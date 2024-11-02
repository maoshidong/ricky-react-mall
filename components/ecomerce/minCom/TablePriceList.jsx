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
 *bom详情的价格阶梯价：不管数量是多少，初始只展示数量对应的一行价格 - showQuantityPrice, 展示少的价格时也是只展示数量对应的一行价格
 */
const TablePriceList = ({
	pricesList, initNum = 3,
	isShowContactUs = true, showQuantityPrice=false,
	quantity = 0,
}) => {
	const { i18Translate, temporaryClosureZh } = useLanguage();
	const isHavePrices = (!temporaryClosureZh() && pricesList && pricesList?.length !== 0) ? true : false; // 是否有价格
	const [cur, setCur] = useState(0);
	const [quantityPriceIndex, setQuantityPriceIndex] = useState(0); // 数量对应的价格行的索引
	const [list, setList] = useState(pricesList?.slice(0, initNum) || []);

	const currencyInfo = getCurrencyInfo();



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
	
	// 点击显示隐藏
	const handleMore = () => {
		setCur(cur ? 0 : 1);
		if(showQuantityPrice) {
			// bom展示少的价格时也是只展示数量对应的一行价格
			setList(cur ? pricesList?.slice(quantityPriceIndex - 1, quantityPriceIndex) : pricesList);
		} else {
			setList(cur ? pricesList?.slice(0, initNum) : pricesList);
		}

	};

	useEffect(() => {
		// bom询价根据数量展示价格行数量
		if (+quantity > 0) {
			let quantityIndex = 0; // 数量对应的价格行的索引
			pricesList?.forEach((item, index) => {
				if (item?.quantity <= +quantity) {
					quantityIndex = index + 1;
				}
			});
			// bom展示少的价格时也是只展示数量对应的一行价格
			let newList = []
			if(showQuantityPrice) {
				setQuantityPriceIndex(quantityIndex)
				newList = pricesList?.slice(quantityIndex - 1, quantityIndex) // 只取数量对应的一条价格
			} else {
				newList = pricesList?.slice(0, quantityIndex)
			}

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