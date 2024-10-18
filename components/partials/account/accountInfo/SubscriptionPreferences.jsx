import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Checkbox, Col, Row, Button } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import { NewsRepository } from '~/repositories';
import { MinModalTip } from '~/components/ecomerce';
import { useCookies } from 'react-cookie';

const SubscriptionPreferences = ({ subscribeList }) => {
	const { i18Translate, i18MapTranslate, getDomainsData } = useLanguage();
	const { iCancel, iSubscriptionSuccessful, iUnsubscribeOperationTips, iUnsubscribeTip } = useI18();
	const iUnsubscribe = i18Translate('i18MyAccount.Unsubscribe', 'Unsubscribe');

	const [cookies, setCookie] = useCookies(['account']);

	const [tabActive, seTabActive] = useState('settings'); // 头部导航状态
	const [checkList, setCheckList] = useState([]) // 选择的
	const [isSuc, setIsSuc] = useState(false) // 成功提示
	const [cancelSubscribe, setCancelSubscribe] = useState(false) // 取消订阅弹窗
	const [tabArr, setTabArr] = useState([
		{ name: 'Settings', tabLabel: 'settings' },
		{ name: 'Unsubscribe', tabLabel: 'unsubscribe' },
	]) // 取消订阅弹窗

	// let tabArr = [
	// 	{ name: 'Settings', tabLabel: 'settings' },
	// 	{ name: 'Unsubscribe', tabLabel: 'unsubscribe' },
	// ];
	const handleTabNav = (e, item) => {
		e.preventDefault();
		seTabActive(item?.tabLabel);
	};
	const onChange = (checkedValues) => {
		setCheckList(checkedValues || [])
	};
	// 没有订阅时
	const cancelSub = () => {
		setTabArr([
			{ name: 'Settings', tabLabel: 'settings' },
		]);
		seTabActive('settings')
		setCheckList([])
		setIsSuc(false)
	}

	useEffect(() => {
		let arr = []
		subscribeList?.map(item => {
			if (item?.status === 1) {
				arr.push(item?.id)
			}
			setCheckList(arr)
		})
		if (arr?.length === 0) {
			cancelSub()
		}
	}, [subscribeList])
	const saveSetting = async (arr) => {
		const userSubscribeInfoList = arr?.map(item => {
			return {
				email: cookies?.email || cookies?.account?.account,
				subscribeLabelId: item,
			}
		})
		const params = {
			languageType: getDomainsData()?.defaultLocale,
			userSubscribeInfoList,
		}
		const res = await NewsRepository.apiUserSubscribeUpdate(params)
		if (res?.code === 0) {
			setIsSuc(true)
			setCancelSubscribe(false)
		}
		// 没有订阅数据了
		if (arr?.length === 0) {
			cancelSub()
		} else {
			setTabArr([
				{ name: 'Settings', tabLabel: 'settings' },
				{ name: 'Unsubscribe', tabLabel: 'unsubscribe' },
			]);
		}
	};
	// 取消订阅
	const handUnsubscribe = () => {
		setCancelSubscribe(true)
	}


	const iSubscriptionPreferences = i18Translate('i18MyAccount.Subscription Preferences', 'Subscription Preferences');
	const iSubscriptionPreferencesDes = i18Translate(
		'i18MyAccount.SubscriptionPreferencesDes',
		"Your work demands precision. So we've made our e-mail news and reference subscriptions customizable to your unique and changing project needs."
	);
	const iSubscribeTit = i18Translate('i18MyAccount.SubscribeTit', 'What topics would you like to subscribe to?');
	const iSaveSettings = i18Translate('i18MyAccount.Save Settings', 'Save Settings');

	const iUnsubscribeTip1 = i18Translate('i18MyAccount.UnsubscribeTip1', 'Unsubscribe from emails');
	const iUnsubscribeTip2 = i18Translate(
		'i18MyAccount.UnsubscribeTip2',
		'Select this to stop receiving all marketing communications. We will still send you messages related to your orders.'
	);
	return (
		<div className="account-subscription-preferences custom-antd-btn-more">
			<div className="mb20 ps-section--account-setting pub-border15 box-shadow">
				<div className="mb7 pub-left-title">{iSubscriptionPreferences}</div>
				<div className="pub-color555" style={{ marginBottom: '-3px' }}>
					{iSubscriptionPreferencesDes}
				</div>
			</div>

			<div className="pub-border15 box-shadow">
				<div className="cart-tabs">
					{tabArr.map((item) => {
						return (
							<div
								key={nanoid()}
								className={'cart-tabs-item pub-color555 ' + (tabActive == item?.tabLabel ? 'cart-tabs-active' : '')}
								onClick={(e) => handleTabNav(e, item)}
							>
								{i18MapTranslate(`i18MyAccount.${item.name}`, item.name)}
							</div>
						);
					})}
				</div>

				{tabActive === 'settings' && (
					<>
						<div className="mt17 mb9 pub-color555">{iSubscribeTit}</div>
						<Checkbox.Group
							style={{
								width: '100%',
							}}
							value={checkList}
							onChange={onChange}
						>
							<Row>
								{
									subscribeList?.map((item, index) => {
										return (
											<Col span={24} className="mb12" key={index}>
												<Checkbox value={item?.id} checked={item?.status}>{item?.labelName}</Checkbox>
											</Col>
										)
									})
								}
							</Row>
							{/* <Row>
								<Col span={24} className="mb12">
									<Checkbox value="Promotions & Special Pricing">{i18Translate('i18MyAccount.Promotions & Special Pricing', 'Promotions & Special Pricing')}</Checkbox>
								</Col>
								<Col span={24} className="mb12">
									<Checkbox value="Industry News">{i18Translate('i18MyAccount.Industry News', 'Industry News')}</Checkbox>
								</Col>
								<Col span={24} className="mb12">
									<Checkbox value="Coupon">{i18Translate('i18MyAccount.Coupon', 'COUPON')}</Checkbox>
								</Col>
							</Row> */}
						</Checkbox.Group>
						<Button type="submit" ghost="true" className="mt15 login-page-login-btn custom-antd-primary w150" onClick={() => saveSetting(checkList)}>
							{iSaveSettings}
						</Button>
						{isSuc && <span className='ml10 pub-success'>{iSubscriptionSuccessful}</span>}
					</>
				)}

				{tabActive === 'unsubscribe' && (
					<>
						<div className="mt18 pub-color555 pub-fontw">{iUnsubscribeTip1}</div>
						<div className="mb5 pub-color555">{iUnsubscribeTip2}</div>
						<Button type="submit" ghost="true" className="mt50 login-page-login-btn w150" onClick={() => handUnsubscribe()}>
							{iUnsubscribe}
						</Button>
					</>
				)}
			</div>

			{cancelSubscribe && (
				<MinModalTip
					isShowTipModal={cancelSubscribe}
					tipTitle={iUnsubscribeOperationTips}
					tipText={iUnsubscribeTip}
					// cancelText={iCancel}
					width={430}
					handleOk={() => saveSetting([])}
					onCancel={() => setCancelSubscribe(false)}
				/>
			)}


		</div>
	);
};

export default SubscriptionPreferences