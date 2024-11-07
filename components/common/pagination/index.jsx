import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import Flex from '../flex';
import styles from './_pagination.module.scss';

const generateArray = (totalPages, pageStep, isReverse) => {
	const result = [];
	if (isReverse) {
		for (let i = totalPages; i > 0; i -= pageStep) {
			const pageArray = Array.from({ length: pageStep }, (_, j) => i - j).filter((page) => page > 0);
			result.unshift(pageArray.reverse());
		}
	} else {
		for (let i = 1; i <= totalPages; i += pageStep) {
			result.push(Array.from({ length: pageStep }, (_, j) => j + i).filter((page) => page <= totalPages));
		}
	}
	return result;
};

const Pagination = ({
	total = 0,
	pageNum = 1,
	pagesTotal = 1,
	pageSize = 500,
	currentUrl,
	otherUrlParams = '',
	isSEO = true,
	onChange = () => { },
	className = '',
	style = {}
}) => {
	const Router = useRouter();
	const pageStep = 5;
	const [index, setIndex] = useState(Math.floor((pageNum - 1) / pageStep));
	const [totalPages, setTotalPages] = useState(Math.ceil(total / pageSize) || pagesTotal)

	useEffect(() => {
		setIndex(Math.floor((pageNum - 1) / pageStep));
		let tp = pagesTotal
		if (total > 0) {
			tp = Math.ceil(total / pageSize)
		}
		setTotalPages(tp)
	}, [total, pagesTotal, pageNum, pageStep]);

	const handlePageChange = useCallback(
		(page) => {
			if (page < 1 || page > totalPages) return;
			onChange({ pageNum: page, pageSize });
		},
		[totalPages, pageSize, onChange]
	);

	const handleHref = (e, href) => {
		e.preventDefault();
		Router.push(href);
	};

	const itemRender = (page, type, key) => {
		const isDisabled = (type === 'prev' && page < 1) || (type === 'next' && page >= totalPages + 1);
		const isActive = pageNum === page;

		const element = (
			<div
				key={key}
				className={classNames(styles['zqx-pagination-page-item'], {
					[styles.disabled]: isDisabled,
					[styles.active]: isActive,
				})}
				onClick={() => !isDisabled && handlePageChange(page)}
			>
				{type === 'prev' ? <LeftOutlined /> : type === 'next' ? <RightOutlined /> : page}
			</div>
		);

		if (isSEO) {
			const href = `${currentUrl}?pageNum=${page}&pageSize=${pageSize}${otherUrlParams ? `&${otherUrlParams}` : ''}`;
			return <a key={`link-${key}`} href={href} onClick={(e) => handleHref(e, href)}>{element}</a>;
		}

		return element;
	};

	const pages = useMemo(() => {
		const isReverse = pageNum === totalPages;
		return generateArray(totalPages, pageStep, isReverse);
	}, [totalPages, pageStep, pageNum]);

	return (
		<Flex justifyEnd className={classNames(styles['zqx-pagination'], className)} style={style}>
			<Flex alignCenter className={styles['zqx-pagination-page']}>
				{pageNum > 1 && itemRender(pageNum - 1, 'prev', 'prev')}
				{pages[index]?.map((page, i) => itemRender(page, 'page', i))}
				{pageNum < totalPages && itemRender(pageNum + 1, 'next', 'next')}
			</Flex>
		</Flex>
	);
};

export default Pagination;