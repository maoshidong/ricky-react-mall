import LazyLoad from 'react-lazyload';
import classNames from 'classnames';
import styles from './_PubPageBanner.module.scss';

/**
 * 
 * @param 公共页面banner公共组件
 * @param bgcImg /static/img/bg/ 图片名称
 * @param mobileBgcImg /static/img/bg/ 手机端图片名称
 * titleStyle 标题样式
 * desStyle 描述样式
 */
// 不需要就删除
const PageTopBannerCom = ({
	outerClassName = "",
	bgcImg, // 图片
	mobileBgcImg, // 图片
	title, // 标题
	otherTitleClass = '',
	titleH1 = false, // 标题默认不是h1标签
	description = '', // 描述
	descriptionClass = 'w600',
	otherDescriptionClass = '',
	minHeight = '',
	children,
	contentStyle,
	titleStyle,
	desStyle,
	style,
	isdynamic = false,
}) => {

	const curImg = `/static/img/bg/` + bgcImg
	const curMobileImg = mobileBgcImg ? (`/static/img/bg/` + mobileBgcImg) : curImg

	return (
		<div className={classNames('pub-top-bgc pub-top-bgc-minh260 ' + minHeight, styles.pubTopBgc, styles[outerClassName])} style={style}>
			{/* <div style={{ backgroundImage: `url(${isdynamic ? bgcImg : curImg})` }}></div> */}
			<img className={classNames(styles.pubTopImg, styles.img1)} src={isdynamic ? bgcImg : curImg} alt="banner" />
			<img className={classNames(styles.pubTopImg, styles.img3)} src={isdynamic ? bgcImg : curMobileImg} alt="banner" />
			<div className={classNames("ps-container pub-top-bgc-content", styles.pubTopBgcContent)} style={contentStyle}>

				{title && !titleH1 && <h2
					className={classNames('pub-top-bgc-title pub-fontw mb10 pub-text-left ' + otherTitleClass, styles.pubTopBgcTitle)}
					style={titleStyle}
				>{title}</h2>}

				{title && titleH1 && <h1
					className={classNames('pub-top-bgc-title pub-fontw mb10 ' + otherTitleClass, styles.pubTopBgcTitle)}
					style={{ lineHeight: '56px', ...titleStyle }}
				>{title}</h1>}
				{/* 描述 */}
				{description && (
					<p
						className={classNames(`pub-font16 pub-font50 pub-text-left pub-lh20 ` + descriptionClass + ' ' + otherDescriptionClass, styles.pubTopBgcDes)}
						style={{ maxWidth: '100%', ...desStyle }}
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
// 制造商和品牌详情和样品？
{  /* https://cloud.tencent.com/act/pro/for-enterprise?from=17778  库存解决方案 */ }
{  /* https://cloud.tencent.com/act/pro/game-social?from=18150  联系我们 */ }
{  /* https://partner.cloud.tencent.com/  关于我们 */ }
{  /* https://cloud.tencent.com/act/pro/e-business?from=17778  订单状态 */ }
{  /* https://www.tencentcloud.com/campaign/freetier?from_qcintl=112010105  免费样品 */ }
{  /* https://cloud.tencent.com/act/pro/game-speedup?from=18149  品牌推荐 */ }
{  /* https://market.cloud.tencent.com/  所有制造商 */ }