import React, { useState } from 'react';
import Flex from '../flex';
import ImgEnlarge from '../imgEnlarge';
import { MinModalTip } from '~/components/ecomerce/minCom';
import useLanguage from '~/hooks/useLanguage';
import styles from './_imageModal.module.scss';
import classNames from 'classnames';
import map from 'lodash/map';

const ImageModal = ({ title, alt, images = [], emptyImg = null }) => {
	// 多语言
	const { i18Translate, getLanguageEmpty } = useLanguage();
	const iGallery = i18Translate('i18AboutProduct.Product Gallery', 'Product Gallery');
	const iOnly = i18Translate('i18AboutProduct.Images reference', 'Images are for reference only');
	const iSpeci = i18Translate('i18AboutProduct.Product Specifications', 'See Product Specifications');
	const iImages = i18Translate('i18AboutProduct.Images', 'Images');

	// 设置选中的图片
	const [selectImg, setSelectImg] = useState(images?.[0] || {});
	const [keyboard, setKeyboard] = useState(true);

	// 弹窗
	const [isShowModal, setShowModal] = useState(false);

	// 设置弹窗标识
	const handleShowModal = (flag = false) => {
		setShowModal(flag);
	};

	// 选择展示的图片
	const handleSelectImag = (imgInfo) => {
		setSelectImg(imgInfo);
	};

	return (
		<>
			{/* 图片 */}
			<Flex
				className={classNames(!emptyImg ? '' : 'pub-cursor-pointer')}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					handleShowModal(true);
				}}
			>
				<img
					src={images?.[0]?.original}
					alt={alt}
					title={title}
					onError={(e) => {
						e.target.src = getLanguageEmpty();
					}}
				/>
			</Flex>

			{/* 弹窗，显示图片列表 和图片放大 */}
			{!emptyImg && (
				<MinModalTip
					width={900}
					keyboard={keyboard}
					tipTitle={iGallery}
					showCancel={false}
					isShowTipModal={isShowModal}
					isChildrenTip={true}
					onCancel={() => handleShowModal()}
					footerOk={
						<div>
							{iOnly} <br /> {iSpeci}
						</div>
					}
				>
					<Flex className={styles.imageModal}>
						<Flex column>
							<div className={styles.navLabel}>{iImages}</div>
							<Flex column gap={10} className={styles.navThumbnail}>
								{map(images, (ig, index) => {
									return (
										<button
											key={`thumb-${index}`}
											className={classNames(styles.btn, ig.original === selectImg.original ? styles.active : null)}
											onClick={() => {
												handleSelectImag(ig);
											}}
										>
											<img key={`thumb-${index}`} className={styles.imgThumbnail} src={ig.thumbnail || ig.original} title={ig.alt} alt={ig.alt} />
										</button>
									);
								})}
							</Flex>
						</Flex>

						<Flex
							justifyCenter
							alignCenter
							flex
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
							}}
						>
							<ImgEnlarge bigImage={selectImg.original} smallImge={selectImg.original} onChangeKey={setKeyboard} />
						</Flex>
					</Flex>
				</MinModalTip>
			)}
		</>
	);
};

export default React.memo(ImageModal);
