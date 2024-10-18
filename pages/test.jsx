// import { changeServerSideLanguage } from '~/utilities/easy-helpers';
// import changeServerSideLanguage from '~/utilities/easy-helpers/changeServerSideLanguage';
// import changeServerSideLanguage from '~/utilities/easy-helpers/changeServerSideLanguage';
// import { last, cloneDeep } from 'lodash'; // 这个方法没有达到摇树优化
import last from 'lodash/last';
import cloneDeep from 'lodash/cloneDeep';
// import { useLanguage, useI18, useAccount, useEcomerce, useCart, useClickLimit, useApi } from '~/hooks';
import useLanguage from '~/hooks/useLanguage';
// import useLanguage from '~/hooks/useLanguage';

export const config = { amp: 'hybrid' }
import Head from 'next/head';
import dynamic from 'next/dynamic';
const PageContainer = dynamic(() => import('~/components/layouts/PageContainer'));
// import { Flex } from '~/components/common';


const Test = () => {
	return (
		<div>Web page opening speed test.</div>
	)
}

export default Test
// export async function getServerSideProps({ req }) {
// 	const translations = await changeServerSideLanguage(req)

// 	return {
// 		props: {
// 			...translations,
// 		}
// 	}
// }
