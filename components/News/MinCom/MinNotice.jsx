import { Button } from 'antd'
import useLanguage from '~/hooks/useLanguage';
const noticeBox = {
	zIndex: '999',
	width: '100%',
	background: 'linear-gradient(0deg, #E3E7EE 0%, #FFFFFF 41%)',
}

const MinNoticeCom = ({ handleReceive }) => {
	const { i18Translate } = useLanguage();
	const iOK = i18Translate('i18FunBtnText.OK', "OK")

	const iUeditorNotice = i18Translate('i18Ueditor.UeditorNotice', '')

	const receive = () => {
		if (handleReceive) {
			handleReceive()
		}
	}
	return (
		<>
			{
				iUeditorNotice && (<div className="notice-box" style={noticeBox}>
					<div className='ps-container'>
						<div className='pub-flex-align-center'>
							<div style={{ width: '1200px' }}>
								<div className='pub-flex-grow pub-link-a exper-text mt10 mb10 pub-lh18 vue-ueditor-wrap' dangerouslySetInnerHTML={{ __html: iUeditorNotice }}></div>
							</div>

							<div className="custom-antd-btn-more" style={{ marginLeft: '8%' }}>
								<Button
									type="primary" ghost='true'
									className='ps-add-cart-footer-btn custom-antd-primary w180'
									onClick={() => receive()}
								>{iOK}</Button>
							</div>

						</div>
					</div>
				</div>
				)
			}
		</>

	)
}

export default MinNoticeCom