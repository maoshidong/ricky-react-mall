import React, { useRef, useEffect, useState } from 'react';
import { Image } from 'antd';
import { useRouter } from 'next/router';

// 给指定div下的所有图片添加alt 和title属性
/**
 * manufacturerLogo 供应商logo
 * manufacturerName 供应商名字
 * **/
function AddAttributesToImagesCom({ children, imgAlt, imgTitle, imgUrl, contents, manufacturerLogo, manufacturerName, manufacturerUrl }) {
	const targetDivRef = useRef(null);
	// 放大图片设置
	const [visible, setVisible] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (targetDivRef.current) {
			addAltAndTitleAttributes();
		}

		const newsImgId = window.document.getElementById('myNewsContent');
		newsImgId && newsImgId.addEventListener('click', handleEnlargeClcik);

		const manufacturerId = window.document.getElementById('manufacturer');
		manufacturerId && manufacturerId.addEventListener('click', handleManufacturerJumpClick);

		return () => {
			newsImgId && newsImgId.removeEventListener('click', handleEnlargeClcik);
			manufacturerId && manufacturerId.removeEventListener('click', handleManufacturerJumpClick);
		};
	}, [contents]);

	// 添加img图片属性alt,title
	const addAltAndTitleAttributes = () => {
		const imgElements = targetDivRef.current.querySelectorAll('img');
		imgElements?.forEach((img) => {
			// 如果是供应商的就不需要添加属性
			if (img?.id !== 'manufacturer') {
				img.setAttribute('alt', imgAlt || imgTitle);
				img.setAttribute('title', imgTitle);
			}
		});
	};

	// 放大图片
	const handleEnlargeClcik = () => {
		setVisible(true);
	};

	// 跳转到供应商
	const handleManufacturerJumpClick = () => {
		manufacturerUrl && router.push(manufacturerUrl);
	};

	// 把图片插入到div中
	const newsImgUrl = (imgUrl || 'https://oss.origin-ic.net/otherFile/bog.jpg')?.replace(/ /g, '%20'); // 所有的空格都用%20替换
	let newsContents = '';
	if (!!contents) {
		if (!!manufacturerLogo) {
			newsContents =
				`<div style='border:1px solid #e3e7ee;border-radius: 6px;float:right;width:240px;margin-left:30px;padding:10px;text-align:center'><img id='manufacturer' style='object-fit:contain;height:50px;margin-bottom:20px;cursor:pointer;' src=${manufacturerLogo} title=${manufacturerName} alt=${manufacturerName}></img><img id='myNewsContent' src=${newsImgUrl} style='width:200px;cursor:pointer;'></img></div>` +
				contents.replace(/<br\s*\/?>/gi, '');
		} else {
			newsContents =
				`<img id='myNewsContent' alt=${imgAlt} src=${newsImgUrl} style=float:right;width:200px;padding:10px;cursor:pointer;></img>` + contents?.replace(/<br\s*\/?>/gi, '');
		}
	}

	return (
		<div ref={targetDivRef}>
			{children || <div className="mr10" dangerouslySetInnerHTML={{ __html: newsContents }} />}

			<Image
				style={{ display: 'none' }}
				preview={{
					visible,
					onVisibleChange: (value) => {
						setVisible(value);
					},
				}}
				width={200}
				alt={'Image of ' + imgTitle}
				title={imgTitle}
				src={newsImgUrl}
			/>
		</div>
	);
}

export default AddAttributesToImagesCom;