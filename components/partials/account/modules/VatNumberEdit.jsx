import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Modal, Form, Input, Button, Row, Col, Checkbox } from 'antd';
import { CustomInput } from '~/components/common';

import AccountRepository from '~/repositories/zqx/AccountRepository';
import { REMARK_MAX_LENGTH } from '~/utilities/constant';

import useLanguage from '~/hooks/useLanguage';

const VatNumberEditCom = ({ token, visible, handleCancel, handleSubmit, otherParams }) => {
    const { i18Translate } = useLanguage();
    const iVATNumber = i18Translate('i18AboutOrder2.VAT Number', 'VAT Number')

    const [cookies, setCookie] = useCookies(['email', 'account']);
    const { account } = cookies;
    // const { useFormItemCompanyName } = useForm();
    // const Router = useRouter();
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const { type, currentRecord, list } = otherParams || {} // shipping billing

    const [isDefault, setIsDefault] = useState((list?.length === 0 || currentRecord?.isDefault ? true : false) ? true : false) // 地址是否默认
    const [isloading, setIsloading] = useState(false)


    const onChangeDefault = e => {
        setIsDefault(e.target.checked)
    };

    const handleOk = async (fieldsValues) => {
        if(isloading) {
            return
        }
        setIsloading(true)
        const params = {
            ...fieldsValues,
            isDefault: (isDefault || list?.length === 0) ? 1 : 0,
        }
        const res = await AccountRepository.addVatNumber(params, token);
        setIsloading(false)
        if(res?.code === 0) {
            handleSubmit()
        }

    }


    useEffect(() => {
        form.setFieldsValue({
            ...currentRecord
        });
        if(!currentRecord?.id) {
            form.resetFields()
        }
    }, [currentRecord])

    const iAddVATNumber = i18Translate('i18AboutOrder2.Add VAT Number', 'ADD VAT NUMBER')
    const iRemark = i18Translate('i18Form.Remark', 'Remark')
    const iSetDefault = i18Translate('i18OrderAddress.Set Default', 'Set Default')
    return (
      <Modal
        centered
        title={iAddVATNumber}
        open={visible}
        onCancel={(e) => handleCancel(e)}
        closeIcon={<i className="icon icon-cross2"></i>}
        footer={null}
        width="390px"
      >
        {/* {
          errMsg && (
            <div className='pub-danger mb10'>{errMsg}</div>
          )
        } */}
                <Form
                    form={form}
                    layout="vertical"
                    className="pub-custom-input-suffix custom-antd-btn-more"
                    // onFinish={handleAddressSubmit}
                    autoComplete="new-password"
                    onFinish={handleOk}
                >
                        {/* 姓名 */}
                        <Row gutter={20}>
                            <Col>
                                <Form.Item
                                    name="vatNumber"
                                    className='mb20'
                                    rules={[{ required: true, message: i18Translate('i18Form.Required', 'Required') }]}
                                >
                                        <CustomInput
                                            className="form-control w330"
                                            type="text"
                                            autoComplete="new-password"
                                            suffix={<div className='pub-custom-holder pub-input-required'>{iVATNumber}</div>}
                                        />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={20}>
                            <Col>
                                {/* TextArea嵌套结构与校验信息 */}
                                <Form.Item className='pub-custom-select'>
                                    <Form.Item
                                        name="remark"
                                        className='mb0'
                                        noStyle
                                    >
                                        <TextArea
                                            autoSize={true}
                                            maxLength={REMARK_MAX_LENGTH}
                                            className='form-control w330'
                                        />
                                    </Form.Item>
                                    <div className='pub-custom-textarea-holder' style={{left: '16px'}}>{iRemark}</div>
                                </Form.Item>
                            </Col>
                        </Row>

                        {
                            (list?.length !== 0) && (
                                <div>
                                    <Checkbox checked={isDefault} onChange={onChangeDefault} style={{ marginRight: '10px' }}>
                                        <span className="pub-color555">{iSetDefault}</span>
                                    </Checkbox>
                                </div>
                            )
                        }

                        <Form.Item>
                    <div className='ps-add-cart-footer'>
                        <Button
                            type="primary" ghost='true'
                            className='login-page-login-btn ps-add-cart-footer-btn w150'
                            onClick={handleCancel}
                        >{i18Translate('i18FunBtnText.Cancel', "Cancel")}</Button>
                        <button
                            type="submit" ghost='true'
                            className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w150'
                            // onClick={handleAddressSubmit}
                        >
                            {i18Translate('i18Form.Submit', 'Submit')}
                        </button>
                    </div>
                    </Form.Item>
                </Form>
      </Modal>
    );
};

export default connect((state) => state.auth)(VatNumberEditCom);