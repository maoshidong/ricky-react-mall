import React from 'react';
import LazyLoad from 'react-lazyload';
import { baseUrl } from '~/repositories/Repository';
// import { formatCurrency } from '~/utilities/product-helper';
// import { getCurrencyInfo } from '~/repositories/Utils';
import useLanguage from '~/hooks/useLanguage';

// 对比,检查,不需要就删除
function getImageURL(source, size) {
	let image, imageURL;

	if (source) {
		if (size && size === 'large') {
			if (source.formats.large) {
				image = source.formats.large.url;
			} else {
				image = source.url;
			}
		} else if (size && size === 'medium') {
			if (source.formats.medium) {
				image = source.formats.medium.url;
			} else {
				image = source.url;
			}
		} else if (size && size === 'thumbnail') {
			if (source.formats.thumbnail) {
				image = source.formats.source.url;
			} else {
				image = source.url;
			}
		} else if (size && size === 'small') {
			if (source.formats.small !== undefined) {
				image = source.formats.small.url;
			} else {
				image = source.url;
			}
		} else {
			image = source.url;
		}
		imageURL = `${baseUrl}${image}`;
	} else {
		imageURL = `/static/img/undefined-product-thumbnail.jpg`;
	}
	return imageURL;
}

export default function useProduct() {
    const { getLanguageEmpty } = useLanguage();
	// const currencyInfo = getCurrencyInfo();
    return {
        thumbnailImage: (payload) => {
            if (payload) {
                if (payload?.image?.data?.attributes) {
                    return (
                        <>
                            <LazyLoad>
                                <img
                                    src={getImageURL(payload.image.data.attributes)}
                                    alt={getImageURL(payload.image.data.attributes)}
                                />
                            </LazyLoad>
                        </>
                    );
                } else if (payload?.attributes?.image) {
                    return (
                        <>
                            <LazyLoad>
                                <img
                                    style={{ display:"inline-block",width: '90px', height: '100%' }}
                                    src={payload?.attributes?.image}
                                    alt={payload?.attributes?.image}
                                />
                            </LazyLoad>
                        </>
                    );
                } else if (payload?.attributes?.thumb) {
                    return (
                        <>
                            <LazyLoad>
                                <img
                                    src={payload?.attributes?.thumb}
                                    alt={payload?.attributes?.thumb}
                                />
                            </LazyLoad>
                        </>
                    );
                } else  if (payload?.image) {
                    return (
                        <>
                            <LazyLoad>
                                <img
                                    src={payload?.image}
                                    alt={payload?.image}
                                />
                            </LazyLoad>
                        </>
                    )
                } else {
                    return (
                        <>
                            <LazyLoad>
                                <img
                                    src={getLanguageEmpty()}
                                    alt={payload?.attributes?.thumb}
                                />
                            </LazyLoad>
                        </>
                    )
                }
            }
        },
    };
}
