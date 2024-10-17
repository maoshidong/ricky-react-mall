import { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';

import Link from 'next/link';
import Router, { useRouter } from 'next/router';

import { Flex, CustomInput } from '~/components/common';
import SampleModal from '~/components/shared/blocks/sample-modal';
import { Datasheet, AddToFavorites, FreeSample } from './components/index'
import ModuleLogin from '~/components/ecomerce/modules/ModuleLogin'

import { ProductsDetailContext } from '~/utilities/shopCartContext';
import { getEnvUrl, ACCOUNT_FAVORITES, MANUFACTURER } from '~/utilities/sites-url'
import { isIncludes } from '~/utilities/common-helpers'
import {
	calculateTargetPriceTotal, calculateItemPriceTotal, toFixedFun
} from '~/utilities/ecomerce-helpers';


import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';

const ModuleDetailTopInformationCom = ({ auth }) => {
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const { iCustomerReference } = useI18();
	const iECADModel = i18Translate('i18PubliceTable.ECAD Model', 'ECAD Model')

	const { isAccountLog } = auth
	const router = useRouter();
	const { query } = router;

	// 从上下文context中获取数据
	const { productDetailData, isHavePrice, updateCustomerReference, paramMap } = useContext(ProductsDetailContext)
	const { id, name, image, rohs, datasheet, description, ECAD } = productDetailData // 产品详情数据
	// console.log(productDetailData, 'productDetailData--23--del')
	// console.log(paramMap.sampleAmount, 'paramMap--1222--del')

	const { pricesList } = productDetailData;
	const { sampleAmount } = paramMap || {};
	// 产品阶梯价行样式
	// const getResAmount = () => {
	// 	let resAmount = pricesList?.[0]?.unitPrice 
	// 	pricesList?.map((item) => {
	// 		if (+sampleAmount >= calculateItemPriceTotal({
	// 			voList: pricesList,
	// 			cartQuantity: item?.quantity,
	// 		})) {
	// 			resAmount = item?.unitPrice
	// 		}
	// 	});
	// 	console.log(resAmount, 'resAmount--del')
	// }
	// useEffect(() => {
	// 	getResAmount()
	// }, [])

	// 设置的金额/产品单价=数量（个）
	// 30/5=6  数量最多5个
	// 30/10=3个  这样就是最多可以申请3个
	// 30/50=0.6，这样的就不要显示入口了
	const calculateMaxQuantity = (amount, unitPrice) => {
		// 计算可能的数量 
		const quantity = Number(sampleAmount) / toFixedFun(calculateTargetPriceTotal({ pricesList, quantity: 1, }) || 0, 4);

		// 根据条件判断最大数量
		if (quantity >= 1 && quantity <= 5) {
			// console.log(`最多可以申请 ${Math.floor(quantity)} 个`);
			return Math.floor(quantity);
		} else if (quantity > 5) {
			// console.log(`最多可以申请 5 个`);
			return 5;
		} else {
			// console.log(`不显示入口`);
			return 0;
		}
	}


	const attrsToShow = new Array();

	const [isSampleView, setIsSampleView] = useState(query?.showSample || false);
	const [loginVisible, setLoginVisible] = useState(false); // 登录弹窗
	const [showFavoritesModal, setShowFavoritesModal] = useState(false); // 收藏成功弹窗
	const { isFavoritesSuc, upDateIsFavoritesSuc, addProductsFavorites, delProductsFavorites } = useEcomerce();
	const [curCustomerReference, setCurCustomerReference] = useState(productDetailData?.userProductTag ?? '');
	const [curNeedLogType, setCurNeedLogType] = useState(''); // 当前需要登录的type，判断登录后需要做的 

	useEffect(() => {
		upDateIsFavoritesSuc(productDetailData?.userCollectFlag)
		setCurCustomerReference(productDetailData?.userProductTag)
	}, [productDetailData])

	const handleHideSampleModal = (e) => {
		e && e.preventDefault();
		setIsSampleView(false);
	};

	const handleLogin = (token) => {
		// 收藏
		if (curNeedLogType === 'favorites') {
			addProductsFavorites(id, token)
		}
		// 自定义标签
		if (curNeedLogType === 'reference') {
			updateCustomerReference(curCustomerReference)
		}
		// 样品
		if (curNeedLogType === 'sample') {
			setIsSampleView(true)
		}
		setLoginVisible(false);
	};

	const handleUpdateReference = (value, type) => {
		setCurNeedLogType(type)
		if (isAccountLog) {
			setCurCustomerReference(value)
			updateCustomerReference(value)
		} else {
			// 未输入任何内容，不弹出登录窗口
			if (value) {
				setLoginVisible(true)
			}
		}
	}

	const handleAddProductsFavorites = async () => {
		if (isAccountLog) {
			if (isFavoritesSuc) {
				delProductsFavorites([id])
			} else {
				const favoritesRes = await addProductsFavorites(id)
				if (favoritesRes?.id) {
					setShowFavoritesModal(true)
				}
			}
		} else {
			setLoginVisible(true)
			setCurNeedLogType('favorites')
		}
	}

	const handleSampleModal = () => {
		setIsSampleView(true)
	}

	const { manufacturer } = productDetailData || {}

	if (manufacturer) {
		// 详情供应商
		attrsToShow.push({
			label: i18Translate('i18PubliceTable.Manufacturer', 'Manufacturer'),
			value: (<>
				{/* 品牌管理中品牌主页状态slugStatus: 0 关闭 1 开启，开启才能跳转到品牌主页*/}
				{(manufacturer?.id && +manufacturer?.slugStatus === 1) ? <Link href={`${MANUFACTURER}/${isIncludes(manufacturer?.slug)}`}>
					<a className='pub-color-hover-link'>
						{/* productDetailData?.detailMfgName ||  */}
						{manufacturer?.name}
					</a>
					{/* productDetailData?.detailMfgName ||  */}
				</Link> : <span>{manufacturer?.name}</span>
				}
			</>),
		})
	}

	if (description) {
		attrsToShow.push({
			label: i18Translate('i18AboutProduct.Description', 'Description'),
			value: <p className='pub-font13 mb0 pub-font500'>{description}</p>,
		})
	}

	const getPubElm = (label, elm) => {
		return <div className="ps-product__meta_zqx">
			<p className="ps-product__attr-label">{label}:</p> {elm}
		</div>
	}

	return (
		<section>
			<div className='ps-product__meta_markty clearfix'>
				<h1>{name}</h1>
			</div>

			{attrsToShow && attrsToShow.map((item, index) => (
				<h2 key={'atrrib' + index} className="ps-product__meta_zqx">
					<p className="ps-product__attr-label">{item?.label}:</p> {item?.value}
				</h2>
			))}
			{/* 我们自己的型号 */}
			<div className="ps-product__meta_zqx">
				<p className="ps-product__attr-label">{i18Translate('i18CompanyInfo.Origin Data', 'Origin Data')} #:</p> <p className='pub-font13 mb0 pub-font500'>{id}-{name}</p>
			</div>
			{/* 客户打标签(备注) */}
			<div className="ps-product__meta_zqx">
				<span className="ps-product__attr-label">{i18Translate('i18AboutProduct.Customer', 'Customer')}:</span>
				<CustomInput
					className="form-control form-input w300 mt5"
					placeholder={iCustomerReference}
					value={curCustomerReference}

					onChange={e => setCurCustomerReference(e.target.value)}
					onBlur={e => handleUpdateReference(e.target.value, 'reference')}
				/>
			</div>

			{
				(rohs === 1 && isHavePrice) && (
					getPubElm(i18Translate('i18AboutProduct.RoHS Status', 'RoHS Status'), (
						<Flex alignCenter className='pu-flex-align-center'>
							<div className='sprite-icon4-cart sprite-icon4-cart-2-2' />
							<span style={{ marginLeft: '10px' }}>{i18Translate('i18AboutProduct.RoHS Compliant', 'RoHS Compliant')}</span>
						</Flex>
					))
				)
			}

			{
				isHavePrice && (
					getPubElm(iECADModel, (
						<div className='ps-product__meta_ECAD'>
							<span className="iconfont" />
							<i className="iconfont sprite-icon2-6-3" />
							<span>{ECAD || 'PCB Symbol, Footprint & 3D Model'}</span>
						</div>
					))
				)
			}


			<div className="ps-product__meta_zqx" style={{ flexFlow: 'wrap' }}>
				{/* PDF? */}
				{
					datasheet && <Datasheet datasheet={datasheet} />
				}

				{/* 添加到收藏夾 */}
				<AddToFavorites isFavoritesSuc={isFavoritesSuc} onAddFavorites={handleAddProductsFavorites} />

                <div className='pub-flex-align-center'>
                    <img className='pub-img50' src={image || getLanguageEmpty()} title={name} alt={name} loading="lazy" />
                    <div className='ml15'>
                        <div className='pub-font13 pub-color18'>{name}</div>
                        <div className='pub-font12 pub-color555'>{description}</div>
                    </div>
                </div>

			</div>

			{isSampleView && <SampleModal
				cancelFn={() => { handleHideSampleModal(); }}
				submitFn={handleHideSampleModal}
				productDetailData={productDetailData}
				curCustomerReference={curCustomerReference}
				isSampleView={isSampleView}
				quantityLimitIndex={calculateMaxQuantity()}
			/>}

			{loginVisible && (<ModuleLogin
				visible={loginVisible}
				onCancel={() => setLoginVisible(false)}
				onLogin={handleLogin}
			/>)}

			{/* 收藏成功 */}
			{showFavoritesModal && <Modal
				centered
				title={i18Translate('i18AboutProduct.Add to favorites', "ADD TO FAVORITES")}
				footer={null}
				width={390}
				onCancel={() => setShowFavoritesModal(false)}
				open={showFavoritesModal}
				closeIcon={<i className="icon icon-cross2"></i>}
			>
				<div className='mb15 pub-color18 pub-font13'>
					{i18Translate('i18AboutProduct.AddedFavorites', "You have added the following products to your favorites")}
				</div>

				<div className='pub-flex-align-center'>
					<img className='pub-img50' src={image || getLanguageEmpty()} title={name} alt={name} />
					<div className='ml15'>
						<div className='pub-font13 pub-color18'>{name}</div>
						<div className='pub-font12 pub-color555'>{description}</div>
					</div>
				</div>

				<div className='custom-antd-btn-more mt30' style={{ textAlign: 'center' }}>
					<Button
						type="primary" ghost='true'
						className='ps-add-cart-footer-btn'
						onClick={() => setShowFavoritesModal(false)}
						style={{ width: '150px' }}
					>
						{i18Translate('i18FunBtnText.Close', "Closure")}
					</Button>

					<Link href={getEnvUrl(ACCOUNT_FAVORITES)}>
						<a>
							<Button
								type="primary" ghost='true'
								className='ml20 ps-add-cart-footer-btn custom-antd-primary'
								onClick={() => Router.push(getEnvUrl(ACCOUNT_FAVORITES))}
								style={{ width: '150px' }}
							>{i18Translate('i18AboutProduct.View Favorites', "View Favorites")}</Button>
						</a>
					</Link>
				</div>
			</Modal>
			}
		</section>
	);
};

export default connect(state => state)(ModuleDetailTopInformationCom)
