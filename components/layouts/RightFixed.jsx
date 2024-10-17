import React, { useState, useRef, useEffect } from 'react'
import { BackTop } from 'antd';
import {
	UpOutlined,
} from '@ant-design/icons';

import classNames from 'classnames'
import { useLanguage, useI18 } from "~/hooks"
import { useDebounceFn } from 'ahooks';
import { ConnectList } from '~/components/shared'
import styles from "./_RightFixed.module.scss"
import styles1 from "scss/module/_minPage.module.scss";
import { I18NEXT_LOCALE } from '~/utilities/constant';
import { getWinLocale } from '~/utilities/easy-helpers';

// 能不能用官方的skype
const RightFixedCom = ({ paramMap }) => {
	const { curLanguageCodeZh } = useLanguage()
	const { iContactSales, iConnect } = useI18()
	const [isShowContact, setIsShowContact] = useState(false)
	const [curIsZh, setCurIsZh] = useState(curLanguageCodeZh())

	const timer = useRef(null)

	const { hideContact } = useDebounceFn((v) => setIsShowContact(false), { wait: 200 })

	const showContactUsBox = (flag) => {
		clearTimeout(timer.current)
		const time = flag ? 0 : 200
		timer.current = setTimeout(() => {
			setIsShowContact(flag)
		}, time)
		// setIsShowContact(flag)
	}


	useEffect(() => {
		// const curIsZh = () => getWinLocale() === I18NEXT_LOCALE.zh
		setCurIsZh(getWinLocale() === I18NEXT_LOCALE.zh)
	}, [getWinLocale()])

	return (
		<div className={styles.rightFixed}>
			<div className={styles.rightContent}>
				<div className={classNames(styles.contactSales)}>

					<span
						className={classNames('box-shadow', styles.contactLink)}
						onClick={() => window.open(`${curIsZh ? paramMap?.qqUrl : paramMap?.skype}`, '_blank')}
					>
						<img className={styles.contactImg} alt={iContactSales} src={`/static/img/common/${curIsZh ? 'qq_logo.jpg' : 'skype.jpg'}`} />
						<p className={classNames(curIsZh ? 'pub-lh16 pub-font13 w20 ' : '', styles.contactText)}>
							{curIsZh && '联系销售'}
							{!curIsZh && <span className='mr6'>C<br />o<br />n<br />t<br />a<br />c<br />t</span>}
							{!curIsZh && <span>S<br />a<br />l<br />e<br />s</span>}
							{/* {iContactSales}
							联系销售 */}
						</p>
					</span>

				</div>

				<div className={styles.contactUsBox} onMouseEnter={() => showContactUsBox(true)} onMouseLeave={() => showContactUsBox(false)}>
					<div className={classNames('box-shadow', styles.rightPubBut, styles.contactUs)}>
						<img className={styles['rightPubBut', 'contactImg']} alt={iConnect} src="/static/img/common/tel-sale.svg" />
					</div>
					{isShowContact && <div className={classNames(styles.connectBox)} onMouseEnter={() => showContactUsBox(true)} style={{ zIndex: 99999 }}>
						<ConnectList paramMap={paramMap} />
					</div>}
				</div>

				<BackTop className='mt8' style={{ right: '8px', bottom: '135px', width: '52px', height: '52px' }}>
					<button className={classNames('', styles1.psBtnBacktop)} style={{ borderRadius: '100px !important' }}>
						{/* <i className="icon-arrow-up" /> */}
						<UpOutlined />
					</button>
				</BackTop>
			</div>


		</div>
	)
}

export default RightFixedCom