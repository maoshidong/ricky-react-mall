import React from 'react';
import PageContainer from '~/components/layouts/PageContainer';
import PageNoFound from '~/components/elements/PageNoFound';
import { changeServerSideLanguage } from '~/utilities/easy-helpers';

function CustomError({ statusCode }) {
	return (
		<PageContainer>
			<PageNoFound />
		</PageContainer>
	);
}

CustomError.getInitialProps = ({ res, err }) => ({
	statusCode: res ? res.statusCode : err ? err.statusCode : 404,
});
  
  export default CustomError;
//   export async function getServerSideProps({ req }) {
//     const translations = await changeServerSideLanguage(req)

//     return {
//         props: {
//             ...translations,
//         }
//     }
// }
//   export async function getInitialProps({ query, res }) {
//     res.writeHead(302, { Location: '/page/page-404' });
// };
