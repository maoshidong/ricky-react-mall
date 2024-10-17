import React from 'react';
import LazyLoad from 'react-lazyload';
import useLanguage from '~/hooks/useLanguage';

const Articles = () => {
	const { i18Translate } = useLanguage();
	const des1 = 'We demonstrate honesty and trustworthiness in all we do with the highest standard of ethical behavior to guide all our actions.';
	const des2 =
		'We think about problems from the standpoint of customers, and on the basis of adhering to principles, we will finally achieve customer satisfaction and never let customers regret it.';
	const des3 = 'We keep pace with the times, forge ahead and dare to be the first.';
	const des4 =
		'We proactively share business knowledge and experience; take the initiative to give necessary help to colleagues; and are good at using the team to solve problems and difficulties.';
	const des5 =
		"We don't push off today's work until tomorrow; continuous learning, self-improvement, improvement of professional skills, and doing things fully reflect the result-oriented.";
	const des6 =
		'We value and respect our people by embracing diversity of backgrounds, learning, experience and thought, creating equal opportunities across our workplace culture.';
	const arr = [
		{
			img: 'core-values1.png',
			label: i18Translate('i18AboutUs.CoreValuesTitle1', 'INTEGRITY'),
			des: i18Translate('i18AboutUs.CoreValuesContent1', des1),
		},
		{
			img: 'core-values2.png',
			label: i18Translate('i18AboutUs.CoreValuesTitle2', 'STOMERS FIRST'),
			des: i18Translate('i18AboutUs.CoreValuesContent2', des2),
		},
		{
			img: 'core-values3.png',
			label: i18Translate('i18AboutUs.CoreValuesTitle3', 'INNOVATION'),
			des: i18Translate('i18AboutUs.CoreValuesContent3', des3),
		},
		{
			img: 'core-values4.png',
			label: i18Translate('i18AboutUs.CoreValuesTitle4', 'TEAMWORK'),
			des: i18Translate('i18AboutUs.CoreValuesContent4', des4),
		},
		{
			img: 'core-values5.png',
			label: i18Translate('i18AboutUs.CoreValuesTitle5', 'DEDICATION'),
			des: i18Translate('i18AboutUs.CoreValuesContent5', des5),
		},
		{
			img: 'core-values6.png',
			label: i18Translate('i18AboutUs.CoreValuesTitle6', 'INCLUSIVENESS'),
			des: i18Translate('i18AboutUs.CoreValuesContent6', des6),
		},
	];
	const CoreValuesDes =
		'Our strong values have guided how we operate and interact with our customers, suppliers and with each other. We believe that earning your trust is a privilege and doing the right thing is always the best course of action. Our Core Values, Code of Conduct and company policies reflect our commitment to doing business with integrity.';
	return (
		<div className="ps-container articles-box">
			<h2 className="pub-font500 articles-title pub-font30">{i18Translate(`i18MenuText.Core Values`, 'CORE VALUES')}</h2>
			<p className="articles-des pub-center">{i18Translate(`i18AboutUs.CoreValuesDes`, CoreValuesDes)}</p>
			<div className="articles-values pub-flex-align-center">
				{arr.map((item, i) => {
					return (
						// + ((i !== 2 && i !==5) ? 'mr20' : '')
						<div key={'core' + i} className={'articles-item box-shadow '}>
							<LazyLoad height={180} once={true} offset={200}>
								<img src={'/static/img/about-us/' + item.img} alt="Core Values" className="articles-item-img" />
							</LazyLoad>
							<div className="articles-item-label">
								<h3 className="pub-fontw">{item.label}</h3>
								<p className="pub-font13 articles-item-des">{item.des}</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};


export default Articles