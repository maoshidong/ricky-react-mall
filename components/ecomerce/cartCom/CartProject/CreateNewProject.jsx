
import React, { useState, useEffect } from 'react';
// import { connect } from 'react-redux';
import { Form, Row, Col, Select } from 'antd'; //  Input,
import { CustomInput } from '~/components/common';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import useCart from '~/hooks/useCart';
import useLanguage from '~/hooks/useLanguage';
import ZqxCartRepository from '~/repositories/zqx/CartRepository';
import { PRODUCTS, MANUFACTURER, ACCOUNT_PROJECT_DETAIL } from '~/utilities/sites-url';

const CreateNewProjectCom = () => {
	const { i18Translate, getDomainsData } = useLanguage();
	const iProjectName = i18Translate('i18MyAccount.Project Name', 'Project Name');
	const iProjectTit = i18Translate('i18MyAccount.ProjectTit', 'Create New Project');
	const iProjectDes = i18Translate(
		'i18MyAccount.ProjectDes',
		'Get started by entering a new Project Name, then select a method to add items to your project, and then press the Start New Project Button.'
	);
	const iStartNewProject = i18Translate('i18MyAccount.Start New Project', 'Start New Project');
	const iProject = i18Translate('i18MyCart.Project', 'Project');
	const iRequired = i18Translate('i18Form.Required', 'Required');
	const iProducts = i18Translate('i18Head.products', 'Products');
	const iManufacturer = i18Translate('i18PubliceTable.Manufacturer', 'Manufacturers');

	const Router = useRouter();
	const [form] = Form.useForm();
	const [cookies, setCookie] = useCookies(['cart']);
	const { account } = cookies;
	const [curProject, setCurProject] = useState('');
	const { projectList, myProjectList, getMyProjectList } = useCart();

	const handleSubmit = async (fieldsValue) => {
		// 选择Products
		if (curProject === 'Products') {
			const params = {
				projectName: fieldsValue?.projectName,
			};
			const res = await ZqxCartRepository.addProject(account?.token, params);
			if (res?.code === 0) {
				Router.push(PRODUCTS);
			}
			return;
		}
		// 选择供应商
		if (curProject === 'Manufacturers') {
			const params = {
				projectName: fieldsValue?.projectName,
			};
			const res = await ZqxCartRepository.addProject(account?.token, params);
			if (res?.code === 0) {
				Router.push(MANUFACTURER);
			}
			return;
		}
		const infoList = curProject?.map((item) => {
			return {
				productId: item?.productId,
				quantity: item?.quantity,
			};
		});
		const params = {
			projectName: fieldsValue?.projectName,
			infoList,
		};
		const res = await ZqxCartRepository.addProject(account?.token, params);
		if (res?.code === 0) {
			Router.push(ACCOUNT_PROJECT_DETAIL + `/${res?.data}`);
		}
	};

	const projectListChange = async (projectId) => {
		setCurProject(projectId);
		if (projectId === 'Products' || projectId === 'Manufacturers') {
			return;
		}
		const res = await ZqxCartRepository.projectProductList(account?.token, { projectId, languageType: getDomainsData()?.defaultLocale, });
		if (res?.code === 0) {
			setCurProject(res?.data);
		}
	};

	useEffect(async () => {
		getMyProjectList();
	}, []);

	return (
		<div className="pub-border15">
			<div className="pub-left-title mb10">{iProjectTit}</div>
			<div>{iProjectDes}</div>

			<Form form={form} className="ps-form-modal__account pub-custom-input-suffix mt15 mb-5" onFinish={handleSubmit} layout="vertical">
				<Row gutter={20}>
					<Col>
						<div className="form-group pub-custom-input-box w180">
							<Form.Item
								name="projectName"
								rules={[
									{
										required: true,
										message: iRequired,
									},
								]}
							>
								<div>
									<CustomInput className="form-control form-input pub-border w180" type="text" />
									<div className="pub-custom-input-holder pub-input-required">{iProjectName}</div>
								</div>
							</Form.Item>
						</div>
					</Col>
					<Col>
						{/* 嵌套结构与校验信息 */}
						<Form.Item className={'pub-custom-select ' + (curProject === 0 || curProject ? 'select-have-val' : '')}>
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
									filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
									className="w180"
									autoComplete="new-password"
									onChange={(e) => projectListChange(e)}
									options={[{ label: iProducts, value: 'Products' }, { label: iManufacturer, value: 'Manufacturers' }, ...projectList]}
									getPopupContainer={(trigger) => trigger.parentNode}
								></Select>
							</Form.Item>
							<div className="pub-custom-holder pub-input-required">{iProject}</div>
						</Form.Item>
					</Col>

					<Col>
						<div className="form-group form-forgot pub-custom-input-nolable">
							<Form.Item>
								<button type="submit" ghost="true" className="login-page-login-btn custom-antd-primary w150">
									{iStartNewProject}
								</button>
							</Form.Item>
						</div>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default CreateNewProjectCom