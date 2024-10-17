import React, { useState, useEffect, useContext } from 'react';
import qs from 'qs';
import { useRouter } from 'next/router';
import NewsRepository from '~/repositories/zqx/NewsRepository';

import { RefineSearch, NewItem } from '~/components/News';
import SearchNoData from '~/components/ecomerce//minCom/SearchNoData'; // 无数据展示
// import MinPagination from '~/components/ecomerce/minCom/MinPagination'; // 分页
import SamplePagination from '~/components/common/pagination';

import useLanguage from '~/hooks/useLanguage';
import { NewsContentContext } from '~/utilities/productsContext'


// 新闻首页和产品亮点公共组件
const NewsContentCom = ({ newsData = {}, newsTypeTreeServer = [], isAdda = false }) => {
	const { i18Translate, getDomainsData } = useLanguage();
	const Router = useRouter();
	const { typefitIds, queryKey, functionIdList, manufactureIdList } = useContext(NewsContentContext)
	const [curTypefitIds, setCurTypefitIds] = useState(typefitIds)
	const [fIdList, setFIdList] = useState(functionIdList)

	const { data } = newsData
	const [newsAllData, setNewsAllData] = useState(data || {})
	const { pageNum, pageSize, total } = newsAllData || {}

	useEffect(async () => {
		setNewsAllData(data || [])
	}, [newsData])

	// 除分页外其它参数，传给分页组件
	const getOtherUrlParams = () => {
		let params = {}
		if (curTypefitIds) { params.typefitIds = curTypefitIds.join(',') }
		if (fIdList) { params.functionIdList = fIdList.join(',') }
		if (queryKey) { params.key = queryKey }
		return qs.stringify(params)
	}

	// 更新列表
	const getAllNewList = async (params) => {
		const res = await NewsRepository.getQueryNewsList({
			languageType: getDomainsData()?.defaultLocale,
			...params, // pageListSize: 2000,
		});
		if (res.code === 0) {
			setNewsAllData(res?.data)
		}
	}
	// 条件改变，更新列表
	const conditionChange = param => {
		const typeIdList = param?.typeIdList || []
		const functionIdList = param?.functionIdList || [] // Function, Product-Type, Video-Type id集合
		const keyword = param?.keyword || '' // 搜索词
		const manufactureIdList = param?.manufactureIdList || [] // 选中的供应商

		setFIdList(functionIdList)
		// 更新当前选中的栏目id
		setCurTypefitIds(typeIdList)
		const params = {
			pageNum: 1,
			pageSize: 20,
			typeIdList,
			functionIdList,
			keyword,
			manufactureIdList,
		}
		getAllNewList(params) // 更新新闻列表
		// getAllManufacturers(params) // 获取所有供应商 apiNewsManufacturers
	}
	const currentUrl = Router?.route
	const paginationChange = () => { };

	return (
		<div className="ps-page-new">
			<div className='pub-flex blog-content'>
				<RefineSearch conditionChange={conditionChange} newsTypeTreeServer={newsTypeTreeServer} isAdda={isAdda} />

				<div className='pub-flex-grow ml20 blog-content-right-content' style={{ minWidth: '1000px' }}>
					<div className='mb20'>
						<div className='pub-font14 pub-fontw pub-color555'>{i18Translate('i18SmallText.Results', 'Results')}:
							<span className='ml10 pub-color18 pub-font18'>{total}</span>
						</div>
					</div>
					{/* 无数据 */}
					{
						newsAllData?.data?.length === 0 && (
							<div className="pub-flex-grow">
								<SearchNoData />
							</div>
						)
					}
					{/* 列表数据 */}
					{
						newsAllData?.data?.map(item => {
							return (
								<div key={'news' + item?.id}>
									<div className='mb10'><NewItem item={item} /></div>
								</div>
							)
						})
					}
					{/* 所有供应商列表 */}
					{/* {
						newsAllData?.data?.map(item => {
							return (
								<div key={'m' + item?.id}>
									<div className='mb10'><NewItem item={item} /></div>
								</div>
							)
						})
					} */}

					{/* <MinPagination
                        total={total}
                        pageNum={pageNum}
                        pageSize={pageSize}
                        currentUrl={currentUrl}
                        paginationChange={(page, pageSize) => {
                            paginationChange(page, pageSize)
                        }}
                        otherUrlParams={getOtherUrlParams()}
                    /> */}
					<SamplePagination
						total={total}
						pageNum={pageNum}
						pageSize={pageSize}
						currentUrl={currentUrl}
						className='mt20'
						otherUrlParams={getOtherUrlParams()}
						onChange={({ pageNum, pageSize }) => {
							paginationChange(pageNum, pageSize)
						}}
					/>
				</div>
			</div>

		</div>
	);
};

export default NewsContentCom;