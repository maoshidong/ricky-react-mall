import useLanguage from '~/hooks/useLanguage';
import styles from 'scss/module/_firstLoad.module.scss';
import LazyLoad from 'react-lazyload';
const CertificarionsItem = ({ item }) => {
	const { i18Translate, i18MapTranslate } = useLanguage();
	return (
		<div className={`${styles.certificarionsItem} box-shadow`}>
			<div className={styles.certificarionsFirst}>
			<LazyLoad height={64} once={true} offset={0}>
				<img src={item?.imageUrl} alt={item.name} title={item.name}  loading='lazy' width="90" height="77" style={{ width: '100%',  height:"100%"}} />
			</LazyLoad>
				<div className={styles.certificarionsNum}>{item.name}</div>
			</div>

			<div className={styles.certificarionsContent}>
				<div className="pub-color18 pub-font14 pub-fontw mt15 mb10">{item.name}</div>
				<div className="pub-color555" style={{ textAlign: 'left' }}>
					{i18MapTranslate(`i18CareersPage.${item.name}`, item.text)}
				</div>
				<a target="_blank" href={item.url} style={{ display: 'inline-block' }}>
					<div className="pub-color-link mt5">{i18Translate('i18FunBtnText.Download', 'View Certificate')}</div>
				</a>
			</div>
		</div>
	);
};

export default CertificarionsItem