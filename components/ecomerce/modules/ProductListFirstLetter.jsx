import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';

import BreadCrumb from '~/components/elements/BreadCrumb';
// import MinPagination from '~/components/ecomerce/minCom/MinPagination';
import { SamplePagination } from '~/components/common';
import SearchNoData from '~/components/ecomerce/minCom/SearchNoData';
import { getProductUrl, helpersAz09, buildUrl, isIncludes } from '~/utilities/common-helpers';
import { getEnvUrl, PRODUCTS_LIST, PAGE_CONTACT_US } from '~/utilities//sites-url';

const renderGroup = (manufacturers) => {
	const indexs = manufacturers?.map(item => (
		<Link href={getProductUrl(item?.manufacturerSlug, item?.name, item?.id)} key={nanoid()}>
			<a className='li' title={item?.name}>{item?.name}</a>
		</Link>
	));
	return (
		<div key={nanoid()}>
			<div className='manufacturer-item pub-border mb10'>
				{/* <div className='manufacturer-header pub-flex-align-center'>
                    <a className='pub-fontw' name={key}>{key}</a>
                </div> */}
				<div className='ul pt-10' style={{ columnCount: 4 }}>{indexs}</div>
			</div>
		</div>
	)
}

const ProductListFirstLetter = ({ serverList, serverData, query, firstLetter, showNoData = true }) => {
	const Router = useRouter()
	const { total, pages, pageNum, pageSize } = serverData || {}
	// const { slugs } = query || {}

	const breadcrumb = [
		{
			text: 'Home',
			url: '/',
		},
		{
			text: `Electronic Parts Index ${firstLetter}`,
			url: getEnvUrl(PAGE_CONTACT_US)
		}
	];

	const stickyHeader = () => {
		let number =
			window.pageXOffset ||
			document.documentElement.scrollTop ||
			document.body.scrollTop ||
			0;
		const header = document.getElementById('pubSticky');
		if (header !== null) {
			if (number >= 100) {
				header.classList.add('pubSticky');
			} else {
				header.classList.remove('pubSticky');
			}
		}
	};

	useEffect(async () => {
		window.addEventListener('scroll', stickyHeader);
	}, [])

	const headerIndex = (manufacturerGroups) => {
		const indexs = manufacturerGroups?.map(item => (
			// 
			<Link href={getEnvUrl(PRODUCTS_LIST) + `/${isIncludes(item)}`} key={nanoid()}>
				<a
					className={firstLetter === item.toUpperCase() ? 'current-choose' : ''}
					title={"Part Number Start with " + item}
				//  target="_blank"
				>
					{item}
				</a>
			</Link>
		));
		return (
			// pubSticky
			<div id="pubSticky" className='ps-header--manufacturer'>
				{indexs}
			</div>
		)
	}
	const tableChange = async (page, pageSize) => {
		let params = {
			pageNum: page,
			pageSize,
		};
		const resultURL = await buildUrl(currentUrl, params);
		Router.push(resultURL)
	}

	const currentUrl = getEnvUrl(PRODUCTS_LIST) + `/${firstLetter}`;

	return (
		<div className="ps-page--shop pb-60">
			<div className='ps-container'>
				<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />
				<div className="ps-stores-items mt24">
					{headerIndex(helpersAz09())}
					{
						serverList?.length > 0 && (
							<>
								<div className="ps-header--manufacturer-groups mb60">
									{renderGroup(serverList)}
									{/* {keys(arr).map((key) => renderGroup(key, serverList))} */}

									<SamplePagination
										className="mt20"
										total={total}
										pageNum={pageNum}
										pageSize={pageSize}
										pagesTotal={pages}
										currentUrl={currentUrl}
									/>
								</div>
							</>
						)
					}

					{
						(showNoData && serverList?.length === 0) && (
							<div className='mt20'>
								<SearchNoData type={1} />
							</div>
						)
					}
					<h1 className="pub-seo-visibility1">Electronic Parts Index</h1>
				</div>
			</div>
		</div>
	)
}

export default ProductListFirstLetter