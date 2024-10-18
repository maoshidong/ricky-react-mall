import styles from "scss/module/_news.module.scss";
// 新闻左侧部分组件
const FilterPairCom = ({
    filterHeaderName, // 组title
    expandHide, // 展开隐藏
    filterPairClick,  // 回调函数
    children // 插槽 
}) => {
    const handleClick = () => {
        if(filterPairClick) {
            filterPairClick()
        }
    }
    return (
        <div className={`${styles['filter-pair']}`}>
            <div
                className={`pub-flex-between ${styles['filter-header']} ` + (expandHide ? 'active' : '')}
                onClick={() => handleClick()}
            >
            {/* <div className="pub-flex-between filter-header"> */}
                {filterHeaderName}
                <div className={`${styles['open-icon']} sprite-account-icons sprite-account-icons-3-1`}></div>
            </div>
            <div className={`${styles['filter-group']} ` + (expandHide ? styles.active : '')}>
                <div className="checkbox-group refinement">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default FilterPairCom