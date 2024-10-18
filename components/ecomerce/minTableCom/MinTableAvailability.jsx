import { getStockThousandsData } from '~/utilities/ecomerce-helpers';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
// 立即发货 or 可发货数量， or Contact Us   adddressMap-旧版(从字典拿的)
const minTableAvailability = ({ sendTimeMap = [], adddressMap = [], record, showTimeAddress = true, isShowQuantity = true }) => {
	const { i18Translate } = useLanguage();
	const { iShipsFrom } = useI18();

	const sendTime = record?.shippingTimeId ? sendTimeMap?.[record?.shippingTimeId] : i18Translate('i18SmallText.Can ship immediately', 'Can ship immediately'); //发货时间
	const Adddress = record?.shipFrom ? record?.shipFrom : (record?.addressId ? adddressMap?.[record?.addressId] : ''); // 发货地址

	return (
		<div>
			{record?.quantity > 0 && (
				<div>
					{isShowQuantity && getStockThousandsData(record?.quantity) + ' ' + i18Translate('i18PubliceTable.Available', 'Available')}
					{showTimeAddress && <div>{sendTime}</div>}
					{(showTimeAddress && Adddress) && (
						<div>
							{iShipsFrom}: {Adddress}
						</div>
					)}
				</div>
			)}
			{isShowQuantity && !record?.quantity && i18Translate('i18MenuText.Contact Us', 'Contact us')}
		</div>
	);
};

export default minTableAvailability