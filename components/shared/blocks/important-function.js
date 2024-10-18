import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Row, Col } from 'antd';
import useLanguage from '~/hooks/useLanguage';
import TitleMore from '~/components/shared/public/titleMore';
import ModuleLogin from '~/components/ecomerce/modules/ModuleLogin';
import { RESOURCES_TOOLS_LIST } from '~/utilities/constant';

const ImportantFunction = ({ auth }) => {
	const { i18Translate, i18MapTranslate } = useLanguage();
	const { isAccountLog } = auth;
	const Router = useRouter();
	const [loginVisible, setLoginVisible] = useState(false);

	const [curActiveUrl, setCurActiveUrl] = useState('');

	const handleUrl = (e, item) => {
		e.preventDefault();
		if (item?.needLog && !isAccountLog) {
			setLoginVisible(true);
			setCurActiveUrl(item?.url);
			return;
		}
		Router.push(item?.url);
	};

	const handleLogin = (res) => {
		setLoginVisible(false);
		Router.push(curActiveUrl);
	};

	return (
		<div className="ps-product-list blocks-important-function">
			<div className="ps-container">
				<TitleMore title={i18Translate('i18Home.toolsTitle', 'CONVENIENT AND POWERFUL RESOURCES & TOOLS')} />
				{/* <Row gutter={20}></Row> */}
				<Row gutter={15} className="row important-function-ul pub-margin-8">
					{RESOURCES_TOOLS_LIST.map((item, index) => (
						<Col
							key={item?.name}
							xs={12}
							sm={12}
							md={12}
							xl={4}
							lg={2}
							className="mb20"
							// className='col-xl-2 col-lg-4 col-md-6 col col-sm-12 pub-padding8'
						>
							<Link href={item?.url}>
								<a onClick={(e) => handleUrl(e, item)}>
									<div className="important-function-item box-shadow">
										{/* <LazyLoad height={70} once={true} offset={500}> */}
										<div className={item.className} alt={item.name} title={item.name}></div>
										{/* </LazyLoad> */}
										<h3 className="pub-font500 important-function-text">{i18MapTranslate(`i18MenuText.${item.name}`, item.name)}</h3>

										{/* <div className='important-function-text'>{item.name}</div> */}
									</div>
								</a>
							</Link>
						</Col>
					))}
				</Row>
			</div>
			{/* onClick={() => setLoginVisible(true)} */}

			<ModuleLogin visible={loginVisible} onCancel={() => setLoginVisible(false)} onLogin={handleLogin} />
		</div>
	);
};

export default connect(state => state)(ImportantFunction);
