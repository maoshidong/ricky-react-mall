import styles from "./_myGrid.module.scss"
// 检查，不需要就删除 xs={24} sm={12} md={8} xl={8} lg={8}
const MyGridCom = ({
    type=1, // 根据类型不同
    children,
}) => {
    return (
        <a className={`${styles['my-xl-8']}, li`}>
            {children}
        </a>
    )
}

export default MyGridCom