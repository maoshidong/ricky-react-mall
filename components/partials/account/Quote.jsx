import React, { useEffect, useState, useMemo, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';
import { Form, Table, Button } from 'antd';
import { CustomInputNumber, CustomInput, AlarmPrompt, Flex, RequireTip, BulkAdd, BulkUpload, Confirm, SamplePagination } from '~/components/common';
import FloatButtons from '~/components/ecomerce/modules/FloatButtons'

import { useCookies } from 'react-cookie';
import { onlyNumber, onlyNumberPoint, helpersFormNoError, scrollToTop, uppercaseLetters } from '~/utilities/common-helpers';
import { getEnvUrl, ACCOUNT_QUOTE, ACCOUNT_QUOTE_BOM_UPLOAD } from '~/utilities/sites-url';
// import QuoteRepositry from '~/repositories/zqx/QuoteRepositry';
import ProductRepository from '~/repositories/zqx/ProductRepository';
import ModuleProductsSearch from '~/components/ecomerce/modules/ModuleProductsSearch';
import MinLoginTip from '~/components/ecomerce/minCom/MinLoginTip';
import PageHeaderShadow from '~/components/ecomerce/minCom/PageHeaderShadow';

import { QuoteBom, QuoteStepTip } from '~/components/partials';
import { getCurrencyInfo } from '~/repositories/Utils';
import useI18 from '~/hooks/useI18'
import QuoteReqHistory from './QuoteReqHistory';

import useEcomerce from '~/hooks/useEcomerce';
import useLocalStorage from '~/hooks/useLocalStorage';
import useClickLimit from '~/hooks/useClickLimit';
import useLanguage from '~/hooks/useLanguage';


import CreateQuote from './createQuote';

// import { Trans } from 'next-i18next';

const HASH_QUOTE_REQUEST = 'quote-request';
const HASH_QUOTE_REQUEST_HISTORY = 'quote-request-history';
const HASH_BOM_UPLOAD = 'bom-upload';

const Quote = ({ paramMap, auth, curActive, quoteReqList }) => {
	const { getDomainsData, i18Translate } = useLanguage();
	const { iEmailTip, iRfqTip1, iQuoteHistory, iRfqTip2, iPartNumber, iAddPartNumber, iManufacturer,
		iQuantity, iTargetPrice, iRequestAQuote, iPartsListBOMTools, iLoginTip, iQuoteTip, iPartList, iAddMoreParts, iContactInformation,
		iEmail, iRemark, iSubmitQuote, iRow, iReceivedRfq, iReceivedRfq1, iRequired,
		iReceivedRfq2, iThankYou, iProject, iProcessRFQ, iCreateQuote } = useI18();
	const Router = useRouter();
	const currencyInfo = getCurrencyInfo();
	const { saveAddToRfq } = useEcomerce();

	const [form] = Form.useForm();
	const [cookies, setCookie] = useCookies(['email', '']);
	const { email } = cookies;

	const [showError, setShowError] = useState(false);
	const [errText, setErrText] = useState(iRfqTip1);
	const [isShowSuc, setIsShowSuc] = useState(false);

	const [tabActive, seTabActive] = useState(curActive || HASH_QUOTE_REQUEST); // 头部导航状态
	const [isShowModal, setIsShowModal] = useState(false);
	const [searchName, setSearchName] = useState(''); // 搜索框型号名
	const [productList, setProductList] = useState([]); // 搜索到的产品列表
	const [productTotal, setProductTotal] = useState(0); // 型号匹配总数
	const [quoteList, setQuoteList] = useLocalStorage('quoteList', new Array(5).fill({})); // 保存到本地

	const [limitDisabled, handleLimitDisabled] = useClickLimit();
	const [list, setList] = useState(quoteList || {});
	const [emailInput, setEmailInput] = useState('');
	const [pageNum, setPageNum] = useState(1)
	const [pageSize, setPageSize] = useState(35)
	const [isCreateQuote, setIsCreateQuote] = useState(false)
	const [isSetError, setIsSetError] = useState(false) // 提交后，pageSize变化时是否验证未填输入框
	const [fItems, setFItems] = useState([]); // 存储询价数据

	const { isAccountLog } = useSelector(state => state.auth)
	const tableRef = useRef(null);
	const tableRowRefs = useRef([]);

	useEffect(() => {
		const result = Object.assign({}, ...quoteList);
		form.setFieldsValue(result);
	}, []);

	useEffect(() => {
		// 初始化展示
		const cList = cloneDeep(list)
		const arr = map(cList?.slice((pageNum - 1) * pageSize, pageSize * pageNum), (item, index) => {
			const subSript = (pageNum - 1) * pageSize + index
			const { PartNumber, Manufacturer, Quantity, TargetPrice } =
				item || {};
			return {
				['PartNumber_' + subSript]: PartNumber,
				['Manufacturer_' + subSript]: Manufacturer,
				['Quantity_' + subSript]: Quantity,
				['TargetPrice_' + subSript]: TargetPrice,
				...item,
			};
		});
		const result = Object.assign({}, ...arr);
		form.setFieldsValue(result);
		// 提交后，pageSize变化时是否验证未填输入框	
		if (isSetError) {
			cList?.map((item, index) => {
				const { PartNumber, Manufacturer, Quantity, TargetPrice } = item;
				if (
					!item?.PartNumber &&
					!item?.Manufacturer &&
					!item?.Quantity &&
					!item?.TargetPrice
				) {
					setNoError(`Quantity_${index}`);
					setNoError(`PartNumber_${index}`);
					return {};
				}
				// 型号、数量必填
				if (PartNumber || Manufacturer || TargetPrice) {
					if (!Quantity) {
						setForError(`Quantity_${index}`);
					}
				}

				if (Quantity || Manufacturer || TargetPrice) {
					if (!PartNumber) {
						setForError(`PartNumber_${index}`);
					}
				}
				setIsSetError(false)
			})
		}

	}, [list, pageNum, pageSize]);

	const setNoError = (name) => {
		form.setFields([
			{
				name,
				errors: [],
			},
		]);
	};


	const setForError = (name) => {
		form.setFields([
			{
				name,
				errors: [<AlarmPrompt text={iRequired} style={{ marginBottom: '-10px' }} />],
				// errors: [iRequired],
			},
		]);
	};
	const handleSubmit = async (flag) => {
		// const contact = {
		// 	email: emailInput,
		// 	remark: remark,
		// 	companyName: '',
		// 	yourName: 'CUSTOM',
		// 	address: '',
		// 	phone: '',
		// 	payment: -1,
		// 	delivery: 0,
		// 	message: '',
		// };
		let errRowNum = [] // 错误的所有行下标，
		let isError = false;
		if (list.length === 1) {
			if (!list[0]?.PartNumber) {
				isError = true;
				errRowNum.push(0)
				setForError(`PartNumber_0`);
			}
			if (!list[0]?.Quantity) {
				isError = true;
				errRowNum.push(0)
				setForError(`Quantity_0`);
			}
		}

		const items = list?.map((item, index) => {
			// 只要数据都不为空
			if (
				!item?.PartNumber &&
				!item?.Manufacturer &&
				!item?.Quantity &&
				!item?.TargetPrice
			) {
				setNoError(`Quantity_${index}`);
				setNoError(`PartNumber_${index}`);
				return {};
			}

			const { PartNumber, Manufacturer, Quantity, TargetPrice } = item;
			// 型号、数量必填
			if (PartNumber || Manufacturer || TargetPrice) {
				if (!Quantity) {
					isError = true;
					if (!Quantity) {
						errRowNum.push(index)
						setForError(`Quantity_${index}`);
					}
				}
			}

			if (Quantity || Manufacturer || TargetPrice) {
				if (!PartNumber) {
					isError = true;
					if (!PartNumber) {
						errRowNum.push(index)
						setForError(`PartNumber_${index}`);
					}
				}
			}

			return {
				partNum: PartNumber,
				manufacturer: Manufacturer || '',
				quantity: Quantity,
				targetPrice: TargetPrice || -1,
				priceType: 0, // 0 USD
				extPrice: TargetPrice
					? (Number(Quantity) * Number(TargetPrice)).toFixed(4)
					: -1,
			};
		});

		// if (!validateEmail(_, emailInput)) {
		// 	isError = true;
		// 	form.setFields([
		// 		{
		// 			name: 'email',
		// 			errors: ['Please input a valid email!'],
		// 		},
		// 	]);
		// }

		const filterItems = items.filter((i) => Object.keys(i).length !== 0);

		if (filterItems.length === 0) {
			setErrText(iRfqTip1);
			setShowError(true);
			return;
		}

		if (isError) {
			// 计算页码
			const pageNumber = Math.ceil((errRowNum?.[0] + 1) / 35);
			setPageNum(pageNumber)
			setIsSetError(true)
			// 保存未填的在第几行 - 先切换页码
			tableRowRefs.current?.[errRowNum?.[0] % 35]?.input.scrollIntoView({ behavior: 'smooth', block: 'center' });
			if (+pageNum !== +pageNumber && !flag) {
				handleSubmit(true) // 跳转到未输入的页码， 然后重新提交
			}

			return;
		}

		setFItems(filterItems)

		if (limitDisabled) return; // 限制多次点击

		handleLimitDisabled(true);
		setIsCreateQuote(true)
		// const res = await QuoteRepositry.addToQuote111(auth.token, {
		// 	information: contact,
		// 	items: filterItems,
		// });

		// if (res?.data?.code === 0) {
		// 	setShowError(false);
		// 	setIsShowSuc(true);
		// 	setQuoteList([{}, {}, {}]);
		// 	setList([{}, {}, {}]);
		// 	setSearchName('');
		// 	form.resetFields()
		// 	form.setFields([
		// 		{
		// 			name: 'remark',
		// 			value: '',
		// 		},
		// 	]);
		// } else {
		// 	setErrText(iRfqTip2);
		// 	setShowError(true);
		// }
		handleLimitDisabled(false);
	};
	// 新增一行
	const handeAddEmptyRow = (e) => {
		e.preventDefault();
		const _lt = cloneDeep(list)
		const _qlt = cloneDeep(quoteList)
		_lt.push({})
		_qlt.push({})

		const toPageNum = Math.ceil(_lt?.length / pageSize)

		setList(_lt);
		setQuoteList(_qlt);
		// setList([...list, {}]);
		// setQuoteList([...quoteList, {}]);

		paginationChange(toPageNum, pageSize, false)
		// if (tableRef.current) {
		// 	const rows = tableRef.current.getElementsByClassName('ant-table-row');

		// 	const lastRow = rows[rows.length - 2];
		// 	// 你可以在这里执行你想要的操作，比如滚动到最后一行
		// 	lastRow.scrollIntoView({ behavior: 'smooth' });
		// }
	};

	// 清空列表数据
	const openAllRemove = () => {
		form.resetFields()
		form.setFieldsValue({
			email,
		});
		setQuoteList([{}, {}, {}]);
		setList([{}, {}, {}]);
	};

	// 删除单行数据
	const removeMadol = (index) => {
		const newList = [...list];
		newList.splice(index, 1);
		if (newList.length === 0) {
			form.resetFields()
			setQuoteList([{}]);
			setList([{}]);
			return;
		}
		setQuoteList(newList);
		setList(newList);
	};

	const searchChange = (e) => {
		const v = uppercaseLetters(e.target.value)
		setSearchName(v);
		form.setFields([
			{
				name: 'searchPartNumber',
				errors: [],
				value: v
			},
		]);
	};
	// 搜索型号
	const handleSearch = async (flag, pNum) => {
		if (flag !== 'true') {
			return;
		}

		const params = {
			pageListNum: 1,
			pageListSize: 20,
			languageType: getDomainsData()?.defaultLocale,
		};

		if (!pNum) {
			if (!searchName || searchName.length < 3) {
				form.setFields([
					{
						name: 'searchPartNumber',
						errors: [<RequireTip className='mt6' isAbsolute={false} style={{ width: 'max-content' }} />],
					},
				]);
				return;
			}
		}

		const res = await ProductRepository.getProductsSearch({
			keyword: searchName || pNum,
			...params,
		});

		if (res.code === 0) {
			const { data, total } = res.data;
			form.setFields([
				{
					name: 'searchPartNumber',
					value: '',
					errors: [],
				},
			]);
			setProductList(data);
			setProductTotal(total);
			setIsShowModal(true);
		}
	};

	const chooseModule = (value) => {
		setSearchName('');
		const { name, manufacturerName, quantity, productId } = value;
		const params = {
			PartNumber: name,
			Manufacturer: manufacturerName,
			Quantity: quantity,
			productId,
		};
		let qList = JSON.parse(localStorage.getItem('quoteList'));
		let sliceArr = qList;

		let fillIndex = 0;
		sliceArr.map((item, index) => {
			if (Object.keys(item).length > 0) {
				fillIndex = index + 1;
			}
		});
		sliceArr[fillIndex] = params;
		setIsShowSuc(false);
		setList(sliceArr);
		setQuoteList(sliceArr);
		setIsShowModal(false);
	};

	const partNumberChange = (e, index, key) => {
		const newData = JSON.parse(localStorage.getItem('quoteList')) || [];

		// const newItem = _dl[index] || {}

		const newItem = newData[index] || {};

		newItem[key] = e;
		// _dl[index] = newItem;
		newData[index] = newItem;
		// 本地保存一份
		// localStorage.setItem('quoteList', JSON.stringify(_dl));
		localStorage.setItem('quoteList', JSON.stringify(newData))
		form.setFields([
			{
				name: `${key + '_' + index}`,
				errors: [],
			},
		]);
		setShowError(false);
		setList(newData);
		setQuoteList(newData); //保存到本地
	};

	const handleDoubleClick = (e) => {
		e.target.select();
	};

	const columns = [
		{
			title: iRow,
			key: 'index',
			width: 30,
			render: (_v, _record, index) => {
				const subSript = (pageNum - 1) * pageSize + (index + 1)
				return <div style={{ paddingTop: '7px' }}><span >{subSript}</span></div>
			}
		},
		{
			title: iPartNumber,
			key: 'PartNumber',
			width: 130,
			render: (text, record, index) => {
				const _index = (pageNum - 1) * pageSize + index
				const _name = `PartNumber_${_index}`
				return <Form.Item className="mb0" name={_name}>
					<CustomInput
						className="form-control form-input pub-border w220"
						placeholder={iPartNumber}
						onChange={(e) =>
							partNumberChange(uppercaseLetters(e.target.value), _index, 'PartNumber')
						}
						ref={(el) => (tableRowRefs.current[index] = el)}
					/>
				</Form.Item>
			},
		},
		{
			title: iManufacturer,
			key: 'Manufacturer',
			width: 130,
			render: (text, record, index) => {
				const _index = (pageNum - 1) * pageSize + index
				const _name = `Manufacturer_${_index}`
				return <Form.Item
					className="mb0"
					name={_name}
					rules={[
						{
							message: 'Required',
						},
					]}>
					<CustomInput
						className="form-control form-input pub-border w220"
						type="text"
						placeholder={iManufacturer}
						value={record?.Manufacturer}
						onChange={(e) =>
							partNumberChange(
								e.target.value,
								_index,
								'Manufacturer'
							)
						}
					/>
				</Form.Item>
			},
		},
		{
			title: iQuantity,
			dataIndex: 'Quantity',
			key: 'Quantity',
			width: 100,
			render: (text, record, index) => {
				const _index = (pageNum - 1) * pageSize + index
				const _name = `Quantity_${_index}`
				return <Form.Item
					className="mb0"
					name={_name}
				>
					<CustomInputNumber
						className="form-control form-input pub-border w150"
						type="text"
						min={1}
						placeholder={iQuantity}
						onKeyPress={onlyNumber}
						onDoubleClick={handleDoubleClick}
						onChange={(e) => partNumberChange(e, _index, 'Quantity')}
					/>
				</Form.Item>
			},
		},
		{
			title: iTargetPrice,
			key: 'TargetPrice',
			width: 80,
			render: (text, record, index) => {
				const _index = (pageNum - 1) * pageSize + index
				const _name = `TargetPrice_${_index}`
				return <Form.Item className="mb0" name={_name}>
					<CustomInputNumber
						prefix={currencyInfo.label}
						className="form-input w150"
						style={{ borderRadius: "6px" }}
						type="text"
						placeholder={iTargetPrice}
						controls={false}
						onKeyPress={onlyNumberPoint}
						onDoubleClick={handleDoubleClick}
						onChange={(e) =>
							partNumberChange(e, _index, 'TargetPrice')
						}
					/>
				</Form.Item>
			},
		},
		{
			title: (
				<Confirm onConfirm={() => openAllRemove()}>
					<div className="sprite-icon4-cart sprite-icon4-cart-3-7 sprite-icon4-cart-3-6 ml40" />
				</Confirm>
			),
			key: 'ExtendedPrice',
			align: 'right',
			verticalAlign: 'middle',
			className: 'pub-table-vertical-align-middle',
			width: 40,
			render: (text, record, index) => {
				const _index = (pageNum - 1) * pageSize + index
				return <Confirm onConfirm={() => removeMadol(_index)}>
					<div className="" style={{ verticalAlign: 'middle' }}>
						<div className="sprite-icon4-cart sprite-icon4-cart-3-6 ml40" />
					</div>
				</Confirm>

			},
		},
	];

	const validateEmail = (_, value) => {
		// 如果没有输入值，则直接返回 Promise.resolve()，
		// 表示校验通过（Ant Design 中规定 required 由单独的 rules 完成）
		if (!value) {
			return false;
		}
		const emailRegex = /^\S+@\S+\.\S+$/;
		if (emailRegex.test(value)) {
			return true;
		}
		// 格式不正确时返回 Promise.reject() 并提供错误信息
		return false;
	};

	const checkEmail = (e) => {
		e.preventDefault();
		setEmailInput(e.target.value);
		if (validateEmail(_, e.target.value)) {
			form.setFields([
				{
					name: 'email',
					errors: [],
				},
			]);
		} else {
			form.setFields([
				{
					name: 'email',
					errors: ['Please input a valid email!'],
				},
			]);
		}
	};

	const handleEmail = (email) => {
		form.setFieldsValue({
			email,
		});
		setEmailInput(email);
	};

	useEffect(() => {
		if (isAccountLog) {
			handleEmail(cookies?.account?.account);
		} else {
			handleEmail(email);
		}
	}, [auth, email]);

	const quoteTableList = quoteList || [];

	// Quote History
	const headNavArr = [
		{
			name: iRequestAQuote,
			tabLabel: HASH_QUOTE_REQUEST,
			linkUrl: getEnvUrl(ACCOUNT_QUOTE),
		},
		{
			name: iPartsListBOMTools,
			tabLabel: HASH_BOM_UPLOAD,
			linkUrl: getEnvUrl(ACCOUNT_QUOTE_BOM_UPLOAD),
		}, // BOM开关 - 完成后开启底部的BOM Tools
		{
			name: iQuoteHistory,
			tabLabel: HASH_QUOTE_REQUEST_HISTORY,
			linkUrl: getEnvUrl('quote-request-history'),
		},
	];

	const handleTabNav = (e, item) => {
		// e.preventDefault();
		// setIsShowSuc(false);
		// seTabActive(item?.tabLabel);

	};
	// 添加数据到表格
	const handleAddToRow = (data) => {
		const isMore = data.length > 1 ? true : false
		let dt = isMore ? data : data?.[0]
		saveAddToRfq(dt, isMore)

		setTimeout(() => {
			const _qtList = JSON.parse(localStorage.getItem('quoteList'));
			setList(_qtList);
			setQuoteList(_qtList)
		}, 200)
	}

	const paginationChange = (pageNumber, pageSize, isScroll = true) => {
		setPageNum(pageNumber)
		setPageSize(pageSize)
		isScroll && scrollToTop()
	}

	const handleCreateQuote = () => {
		setIsCreateQuote(false)
		// openAllRemove
	}
	const onCallbackDel = () => {
		openAllRemove()
	}

	const lt = list?.slice((pageNum - 1) * pageSize, pageSize * pageNum)
	// let i18Options = {
	// 	partNumber: 1,
	// 	manufacturer: "<a	className='pub-color-link' href='/'>111</a>",
	// 	description: 3,
	// 	allCatalogName: 4,
	// 	hotProducts: 5,
	// }
	// const i18Des111 = i18Translate('i18Seo.productsDetail.description', "", i18Options)

	const i18Options = { salesEmail: paramMap?.email }
	const iLoginTip1 = i18Translate(
		'i18QuotePage.loginTip',
		'to effortlessly create and manage your quotes! Simply add parts to your quote list, click "Create Quote," provide your contact details, and submit. Your quote will be promptly sent to our sales team for processing. Alternatively, you can email us directly to request a quote at',
		i18Options)

	return (
		<div className="ps-section--shopping pub-minh-1 pb60 custom-antd-btn-more product-table-container">
			<PageHeaderShadow
				tabActive={tabActive}
				headNavArr={headNavArr}
				handleTabNav={handleTabNav}
			/>
			<div className="mt20 ps-container">
				{/* {{ i18Options }} */}
				{/* <Trans
					i18nKey="i18Seo.productsDetail.description"
					components={{ manufacturer: <strong>John</strong> }}
					values={{}}
				>
					Welcome, {{ manufacturer }}! You have unread messages.
				</Trans> */}
				{(tabActive !== HASH_BOM_UPLOAD && !isAccountLog) ?
					<div className="mt-10">
						<MinLoginTip routerPath={Router.asPath} tipText={iLoginTip1} email={paramMap?.email} />
					</div> : ''
					// <p className="mt10 pub-font14 pub-color18 mb-5 w900 quote-description">
					// 	{iQuoteTip}
					// 	<a
					// 		className="pub-color-link"
					// 		href={`mailto:${paramMap?.email || process.env.email}`}>
					// 		{paramMap?.email || process.env.email}
					// 	</a>
					// </p>
				}

				{tabActive === HASH_QUOTE_REQUEST && (
					<>

						<Form
							form={form}
							className="ps-form__billing-info"

							onFinish={handleSearch}
							layout="vertical"
						>
							{/* 成功提示 */}
							{isShowSuc && (
								<>
									<Flex column className="success-quote pub-border20 mt20">
										<Flex>
											<div className="sprite-icon4-cart sprite-icon4-cart-1-14" />
											<div className="success-quote-title ml10">
												<div className="thank-you-text pub-fontw">{iReceivedRfq}</div>
												<div className="pub-color555 pub-font13">{iReceivedRfq1}</div>
												<div className="pub-color555 pub-font13">
													{iReceivedRfq2}{iThankYou}
												</div>
											</div>
										</Flex>
									</Flex>

									<Flex column className="success-quote pub-border20 mt20">
										<Flex justifyStart>
											<div className="sprite-doubt-icon sprite-doubt-icon-2-5" />
											<div className="success-quote-title ml10">
												<div className="success-quote-title pub-color18">{iProject}</div>
												<div className="pub-color555 pub-font13">
													{iProcessRFQ}
												</div>

												<div className="pub-search mt20 quote-part-search-top w300">
													<CustomInput
														id='partNumber'
														onChange={(e) => searchChange(e)}
														className="form-control pub-search-input w300"
														placeholder={iPartNumber}
														value={uppercaseLetters(searchName)}
													/>
													<div className={'pub-search-icon sprite-icons-1-3'} onClick={() => handleSearch('true')} />
												</div>
											</div>
										</Flex>
									</Flex>
								</>
							)}

							{!isShowSuc && (
								<div>
									<div className="pub-search mt20 quote-part-search-top w300">
										<Form.Item name="searchPartNumber" style={{ width: 'max-content' }}>
											<CustomInput
												onChange={(e) => searchChange(e)}
												onPressEnter={() => handleSearch('true')}
												className="form-control pub-search-input w300"
												placeholder={iAddPartNumber}
											/>
										</Form.Item>
										<div className='pub-search-icon sprite-icons-1-3' onClick={() => handleSearch('true')} />
									</div>
									<div className="ps-section__content mt20">
										<div className="table-responsive pub-border15" style={{ padding: '0', border: 'none', background: 'transparent' }}>


											<div className='pub-flex-wrap' style={{ flexWrap: 'wrap-reverse' }}>

												<div className='mb20 mr40' style={{ maxWidth: '930px' }}>
													<h3 className="mb15 pub-fontw pub-1 pub-color18">{iPartList}</h3>
													<Table
														size="small"
														ref={tableRef}
														columns={columns}
														dataSource={lt}
														sticky
														scroll={{ x: 900 }}
														className="pub-border-table pub-table-vertical-align-top"
														// 使用 key 属性：在 Table 组件上设置一个唯一的 key 属性来确保组件能够正确地重新渲染。例如：
														key={lt.length} // dataSource列表数据变化，导致  输入框失去焦点
														pagination={false}
														style={{ maxWidth: '950px' }}
													/>
													{showError && (
														<AlarmPrompt text={errText} />
													)}
													<Flex justifyBetween className='mt20'>
														<FloatButtons isShow>
															<Flex gap={10} alignCenter>
																<Button
																	type="submit"
																	ghost="true"
																	className="login-page-login-btn ps-add-cart-footer-btn"
																	onClick={(e) =>
																		handeAddEmptyRow(e)
																	}>
																	<Flex alignCenter>
																		<div className="sprite-account-icons sprite-account-icons-1-8 mr10" />
																		{iAddMoreParts}
																	</Flex>
																</Button>
																{/* 批量添加 */}
																<BulkAdd onAddToList={handleAddToRow} />
																{/* 批量上传 */}
																<BulkUpload onAddToList={handleAddToRow} />

																<div style={{ border: '1px solid #e3e7ee', width: '1px', height: '26px', margin: '0 10px' }} />

																<Flex>
																	<Button
																		ghost="true"
																		className="login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w150"
																		onClick={handleSubmit}
																	// onClick={() => { setIsCreateQuote(true) }}
																	>
																		{iCreateQuote}
																	</Button>
																</Flex>
															</Flex>
														</FloatButtons>
														{
															list?.length > 30 && (
																<SamplePagination
																	pageNum={Number(pageNum)}
																	total={Number(quoteTableList?.length)}
																	pageSize={Number(pageSize)}
																	isSEO={false}
																	onChange={({ pageNum, pageSize }) => paginationChange(pageNum, pageSize)}
																/>
															)
														}
													</Flex>
												</div>

												<div className='mb20' style={{ paddingTop: '37px' }}>
													<QuoteStepTip />
												</div>
											</div>




										</div>

										{/* <div className="pub-border15 mt20 pub-custom-input-suffix" style={{ padding: '0', border: 'none', background: 'transparent' }}>
											<h3 className="mb15 pub-fontw pub-font16 pub-color18">{iContactInformation}</h3>
											<Flex row gap={10} width='100%' className='custom-suffix'>
												<div>
													<Form.Item
														name="email"
														className="mb0"
														rules={[
															{
																required: true,
																message: <AlarmPrompt text={iEmailTip} />,
															},
															{
																pattern: EMAIL_REGEX,
																message: <AlarmPrompt text={CORRECT_EMAIL_TIP} />,
															},
														]}
														validateTrigger="onBlur" // 设置触发验证的时机为失去焦点时
													>
														<CustomInput
															className="form-control w300"
															style={{ background: "white" }}
															type="text"
															onBlur={(e) => (
																checkEmail(e),
																form.validateFields(['email'])
															)}
															onChange={() =>
																helpersFormNoError(form, 'email')
															}
															suffix={
																<div>
																	<div className="pub-custom-holder pub-input-required">{iEmail}</div>
																</div>
															}
														/>
													</Form.Item>
												</div>

												<Flex className="ps-quote-form" style={{ width: '100%' }}>
													<Form.Item style={{ marginBottom: '0px', width: '100%' }}>
														<Form.Item
															name="remark"
															className="mb0"
															noStyle
														>
															<TextArea
																autoSize={true}
																className="form-control"
																style={{ width: '100%', background: 'white' }}
																maxLength={512}
																onChange={(e) => remarkChange(e)}
															/>
														</Form.Item>
														<div
															className="pub-custom-textarea-holder"
															style={{ left: '16px' }}>
															{iRemark}
														</div>
													</Form.Item>
												</Flex>
												<div>
													<Button
														ghost="true"
														className="login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w150"
														onClick={handleSubmit}>
														{iSubmitQuote}
													</Button>
												</div>
											</Flex>
										</div> */}
									</div>
								</div>
							)}
						</Form>

					</>
				)
				}

				{/* 询价历史数据 */}
				{tabActive === HASH_QUOTE_REQUEST_HISTORY && <QuoteReqHistory isLogin={isAccountLog} quoteReqList={quoteReqList} />}

				{/* BOM上传 */}
				{tabActive === HASH_BOM_UPLOAD && <QuoteBom />}
			</div >

			{isShowModal && (
				<ModuleProductsSearch
					modalData={{
						productTotal,
						isShowModal,
						productList,
						PartNumber: searchName,
					}}
					cancelModule={() => setIsShowModal(false)}
					chooseModule={(e) => chooseModule(e)}
				/>
			)}

			{/* 创建询价单 */}
			{isCreateQuote && (
				<CreateQuote
					isShow={isCreateQuote}
					onCallback={handleCreateQuote}
					onCallbackDel={onCallbackDel}
					email={email}
					profileData={cookies?.profileData}
					filterItems={fItems}
					auth={auth}
					onSearch={(v) => {
						setList([{}])
						setQuoteList([{}])
						form.resetFields()
						setSearchName(v)
						handleSearch('true', v)
					}}
				/>
			)}
		</div >
	);
};
export default connect((state) => state)(Quote);
