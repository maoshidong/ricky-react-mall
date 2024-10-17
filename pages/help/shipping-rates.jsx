import Head from 'next/head';
import PageContainer from '~/components/layouts/PageContainer';
import DescriptionShipping from '~/components/elements/detail/description/DescriptionShipping';
import BreadCrumb from '~/components/elements/BreadCrumb';
import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';
import { PubPageBanner } from '~/components/common';

import { All_SEO6 } from '~/utilities/constant';
import { getEnvUrl, HELP_SHIPPING_RATES } from '~/utilities/sites-url';
import useLanguage from '~/hooks/useLanguage';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';


const ShippingRatesPage = ({ paramMap }) => {
	const { i18Translate } = useLanguage();
	const iHome = i18Translate('i18MenuText.Home', 'Home')
	const iShippingRates = i18Translate('i18MenuText.Shipping Rates', 'Shipping Rates')
	const iEstimate = i18Translate('i18ResourcePages.Estimate', 'Estimate')
	const iCanhelp = i18Translate('i18ResourcePages.Canhelp', 'how can we help')
	const breadcrumb = [
		{
			text: iHome,
			url: '/',
		},
		{
			text: iShippingRates,
			url: getEnvUrl(HELP_SHIPPING_RATES)
		}
	];

	const { shippingRatesTit, shippingRatesKey, shippingRatesDes } = All_SEO6?.shippingRates
	const i18Title = i18Translate('i18Seo.shippingRates.title', shippingRatesTit)
	const i18Key = i18Translate('i18Seo.shippingRates.keywords', shippingRatesKey)
	const i18Des = i18Translate('i18Seo.shippingRates.description', shippingRatesDes)
	return (
		<PageContainer paramMap={paramMap}>
			<Head>
				<title>{i18Title}</title>
				<meta property="og:title" content={i18Title} key="og:title" />
				<meta name="keywords" content={i18Key} key="keywords" />
				<meta name="description" content={i18Des} key="description" />
				<meta name="og:description" content={i18Des} key="og:description" />
			</Head>
			{/* Search help content */}
			<div className='pub-bgc-f5 custom-antd-btn-more'>
				<PubPageBanner
					bgcImg="shipping-rates1.png"
					mobileBgcImg="shipping-rates2.png"
					title={iCanhelp}
					titleH1={true}
					minHeight={'pub-top-bgc-140'}
					outerClassName='shippingRatesBgc'
					style={{ marginTop: '-60px' }}
				/>
				{/* <PageTopBanner
					bgcImg="help-center2.jpg"
					title={iCanhelp}
					titleH1={true}
					minHeight={'pub-top-bgc-140'}
				/> */}

				<div className="ps-container">
					<BreadCrumb breacrumb={breadcrumb} layout="fullwidth" />
					<div className="mt24 pub-border20 pd-0">
						<DescriptionShipping titleText={`${iShippingRates} - ${iEstimate}`} />
					</div>
				</div>
			</div>
		</PageContainer>
	)
}

export default ShippingRatesPage
export async function getServerSideProps({ req }) {
	const translations = await changeServerSideLanguage(req)
	return {
		props: {
			...translations,
		}
	}
}