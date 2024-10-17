import Link from "next/link";
// import classNames from "classnames";
import styles from "./_PubTabLink.module.scss";
// m-tabs-item 
const PubTabLinkCom = ({ headNavArr = [], tabActive }) => {
	return (
		<div className={styles.tabsBox}>
			<div className='ps-container'>
				<div className='pub-flex-align-center'>
					{
						headNavArr?.map((item, index) => {
							return <Link href={item?.linkUrl} key={index}>
								<a><h2
									className={`${styles.tabsItem} ` + (tabActive == item.tabLabel ? styles.tabsActive : '')}
								>{item.name}</h2>
								</a>
							</Link>
						})
					}
				</div>
			</div>
		</div>
	)
};

export default PubTabLinkCom;