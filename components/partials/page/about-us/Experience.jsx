import React, { useState } from 'react';
import { Image } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import { ABOUT_US_ONE_ARR, SCOMPANY_NAME, COMPANY_NAME_ZH } from '~/utilities/constant';

const Experience = () => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const iUeditorAboutUs = i18Translate('i18Ueditor.UeditorAboutUs', ABOUT_US_ONE_ARR[0]);
	const [visible, setVisible] = useState(false);

	const imgUrl = `/static/img/about-us/${curLanguageCodeZh() ? 'abus-9.jpg' : 'abus-8.jpg'}`;
	const imgUrlBig = `/static/img/about-us/${curLanguageCodeZh() ? 'abus-9.jpg' : 'abus-8-big.png'}`;

	return (
		<div className="ps-container exper-container">
			<h3 name="About" className="pub-font500 exper-title">
				{i18Translate('i18MenuText.About Us', 'ABOUT US')}
			</h3>

			<div className="exper-content">
				<img
					src={imgUrl}
					alt={curLanguageCodeZh() ? COMPANY_NAME_ZH : SCOMPANY_NAME}
					className="exper-img"
					onClick={() => {
						setVisible(true);
					}}
					style={{ maxWidth: curLanguageCodeZh() ? '200px' : '500px', marginTop: curLanguageCodeZh() ? '-40px' : '0' }}
				/>
				<div>
					<div className="pub-flex-grow pub-link-a exper-text pub-lh18 vue-ueditor-wrap" dangerouslySetInnerHTML={{ __html: iUeditorAboutUs }}></div>
				</div>

				{visible && (
					<Image
						style={{ display: 'none', objectFit: 'cover' }}
						preview={{
							visible: visible,
							src: imgUrlBig,
							onVisibleChange: (value) => {
								setVisible(value);
							},
						}}
						src={imgUrlBig}
						alt=""
					/>
				)}
			</div>
		</div>
	);
};


export default Experience