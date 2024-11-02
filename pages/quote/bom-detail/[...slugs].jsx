import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';

import { useCookies } from 'react-cookie';
import { Table, Button, Modal } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { setPageLoading } from '~/store/setting/action';

import PageContainer from '~/components/layouts/PageContainer';
import { Flex, CustomInputNumber, CustomInput, AlarmPrompt, SamplePagination } from '~/components/common';
import AddMoreItems from '~/components/ecomerce/cartCom/AddMoreItems';
import ModuleProductsSearch from '~/components/ecomerce/modules/ModuleProductsSearch'; // 查看更多匹配的型号
import FloatButtons from '~/components/ecomerce/modules/FloatButtons'
import MinAddToRFQ from '~/components/ecomerce/minCom/MinAddToRFQ'
import TablePriceList from '~/components/ecomerce/minCom/TablePriceList'
import MinAddMoreCart from '~/components/ecomerce/minCom/MinAddMoreCart'

import last from 'lodash/last';
import { QuoteRepositry, ProductRepository } from '~/repositories';
import { getCurrencyInfo } from '~/repositories/Utils';

import { PAYMENT_TYPE, TABLE_COLUMN, DEL_ONE_TEXT, PUB_PAGINATION, INVALID_INPUT_TIP } from '~/utilities/constant';
import { getProductUrl, handleMomentTime, scrollToTop, downloadClick, uppercaseLetters } from '~/utilities/common-helpers'
import {
	getThousandsDataInt,
	calculateItemPriceTotal, toFixedFun
} from '~/utilities/ecomerce-helpers';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';

import useLocalStorage from '~/hooks/useLocalStorage';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import styles from "scss/module/_leastUsed.module.scss";

// bom详情返回供应商短语
// 删除bom文件，删除的文案、下载bom样本、？
// 0 未匹配  1 已匹配 2多匹配   matchStatus
const matchObj = {
	noMatch: 0,
	sucMatch: 1,
	moreMatch: 2,
}

