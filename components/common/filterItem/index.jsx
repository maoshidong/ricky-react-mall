import Flex from '../flex';
import classNames from 'classnames';

/**
 * @搜索条件展示项
 * @text 展示内容
 * @onClick 点击事件
 * @key
 * @isAbbreviation 是否缩略
 * @length 缩略长度
 */
const FilterItem = ({ text, onClick, key, isAbbreviation = false, length = 20, className, style }) => {
	let showText = text;
	if (isAbbreviation) {
		showText = text?.substring(0, length);
	}

	return (
		<Flex
			alignCenter
			key={key}
			className={classNames('mb3 product-filter-selected-group pub-border pub-font12 mb0', className)}
			style={{ wordBreak: 'break-all', ...style }}
		>
			<div className="pub-lh18">{showText}</div>
			<div className="filter-close" onClick={onClick}>
				<div className="ml5 sprite-about-us sprite-about-us-1-4" />
			</div>
		</Flex>
	);
};

export default FilterItem;
