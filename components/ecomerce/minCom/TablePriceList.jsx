import React, { useState, useEffect } from 'react';
import useLanguage from '~/hooks/useLanguage';
import { toFixedFun } from '~/utilities/ecomerce-helpers';
import { getCurrencyInfo } from '~/repositories/Utils';

// 产品阶梯价
/**
 *@params
 *pricesList: 价格列表
 *initNum：是否展示更多价格，默认展示三个
 *isShowContactUs: 是否显示联系我们
 *quantity: 展示阶梯价的数量
 */
const TablePriceList = ({ pricesList, initNum = 3, isShowContactUs = true, quantity = 0 }) => {
	const { i18Translate, temporaryClosureZh } = useLanguage();
	const isHavePrices = (!temporaryClosureZh() && pricesList && pricesList?.length !== 0) ? true : false; // 是否有价格
	const [cur, setCur] = useState(0);
	const [list, setList] = useState(pricesList?.slice(0, initNum) || []);


	const currencyInfo = getCurrencyInfo();

	// 点击显示隐藏
	const handleMore = () => {
		setCur(cur ? 0 : 1);
		setList(cur ? pricesList?.slice(0, initNum) : pricesList);
	};

	const getPricesList = () => {
		const mapList = list?.length > 0 ? list : [pricesList?.[0]] // 最少展示一个价格
		const view = mapList?.map((item, index) => {
			return (
				<div className="pub-flex-align-center pub-prices-list-item" key={index}>
					<div>{item.quantity}+</div>
					<div>
						{currencyInfo.label}
						{toFixedFun(item.unitPrice, 4)}
					</div>
				</div>
			);
		});
		return view;
	};

	useEffect(() => {
		// bom询价根据数量展示价格行数量
		if (+quantity > 0) {
			let quantityIndex = 0;

			pricesList?.forEach((item, index) => {
				if (item?.quantity <= +quantity) {
					quantityIndex = index + 1;
				}
			});

			const newList = pricesList?.slice(0, quantityIndex)

			setCur(initNum >= newList?.length ? 0 : 1)
			setList(newList || [])
		}
	}, [quantity])

	return (
		<div className="pub-prices-list pub-font12 pub-color555" style={{ textAlign: isHavePrices ? 'center' : 'left' }}>
			{isHavePrices && (
				<>
					{getPricesList()}
					{pricesList?.length > initNum && <div className="mt5 pub-color-link" onClick={handleMore}>
						{cur ? i18Translate('i18FunBtnText.LessPrice', 'Less Price') : i18Translate('i18FunBtnText.MorePrice', 'More Price')}
					</div>}
				</>
			)}
			{!isHavePrices && isShowContactUs && <span className="pub-color18">{i18Translate('i18MenuText.Contact Us', 'Contact us')}</span>}
		</div>
	);
};

export default TablePriceList