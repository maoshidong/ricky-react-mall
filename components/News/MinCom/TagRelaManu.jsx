import Link from 'next/link';
import useLanguage from '~/hooks/useLanguage';
import { MANUFACTURER, ALL_TAGS } from '~/utilities/sites-url';
import { isIncludes, capitalizeFirstLetter } from '~/utilities/common-helpers';

const TagRelaManuCom = ({ tagList, content }) => {
	const { i18Translate } = useLanguage();
	const iTags = i18Translate('i18AboutProduct.Tags', 'Tags');
	const { manufacturerName, manufacturerSlug, slugStatus } = content
	let relaManuList = []
	// slugStatus 1 品牌主页开启
	if(+slugStatus === 1 && manufacturerName) {
		relaManuList = [
			{ manufacturerName, manufacturerSlug }
		]
	}
	// 供应商链接
	const getManLink = () => {
		return relaManuList?.map((i, index) => {
			return (
				<div className="mb10" key={'m' + index}>
					<Link href={`${MANUFACTURER}/${isIncludes(i?.manufacturerSlug)}`}>
						<a className="new-tag pub-color-hover-link ml10">{capitalizeFirstLetter(i?.manufacturerName)}</a>
					</Link>
				</div>
			);
			// return (
			// 	<div className="mb10" key={'m' + index}>
			// 		<Link href={`${MANUFACTURER}/${isIncludes(i?.slug)}`}>
			// 			<a className="new-tag pub-color-hover-link ml10">{capitalizeFirstLetter(i?.name)}</a>
			// 		</Link>
			// 	</div>
			// );
		});
	};

	// 字母标签
	const getTagListLink = () => {
		return tagList?.map((i, index) => {
			return (
				<div className="mb10" key={'t' + index}>
					<Link href={ALL_TAGS + `/${isIncludes(i?.name)}/${i?.id}`}>
						<a className="new-tag pub-color-hover-link ml10">{capitalizeFirstLetter(i?.name)}</a>
					</Link>
				</div>
			);
		});
	};

	return (
		<div>
			{(relaManuList?.length > 0 || tagList?.length > 0) && (
				<div className="pub-color555 pub-flex-wrap">
					{iTags}:{relaManuList?.length > 0 && getManLink()}
					{tagList?.length > 0 && getTagListLink()}
				</div>
			)}
		</div>
	);
};

export default TagRelaManuCom