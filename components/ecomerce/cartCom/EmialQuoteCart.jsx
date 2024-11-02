import React, { useState, useEffect, useRef } from "react"
import { useSelector } from 'react-redux'
import { useCookies } from "react-cookie"
import { Modal } from 'antd';
import { useRouter } from "next/router";
import CartRepository from '~/repositories/zqx/CartRepository';
import { EmialQuoteCartPrompt, EmialQuoteCartPastPrompt } from '~/components/ecomerce/cartCom'; // 邮件报价产品添加到购物车的提示。
import { AddRfqPreview } from '~/components/shared';
import { ACCOUNT_QUOTE } from '~/utilities/sites-url';

import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';

// email点击过来的url，报价和推送订单
const EmialQuoteCartCom = () => {
	const { i18Translate } = useLanguage();
	const { useAddMoreCart, saveAddToRfq } = useEcomerce();
	const [cookies] = useCookies(['account'])
	const [isShow, setIsShow] = useState(false) // 未过期, 购物车目前有产品提示 timeStatus
	const [isPastShow, setIsPastShow] = useState(false) // 过期提示
	const [curParams, setCurParams] = useState([]) // 报价过来的产品添加到购物车参数
	const [infoList, setInfoList] = useState([]) // 报价过来的产品列表

	const [isRfqView, setIsRfqView] = useState(false); // 添加Rfq弹窗

	const Router = useRouter();
	const { emailQuoteIds, pushNo } = Router.query;
	const { allCartItems } = useSelector(state => state.ecomerce)
	const cartAllList = useRef(allCartItems || [])

	useEffect(() => {
		cartAllList.current = allCartItems
	}, [allCartItems])

	// 添加到购物车 expireTime
	const addCart = () => {
		useAddMoreCart(
			curParams,
			{ newToken: cookies?.['account']?.token, type: 4, } // 旧版的type2也改为4了
		);
		setIsShow(false)
	}
	// 添加新购物车
	const addNewCart = () => {
		useAddMoreCart(
			curParams,
			{ newToken: cookies?.['account']?.token, type: 4, cartNo: -1 } // 旧版的type2也改为4了
		);
		setIsShow(false)
	}

	// 添加到询价单
	const addRfq = () => {
		const params = infoList?.map(item => {
			return {
				PartNumber: item?.partNum,
				Manufacturer: item?.manufacturer,
				Quantity: item?.quantity,
			}
		})

		saveAddToRfq(params, true)
		setIsPastShow(false)
		setIsRfqView(true)
	}

	// 报价和推送订单处理res
	const handleRes = (res, type) => {
		if (res.code === 0) {
			setInfoList(res?.data)
			// 添加or新建购物车需要的参数
			const params = res?.data?.map(item => {
				const { id, productId, quantity, partNum, manufacturer } = item
				return {
					callBackId: id, id: productId, quantity,
					sku: partNum + '--' + manufacturer
				}
			})
			setCurParams(params)
			// 报价过期
			if (res?.data?.[0]?.timeStatus === 2) {
				setIsPastShow(true)
				return
			}

			if (params.length === 0) return
			// 没过期, 但是购物车有产品
			if (cartAllList.current?.length > 0) {
				setIsShow(true)
				return
			}

			// 没过期, 购物车无产品， 直接添加, 2报价， 4 推送订单
			useAddMoreCart(
				params,
				{ newToken: cookies?.['account']?.token, type, }
			);
		}
	}

	const getCallbackInfoList = async () => {
		// pushNo， emailQuoteIds 是url的参数
		if (pushNo && pushNo?.length > 0) {
			const res = await CartRepository.apiInfoListByPushNo({ pushNo })
			handleRes(res, 4)
		}
		if (emailQuoteIds && emailQuoteIds?.length > 0) {
			const res = await CartRepository.queryCallbackInfoList(cookies?.['account']?.token, emailQuoteIds?.split(','))
			handleRes(res, 4) // handleRes(res, 2) => handleRes(res, 4)  旧版的type2也改为4了
		}
	}
	useEffect(async () => {
		if (cookies?.['account']?.token) {
			getCallbackInfoList()
		}
	}, [cookies?.['account']?.token])
	return (
		<div>
			{isShow && <EmialQuoteCartPrompt cancel={() => addCart()} handleOk={() => addNewCart()} />}
			{/* 询价过期提示 */}
			{isPastShow && <EmialQuoteCartPastPrompt infoList={infoList} cancel={() => setIsPastShow(false)} handleOk={() => addRfq()} />}

			{isRfqView && (
				<Modal
					centered title={i18Translate('i18AboutProduct.RFQ', 'RFQ')} footer={null} width={550}
					onCancel={() => setIsRfqView(false)}
					open={isRfqView}
					closeIcon={<i className="icon icon-cross2"></i>}
				>
					<AddRfqPreview
						submitFn={() => {
							setIsRfqView(false);
							Router.push(ACCOUNT_QUOTE);
						}}
						continueFn={() => setIsRfqView(false)}
						otherParams={{
							addCartList: infoList,
							type: 'more',
						}}
					/>
				</Modal>
			)}
		</div>
	)
}

export default EmialQuoteCartCom