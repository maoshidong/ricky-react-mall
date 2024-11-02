import { CommonRepository } from '~/repositories'; 
import { redirectLogin } from '~/utilities/easy-helpers';

const ShortPage = ({ url }) => {
	console.log(url, '--del')
    return (
			<div>share</div>
    )
}

export default ShortPage

export async function getServerSideProps({ req, params }) {
		const { slugs } = params;
		const res = await CommonRepository.apiGetShareUrlByCode({
			shareCode: slugs.at(-1)
		})
		return redirectLogin(res?.data || '/')
};
