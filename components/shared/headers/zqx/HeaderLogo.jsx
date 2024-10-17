import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LogoCom from '~/components/shared/headers/zqx/LogoCom';
import useLanguage from '~/hooks/useLanguage';

const HeaderLogoCom = () => {
	const Router = useRouter();
	const { curLanguageCodeEn, getDomainsData } = useLanguage();

	const isHome = Boolean(Router.asPath === '/');

	const isEn = curLanguageCodeEn();
	const sty = { width: isEn ? 'auto' : '214px' };

	return (
		<>
			{isHome && (
				<h1 className="header-h1" style={sty}>
					{/* as 是用户在浏览器地址栏中看到的路径，可以帮助提供更好的用户体验和 SEO 友好性。 */}
					<Link href={getDomainsData()?.httpDomain}>
						<a className="ps-logo" href={getDomainsData()?.httpDomain}>
							<LogoCom />
						</a>
					</Link>
				</h1>
			)}
			{!isHome && (
				<div style={sty}>
					<Link href={getDomainsData()?.httpDomain}>
						<a className="ps-logo" href={getDomainsData()?.httpDomain}>
							<LogoCom />
						</a>
					</Link>
				</div>
			)}
		</>
	);
};

export default HeaderLogoCom;
