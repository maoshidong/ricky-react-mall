

import Link from 'next/link';
import Menu from '~/components/mobile/headers/menu';
import Account from '~/components/mobile/headers/account';
import Search from '~/components/mobile/headers/search';
import LogoCom from '~/components/shared/headers/zqx/LogoCom';
import AgreeCookies from '~/components/elements/min/AgreeCookies';
import Footer from '~/components/mobile/footers';

const MobilePageContainerCom = ({ children, paramMap }) => {

	return (
		<div className="m-page-container">
			<div className="m-header">
				<div className="m-header-left">
					<Link href="/">
						<a className="ps-logo">
							<LogoCom />
							{/* <img
											src={`/static/img/logo.png`}
											alt={process.env.title}
											title={process.env.title}
											className="logwh"
									/> */}
						</a>
					</Link>
					{/* <img
						className="m-logo"
						src="/static/img/logo.png"
						title={iOriginMall}
						alt={iOriginMall}
						onClick={() => {
							push('/');
						}}
					/> */}
				</div>
				<div className="m-header-right">
					<Search>
						<div className="common-bg-image-icon1 m-header-right-search"></div>
					</Search>
					<Account>
						<div className="common-bg-image-icon1 m-header-right-avatar"></div>
					</Account>
					<Menu>
						<div className="common-bg-image-icon1 m-header-right-menu"></div>
					</Menu>
				</div>
			</div>
			<div id="header-block"></div>
			{children}
			<Footer paramMap={paramMap} />

			<AgreeCookies />
		</div>
	);
};

export default MobilePageContainerCom