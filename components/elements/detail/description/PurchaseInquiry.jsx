import React from 'react';
import { nanoid } from 'nanoid';
import { Flex } from '~/components/common';
import useLanguage from '~/hooks/useLanguage';
import { REGISTER } from '~/utilities/sites-url';
import map from 'lodash/map';

const PurchaseInquiryCom = () => {
	const { i18Translate, curLanguageCodeEn } = useLanguage();

	const isEnglish = curLanguageCodeEn();

	const iPurchase = i18Translate('i18SmallText.Purchase', 'Purchase');
	const iSupport = i18Translate(
		'i18SmallText.Support customers',
		'We support customers to place orders online through the Origin Data store, either by registering an account or anonymously. To manage your account efficiently and conveniently, including addresses, orders, BOMs, and more, we encourage you to register with us.'
	);

	const iPayment = i18Translate('i18MyCart.Payment', 'Payment');
	const iOffer = i18Translate(
		'i18SmallText.Payment methods',
		'We offer multiple payment methods for customer convenience, including PayPal, credit cards, and bank transfers.'
	);

	const iShipping = i18Translate('i18AboutProduct.Shipping', 'Shipping');
	const iDelivery = i18Translate(
		'i18SmallText.Global delivery',
		'Global delivery. We provide various shipping options for customers to choose from, such as DHL, FedEx, UPS, SF Express, or using your own shipping account.'
	);

	const iInquiry = i18Translate('i18SmallText.Inquiry', 'Inquiry');
	const iProduct = i18Translate(
		'i18SmallText.calculated',
		'1. The product prices displayed on the Origin Data store are fixed based on calculated quantities. If you are unsatisfied with the fixed pricing or require a large quantity, you can request a quote to submit your requirements. Our sales representatives will be happy to provide you with a competitive quote.'
	);

	const iExtensive = i18Translate(
		'i18SmallText.immediate',
		'2. Due to the extensive range of products on the Origin Data store, some products may not have immediate listed prices. You can send us your inquiry, and our sales representatives will provide you with a competitive quote within one business day.'
	);

	const info = [
		{ title: iPurchase, desc: [iSupport], dataSet: 'purchase' },
		{ title: iPayment, desc: [iOffer] },
		{ title: iShipping, desc: [iDelivery] },
		{ title: iInquiry, desc: [iProduct, iExtensive] },
	];

	return (
		<Flex column className="ps-product-contact-us">
			{map(info, (item, index) => {
				return (
					<Flex key={nanoid()} column>
						<h2 className={`mb15 pub-font16 pub-color555 pub-fontw ${index === 0 ? '' : 'mt12'}`}>{item.title}</h2>
						<Flex column className="mb5" gap={12}>
							{map(item.desc, (descItem, descIndex) => {
								let element = (
									<p className="pub-color555" key={nanoid()}>
										{descItem}
									</p>
								);
								if (item?.dataSet === 'purchase') {
									// 这里如果有更好的方法，可以修改掉
									let els = descItem?.split('register ');
									if (!isEnglish) {
										els = descItem?.split('注册。');
									}
									element = (
										<div key={nanoid()}>
											{els?.[0]}
											<span className="pub-color-link">
												<a href={`${REGISTER}`} className="pub-color-link">
													{i18Translate('i18MenuText.register', 'register')}
												</a>
											</span>
											{isEnglish ? ' ' : '。'}
											{els?.[1]}
										</div>
									);
								}
								return element;
							})}
						</Flex>
					</Flex>
				);
			})}
		</Flex>
	);
};

export default React.memo(PurchaseInquiryCom);