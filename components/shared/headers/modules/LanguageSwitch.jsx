import React, { useState } from 'react';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip'; // 公共提示
import { I18NEXT_DOMAINS } from '~/utilities/constant';
import useLanguage from '~/hooks/useLanguage';
import NoSSR from 'react-no-ssr';
import styles from 'scss/module/_minPage.module.scss';
import stylesSprite from 'scss/module/_sprite.module.scss';

const LanguageSwitchCom = () => {
	const { i18Translate, getZhName } = useLanguage();
	const iSelCountryTit = i18Translate('i18Other.selCountryTit', 'SELECT YOUR COUNTRY/REGION');
	const iAsia = i18Translate('i18Other.Asia', 'Asia');
	const iAustralia = i18Translate('i18Other.Australia', 'Australia');
	const iEurope = i18Translate('i18Other.Europe', 'Europe');
	const iMiddleEast = i18Translate('i18Other.Middle East', 'Middle East');
	const iNorthAmerica = i18Translate('i18Other.North America', 'North America');
	const iSouthAmerica = i18Translate('i18Other.South America', 'South America');
	const [isShowModal, setIsShowModal] = useState(false);

	const handleSwitch = (e) => {
		e && e.preventDefault();
		setIsShowModal(true);
	};

	// 获取域名
	const getClass = () => {
		const domain = typeof window !== 'undefined' ? window?.location?.host : '';
		const item = I18NEXT_DOMAINS.find((i) => i.domain === domain);
		return item?.class;
	};

	const getTitle = (_item, index) => {
		let text = '';
		switch (index) {
			case 0:
				text = <div className="pub-fontw mb10">{iAsia}</div>; // 亚洲
				break;
			case 10:
				text = <div className="pub-fontw mb10">{iAustralia}</div>; // 澳大利亚
				break;
			case 12:
				text = <div className="pub-fontw mb10">{iEurope}</div>;
				break;
			case 39:
				text = <div className="pub-fontw mb10">{iMiddleEast}</div>;
				break;
			case 40:
				text = <div className="pub-fontw mb10">{iNorthAmerica}</div>;
				break;
			case 43:
				text = <div className="pub-fontw mb10">{iSouthAmerica}</div>;
				break;
			default:
				break;
		}
		return text;
	};

	return (
		<div className="language-switch mr10">
			<NoSSR>
				<div className="pub-relative mt5 pub-cursor-pointer" onClick={(e) => handleSwitch(e)}>
					中国
					{getClass() ?
						<div className={getClass() ? `${stylesSprite['sprite-language']} ' ${getClass()}` : ''}>中国</div>
						: null}
				</div>
			</NoSSR>

			{isShowModal && (
				<MinModalTip isShowTipModal={isShowModal} width={930} tipTitle={iSelCountryTit} isChildrenTip={true} onCancel={() => setIsShowModal(false)}>
					<div className={styles['language-box']}>
						{I18NEXT_DOMAINS?.map((item, index) => {
							return (
								<div key={item?.code}>
									{getTitle(item, index)}
									{/* <Link> */}
									<a href={`https://${item.domain}`} className="language-item pub-flex-align-center pub-color-hover-link mb10">
										<div className={`mr10 ${stylesSprite['sprite-language']} ` + `${stylesSprite[item?.class]}`}></div>
										{getZhName(item)}
									</a>
									{/* </Link> */}
								</div>
							);
						})}
					</div>
				</MinModalTip>
			)}
		</div>
	);
};

export default LanguageSwitchCom;
