import React, { useState, useEffect } from 'react';
import CommonRepository from '~/repositories/zqx/CommonRepository';
import useLanguage from '~/hooks/useLanguage';

const Certificate = () => {
	const { i18Translate, getDomainsData } = useLanguage();
	const iCertifications = i18Translate('i18MenuText.Certifications', 'CERTIFICATIONS');

	const [authList, setAuthList] = useState([]);
	const getList = async () => {
		const res = await CommonRepository.apiAuthList({
			languageType: getDomainsData()?.defaultLocale,
		});
		setAuthList(res?.data || []);
	};
	useEffect(() => {
		getList();
	}, []);

	return (
		<div className="ps-container certificate-box">
			<h2 className="pub-font500 certificate-tit pub-font30">{iCertifications}</h2>
			<div className="ps-container pub-certifications pub-border20 box-shadow">
				{authList?.slice(0, 12).map((item, index) => {
					return (
						<a className="pub-color-hover-link" key={item.name} target="_blank" href={item.url}>
							<img style={{ marginTop: index === 0 ? '5px' : '0px' }} src={item?.imageUrl} alt={item.name} loading="lazy" className="certificate-icon" />
							<h3 className="pub-font500 pub-font14 pub-color18 mb10" />
							{item.name}
						</a>
					);
				})}
			</div>
		</div>
	);
};

export default Certificate;
