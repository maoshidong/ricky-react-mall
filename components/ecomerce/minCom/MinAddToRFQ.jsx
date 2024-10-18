import { useState } from 'react';
import { Button, Modal } from 'antd';
import { useRouter } from 'next/router';
import { ACCOUNT_QUOTE } from '~/utilities/sites-url';
import useEcomerce from '~/hooks/useEcomerce';
import useLanguage from '~/hooks/useLanguage';
import AddRfqPreview from '~/components/shared/blocks/add-cart-preview/AddRfqPreview';
import map from 'lodash/map';
import noop from 'lodash/noop';

const MinAddToRFQ = ({ list = [], onCallBack = noop(), className, isShowItem }) => {
	const Router = useRouter();
	const { saveAddToRfq } = useEcomerce();
	const { i18Translate } = useLanguage();
	const iRFQ = i18Translate('i18AboutProduct.RFQ', 'RFQ');
	const iAddToRfq = i18Translate('i18FunBtnText.AddToRfq', 'ADD TO RFQ');

	const [addRfqList, setAddRfqList] = useState(false); // 添加Rfq数据
	const [isRfqView, setIsRfqView] = useState(false); // 添加Rfq弹窗

	// 添加询价数据
	const handleRequestQuoteClick = (e) => {
		e.preventDefault();

		const params = map(list, (item) => {
			return {
				PartNumber: item?.partNum || item?.name,
				Manufacturer: item?.manufacturer || item?.manufacturerName,
				Quantity: item?.quantity || item?.cartQuantity,
				cartQuantity: item?.cartQuantity,
				thumb: item?.thumb,
				image: item?.image,
			};
		});

		setIsRfqView(true);
		setAddRfqList(params);
		saveAddToRfq(params, true);
		onCallBack?.(params, true);
	};

	return (
		<div className={className}>
			<Button
				type="primary"
				ghost="true"
				className="login-page-login-btn ps-add-cart-footer-btn w150"
				disabled={list?.length === 0}
				onClick={(e) => handleRequestQuoteClick(e)}
			>
				{iAddToRfq}
				{isShowItem && ` (${list?.length})`}
			</Button>

			{isRfqView && (
				<Modal centered title={iRFQ} footer={null} width={550} onCancel={() => setIsRfqView(false)} open={isRfqView} closeIcon={<i className="icon icon-cross2"></i>}>
					<AddRfqPreview
						submitFn={() => {
							setIsRfqView(false);
							Router.push(ACCOUNT_QUOTE);
						}}
						continueFn={() => setIsRfqView(false)}
						otherParams={{
							addCartList: addRfqList,
							type: 'more',
						}}
					/>
				</Modal>
			)}
		</div>
	);
};

export default MinAddToRFQ;
