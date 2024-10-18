import Flex from '../flex';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import styles from './_tableFilterField.module.scss';

/**
 * @表头字段排序
 * @param {*title-列头}
 * @param {*field-排序字段}
 * @param {*onSort-排序回调}
 * @param {*result-是否选中}
 * @param {*isShowOperation-是否显示操作}
 */
const TableFilterField = ({ title = '', field = '', onSort, result = '', isShowOperation = true }) => {
	// 根据字段排序
	const handleSortUpOrDown = (type) => {
		onSort?.(field, type);
	};

	// 是否选中
	const getIsSelected = (sort) => {
		return result === field + '=' + sort;
	};

	return (
		<Flex flex column justifyBetween className={styles.container}>
			<Flex flex alignCenter className={styles.title}>
				{title}
			</Flex>
			{!!isShowOperation && (
				<Flex justifyBetween className={styles.opration}>
					{!!field ? (
						<>
							<button className={getIsSelected('asc') ? styles.isSelect : ''} onClick={() => handleSortUpOrDown('asc')}>
								<UpOutlined />
							</button>
							<button className={getIsSelected('desc') ? styles.isSelect : ''} onClick={() => handleSortUpOrDown('desc')}>
								<DownOutlined style={{ marginTop: '4px' }} />
							</button>
						</>
					) : (
						<div className={styles.divSeat} />
					)}
				</Flex>
			)}
		</Flex>
	);
};

export default TableFilterField;
