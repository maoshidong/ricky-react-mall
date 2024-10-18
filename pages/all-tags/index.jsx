import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import Head from 'next/head';
import PageContainer from '~/components/layouts/PageContainer';
import { NewsRepository } from '~/repositories';

import { SEO_COMPANY_NAME } from '~/utilities/constant';
import { changeServerSideLanguage, getLocale } from '~/utilities/easy-helpers';
import { capitalizeFirstLetter } from '~/utilities/common-helpers';
import { isIncludes } from '~/utilities/common-helpers';
import { ALL_TAGS, CONTENT_SEARCH } from '~/utilities/sites-url';

import { Link as ScrollLink, Element } from 'react-scroll';
import useLanguage from '~/hooks/useLanguage';
import Link from 'next/link';
import upperCase from 'lodash/upperCase';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';


// 对标签数据进行分组
const groupingLabelData = (mapList) => {
	const _list = mapList?.filter(item => item?.name)
		.map(item => ({
			status: item?.status,
			name: item.name,
			initial: upperCase(item.name.substring(0, 1)),
			id: item.id
		}));

	const sortList = sortBy(_list, ['name']);

	const groupList = groupBy(sortList, 'initial');
	// return groupList;


	// 数字合并为#
	let mergedArray = [];
	let mergedObj = {};
	// 遍历 arr 对象的键值对
	for (const [key, value] of Object.entries(groupList)) {
		// 检查键是否是数字  or  Number.isInteger(index)
		if (!isNaN(Number(key))) {
			// 合并对应的值到 mergedArray 中
			mergedArray = mergedArray.concat(value);
		} else {
			mergedObj[key] = value
		}
	}
	let params = {}
	if (mergedArray?.length > 0) {
		params['#'] = mergedArray // 搜索#内无数据时，不返回#
	}
	params = {
		...params,
		...mergedObj,
	}

	return params

}

const AllTagsPage = ({ paramMap, numberListSer = [], firstLetter = '', childTag }) => {
	const { i18Translate } = useLanguage();
	const titleSeo = `All Tags ${SEO_COMPANY_NAME}`;
	const i18Title = i18Translate('i18Seo.allTags.title', titleSeo, { firstLetter });
	const i18Key = i18Translate('i18Seo.allTags.keywords', '');
	const i18Des = i18Translate('i18Seo.allTags.description', '');
	const iRelatedContent = i18Translate('i18CatalogHomePage.Related Content', 'Related Content')

	const subscript = groupingLabelData(childTag?.data || {});
	const [tabActive, seTabActive] = useState('1');
	const [current, setCurrent] = useState('')


	let otherArr = []; // 除数字外其它的放在这
	numberListSer?.map(i => {
		if (isNaN(Number(i))) {
			otherArr.push(i);
		}
	})
	const numberList = ['#', ...otherArr] // 数字合并为#

	const tagsContent = [
		{ label: i18Translate('i18CatalogHomePage.All content tags', 'All content tags'), value: '1' },
	];

	useEffect(() => {
		if (process.browser) {
			window.addEventListener('scroll', stickyHeader);
		}
	}, []);

	const stickyHeader = () => {
		setCurrent('')
		let number =
			window.pageXOffset ||
			document.documentElement.scrollTop ||
			document.body.scrollTop ||
			0;
		const header = document.getElementById('pubSticky');
		if (header !== null) {
			if (number >= 280) {
				header.classList.add('pubSticky');
			} else {
				header.classList.remove('pubSticky');
			}
		}
	};

	// 头部激活
	const handleTagActive = (item) => {
		seTabActive(item.value);
		// if (item.value == '1') {
		// 	window.location.hash = `all-manufacturers`; // 注意： 和头部导航的一致
		// } else {
		// 	window.location.hash = `popular-manufacturers`;
		// }
	};

	// 选择字母索引
	const handleCurrentChoose = id => {
		let handler = "";
		clearTimeout(handler);
		handler = setTimeout(() => {
			setCurrent(id)
			if (id === current) return
			window.scrollBy({
				top: -149,
				left: 0,
				behavior: "smooth"
			});
		}, 0);
	}

	// 渲染字母索引
	const headerIndex = (list) => {
		const indexs = map(list, (item, index) => (
			<ScrollLink
				to={item}
				spy={true}
				offset={-115}
				smooth={true}
				duration={500}
				activeClass="current-choose"
				className={current === item ? 'current-choose' : ''}
				onClick={() => handleCurrentChoose(item)}
				key={'all-tag' + index}
			>
				{item}
			</ScrollLink>
		));
		return (
			<div id="pubSticky" className="ps-header--manufacturer">
				{indexs}
			</div>
		);
	};

	// 渲染标签项
	const renderGroup = (key, values) => {
		const indexs = values?.map((item) => {
			return (
				// <Col xs={24} sm={12} md={8} xl={8} lg={8} key={item.id}>
				<Link href={ALL_TAGS + `/${isIncludes(item?.name)}/${item?.id}`}>
					<a className="li pub-color-hover-link">{capitalizeFirstLetter(isIncludes(item?.name))}</a>
				</Link>
				// </Col>
			);
		});

		return (
			<Element name={key} key={key}>
				<div className="manufacturer-item pub-border mb10 box-shadow">
					<div className="manufacturer-header pub-flex-align-center">
						<h3 className="pub-fontw" name={key}>
							{key}
						</h3>
					</div>
					<Row gutter={20} className="ul">
						{indexs}
					</Row>
				</div>
			</Element>
		);
	};

	return (
		<PageContainer
			paramMap={paramMap}
			pageOtherParams={{
				showFooter: true,
				showHead: true,
			}}
		>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			<div className='pb-80'>
				<div className="tabs-container m-tabs-container">
					<div className="ps-container pb-80">
						<div className=" pub-flex-align-center">
							{tagsContent.map((item) => {
								return (
									<h1 key={item.value} className={'tabs-item m-tabs-item ' + (tabActive == item.value ? 'tabs-active' : '')} style={{ marginRight: '20px' }} onClick={() => handleTagActive(item)}>
										{item.label}
									</h1>
								);
							})}
							<h2 className='pub-color-hover-link' style={{ marginTop: '15px' }}>
								<Link href={CONTENT_SEARCH}>{iRelatedContent}</Link>
							</h2>
						</div>
					</div>
				</div>

				<div className='ps-container ps-page--shop'>
					<div className="ps-stores-items mt24" style={{ position: 'sticky', top: '60px', height: '44px', zIndex: 9 }}>
						<div className="mb10">
							<div className="pub-fit-content mb10">
								{headerIndex(numberList)}
							</div>
						</div>
					</div>

					{tabActive == 1 && !isEmpty(subscript) && (
						<div className="ps-header--manufacturer-groups">
							{map(subscript, (st, key) => {
								return renderGroup(key, st)
							})}
						</div>
					)}
				</div>
			</div>
		</PageContainer>
	);
};

export default AllTagsPage

export async function getServerSideProps({ req, query }) {
	const translations = await changeServerSideLanguage(req)

	const firstNumber = query?.key?.slice(0, 1) || ""
	const res = await NewsRepository.apiQueryWebTagFirstNumber(); // 所有首字母

	const param1 = {
		firstNumber,
		pageListNum: 1,
		pageListSize: 99999999,
		languageType: getLocale(req),
	}
	const childTag = await NewsRepository.apiQueryWebTagList(param1); // 首字母下标签
	return {
		props: {
			...translations,
			numberListSer: res?.data || [],
			firstLetter: query?.key || "",
			childTag: childTag?.data || {},
		}
	}
}