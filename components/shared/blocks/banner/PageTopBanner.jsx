import LazyLoad from 'react-lazyload';
// import PageTopBanner from '~/components/shared/blocks/banner/PageTopBanner';
{
	/* <PageTopBanner
bgcImg="help-center2.jpg"
title="how can we help?"
minHeight="minHeight140"
/> */
}
// 页面banner图公共组件, 不需要就删除
const PageTopBannerCom = ({
	isdynamic = false,
	bgcImg, // 图片
	mobileBgcImg, // 手机图片
	title, // 标题
	otherTitleClass = '',
	titleH1 = false, // 标题默认不是h1标签
	description = '', // 描述
	descriptionClass = 'w600',
	otherDescriptionClass = '',
	minHeight = '',
	children,
	contentStyle,
}) => {
	// const desStyle = {
	//     color: $color-bgc555,
	// }
	return (
		<div className={'pub-top-bgc pub-top-bgc-minh260 ' + minHeight}>
			{/* <Image
                priority={true}
                src={`/static/img/bg/` + bgcImg}
                alt={title}
                title={title}
                layout='fill'
                className='pub-top-img'
            /> */}
			<LazyLoad height={260} once={true} offset={100}>
				<img className="pub-top-img" src={isdynamic ? bgcImg : `/static/img/bg/` + bgcImg} alt="banner" />
			</LazyLoad>
			<div className="ps-container pub-top-bgc-content" style={contentStyle}>
				{/* h2 pub-lh36 mb20 */}
				{title && !titleH1 && <h2 className={'pub-top-bgc-title pub-fontw mb10 pub-text-left pub-color555 ' + otherTitleClass}>{title}</h2>}
				{/* h1 pub-lh36 mb20 */}
				{title && titleH1 && <h1 className={'pub-top-bgc-title pub-fontw mb10 pub-color555 ' + otherTitleClass} style={{ lineHeight: '56px' }}>{title}</h1>}
				{description && (
					// pub-lh18
					<p
						className={`pub-font16 pub-top-bgc-des pub-font50 pub-text-left pub-lh20 pub-color555 ` + descriptionClass + ' ' + otherDescriptionClass}
						style={{ maxWidth: '100%' }}
					>
						{description}
					</p>
				)}
				{children && children}
			</div>
		</div>
	);
};

export default PageTopBannerCom