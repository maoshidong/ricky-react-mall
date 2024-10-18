import { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { PRODUCTS_COMPARE } from '~/utilities/sites-url';
import { useRouter } from 'next/router';
import useLanguage from '~/hooks/useLanguage';
import { encrypt } from '~/utilities/common-helpers';
import { Flex } from '~/components/common';

import map from 'lodash/map';
import slice from 'lodash/slice';

const MinCompareProducts = ({ className, productList: list = [] }) => {
	const Router = useRouter();
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const iCompare = i18Translate('i18AboutProduct.Compare', 'COMPARE');
	const iProducts = i18Translate('i18Head.products', 'PRODUCTS')?.toUpperCase();
	const iCompareNote = i18Translate('i18AboutProduct.Compare Note', 'Note: Comparison products support up to 10 product information.');

	const [productList, setProductList] = useState(list);

	useEffect(() => {
		setProductList(list);
	}, [list]);

	// 产品比较
	const handleCompareProducts = () => {
		// 过滤产品id
		const pId = map(slice(productList, 0, 10), (pl) => pl.productId);
		// 加密
		const pros = encrypt(pId.join(','));

		// 跳转到产品比较页面
		Router.push(PRODUCTS_COMPARE + `/${pros}`);
	};

	const btn = () => {
		return (
			<Button type="primary" ghost="true" className="login-page-login-btn ps-add-cart-footer-btn" onClick={handleCompareProducts}>
				{iCompare + (curLanguageCodeZh() ? '' : ' ') + iProducts + `: ${productList?.length}`}
			</Button>
		);
	};

	return <Flex className={className}>{list?.length > 10 ? <Tooltip title={iCompareNote}>{btn()}</Tooltip> : btn()}</Flex>;
};

export default MinCompareProducts;