// 询价表单详情
const BomDetail = ({ paramMap }) => {
	const { i18Translate, getLanguageEmpty, getDomainsData } = useLanguage();
	const { iDeleteSelected } = useI18();
	const iRFQ = i18Translate('i18AboutProduct.RFQ', "RFQ")

	// const { saveAddToRfq } = useEcomerce();
	const dispatch = useDispatch();
	const Router = useRouter();
	const { query } = Router
	const queryFileId = Number(last(query?.slugs)) || ''
	const [storageBomList] = useLocalStorage('storageBom', []);
	const [cookies] = useCookies(['auth'])

	const [loading] = useState(false)
	// 分页
	const [total, setTotal] = useState(0)
	const [pages, setPages] = useState(1)
	const [pageNum, setPageNum] = useState(PUB_PAGINATION?.pageNum)
	const [pageSize, setPageSize] = useState(PUB_PAGINATION?.pageSize)

	const [isShowModal, setIsShowModal] = useState(false) // 查看更多匹配的型号
	const [productList, setProductList] = useState([]) // 搜索到的产品列表
	const [productTotal, setProductTotal] = useState(0) // 型号匹配总数
	const [searchName, setSearchName] = useState(""); // 查看更多匹配的型号-型号条件

	const [fileId, setFileId] = useState('')
	const [isEditFileName, setIsEditFileName] = useState(false) // 修改文件名
	// const [isDisabled, setIsDisabled] = useState(false)
	const [currentBom, setCurrentBom] = useState({}) // 接口的bom列表
	const [selectedRows, setSelectedRows] = useState([]); // table表格选中项
	const [matchingList, setMatchingList] = useState([]); // table表格选中项
	const [curMatchStatus, setCurMatchStatus] = useState(''); // 当前匹配条件  '' 全部 0 未匹配  1 已匹配 2多匹配
	const [invalid, setInvalid] = useState({})
	const [curRecord, setCurRecord] = useState({})
	const [isAddOne, setIsAddOne] = useState(false) // true 添加一个型号 false修改型号


	const [removeModal, setRemoveModal] = useState(false) // 删除弹框
	const [delChooseData, setDelChooseData] = useState([]) // 可删除、可加入询价操作选择的数组
	const [addCartData, setAddCartData] = useState([]) // 可以加入购物车的数据
	const [isAllClear, setIsAllClear] = useState(false) // 删除全部状态
	// const [addRfqList, setAddRfqList] = useState(false); // 添加Rfq数据
	// const [isRfqView, setIsRfqView] = useState(false); // 添加Rfq弹窗

	const [currentBomData, setCurrentBomData] = useState({})
	const currencyInfo = getCurrencyInfo()

	const changeFileName = async (e) => {
		const { value } = e.target
		const params = {
			id: queryFileId,
			fileName: value,
		}

		const res = await QuoteRepositry.updateFileInfo(params);

		// if (res && res.code == 0) {
		//     handleGetBomFileList(fileId)
		//     handleGetBomList()
		//     handleRemoveCancel()
		// }


		// setCurrentBomData({
		//     ...currentBomData,
		//     fileName: value
		// })
		// const arr = storageBomList?.map(item => {
		//     return {
		//         ...item,
		//         fileName: item.nanoid === currentBomData?.nanoid ? value : item?.fileName,
		//     }
		// })
		// setStorageBomList(arr)
		// setIsEditFileName(false)
	}

	const openRemoveMadol = (e, record) => {
		e?.preventDefault();
		setRemoveModal(true)
		if (!record) {
			// 多选
			setIsAllClear(true)
		} else {
			setIsAllClear(false)
			setDelChooseData([record])
		}
	}
	// const handleRequestQuote = e => {
	//     e?.preventDefault();

	//     const params = delChooseData?.map(item => {
	//         return {
	//             PartNumber: item?.partNum,
	//             Manufacturer: item?.manufacturer,
	//             Quantity: item?.quantity,
	//             thumb: item?.thumb,
	//             image: item?.image,
	//         }
	//     })
	//     setIsRfqView(true)
	//     setAddRfqList(params)
	//     // const { name, manufacturerName, cartQuantity } = record
	//     // const params = {
	//     //     PartNumber: name,
	//     //     Manufacturer: manufacturerName,
	//     //     Quantity: cartQuantity,
	//     // }
	//     // setChooseItems([...chooseItems, params])
	//     saveAddToRfq(params, true)
	// }

	const handleRemoveCancel = () => {
		setRemoveModal(false)
		setDelChooseData([])
		setIsAllClear(false)
	}

	// 删除成功后
	// const handleSucDel = res => {
	//     if (res && res.code == 0) {
	//         getMyList()
	//         handleRemoveCancel()
	//     }
	// }

	const handleRemoveOk = async () => {
		const infoList = delChooseData?.map(item => {
			return {
				id: item?.id,
				matchStatus: item?.matchStatus,
			}
		})
		const params = {
			fileId,
			infoList,
		}
		const res = await QuoteRepositry.removeBomMatchInfo(params);

		if (res && res.code == 0) {
			handleGetBomFileList(fileId)
			handleGetBomList()
			handleRemoveCancel()
		}
	}
	// 查看更多匹配的型号
	const viewMatchesResults = async (record) => {
		setCurRecord(record || {})

		setSearchName(record?.partNum)
		const params = {
			pageListNum: 1,
			pageListSize: 20,
			languageType: getDomainsData()?.defaultLocale,
		}

		const res = await ProductRepository.getProductsSearch({
			keyword: record?.partNum,
			...params,
		});

		if (res.code === 0) {
			const { data, total } = res.data
			setProductTotal(total)
			const newArr = data?.map(item => {
				return {
					...item,
					cartQuantity: record?.quantity || 1
				}
			})
			setProductList(newArr)
			setIsShowModal(true)
		}
	}
	// 修改
	// 将多选（未匹配）变为单匹配： 
	// 主键为当前数据的id
	// 选择好的产品productId  * 
	// 还有选择型号的manufacturer 供应商  * 只有完全匹配才传
	// matchPartNum 变为当前选择的型号 *

	// originStatus 原始状态为2或0
	// matchStatus 改为需要改为的匹配状态 1或2或0
	// 关闭选择型号框
	const closeModal = () => {
		setIsShowModal(false)
		setIsAddOne(false)
	}
	// matchquantity  选了具体型号变为1，  否则查到几个就几个
	const handleUpdateMatchInfo = async (params) => {
		const res = await QuoteRepositry.updateMatchInfo(params);
		if (res.code === 0) {
			handleGetBomFileList(fileId)
			handleGetBomList()
			closeModal()
		}
	}

	// 多匹配不能改型号
	// 选择匹配到的型号
	const chooseModule = async (record) => {
		const { productId, manufacturerName, name, quantity } = record || {}
		if (isAddOne) {
			// 添加搜索选择的型号
			sureAddOnePartNum(name, quantity || record?.cartQuantity)
			return
		}
		const params = {
			fileId: queryFileId,
			id: curRecord?.id,
			productId,
			manufacturer: manufacturerName,
			matchPartNum: name,
			originStatus: curRecord?.matchStatus,
			matchStatus: 1,
			matchQuantity: 1,
			quantity,
		}

		handleUpdateMatchInfo(params)
	}

	// 无匹配改变型号
	const changeUploadedData = (e, record) => {
		const { value } = e?.target
		setInvalid({ id: record.id, flag: false })
		const newMatchingList = matchingList?.map(item => {
			return {
				...item,
				partNum: item?.id === record?.id ? uppercaseLetters(value) : item?.partNum,
			}
		})

		setMatchingList(newMatchingList)
	}

	//改变数量
	const changeQuantity = (e, record) => {
		const newMatchingList = matchingList?.map(item => {
			return {
				...item,
				quantity: item?.id === record?.id ? e : item?.quantity,
			}
		})
		setMatchingList(newMatchingList)
	}

	const uploadedDataSearch = async (record) => {
		const { id, matchStatus, quantity, partNum } = record || {}
		if (!partNum || partNum?.length < 3) {
			setInvalid({ id, flag: true })
			return
		}
		const params = {
			pageListNum: 1,
			pageListSize: 2,
			languageType: getDomainsData()?.defaultLocale,
		}
		dispatch(setPageLoading(true));
		const res = await ProductRepository.getProductsSearch({
			keyword: record?.partNum,
			...params,
		});
		dispatch(setPageLoading(false));
		//matchStatus: 0 未匹配(noMatch:0)  1 已匹配(sucMatch:1) 2多匹配(moreMatch) 
		if (res.code === 0) {
			const { total, data } = res?.data || {}
			const matchQuantity = Number(total) || 0 // 匹配到的总数量
			const newMatchStatus = matchQuantity === 0 ? matchObj?.noMatch : (matchQuantity === 1 ? matchObj?.sucMatch : matchObj?.moreMatch)
			let param = {
				fileId: queryFileId,
				id,
				partNum,
				originStatus: matchStatus,
				matchStatus: newMatchStatus,
				matchQuantity,
				quantity,
			}
			// 完全匹配时传
			if (matchQuantity === 1) {
				param.matchPartNum = partNum
				param.productId = data?.[0]?.productId
				param.manufacturer = data?.[0]?.manufacturerName
			}

			handleUpdateMatchInfo(param)
				+ total && viewMatchesResults(record)
		}
	}

	// 加上选择
	const rowSelection = {
		columnWidth: '45px', // 设置行选择列的宽度为
		onChange: (selectedRowKeys, selectedRows) => {
			const arr = [
				{ productId: 5359744, cartQuantity: 1, },
				{ productId: 7838717, cartQuantity: 2, },
			]

			setSelectedRows(arr)
			setDelChooseData(selectedRows)
			let addCartArr = []
			selectedRows?.map(item => {
				if (item?.productId && item?.pricesList?.length > 0) {
					addCartArr.push({
						...item,
						cartQuantity: item?.quantity,
					})
				}
			})
			setAddCartData(addCartArr)
			// setIsAllClear(true)
		},
		// // getCheckboxProps: (record) => ({
		// //     disabled: record.name === 'Disabled User',
		// //     name: record.name,
		// // }),
		getCheckboxProps: (record) => ({
			// disabled: (curMatchStatus !== '') && curMatchStatus !== 0,
			// disabled: (!(record?.productId) && curMatchStatus == '') && curMatchStatus !== 0,
		}),
	};
	// 添加零件搜索 viewMatchesResults	
	const addOnePartNum = async (fieldsValue) => {
		setIsAddOne(true)
		const record = {
			partNum: fieldsValue.PartNumber,
			quantity: fieldsValue.Quantity,
		}
		viewMatchesResults(record)
		// const params = {
		// 	fileId: queryFileId,
		// 	partNum: fieldsValue?.PartNumber,
		// 	quantity: fieldsValue?.Quantity,
		// }
		// const res = await QuoteRepositry.addMatchInfo(params)
		// if (res.code === 0) {
		// 	handleGetBomFileList(fileId)
		// 	handleGetBomList()
		// }
	}
	// 确认添加零件
	const sureAddOnePartNum = async (partNum, quantity) => {
		const params = {
			fileId: queryFileId,
			partNum,
			quantity: quantity || 1,
		}
		const res = await QuoteRepositry.addMatchInfo(params)
		if (res.code === 0) {
			handleGetBomFileList(fileId)
			handleGetBomList()
			closeModal()
		}
	}

	const handleGetBomFileList = async (fileId, params) => {
		const res = await QuoteRepositry.getBomExistData({
			fileId: Number(fileId),
			matchStatus: curMatchStatus,
			pageNum: params?.pageNum || pageNum,
			pageSize: params?.pageSize || pageSize,
			languageType: getDomainsData()?.defaultLocale,
		}, cookies?.account?.token);
		if (res?.code === 0) {
			const { data, total, pages, pageNum, pageSize } = res?.data || {}
			setMatchingList(data || [])
			setTotal(Number(total))
			setPages(pages)
			setPageNum(pageNum)
			setPageSize(pageSize)
			// scrollToTop()
		}
		return res
	}

	// bom列表
	const handleGetBomList = async () => {
		const res = await QuoteRepositry.getBomFileList({}, cookies?.account?.token);
		if (res?.code === 0) {
			setCurrentBom(res?.data?.find(item => item?.id === queryFileId))
		}
	}

	const paginationChange = (pageNumber, pageSize) => {
		const params = {
			pageNum: pageNumber,
			pageSize: pageSize,
		}
		handleGetBomFileList(queryFileId, params).then(() => {
			scrollToTop()
		})
		setPageNum(pageNumber)
		setPageSize(pageSize)
	};

	const exportBom = async () => {
		const params = {
			fileId: queryFileId
		}
		const res = await QuoteRepositry.uploadBomExportBom(params, cookies?.account?.token);
		downloadClick(res, 'text/xlsx', 'BOM111.xlsx')
	}

	useEffect(() => {
		setFileId(queryFileId)
		if (queryFileId) {
			handleGetBomFileList(queryFileId)
		}

		handleGetBomList() // 所有的bom列表

		const currentData = storageBomList?.find(item => item.nanoid == queryFileId)
		// setCurrentBomData(currentData)
	}, [query])

	useEffect(() => {
		if (queryFileId) {
			handleGetBomFileList(queryFileId)
		}
	}, [curMatchStatus])

	const iBillBomTool = i18Translate('i18Bom.billBomTool', "Bill Of BOM Tool")
	const iTotalLines = i18Translate('i18Bom.totalLines', "Total Lines")
	const iDateAdded = i18Translate('i18PubliceTable.DateAdded', TABLE_COLUMN.DateCreated)
	const iAddMoreItems = i18Translate('i18SmallText.addMoreItems', "Add More Items")

	const iShowAll = i18Translate('i18Bom.showAll', "Show All Items")
	const iMatchedLines = i18Translate('i18Bom.matchedLines', "Matched Lines")
	const iMultipleMatches = i18Translate('i18Bom.multipleMatches', "Multiple Matches")
	const iNoMatches = i18Translate('i18Bom.noMatches', "No Matches")
	const iUploadedData = i18Translate('i18Bom.uploadedData', "Uploaded Data")
	const iSort = i18Translate('i18PubliceTable.Sort', "Sort")
	const iMatchedPartDetail = i18Translate('i18PubliceTable.MatchedPartDetail', 'Matched Part Detail')
	const iManufacturer = i18Translate('i18PubliceTable.Manufacturer', "Manufacturer")
	const iAvailability = i18Translate('i18PubliceTable.Availability', "Availability")
	const iAvailable = i18Translate('i18PubliceTable.Available', "Available")
	const iQuantity = i18Translate('i18PubliceTable.Quantity', "Quantity")

	const iProductNotFound = i18Translate('i18Bom.productNotFound', "Product not found")
	const iAgainSearch = i18Translate('i18Bom.againSearch', "Modify your search and try again")
	const iMatchesFound = i18Translate('i18Bom.matchesFound', "matches found")
	const iSuggestedMatches = i18Translate('i18Bom.suggestedMatches', "Please review our suggested matches")
	const iViewAllResults = i18Translate('i18Bom.viewAllResults', "View All Results")
	const iPrice = i18Translate('i18PubliceTable.Price', "Price")
	const iLinePrice = i18Translate('i18Bom.linePrice', "Line Price")
	const iLineNote = i18Translate('i18Bom.lineNote', "Line Note")

	const iTotalParts = i18Translate('i18Bom.Total Parts', "Total Parts")
	const iSearch = i18Translate('i18FunBtnText.Search', "Search")
	const iDelete = i18Translate('i18PubliceTable.Delete', TABLE_COLUMN.delete)

	const i18Title = i18Translate('i18Seo.bomDetail.title', "")
	const i18Key = i18Translate('i18Seo.bomDetail.keywords', "")
	const i18Des = i18Translate('i18Seo.bomDetail.description', "")

	const columns = [
		{
			title: iSort,
			dataIndex: 'index',
			width: 42,
			render: (_text, _record, index) =>
				<div className='cart-img-sort'>
					<span>{((+pageNum - 1) * +pageSize) + index + 1}</span>
				</div>,
		},
		{
			title: iUploadedData,
			dataIndex: 'partNum',
			width: 300,
			render: (text, record) =>
				<div className='cart-img-sort'>
					{record?.matchStatus !== 0 && (
						<span>{text}</span>
					)}
					<div className='pub-flex-align-center pub-font14 pub-fontw pub-lh18'>
						{record?.matchStatus === 0 && (
							<CustomInput
								className="form-control form-input pub-border w200"
								type="text"
								defaultValue={text}
								value={text}
								onChange={(e) => changeUploadedData(e, record)}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										uploadedDataSearch(record)
									}
								}}
							/>
						)}
					</div>
					{invalid?.id === record.id && invalid?.flag && <AlarmPrompt text={i18Translate('i18Head.enterLimit', INVALID_INPUT_TIP)} />}
					{record?.matchStatus === 0 && (
						<Button
							type="primary" ghost
							className='ps-add-cart-footer-btn w200 mt7'
							onClick={() => uploadedDataSearch(record)}
						>
							{iSearch}
						</Button>
					)}
				</div>,
		},
		{
			title: iMatchedPartDetail,
			dataIndex: 'partNum',
			width: 350,
			render: (text, record, index) => {
				return <div>
					{/* 0 未匹配  1 已匹配 2多匹配   matchStatus */}
					{/* 完全匹配，只有一个匹配型号 */}
					{
						record?.matchStatus === 1 && (
							<div className='pub-flex'>
								<img
									className='w50 h50 mr15'
									src={record?.thumb || record?.image || getLanguageEmpty()}
								/>
								<div>
									<div className="color-link product-name">
										<Link href={getProductUrl(record?.manufacturer, record?.partNum, record?.productId)}>
											<a className="ps-product__title">{record?.matchPartNum || record?.partNum}</a>
										</Link>
									</div>

									<div className='manufacturer pub-color555'>
										{record?.description}
									</div>
								</div>
							</div>
						)
					}
					{/* 有多个匹配型号 */}
					{
						record?.matchStatus === 2 && (
							<div className='pub-flex custom-antd-btn-more'>
								<img
									className='w50 h50 mr15'
									src={getLanguageEmpty()}
								/>
								<div>
									<div className='pub-flex-align-center'>
										<div className='mr10 sprite-bom sprite-bom-2-2'></div>
										<div className='pub-color-tip pub-font14'>{record?.matchQuantity} {iMatchesFound}</div>
									</div>
									<div className='pub-color555 mt2'>{iSuggestedMatches}</div>
									<Button
										type="primary" ghost
										className='ps-add-cart-footer-btn w150 mt7'
										onClick={() => viewMatchesResults(record)}
									>{iViewAllResults}</Button>
								</div>
							</div>
						)
					}
					{/* 无匹配型号 */}
					{
						record?.matchStatus === 0 && (
							<div className='pub-flex'>
								<img
									className='w50 h50 mr15'
									src={getLanguageEmpty()}
								/>
								<div>
									<div className='pub-flex-align-center'>
										<div className='mr10 sprite-bom sprite-bom-2-3'></div>
										<div className='pub-danger pub-font14'>{iProductNotFound}</div>
									</div>
									<div className='pub-color555'>{iAgainSearch}</div>
								</div>
							</div>
						)
					}
				</div>
			}

		},
		{
			title: iManufacturer,
			dataIndex: 'manufacturer',
			width: 200,
			render: (text, record, index) =>
				<div className='cart-img-sort'>
					<span>{text}</span>
				</div>,
		},

		{
			title: iAvailability,
			dataIndex: 'stockQuantity',
			key: 'stockQuantity',
			width: 150,
			render: (text, record, index) => {
				const avbility = !!text ? getThousandsDataInt(text) : ''
				return (
					<div>{avbility ? avbility + ' ' + iAvailable : avbility}</div>
					// <MinTableAvailability sendTimeMap={{}} adddressMap={{}} record={allCartItems?.[index]} />
				)
			},
		},
		{
			title: iQuantity,
			dataIndex: 'quantity',
			width: 100,
			render: (text, record, index) =>
				<div className='cart-img-sort'>
					<span>
						{/* <InputNumber
									className="form-control w80"
									min={1} defaultValue={text}
									onChange={(e) => changeQuantity(e, record)}
							/> */}
						<CustomInputNumber
							className="form-control w80"
							min={1}
							defaultValue={text}
							onChange={(e) => changeQuantity(e, record)}
						/>
					</span>
				</div>,
		},

		{
			title: iPrice,
			dataIndex: 'pricesList',
			key: 'pricesList',
			width: 140,
			render: (text, record) => {
				return <div style={{ display: 'flex' }}>
					<TablePriceList pricesList={text || []} initNum={1} quantity={record?.quantity} showQuantityPrice={true} isShowContactUs={false} />
				</div>
			}
		},
		{
			title: iLinePrice,
			dataIndex: 'linePrice',
			key: 'linePrice',
			width: 120,
			render: (text, record, index) => {
				// 计算价格需要
				const lPrice = calculateItemPriceTotal({
					...record,
				}) || 0

				return <div style={{ display: 'flex' }}>
					{lPrice ? currencyInfo.label + toFixedFun(lPrice, 2) : ''}
				</div>
			}
		},
		{
			title: iLineNote,
			dataIndex: 'remark',
			key: 'remark',
			width: 120,
			render: (text) =>
				<div className='cart-img-sort'>
					<span>{text}</span>
				</div>,
		},
		{
			title: iDelete,
			// title: <div onClick={(e) => openRemoveMadol(e)} className='sprite-icon4-cart sprite-icon4-cart-3-7 sprite-icon4-cart-3-6'></div>,
			dataIndex: 'del',
			key: 'del',
			width: TABLE_COLUMN.deleteWidth,
			// fixed: 'right',
			render: (text, record) => (
				<>
					<a className='pub-font16' href="#" onClick={(e) => openRemoveMadol(e, record)}>
						<div className='sprite-icon4-cart sprite-icon4-cart-3-6'></div>
					</a>
				</>
			),
		},
	]

	const opearation = (isShow = true) => {
		const _isDel = isShow || delChooseData?.length > 0
		const _isRFQ = isShow || delChooseData?.length > 0
		const _isAdd = isShow || addCartData?.length > 0
		const show = isShow || (_isDel || _isRFQ || _isAdd)

		return <FloatButtons isShow={show}>
			<Flex gap={20} className='ml0'>
				{_isDel &&
					<Button
						type="primary" ghost='true'
						className='login-page-login-btn ps-add-cart-footer-btn w150'
						disabled={delChooseData?.length === 0}
						onClick={(e) => openRemoveMadol(e)}
					>{iDeleteSelected}
					</Button>
				}

				{curMatchStatus !== '' && _isRFQ && (
					<MinAddToRFQ list={delChooseData} />
				)}

				{curMatchStatus !== 0 && curMatchStatus !== 2 && _isAdd &&
					<MinAddMoreCart
						addCartBack={() => setSelectedRows([])}
						selectedRows={addCartData}
						otherParams={{
							addText: `${i18Translate('i18FunBtnText.AddToCart', 'ADD TO CART')} (` + addCartData?.length + ')',
							widthClass: 'w150',
						}}
						propDisabled={addCartData?.length === 0}
					/>
				}
			</Flex>
		</FloatButtons>
	}

	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>

			<div className={`${styles['bom-detail-page']} product-table-container pub-minh-1 custom-antd-btn-more pub-bgc-f5 pt-15 pl-30 pr-30 pb60`}>
				<div className='pub-flex-align-center pub-cursor-pointer w140' onClick={() => Router.back()}>
					<div className='ml5 mr10 sprite-bom sprite-bom-2-5'></div>
					{iBillBomTool}
				</div>

				<div className='pub-flex-align-center pub-flex-between pb-15 mt12 pub-border15 box-shadow'>
					<div className='pub-flex-align-center'>
						<div className='pub-flex-align-center pub-font14 pub-fontw pub-lh18'>
							<h1> {!isEditFileName && currentBom?.fileName}</h1>
							{isEditFileName && (
								<CustomInput
									className="form-control form-input pub-border w150"
									type="text"
									defaultValue={currentBom.fileName}
									onBlur={(e) => changeFileName(e)}
								/>
							)}
							<div onClick={() => setIsEditFileName(true)} className='ml20 sprite-account-icons sprite-account-icons-2-2 mr10'></div>
						</div>
						<div className='pub-flex-align-center ml60 bomTime'>
							<div className='pub-color555 pub-lh18'>{iDateAdded}: {handleMomentTime(currentBom?.createTime)}</div>
							<div className='ml30 pub-color555 pub-lh18'>{iTotalLines}: {currentBom?.totalNum}</div>
						</div>
					</div>
					<div>
						<Button
							ghost='true'
							className='login-page-login-btn custom-antd-btn-more  w120'
							onClick={() => exportBom()}
						>
							{i18Translate('i18FunBtnText.Export', 'EXPORT')}
						</Button>
					</div>
				</div>

				<h2 className='mt15 mb3 pub-left-title'>{iAddMoreItems}</h2>
				<div className='pub-border15 box-shadow' style={{ padding: '0 20px' }}>
					<AddMoreItems
						callSubmit={(fieldsValue) => addOnePartNum(fieldsValue)}
						isShowReference={false}
					/>
				</div>


				<h2 className='mt20 pub-font16 pub-fontw'>{iTotalParts}: {currentBom?.totalNum}</h2>
				<div className='pub-flex-between bom-detail-tabs'>
					<div className='pub-flex'>
						<div
							className={`${styles['matched-choose']} pub-flex mr20 ` + (curMatchStatus === '' ? `${styles['matched-filter']}` : '')}
							onClick={() => setCurMatchStatus('')}
						>
							<div className={`pub-center ${styles.num} ${styles.all}`}>{currentBom?.totalNum}</div>
							<span className='ml10 pub-font14'>{iShowAll}</span>
						</div>
						<div
							className={`${styles['matched-choose']} pub-flex mr20 ` + (curMatchStatus === 1 ? `${styles['matched-filter']}` : '')}
							onClick={() => setCurMatchStatus(1)}
						>
							<div className={`pub-center ${styles.num} ${styles.matched}`}>{currentBom?.matchNum}</div>
							<span className='ml10 pub-font14'>{iMatchedLines}</span>
						</div>
						<div
							className={`${styles['matched-choose']} pub-flex mr20 ` + (curMatchStatus === 2 ? `${styles['matched-filter']}` : '')}
							// className={'matched-choose pub-flex mr20 ' + (curMatchStatus === 2 ? 'matched-filter' : '')}
							onClick={() => setCurMatchStatus(2)}
						>
							<div className={`pub-center ${styles.num} ${styles['more-matched']}`}>{currentBom?.overMatchNum}</div>
							<span className='ml10 pub-font14'>{iMultipleMatches}</span>
						</div>
						<div
							className={`${styles['matched-choose']} pub-flex mr20 ` + (curMatchStatus === 0 ? `${styles['matched-filter']}` : '')}
							// className={'matched-choose pub-flex mr20 ' + (curMatchStatus === 0 ? 'matched-filter' : '')}
							onClick={() => setCurMatchStatus(0)}
						>
							<div className={`pub-center ${styles.num} ${styles['no-matched']}`}>{currentBom?.noMatchNum}</div>
							<span className='ml10 pub-font14'>{iNoMatches}</span>
						</div>
					</div>

					{opearation()}
				</div>

				<Table
					size='small'
					columns={columns}
					rowSelection={{
						...rowSelection,
					}}
					sticky
					loading={loading}
					dataSource={matchingList}
					className="mt20 pub-bordered table-vertical-top pub-table-thead box-shadow"
					bordered
					rowKey={record => record.id}
					pagination={false}
					scroll={matchingList?.length > 0 ? { x: 1200 } : null}
				/>
				<Flex justifyBetween className='mt20'>
					{opearation(false)}
					{
						matchingList?.length > 0 && (
							// <MinPagination
							//     total={total}
							//     pageNum={pageNum}
							//     pageSize={pageSize}
							//     totalPages={pages}
							//     isItemRender={false}
							//     paginationChange={(page, pageSize) => {
							//         paginationChange(page, pageSize)
							//     }}
							// />

							<SamplePagination
								total={total}
								pageNum={pageNum}
								pageSize={pageSize}
								pagesTotal={pages}
								isSEO={false}
								onChange={({ pageNum, pageSize }) => {
									paginationChange(pageNum, pageSize)
								}}
							/>
						)
					}
				</Flex>
				{/* <Table
                    size='small'
                    columns={columns}
                    rowSelection={{
                        ...rowSelection,
                    }}
                    loading={loading}
                    dataSource={currentBomData?.dtoList}
                    // className='mt20 pub-border-table'
                    className="mt20 pub-bordered table-vertical-top pub-table-thead"
                    // rowClassName='reset-table-row'
                    // className="reset-table"
                    bordered
                    rowKey={record => record.productId}
                    pagination={false}
                /> */}

			</div>

			{/* 查看更多匹配的型号 */}
			{
				isShowModal && (
					<ModuleProductsSearch
						modalData={{
							productTotal,
							isShowModal,
							productList,
							PartNumber: searchName,
						}}
						cancelModule={() => closeModal()}
						chooseModule={(e) => chooseModule(e)}
					/>
				)
			}

			{/* {isRfqView && <Modal
                centered
                title={iRFQ}
                footer={null}
                width={550}
                onCancel={() => setIsRfqView(false)}
                open={isRfqView}
                closeIcon={<i className="icon icon-cross2"></i>}
            >
                <AddRfqPreview
                    submitFn={() => { setIsRfqView(false); Router.push(ACCOUNT_QUOTE) }}
                    continueFn={() => setIsRfqView(false)}
                    otherParams={{
                        addCartList: addRfqList,
                        type: 'more',
                    }}
                />
            </Modal>
            } */}

			<Modal
				// title='REMOVE AN ITEM'
				title={isAllClear ? i18Translate('i18MyCart.REMOVE ALL ITEMS', "REMOVE ALL ITEMS") : i18Translate('i18MyCart.REMOVE AN ITEM', "REMOVE AN ITEM")}
				open={removeModal}
				footer={null}
				width="440"
				centered
				onCancel={handleRemoveCancel}
				closeIcon={<i className="icon icon-cross2"></i>}
			>
				<div className='custom-antd-btn-more'>
					<div>
						{i18Translate('i18MyCart.ItemRemoveTip', DEL_ONE_TEXT)}
					</div>
					<div className='ps-add-cart-footer'>
						<Button
							type="primary" ghost='true'
							className='login-page-login-btn ps-add-cart-footer-btn w90'
							onClick={handleRemoveCancel}
						>
							{i18Translate('i18FunBtnText.Cancel', 'Cancel')}
						</Button>
						<button
							type="submit" ghost='true'
							className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w90'
							onClick={handleRemoveOk}
						>
							{i18Translate('i18FunBtnText.Confirm', 'Confirm')}
						</button>
					</div>
				</div>
			</Modal>
		</PageContainer>
	);
};

export default connect((state) => state)(BomDetail);

export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	return {
		props: {
			...translations,
		}
	}
}