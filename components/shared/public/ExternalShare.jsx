import { useRouter } from 'next/router';
import { DETAIL_FOLLOW_US } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';

// 对外分享公共组件
const ExternalShareCom = ({ paramMap, jointUrl='' }) => {
	const { getLanguageHost } = useLanguage();

	const Router = useRouter();
	const getShareUrl = (item) => {
		const url = {
			facebook: paramMap?.facebookShareUrl,
			linkedin: paramMap?.linkedinShareUrl,
			twitter: paramMap?.twitterShareUrl,
			mailto: paramMap?.mailtoShareUrl,
		};
		let shareUrl = url[item.name] || item.url;
		const pubUrl = `${getLanguageHost()}${Router.asPath}`;
		if (item?.name === 'facebook') {
			shareUrl = shareUrl + `?u=${pubUrl}`;
		} else if (item?.name === 'linkedin') {
			shareUrl = shareUrl + `?url=${pubUrl}`;
		} else if (item?.name === 'twitter') {
			shareUrl = shareUrl + `?text=${jointUrl}${process.env.title} &url=${pubUrl}`;
		} else if (item?.name === 'mailto') {
			shareUrl = shareUrl + `?subject=${jointUrl}${process.env.title} &body=${pubUrl}`;
		}
		return shareUrl;
	};

	return (
		<>
			{DETAIL_FOLLOW_US.map((item, index) => {
				// return <div className={'pub-cursor-pointer mr10 share-icon ' + item.class} key={index} onClick={() => window.open(getShareUrl(item), '_blank')}></div>;
				return <a
				    // {...helpersHrefNofollow(item.url)}
				    key={index}
				    href={getShareUrl(item)}
				>
				    <div

				        className={"mr10 sprite-home-min " + item.class}
				    ></div>
				</a>
			})}
		</>
	);
};

export default ExternalShareCom