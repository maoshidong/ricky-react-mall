import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Select, Button } from 'antd'; //  Input,
import { CustomInput } from '~/components/common';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import { onlyNumber } from '~/utilities/common-helpers';
import MinTopTitle from '~/components/ecomerce/minCom/MinTopTitle';

import ZqxCartRepository from '~/repositories/zqx/CartRepository';

import useCart from '~/hooks/useCart';
import useLanguage from '~/hooks/useLanguage';
import { ACCOUNT_ORDERS_PROJECT, ACCOUNT_PROJECT_DETAIL, ACCOUNT_SHOPPING_CART, ACCOUNT_CART_PROJECT_HASH } from '~/utilities/sites-url'

// ​/web​/userProject​/addProject
// 新建项目
const AddtoProjectCom = ({ ecomerce }) => {
    const { i18Translate } = useLanguage();
    const iProjectName = i18Translate('i18MyAccount.Project Name', 'Project Name')

    const [form] = Form.useForm();
    const Router = useRouter();
    const [cookies] = useCookies(['cart']);
    const { account } = cookies;
    const { allCartItems } = ecomerce

    const { projectList, myProjectList, getMyProjectList } = useCart();

    const [ curProjectId, setCurProjectId ] = useState('');

    const handleRes = (res, infoList, quantity) => {
        if(res?.code === 0) {
            if(infoList?.length === 0 && quantity === 0) {
                Router.push(ACCOUNT_ORDERS_PROJECT)
            } else {
                Router.push(ACCOUNT_PROJECT_DETAIL + `/${res?.data}`)
            }
        }
    }
    const handleSubmit = async (fieldsValue) => {

        const quantity = myProjectList?.find(item => item?.id === fieldsValue?.id)?.quantity
        const infoList = allCartItems?.map(item => {
            return {
                productId: item?.productId,
                quantity: item?.cartQuantity,
            }
        })
        // return
        if(fieldsValue?.id) {
            const param = {
                id: fieldsValue?.id,
                infoList,
                quantity,
            }
            const res = await ZqxCartRepository.updateProject(account?.token, param);
            handleRes(res, infoList, quantity)
            return
        }

        const params = {
            projectName: fieldsValue?.projectName,
            infoList,
        }
        const res = await ZqxCartRepository.addProject(account?.token, params);
        if(res?.code === 0) {
            if(infoList?.length === 0) {
                Router.push(ACCOUNT_ORDERS_PROJECT)
            } else {
                Router.push(ACCOUNT_PROJECT_DETAIL + `/${res?.data}`)
            }
        }
        // handleRes(res, infoList, quantity)
    }

    useEffect(async () => {
        getMyProjectList()
    }, [])

    const iAddProjectTip = i18Translate('i18MyCart.AddProjectTip', "Add to a new or saved project lists.")

    return (
        <div style={{flex: 1, minWidth: '300px', marginTop: '-15px'}}>
            <MinTopTitle className='sprite-icon4-cart sprite-icon4-cart-3-3'>
                {i18Translate('i18MyCart.Add To Project', "Add to Project Lists")}
            </MinTopTitle>
            {/* <MinTopTitle className='sprite-icon4-cart sprite-icon4-cart-3-3' text='Add to Project' /> */}

            <div className="custom-antd pub-border15 pr-5 mt3 box-shadow">
                <div>{iAddProjectTip}</div>
                <Form
                    form={form}
                    className="ps-form-modal__account pub-custom-input-suffix mt15 mb-5"
                    onFinish={handleSubmit}
                    layout="vertical"
                    autoComplete="off" // 设置为 "off" 禁用浏览器输入记录
                >
                    <Row gutter={20}>
                        <Col>
                            {/* 嵌套结构与校验信息 */}
                            <Form.Item className={'pub-custom-select ' + ((curProjectId === 0 || curProjectId) ? 'select-have-val' : '')}>
                                <Form.Item
                                    name="id"
                                    rules={[
                                        {
                                            required: true,
                                            message: i18Translate('i18Form.Required', 'Required'),
                                        },
                                    ]}
                                    noStyle // 为 true 时不带样式，作为纯字段控件使用
                                >
                                    <Select
                                        allowClear
                                        showSearch={false}
                                        dropdownMatchSelectWidth={300}
																				dropdownStyle={{
																					borderTopRightRadius:'6px'
																				}}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        className='w180'
                                        autoComplete="new-password"
                                        onChange={(e) => setCurProjectId(e)}
                                        options={myProjectList}
																				getPopupContainer={(trigger) => trigger.parentNode}
                                    >
                                    </Select>
                                </Form.Item>
                                <div className='pub-custom-holder pub-input-required'>
                                    {i18Translate('i18MyCart.Project', 'Project')}</div>
                            </Form.Item>
                        </Col>
                        {
                            curProjectId === 0 && (
                                <Col>
                                    <div className="form-group pub-custom-input-box">
                                        <Form.Item
                                            name="projectName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: i18Translate('i18Form.Required', 'Required'),
                                                },
                                            ]}>
                                                <div>
                                                    <CustomInput
                                                        className="form-control form-input pub-border w160"
                                                        type="text"
                                                    />
                                                    <div className='pub-custom-input-holder pub-input-required'>{iProjectName}</div>
                                                </div>
                                        </Form.Item>
                                    </div>
                                </Col>
                            )
                        }


                        <Col>
                            <div className="form-group form-forgot pub-custom-input-nolable">
                                <Form.Item>
                                    <Button
                                        type="submit" ghost='true' htmlType='submit'
                                        className='login-page-login-btnw70'
                                        // disabled={allCartItems?.length === 0}
                                    >{i18Translate('i18FunBtnText.Save', "Save")}</Button>
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                </Form>

                <Link href={ACCOUNT_SHOPPING_CART + '#' + ACCOUNT_CART_PROJECT_HASH}>
                    <a className='view-more mb-5'>
                        <span className='sub-title pub-color-link'>{i18Translate('i18MenuText.View more', 'View All')}</span>
                    </a>
                </Link>
            </div>
        </div>
    )
}

export default connect(state => state)(AddtoProjectCom)