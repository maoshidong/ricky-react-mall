import Image from 'next/image';
// import LazyLoad from 'react-lazyload';
import useLanguage from '~/hooks/useLanguage';

// 延迟加载分类导航右侧数据
const LazyCatalogItem = ({ subItem }) => {
	const { getLanguageName, getLanguageEmpty } = useLanguage();
	// console.log(subItem, 'subItem----del')
	return (
		<>
			{/* offset={200} */}
			{/* <LazyLoad height={110} once={true}>
                <img
                    src={subItem?.image || getLanguageEmpty()}
                    title={subItem?.name} alt={subItem?.name}
                    className='pub-img60'
                />
            </LazyLoad> */}
			<img loading="lazy" width={60} height={60} src={subItem?.image || getLanguageEmpty()} title={subItem?.name} alt={subItem?.name} className="pub-img60" />
			<a className="right-catalog-name pub-lh16 pub-color-hover-link">{getLanguageName(subItem)}</a>
			{/* <p className="right-catalog-name pub-lh16">{getLanguageName(subItem)}</p> */}
		</>
	);
};

export default LazyCatalogItem