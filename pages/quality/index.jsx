import React from 'react';
import Head from 'next/head';

import PageContainer from '~/components/layouts/PageContainer';
import PartQualityView from '~/components/elements/detail/description/PartQualityView';
import { All_SEO3 } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';



const QualityPage = ({ paramMap }) => {
	const { i18Translate } = useLanguage();

	const { qualityTit, qualityKey, qualityDes } = All_SEO3?.quality
	const i18Title = i18Translate('i18Seo.quality.title', qualityTit)
	const i18Key = i18Translate('i18Seo.quality.keywords', qualityKey)
	const i18Des = i18Translate('i18Seo.quality.description', qualityDes)
	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta property="og:description" content={i18Des} key="og:description" />
				<meta property="og:image" content="https://www.origin-ic.com/static/img/logo.png" key="og:image" />
			</Head>
			<main id="homepage-zqx">
				{/* ps-product--detail */}
				<div className=" quality-page" style={{ marginBottom: 0 }}>
					<div className="ps-product__content" style={{ paddingTop: 0, marginTop: 0 }}>
						<PartQualityView />
					</div>
				</div>
			</main>
		</PageContainer>
	);
};

export default QualityPage;
export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)

	return {
		props: {
			...translations,
		}
	}
}
