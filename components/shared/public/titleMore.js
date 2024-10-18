import Link from 'next/link';

const titleMore = ({ title, subTitle, childTex, linkUrl = '#', isLink = true, titleH1 = false }) => {
	const getText = () => {
		return (
			<a className="pub-flex-center">
				<h3 className="mb0 sub-title">
					<span className="pub-color-link">{subTitle}</span>
				</h3>
				<div className="sprite-home-min sprite-home-min-3-9"></div>
			</a>
		);
	};

	return (
		<div className="pub-title-more">
			{titleH1 ? <h1 className="pub-title">{title}</h1> : <div className="pub-title">{title}</div>}
			{subTitle && (
				<div className="pub-more">
					<div className="pub-content">
						{/* 副标题 */}
						{childTex && <div className="mr10">{childTex}</div>}

						{isLink && <Link href={linkUrl}>{getText()}</Link>}
						{!isLink && <div onClick={() => window.open(linkUrl, '_blank')}>{getText()}</div>}
					</div>
				</div>
			)}
		</div>
	);
};

export default titleMore