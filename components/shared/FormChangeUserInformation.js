import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Form, Select, Modal, Row, Col, Radio, Button } from 'antd'; //  Input,
import { CustomInput } from '~/components/common';
import { withCookies } from 'react-cookie';
import { profileData } from '~/store/auth/action';
import Link from 'next/link';

import AccountRepository from '~/repositories/zqx/AccountRepository';
import OrderRepository from '~/repositories/zqx/OrderRepository';

import { getEnvUrl, ACCOUNT_CHANGE_PASSWORD, PRIVACY_CENTER } from '~/utilities/sites-url'
import useLanguage from '~/hooks/useLanguage';
import useApi from '~/hooks/useApi';
import useI18 from '~/hooks/useI18';

// import { useCookies } from 'react-cookie'

// 新国家
const FormChangeUserInformation = (props) => {
    const { auth, cookies, profileRes } = props

    const { i18Translate, i18MapTranslate, getDomainsData, curLanguageCodeZh } = useLanguage();
    const { iPrivacyCenter, iRequired, iFirstName, iLastName, i18FormRules, i18FormRulesTip } = useI18();

    const { dictAddressCustomerType, apiDictAddressCustomerType, dictOrderTypeList, apiDictOrderTypeList, } = useApi();

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [info, setInfo] = useState({})
    const [isShowModal, setIsShowModal] = useState(false)
    const [selectOrderType, setSelectOrderType] = useState("") // 订单类型
    const [shippingList, setShippingList] = useState([]); // 国家列表


    const [countryVal, setCountryVal] = useState('');
    const [customerTypeVal, setCustomerTypeVal] = useState('');

    const { token } = auth;

    const getProfile = async () => {
        const res = await AccountRepository.getProfile(token);
        if (res && res?.code === 0) {
            const { data={} } = res || profileRes || {}
            setInfo(data)
            setSelectOrderType(data?.orderType)
            dispatch(profileData(data));
            cookies.set('profileData', {
                ...data
            }, { path: '/' });
        }
    }

    const handleSubmit = async (fieldsValue) => {
        let isError = false
        if (!countryVal) {
            isError = true
            form.setFields([
                {
                    name: 'country',
                    errors: [iRequired]
                },
            ]);
        }
				// console.log(customerTypeVal, 'customerTypeVal---111--del')
        if (!customerTypeVal && customerTypeVal != '0') {
            isError = true
            form.setFields([
                {
                    name: 'customerType',
                    errors: [iRequired]
                },
            ]);
        }
				console.log(isError, customerTypeVal, 'customerTypeVal---222--del')
				// return
        if (isError) return
        const res = await AccountRepository.updateProfile({
            ...fieldsValue,
            country: countryVal,
            customerType: customerTypeVal,
        }, token);
        if (res) {
            getProfile()
            setIsShowModal(false)
        }
    }
    const getContent = (name, val) => (
        <div className='contact-information'>
            <div className='contact-label'>{name || ''}</div>
            <div className='contact-val'>{val}</div>
        </div>
    )

    // const getOrderTypeList = async () => {
    //     const res = await OrderRepository.getDictList('address_order_type')
    //     if (res && res.data && res.data.length) {
    //         res.data.reverse().map((item) => {
    //             item.value = Number(item.dictValue);
    //             item.label = item.dictLabel;
    //         })
    //         setOrderTypeList(res.data);
    //     }
    // }
    const orderTypeOnChange = (e) => {
        const val = e.target.value;
        setSelectOrderType(val);
    }
    const getDeliveryRefList = async () => {
        const res = await OrderRepository.getApiCountryList('', getDomainsData()?.defaultLocale);
        if (res?.code == 0) {
            const { data } = res?.data || {}
            data?.map(item => {
                const { id, name } = item
                item.value = id
                item.label = name;
                item.addressCode = id;
            })
            // res.data.sort((a, b) => a.addressName - b.addressName)
            setShippingList(data);
        }
        // const res = await OrderRepository.getShippingList();
        // if (res.code == 0) {
        //     res.data.map(item => {
        //         const { addressId, addressCode, addressName } = item
        //         item.value = addressId
        //         item.label = addressName;
        //         item.addressCode = addressCode;
        //     })
        //     setShippingList(res.data);
        // }
    }

    const getOrderTypeLabel = orderType => {
        const res = dictOrderTypeList?.find(item => item.value === orderType)
        return res?.label
    }
    const getCustomerTypeLabel = customerType => {
        const res = dictAddressCustomerType.find(item => item.value === customerType)
        return res?.label
    }
    const handleEdit = () => {
        setIsShowModal(true)
        setCustomerTypeVal(info?.customerType)
        setCountryVal(Number(info?.countryId))
    }

    const countryChange = e => {

        form.setFields([
            {
                name: 'country',
                errors: []
            },
        ]);
        setInfo({
            ...info,
            countryId: e,
        })
        setCountryVal(e)
    }
    const customerTypeChange = e => {
        form.setFields([
            {
                name: 'customerType',
                errors: []
            },
        ]);
        setInfo({
            ...info,
            customerType: e,
        })
        setCustomerTypeVal(e)
    }

    useEffect(() => {
        if (isShowModal) {

            form.setFieldsValue({
                ...info,
                country: info?.countryId,
            });
        }
    }, [isShowModal]);
    useEffect(() => {
        getProfile()
    }, [token]);
    useEffect(() => {
        apiDictAddressCustomerType()
        apiDictOrderTypeList()
        getDeliveryRefList()
    }, []);

    const { firstName, lastName, email, phone, countryId, companyName, orderType, customerType } = info
    const findCountryItem = shippingList?.find(item => item?.id == countryId)

    // /user/profile
    // {"firstName":"sd111","lastName":"sd2222","phone":"18878477500","country":6,"orderType":0,"customerType":2}
    const iName = i18Translate('i18Form.First Name', 'Name')
    const iEmail = i18Translate('i18Form.Email', 'Email')
    const iCountry = i18Translate('i18OrderAddress.Country', 'Country')
    const iOrderType = i18Translate('i18OrderAddress.Order Type', 'Order Type')
    const iTelephone = i18Translate('i18OrderAddress.Telephone', 'Telephone')
    const iEdit = i18Translate('i18OrderAddress.Edit', 'Edit')

    const iContactInformation = i18Translate('i18SmallText.Contact Information', 'Contact Information')
    const iEditContactInformation = i18Translate('i18MyAccount.EditContactInformation', 'EDIT CONTACT INFORMATION')
    const iCompanyName = i18Translate('i18OrderAddress.Company Name', 'Company Name')
    const iCustomerType = i18Translate('i18OrderAddress.Customer Type', 'Customer Type')
    const iPassword = i18Translate('i18Login.Password', 'Password')
    const iChangePassword = i18Translate('i18MyAccount.Change Password', 'Change Password')
    const iPersonalInfoTit = i18Translate('i18MyAccount.PersonalInfoTit', 'About Your Personal Information')
    const iPersonalInfoDes = i18Translate('i18MyAccount.PersonalInfoDes', 'At Origin Data, looking after the personal data you share with, looking after the personal data you share with us is extremely important. We want you to be confident that your data is safe and secure with us, and understand how we use it to offer you a better, more personalised shopping experience.')
    const iVisitThe = i18Translate('i18MyAccount.Visit the', 'Visit the')
    const iTo = i18Translate('i18SmallText.to', 'to')
    const iLearnMore = i18Translate('i18MenuText.Learn more', 'Learn more')
    
    return (
        <div>
            <div className='pub-border15 mb20 box-shadow'>
                <div className='pub-left-title mb15'>{iContactInformation}</div>

                <div className='pub-flex'>
                    {/* 左侧 */}
                    <div className='pub-font13 pub-color18'>
                        <div className='contact-information'>
                            <div className='contact-label'>{iName}:</div>
                            <div className='contact-val'>{firstName} {!curLanguageCodeZh() && lastName}</div>
                        </div>
                        {getContent(`${iEmail}:`, email)}
                        {getContent(`${iTelephone}:`, phone)}
                        {getContent(`${iCountry}:`, findCountryItem?.name)}
                        {getContent(`${iOrderType}:`, getOrderTypeLabel(orderType))}
                        {
                            selectOrderType == 1 && getContent(`${iCompanyName}:`, companyName)
                        }
                        {getContent(`${iCustomerType}:`, getCustomerTypeLabel(customerType))}
                        <div className='pub-color-link' onClick={() => handleEdit()}>{iEdit}</div>
                    </div>

                    {/* 右侧 */}
                    {
                        auth?.accountType === 1 && <div className='ml100'>
                            <div className='pub-font16'>{iPassword}</div>
                            <div className='mb10 mt5 pub-color555 pub-font18'>********</div>
                            <Link href={getEnvUrl(ACCOUNT_CHANGE_PASSWORD)}>
                                <a className='pub-color-link'>{iChangePassword}</a>
                            </Link>
                        </div>
                    }

                </div>
            </div>

            <div className='pub-border15 box-shadow'>
                <div className='pub-left-title mb15'>{iPersonalInfoTit}</div>
                <div className='pub-color555'>{iPersonalInfoDes}</div>
                <div className='mt15 pub-color555'>
                    {iVisitThe} 
                    <a href={PRIVACY_CENTER} target="_blank" style={{ display: 'inline-block' }}
                        className="color-link">
                        &nbsp;{iPrivacyCenter}&nbsp;
                    </a>
                    {iTo} {iLearnMore}
                </div>
            </div>

            <Modal
                centered
                okText={'Remove'}
                title={iEditContactInformation}
                open={isShowModal}
                footer={null}
                closeIcon={<i className="icon icon-cross2"></i>}
                onCancel={() => setIsShowModal(false)}
                width={600}
            >
                {/* horizontal | vertical | inline */}
                <Form
                    form={form}
                    layout="vertical"
                    className="pub-custom-input-box"
                    // initialValues={{
                    //     customerType: info?.customerType,
                    //   }}
                    onFinish={handleSubmit}
                >
                    <Row gutter={20}>
                        <Col>
                            {/* <div className="form-group form-forgot pub-custom-input-box"> */}
                            <Form.Item
                                name="firstName"
                                rules={i18FormRules}>
                                <div>
                                    <CustomInput
                                        className="form-control w260"
                                        type="text"
                                        defaultValue={info?.firstName}
                                    />
                                    <div className='pub-custom-input-holder pub-input-required'>{iFirstName}</div>
                                </div>
                            </Form.Item>
                            {/* </div> */}
                        </Col>
                        { !curLanguageCodeZh() && <Col>
                            {/* <div className="form-group form-forgot pub-custom-input-box"> */}
                            <Form.Item
                                name="lastName"
                                rules={i18FormRules}
                                initialValue={info.lastName}
                            >
                                <div>
                                    <CustomInput
                                        className="form-control w260"
                                        type="text"
                                        defaultValue={info?.lastName}
                                    // placeholder="Last name"
                                    />
                                    <div className='pub-custom-input-holder pub-input-required'>{iLastName}</div>
                                </div>
                            </Form.Item>
                            {/* </div> */}
                        </Col>
                        }
                

                        <Col>
                            <Form.Item
                                name="phone"
                                rules={i18FormRules}>
                                <div>
                                    <CustomInput
                                        className="form-control w260"
                                        type="text"
                                        defaultValue={info?.phone}
                                    />
                                    <div className='pub-custom-input-holder pub-input-required'>{iTelephone}</div>
                                </div>
                            </Form.Item>
                        </Col>
                        {/* onChange={(e) => countryChange(e)} */}
                                         {/* value={info?.countryId} */}
                                         {/* defaultValue={info?.countryId} */}
                        <Col>
                            <Form.Item
                                name="country"
                                rules={i18FormRulesTip(countryVal ? false : true)}
																
                            >
                                <div className='pub-custom-select'>
                                    <Select
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        className={'w260 ' + (countryVal ? 'select-have-val' : '')}
                                        onChange={(e) => countryChange(e)}
                                        value={Number(info?.countryId) || '' } // 使用 value 属性设置选中的值
                                        options={shippingList}
																				getPopupContainer={(trigger) => trigger.parentNode}
                                    >
                                    </Select>
                                    <div className='pub-custom-input-holder pub-input-required'>{iCountry}</div>
                                </div>
                            </Form.Item>
                        </Col>
            
                        <Col>
                            <Form.Item
                                name="orderType"
                                label={iOrderType}
                                
									
                                rules={i18FormRules}
															>
                                <Radio.Group onChange={orderTypeOnChange} value={selectOrderType} className='pub-flex-align-center'>
                                    {dictOrderTypeList?.map((item) =>
                                        <Radio key={item.dictCode} value={item.value}>
                                            {i18MapTranslate(`i18MyAccount.${item.label}`, item.label)}</Radio>
                                    )}
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={20}>
                        {
                            selectOrderType == 1 &&
                            <Col>
                                <Form.Item
                                    name="companyName"
                                    rules={i18FormRules}>
                                    <div>
                                        <CustomInput
                                            className="w260"
                                            type="text"
                                            defaultValue={info?.companyName}
                                        />
                                        <div className='pub-custom-input-holder pub-input-required'>{iCompanyName}</div>
                                    </div>
                                </Form.Item>
                            </Col>
                        }
                        <Col>
                            <Form.Item
                                name="customerType"
                                className='pub-flex-align-center'
                                // rules={i18FormRules}
																rules={i18FormRulesTip(((customerTypeVal || customerTypeVal == 0) ? false : true))}
                            >
                                <div className='pub-custom-select'>
                                    <Select
                                        onChange={(e) => customerTypeChange(e)}
                                        value={info?.customerType}
                                        options={dictAddressCustomerType}
                                        className={'w260 ' + ((customerTypeVal || customerTypeVal == 0) ? 'select-have-val' : '')}
																				getPopupContainer={(trigger) => trigger.parentNode}
                                    >
                                    </Select>
                                    <div className='pub-custom-input-holder pub-input-required'>{iCustomerType}</div>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>


                    <div className="ps-add-cart-footer custom-antd-btn-more mt15">
                        <Button
                            type="primary" ghost="true"
                            className='ps-add-cart-footer-btn'
                            onClick={() => setIsShowModal(false)}
                        >{i18Translate('i18FunBtnText.Cancel', "Cancel")}</Button>
                        <button
                            type="submit" ghost="true"
                            className='custom-antd-primary ps-add-cart-footer-btn'
                        >{i18Translate('i18FunBtnText.Save', "Save")}</button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default connect((state) => state)(withCookies(FormChangeUserInformation));
