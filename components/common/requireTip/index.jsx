import Flex from '../flex';
import AlarmPrompt from '../alarmPrompt';
import { INVALID_INPUT_TIP } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import classNames from 'classnames';
import styles from './_require.module.scss';

// 搜索框校验信息提示
const RequireTip = ({ text, style, isAbsolute = true, textStyle, className }) => {
	const { i18Translate } = useLanguage();
	const iEnterLimit = i18Translate('i18Head.enterLimit', INVALID_INPUT_TIP);

	let cn = !style?.position || style?.position === 'absolute' ? styles.tipAbsolute : styles.tipOthers;

	if (style?.position !== 'absolute') {
		if (!isAbsolute) {
			cn = styles.tipOthers;
		}
	}

	return (
		<Flex className={classNames(styles.requireTip, cn, 'pub-danger', className)} style={style}>
			<AlarmPrompt style={{ margin: 0, lineHeight: '13px' }} textStyle={textStyle} text={text || iEnterLimit} />
		</Flex>
	);
};

export default RequireTip;
