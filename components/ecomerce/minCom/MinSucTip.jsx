const MinSucTip = ({
	susText = 'Your information has been received',
	subText = 'Our customer service will reply to you within 1 business days.',
	subText1,
	isBottom = true,
}) => {
	return (
		<div className={`mt10 ${isBottom ? 'mb20' : 'mb0'}`} style={{ display: 'flex' }}>
			<div className="sprite-about-us sprite-about-us-1-5 mr10 mt5"></div>
			<div>
				<div className="pub-font18 pub-fontw pub-color-success">{susText}</div>
				{subText && <div className="pub-lh18 pub-font13">{subText}</div>}
				{subText1 && <div className="pub-lh18 pub-font13">{subText1}</div>}
			</div>
		</div>
	);
};

export default MinSucTip