import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Select } from 'antd'; //  Input,
import { CustomInput } from '~/components/common';
import ZqxCartRepository from '~/repositories/zqx/CartRepository';
import useCart from '~/hooks/useCart';
import useLanguage from '~/hooks/useLanguage';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import MinSucTip from '~/components/ecomerce/minCom/MinSucTip';
import { ACCOUNT_PROJECT_DETAIL } from '~/utilities/sites-url';

const AddProjectModalCom = ({
    isShowModal, productList,
    handCancel,
}) => {
    const { i18Translate } = useLanguage();
    const iProjectName = i18Translate('i18MyAccount.Project Name', 'Project Name')
    const iProject = i18Translate('i18MyCart.Project', 'Project')
    const iRequired = i18Translate('i18Form.Required', 'Required')
    const iAddProjectTip = i18Translate('i18MyCart.AddProjectTip', "Add to a new or saved project")

    const [form] = Form.useForm();
    const { myProjectList, getMyProjectList } = useCart();
    const [ curProjectId, setCurProjectId ] = useState('');
    const [ projectName, setProjectName ] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false)
    const [sucId, setSucId] = useState(1)
    const [cookies] = useCookies(['cart']);
    const { account } = cookies;

    const handleAddProject = async (fieldsValue) => {

        const infoList = productList?.map(item => {
            return {
                productId: item?.productId,
                quantity: item?.quantity,
            }
        })
        // 选择老项目
        if(fieldsValue?.id) {
            const curItem = myProjectList?.find(item => item?.id === fieldsValue?.id)
            const param = {
                id: fieldsValue?.id,
                infoList,
                quantity: curItem?.quantity
            }
            setProjectName(curItem?.projectName)
            const res = await ZqxCartRepository.updateProject(account?.token, param);
            if(res?.code === 0) {
                setSucId(res?.data)
                setIsSuccessful(true)
            }
            return
        }

        const params = {
            projectName: fieldsValue?.projectName,
            infoList,
        }
        setProjectName(fieldsValue?.projectName)

        const res = await ZqxCartRepository.addProject(account?.token, params);
        if(res?.code === 0) {
            setSucId(res?.data)
            setIsSuccessful(true)
        }
    }


    useEffect(async () => {
        getMyProjectList()
    }, [])

    return (
        <Modal
            centered
            title={i18Translate('i18MyCart.Add To Project', 'ADD TO PROJECT')}
            footer={null}
            width={390}
            onCancel={() => handCancel()}
            open={isShowModal}
            closeIcon={<i className="icon icon-cross2"></i>}
        >
            {
                !isSuccessful && (
                    <>
                        <div className='pub-lh20'>{iAddProjectTip}</div>
                        <Form
                            form={form}
                            className="ps-form-modal__account pub-custom-input-suffix custom-antd-btn-more mt18 mb-5"
                            onFinish={handleAddProject}
                            layout="vertical"
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
                                                    message: iRequired,
                                                },
                                            ]}
                                            noStyle // 为 true 时不带样式，作为纯字段控件使用
                                        >
                                            <Select
                                                allowClear
                                                showSearch={false}
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                className='w300'
                                                autoComplete="new-password"
                                                onChange={(e) => setCurProjectId(e)}
                                                options={myProjectList}
																								getPopupContainer={(trigger) => trigger.parentNode}
                                            >
                                            </Select>
                                        </Form.Item>
                                        <div className='pub-custom-holder pub-input-required'>{iProject}</div>
                                    </Form.Item>
                                </Col>

                                {
                                    curProjectId === 0 && (
                                        <Col>
                                            <div className="form-group pub-custom-input-box w180">
                                                <Form.Item
                                                    name="projectName"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: iRequired,
                                                        },
                                                    ]}>
                                                        <div>
                                                            <CustomInput
                                                                className="form-control form-input pub-border w300"
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
                                    <div className="ps-add-cart-footer form-group form-forgot pub-custom-input-nolable mt15">
                                        <Form.Item>
                                            <Button
                                                type="primary" ghost
                                                className='ps-add-cart-footer-btn ml0 w150'
                                                onClick={() => handCancel()}
                                            >{i18Translate('i18FunBtnText.Cancel', "Cancel")}</Button>
                                            <button
                                                type="submit" ghost='true'
                                                className='login-page-login-btn custom-antd-primary ml10 w150'
                                            >{i18Translate('i18MyCart.Add To Project', "Add to Project")}</button>
                                        </Form.Item>
                                    </div>
                                </Col>

                            </Row>
                        </Form>
                    </>
                )
            }

            {
                isSuccessful && (
                    <div className='mt-10'>
                        <div>
                            {/* <div>Addition successful</div>
                            <div>NX3225GD-8.00MHZ-STD-CRA-3</div> */}
                            <MinSucTip
                                susText="Addition successful"
                                subText={`${productList?.[0]?.name} has been added 
                                to ${projectName}`}
                                // subText1="Please check your email for the latest status of the RFQ. Thank you."
                            />
                        </div>
                        <div className="ps-add-cart-footer custom-antd-btn-more" style={{float:'none'}}>
                            <Link href={ACCOUNT_PROJECT_DETAIL + `/${sucId}`}>
                                <a>
                                    <Button
                                        type="primary" ghost
                                        className='ps-add-cart-footer-btn ml0 w150'
                                    >View Project</Button>
                                </a>
                            </Link>
                            <button
                                type="submit" ghost='true'
                                className='login-page-login-btn custom-antd-primary ml10 w150'
                                onClick={() => handCancel()}
                            >{i18Translate('i18MyCart.Continue Shopping', "Continue Shopping")}</button>
                        </div>
                    </div>
            )}
        </Modal>
    )    
}

export default AddProjectModalCom