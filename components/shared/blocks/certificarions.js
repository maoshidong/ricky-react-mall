import React, { useState, useEffect } from 'react';
import TitleMore from '~/components/shared/public/titleMore';
import CertificarionsItem from '~/components/partials/page/CertificarionsItem';
import CommonRepository from '~/repositories/zqx/CommonRepository';
import { Row, Col, Popover, Skeleton } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import styles from 'scss/module/_firstLoad.module.scss';

const Certificarions = () => {
	const { i18Translate, getDomainsData } = useLanguage();

	const [authList, setAuthList] = useState([]);
	const [isComplate, setIsComplate] = useState(false); // 加载完成

	const getList = async () => {
		const res = await CommonRepository.apiAuthList({
			languageType: getDomainsData()?.defaultLocale,
		});
		setAuthList(res?.data || []);
		setIsComplate(true);
	};
	useEffect(() => {
		getList();
	}, []);
	if (authList?.length === 0) return null;
	return (
		<div className="ps-product-list blocks-certificarions pb-25">
			<div className="ps-container">
				<TitleMore
					title={i18Translate('i18HomeNextPart.certificationsTitle', 'INTERNATIONALLY RECOGNIZED CERTIFICATIONS')}
					subTitle={i18Translate('i18MenuText.View more', 'View more')}
					linkUrl="/page/certifications"
				/>
				{!isComplate ? (
					<Skeleton style={{ height: 300 }} active={true} paragraph={{ rows: 8, title: true }} />
				) : (
					<Row gutter={15} className={`${styles.certificarionsUl} row`}>
						{authList?.slice(0, 10).map((item, index) => (
							<Popover key={item?.url} placement="right" trigger="hover">
								<Col xs={24} sm={12} md={12} xl={4} lg={8} key={index}>
									<CertificarionsItem item={item} />
								</Col>
							</Popover>
						))}
					</Row>
				)}
			</div>
		</div>
	);
};

export default Certificarions;