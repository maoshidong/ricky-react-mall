import { InfoCircleOutlined } from '@ant-design/icons';
import Flex from '../flex';
import classNames from 'classnames';

// 告警提示
const AlarmPrompt = ({
	className, // 最外层class
	text = '', // 提示文本
	iconClass,
	iconStyle, // icon样式
	style, // 最外层style
	textStyle, // 文本样式
}) => {
	return (
		<Flex alignCenter className={classNames('pub-error-tip', className)} style={style}>
			<InfoCircleOutlined className={classNames('pub-error-tip mr5', iconClass)} style={{ fontSize: '14px', ...iconStyle }} />
			<span style={{ marginTop: '2px', ...textStyle }}>{text}</span>
		</Flex>
	);
};

export default AlarmPrompt;
