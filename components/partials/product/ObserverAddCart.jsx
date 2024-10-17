import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'antd';
import Link from 'next/link';
import useLanguage from '~/hooks/useLanguage';
import { getStockThousandsData } from '~/utilities/ecomerce-helpers';
import { isIncludes } from '~/utilities/common-helpers'
import { ProductsDetailContext } from '~/utilities/shopCartContext'
import { MANUFACTURER } from '~/utilities/sites-url'

import { MinTableImage } from '~/components/ecomerce/minTableCom';
// import MinTableStandardPrice from '~/components/ecomerce/minTableCom/MinTableStandardPrice' // 阶梯价
import { InputNumberV2 } from '~/components/common';



import classNames from 'classnames';
import styles from "~/scss/module/_dynamic.module.scss"


const ObserverAddCartCom = ({ buyQuantity, addBack, curIsSame, onChangeInput }) => {
	const { i18Translate } = useLanguage();
	const iAddToCart = i18Translate('i18FunBtnText.AddToCart', 'ADD TO CART')
	const iAvailable = i18Translate('i18PubliceTable.Available', 'Available');

	const [curQuantity, setCurQuantity] = useState('')
	const [isShowStandardPrice, setIsShowStandardPrice] = useState(false); // 阶梯价


	const { productDetailData, isHavePrice } = useContext(ProductsDetailContext)
	const { name, manufacturer, quantity, pricesList } = productDetailData
	const minQUantity = Number(pricesList?.[0]?.quantity)

	const handAddBack = () => {
		if (Number(buyQuantity) || Number(buyQuantity) >= minQUantity) {
			curIsSame(buyQuantity)
		} else {
			addBack(buyQuantity)
		}
	}

	// const onChangeInput = val => {
	// 	setCurQuantity(val)
	// }
	useEffect(() => {
		// onChangeInput(minQUantity)
		return () => {
			setIsShowStandardPrice(false)
		}
	}, [])

	return (
		<div className={styles.detailAddCart}>
			<div className={classNames("ps-container custom-antd-btn-more", styles.content)}>
				<div className='pub-flex-align-center'>
					<div className={styles.img}>
						<MinTableImage record={productDetailData} />
					</div>
					<div className='mr30'>{name}</div>
					{/* 品牌管理中品牌主页状态slugStatus: 0 关闭 1 开启，开启才能跳转到品牌主页*/}
					{(manufacturer?.slug && +manufacturer?.slugStatus === 1) ? <Link href={`${MANUFACTURER}/${isIncludes(manufacturer?.slug)}`}>
						<a className={styles.manufacturerName}>
							{manufacturer?.name}
						</a>
					</Link> : <span className={styles.manufacturerName}>{manufacturer?.name}</span>
					}

				</div>

				<div className='pub-flex-align-center'>
					<div className='mr30'>{getStockThousandsData(quantity)} {iAvailable}</div>
					<div>
						<InputNumberV2
							className="pub-border"
							onChange={onChangeInput}
							// onFocus  onBlur
							// onKeyPress={(e)=>console.log(e,999)}
							// onKeyPress={onlyNumber}
							value={Number(buyQuantity) || ''}
							// propsValue={Number(buyQuantity)}
							// min={minQUantity}
							controls={false}
							style={{ width: '100%' }}
						/>
						{/* {isShowStandardPrice && <MinTableStandardPrice
							isShoeModal={true}
							pricesList={pricesList} // 阶梯价
							cartQuantity={buyQuantity}

						/>} */}
					</div>

					<Button
						type="primary"
						onClick={(e) => handAddBack(e)}
						className={classNames('custom-antd-primary', styles.btn)}
					// disabled={Number(buyQuantity) < minQUantity}
					>
						{isHavePrice ? iAddToCart : i18Translate('i18FunBtnText.REQUEST QUOTE', 'REQUEST QUOTE')}
					</Button>
				</div>

			</div>
		</div>
	)
}

export default ObserverAddCartCom