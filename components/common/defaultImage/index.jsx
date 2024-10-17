import Flex from '../flex';

// 默认图组件
const DefaultImageCom = ({ type, imgUrl, title, className, imgClassName, style, imgStyle, children }) => {
	const blogImgUrl = '/static/img/default/bog_tmb.jpg' || '/static/img/default/bog.jpg';
	return (
		<Flex className={className} style={style}>
			<img className={imgClassName} alt={'Image of ' + title} title={title} style={imgStyle} src={imgUrl || blogImgUrl} />
			{children}
		</Flex>
	);
};

export default DefaultImageCom;
