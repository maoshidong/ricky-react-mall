import { useContext, useState } from 'react';
import { Spin } from 'antd';
import Flex from '../flex';
import Countdown from './countdown';
import useI18 from '~/hooks/useI18';
import useLanguage from '~/hooks/useLanguage';

import { getStockThousandsData } from '~/utilities/ecomerce-helpers';
import { ProductsDetailContext } from '~/utilities/shopCartContext';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip';
import classNames from 'classnames';
import styles from '~/scss/module/_pub.module.scss';
import map from 'lodash/map';

// 发货时间
const DeliveryTime = ({ quantity = 0, Adddress }) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const { iShipsFrom } = useI18();
	const iAvailable = i18Translate('i18PubliceTable.Available', 'Available');
	const iOrderInLine = i18Translate('i18AboutProduct.Order online', 'Order online in');
	const iToShipToDay = i18Translate('i18AboutProduct.Ship today', 'to ship today. ');
	const iShippDetails = i18Translate('i18AboutProduct.Shipping Details', 'Shipping Details');
	const iInstructions = i18Translate('i18AboutProduct.Shipping Instructions', 'Shipping Instructions');

	const iODShip = i18Translate('i18AboutProduct.Ships most', 'Origin Data ships most UPS, FedEx, and DHL orders same day.');
	const iWarehouse = i18Translate(
		'i18AboutProduct.warehouses',
		'We have warehouses in Hong Kong, Shenzhen, and Singapore. We will choose the shipping location based on the order and product situation.'
	);
	const iMail = i18Translate(
		'i18AboutProduct.Global Mail',
		'Global Priority Mail orders ship on the next business day. The following exceptions cause orders to be reviewed before processing. Most exceptions are cleared immediately but some may cause an order to ship one day later.'
	);
	const iProvide = i18Translate('i18AboutProduct.Special instructions', 'If you provide any special instructions on your order');
	const iNew = i18Translate('i18AboutProduct.Require security', 'New customer orders that require security or address verification');
	const iCredit = i18Translate('i18AboutProduct.Credit', 'Credit card security concerns');
	const iOpen = i18Translate('i18AboutProduct.Concern', 'An open account customer with a credit concern');
	const iImport = i18Translate('i18AboutProduct.Restrictions', 'Import restrictions in some countries');

	const [isShowModal, setIsShowModal] = useState(false);

	// 从上下文中取paramMap
	const { paramMap } = useContext(ProductsDetailContext);
	// 取发货时间：deliveryTime
	const deliveryTime = curLanguageCodeZh() ? paramMap?.zhDeliveryTime : paramMap?.deliveryTime;

	// 查看Shipping Details说明
	const handleShippingDetails = () => {
		setIsShowModal(true);
	};

	// 提示内容
	const tips = [iProvide, iNew, iCredit, iOpen, iImport];

	const DeliveryTimeContent = () => (
		<Flex column gap={8}>
			<p className="pub-lh18">{iODShip}</p>
			<p className="pub-lh18">{iWarehouse}</p>
			<p className="pub-lh18">{iMail}</p>
			<ul className={classNames('mt0', styles.saveListUl)}>
				{map(tips, (text, index) => (
					<li key={'tip' + index}>
						{text}
					</li>
				))}
			</ul>
		</Flex>
	);

	return (
		<>
			<Flex column className="product-send-time-addredd">
				<h3 className="mb10 product-quantity">
					{getStockThousandsData(quantity)} {iAvailable}
				</h3>
				<h3>
					<Flex gap={3} className="pub-font500 mb5">
						{iOrderInLine}
						{deliveryTime && <Countdown targetTime={deliveryTime} />}
						{iToShipToDay}
					</Flex>
				</h3>

				<h3>
					<Flex gap={8} className="pub-font500 mb5">
						{iShipsFrom}: {!!Adddress ? Adddress : <Spin size="small" spinning={!Adddress} />}
						<div className="pub-color-link" onClick={handleShippingDetails}>
							{iShippDetails}
						</div>
					</Flex>
				</h3>
			</Flex>
			<div className='pub-seo-visibility'>{DeliveryTimeContent()}</div>
			<MinModalTip
				isShowTipModal={isShowModal}
				isChildrenTip={true}
				width={700}
				onCancel={() => {
					setIsShowModal(false);
				}}
				tipTitle={iInstructions}
			>
				{DeliveryTimeContent()}
			</MinModalTip>
		</>
	);
};

export default DeliveryTime;
