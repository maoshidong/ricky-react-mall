import styles from "./_reactLoading.module.scss";
const LoadingBar = ({isLoading}) => {
  return (
    <div className={styles.headerLoadeBgc}>
        <div className={`${styles.headerLoader} ${isLoading ? styles.active : ''}`}></div>
    </div>
  );
};

export default LoadingBar;