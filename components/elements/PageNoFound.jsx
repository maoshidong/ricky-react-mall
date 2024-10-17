import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Row, Col } from 'antd';
import ProductRepository from '~/repositories/ProductRepository';
import { isIncludes } from '~/utilities/common-helpers';
import { PRODUCTS_CATALOG, PRODUCTS } from '~/utilities/sites-url';
import { I18NEXT_LOCALE } from '~/utilities/constant';
import { getWinLocale } from '~/utilities/easy-helpers';
import useLanguage from '~/hooks/useLanguage';
import { useTranslation } from 'next-i18next';

const PageNoFound = ({ catalogListRes = [], statusCode }) => {
	const { getLanguageName, getDomainsData, curLanguageCodeZh } = useLanguage();
	const { t, i18n } = useTranslation('common');
	const i18Translate = (key, defaultText, options) => {
		const translatedLabel = t(key, options);
		const shouldShowLabel = translatedLabel && translatedLabel !== '' && translatedLabel !== key;
		return shouldShowLabel ? translatedLabel : defaultText
	};
	// let i404Tit = i18Translate('i18Other.404Tit', "We're Sorry. Something went wrong. Page not found.");
	// const i404Des = i18Translate(
	// 	'i18Other.404Des',
	// 	'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.Please try the navigation or search bar above to find what you’re looking for.'
	// );
	// const iBackHome = i18Translate('i18Other.BackHome', 'BACK TO HOME PAGE');
	// const iProducts = i18Translate('i18Head.products', 'PRODUCTS');
	// console.log(t('i18Other.404Des'), '-999--del')
	const [i404Tit, setI404Tit] = useState(i18Translate('i18Other.404Tit', "We're Sorry. Something went wrong. Page not found."))
	const [i404Des, setI404Des] = useState(i18Translate(
		'i18Other.404Des',
		'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.Please try the navigation or search bar above to find what you’re looking for.'
	))
	const [iBackHome, setIBackHome] = useState(i18Translate('i18Other.BackHome', 'BACK TO HOME PAGE'))
	const [iProducts, setIProducts] = useState(i18Translate('i18Head.products', 'PRODUCTS'))
	const [list, setList] = useState(catalogListRes || []);
	const getCatalogs = async () => {
		const res = await ProductRepository.apiGetRecommendCatalogList(0, getDomainsData()?.defaultLocale); // 新的分类树
		if (res?.code === 0) {
			setList(res?.data);
		}
	};

	useEffect(() => {
		getCatalogs();
	}, []);
	// useEffect(() => {
	// 	console.log(getWinLocale(), '-111--del')
	// 	if (getWinLocale() === I18NEXT_LOCALE.zh) {
	// 		i18n.changeLanguage('zh');
	// 		setI404Tit("很抱歉！出了什么问题了，找不到该页面？")
	// 		setI404Des("您正在查找的页面可能已被删除、名称发生更改或暂时不可用。请尝试上面的导航或搜索栏来查找您要查找的内容。")
	// 		setIBackHome("返回主页")
	// 		setIProducts("产品")
	// 	} else {
	// 		i18n.changeLanguage('en');
	// 	}

	// }, [curLanguageCodeZh()]);
	// useEffect(() => {
	// 	console.log(i18n, 'i18n-2222--del')
	// }, [i18n])
	return (
		<div className="ps-page--404">
			<div className="ps-container">
				<div className="ps-section__content pub-flex">
					<div style={{ display: 'contents' }}>
						<img src="/static/img/404.png" alt="" style={{ width: '586px', height: '405px' }} />
					</div>

					<div className="custom-antd-btn-more ml60">
						<div className="mb30 pub-color-link pub-fontw title-404">404</div>
						<div className="pub-color555 pub-fontw sub-title-404">{i404Tit}</div>

						<div className="mt20 pub-font22 pub-lh30 pub-color555">{i404Des}</div>

						<Link href="/" className="mb60">
							<a className="mb60">
								<Button ghost="true" className="mt30 mr20 login-page-login-btn ps-add-cart-footer-btn custom-antd-primary pub-font13 w200">
									{iBackHome}
								</Button>
							</a>
						</Link>
						{/* <div>
                            It seems we can't find what you're looking for.
                            Perhaps searching can help or go back to
                            <Link href="/">
                                <a> Homepage</a>
                            </Link>
                        </div> */}
					</div>
				</div>

				<div className="ml40 pb10 pub-border15 box-shadow">
					<div className="mb10 pub-flex-align-center pub-left-title">
						{iProducts}
						<Link href={PRODUCTS}>
							<a className="ml20 pub-color-link pub-font12">{curLanguageCodeZh() ? "查看所有产品" : i18Translate('i18MenuText.View all products', 'View all products')}</a>
						</Link>
					</div>

					<Row gutter={20} className="">
						{list?.map((item) => (
							<Col xs={24} sm={24} md={12} lg={8} xl={6} key={item?.id}>
								<Link href={`${PRODUCTS_CATALOG}/${isIncludes(item?.slug)}/${item?.id}`} className="mb10">
									<a className="mb10 pub-flex pub-color-hover-link">{getLanguageName(item)}</a>
								</Link>
							</Col>
						))}
					</Row>
				</div>
			</div>
		</div>
	);
};
// getInitialProps  getStaticProps
// PageNoFound.getInitialProps = ({ res, err }) => ({
// 	statusCode: res ? res.statusCode : (err ? err.statusCode : 404)
// });

export default PageNoFound