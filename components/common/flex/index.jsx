import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './_flex.module.scss';

const Flex = forwardRef(
	(
		{
			flex,
			auto,
			none,
			width,
			height,
			row,
			column,
			wrap,
			nowrap,
			justifyStart,
			justifyEnd,
			justifyCenter,
			justifyBetween,
			justifyAround,
			alignStart,
			alignEnd,
			alignCenter,
			alignBaseline,
			alignStretch,
			alignContentStart,
			alignContentEnd,
			alignContentCenter,
			alignContentBetween,
			alignContentAround,
			alignContentStretch,
			className,
			style,
			children,
			gap,
			flexShrink,
			...rest
		},
		ref
	) => {
		const cn = classNames(
			styles['zqx-flex'],
			{
				[styles['zqx-flex-flex']]: flex,
				[styles['zqx-flex-auto']]: auto,
				[styles['zqx-flex-none']]: none || width || height,

				[styles['zqx-flex-row']]: row,
				[styles['zqx-flex-column']]: column,

				[styles['zqx-flex-wrap']]: wrap,
				[styles['zqx-flex-nowrap']]: nowrap,

				[styles['zqx-flex-justify-start']]: justifyStart,
				[styles['zqx-flex-justify-end']]: justifyEnd,
				[styles['zqx-flex-justify-center']]: justifyCenter,
				[styles['zqx-flex-justify-between']]: justifyBetween,
				[styles['zqx-flex-justify-around']]: justifyAround,

				[styles['zqx-flex-align-start']]: alignStart,
				[styles['zqx-flex-align-end']]: alignEnd,
				[styles['zqx-flex-align-center']]: alignCenter,
				[styles['zqx-flex-align-baseline']]: alignBaseline,
				[styles['zqx-flex-align-stretch']]: alignStretch,

				[styles['zqx-flex-align-content-start']]: alignContentStart,
				[styles['zqx-flex-align-content-end']]: alignContentEnd,
				[styles['zqx-flex-align-content-center']]: alignContentCenter,
				[styles['zqx-flex-align-content-between']]: alignContentBetween,
				[styles['zqx-flex-align-content-around']]: alignContentAround,
				[styles['zqx-flex-align-content-stretch']]: alignContentStretch,
			},
			className
		);

		const s = {
			...style,
			...(flex && {
				flex: typeof flex === 'boolean' ? 1 : flex,
				WebKitFlex: typeof flex === 'boolean' ? 1 : flex,
			}),
			...(height && { height }),
			...(width && { width }),
			...(gap && { gap }),
			...(flexShrink && { flexShrink }),
		};

		return (
			<div {...rest} ref={ref} className={cn} style={s}>
				{children}
			</div>
		);
	}
);

Flex.propTypes = {
  flex: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  auto: PropTypes.bool,
  none: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  row: PropTypes.bool,
  column: PropTypes.bool,
  wrap: PropTypes.bool,
  nowrap: PropTypes.bool,
  justifyStart: PropTypes.bool,
  justifyEnd: PropTypes.bool,
  justifyCenter: PropTypes.bool,
  justifyBetween: PropTypes.bool,
  justifyAround: PropTypes.bool,
  alignStart: PropTypes.bool,
  alignEnd: PropTypes.bool,
  alignCenter: PropTypes.bool,
  alignBaseline: PropTypes.bool,
  alignStretch: PropTypes.bool,
  alignContentStart: PropTypes.bool,
  alignContentEnd: PropTypes.bool,
  alignContentCenter: PropTypes.bool,
  alignContentBetween: PropTypes.bool,
  alignContentAround: PropTypes.bool,
  alignContentStretch: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object,
	gap: PropTypes.number,
  flexShrink: PropTypes.number,
};

export default Flex;