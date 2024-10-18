import { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import styles from './_imgEnlarge.module.scss';
import noop from 'lodash/noop';

/**
 *图片放大镜
 * @smallImge 小图原始图片
 * @bigImage 大图
 * @scale 放大倍数
 * @magnifierSize 放大镜的大小
 * @onChangeKey 回调ESC函数
 * **/
const ImgEnlarge = ({ smallImge, bigImage, scale = 2, magnifierSize = 500, onChangeKey = noop() }) => {
	// 原始图片宽高
	const [orgImageWH, setOrgImageWH] = useState({ height: 0, width: 0 });
	// 是否展示全屏
	const [fullScreen, setFullScreen] = useState(false);

	// 是否展示浮层
	const [isShow, setShow] = useState(false);
	const [mfier, setMfier] = useState({ left: 0, top: 0 });
	const [magImg, setMagImg] = useState({ left: 0, top: 0 });

	useEffect(() => {
		const handleEsc = (event) => {
			// ESC 键的 keyCode 是 27
			if (event.keyCode === 27) {
				event.stopPropagation();
				event.preventDefault();
				setFullScreen(false);
				onChangeKey?.(true);
			}
		};

		// 添加事件监听
		document.addEventListener('keydown', handleEsc);

		// 在组件卸载时清除事件监听
		return () => {
			document.removeEventListener('keydown', handleEsc);
		};
	}, []);

	// 获取原始图片的宽高
	const handleOrgImageLoad = (event) => {
		const { naturalWidth, naturalHeight } = event.target;
		setOrgImageWH({ height: naturalHeight, width: naturalWidth });
	};

	// 鼠标进入区域
	const mouseEnter = () => {
		setShow(true);
	};

	// 鼠标移动区域
	const mouseLeave = () => {
		setShow(false);
	};

	//鼠标在区域里移动
	const mouseMove = (e) => {
		const en = e.nativeEvent;
		const left = en.offsetX;
		const top = en.offsetY;

		// 放大镜圆心坐标
		const mFierLeft = left - magnifierSize / 2;
		const mFierTop = top - magnifierSize / 2;
		// 放大镜定位
		setMfier({
			height: magnifierSize + 'px',
			width: magnifierSize + 'px',
			left: mFierLeft,
			top: mFierTop,
		});

		// 鼠标在遮罩层中所处位置相对遮罩层宽/高的比例(遮罩层和外层及原图宽高一致)
		const percW = left / orgImageWH.width;
		const percH = top / orgImageWH.height;

		// 放大镜中图片定位 （图片比例*宽高*放大倍数） magnifierSize放大的大小，因为在圆心所以除以2
		const imgLeft = -percW * orgImageWH.width * scale + magnifierSize / 2;
		const imgTop = -percH * orgImageWH.height * scale + magnifierSize / 2;

		// 设置放大图片的属性,如果图片尺寸过大，则把图片控制到1100*1100左右
		if (orgImageWH.height > 1800 && orgImageWH.width) {
			setMagImg({
				height: orgImageWH.height / scale + 'px',
				width: orgImageWH.width / scale + 'px',
				maxWidth: orgImageWH.width / scale + 'px',
				left: imgLeft + 150,
				top: imgTop + 150,
			});
		} else {
			setMagImg({
				height: orgImageWH.height * scale + 'px',
				width: orgImageWH.width * scale + 'px',
				maxWidth: orgImageWH.width * scale + 'px',
				left: imgLeft,
				top: imgTop,
			});
		}
	};

	// 图片查看
	const handleImageViewer = () => {
		onChangeKey?.(false);
		setFullScreen(true);
	};

	return (
		<>
			<div className={styles.imageMagnifier}>
				{/* 原图片 */}
				<img className={styles.imgSrcOrg} src={smallImge} onLoad={handleOrgImageLoad} />

				{/* 放大镜  */}
				<div
					className={styles.magnifier}
					style={{
						display: isShow ? 'block' : 'none',
						...mfier,
					}}
				>
					<img className={styles.imgSrcMagnifier} style={magImg} src={bigImage} alt="" />
				</div>

				{/* 遮罩 */}
				<div className={styles.mask} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseMove={mouseMove} onClick={handleImageViewer} />
			</div>

			{/* 图片全屏 */}
			{fullScreen && (
				<div
					className={classNames(styles.imageViewer, fullScreen ? styles.fullScreen : null)}
					onClick={() => {
						setFullScreen(false);
						onChangeKey?.(true);
					}}
				>
					<CloseOutlined style={{ position: 'absolute', cursor: 'pointer', fontSize: '42px', color: 'gray', top: 20, right: 20 }} />
					<img
						src={smallImge}
						alt=""
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
						}}
					/>
				</div>
			)}
		</>
	);
};

export default ImgEnlarge;
