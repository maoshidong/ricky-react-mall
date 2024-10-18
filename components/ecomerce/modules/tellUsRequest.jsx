import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import QuoteModal from '~/components/shared/blocks/quote-modal';
import { decrypt } from '~/utilities/common-helpers';
import useLanguage from '~/hooks/useLanguage';
import { Flex } from '~/components/common';

const tellUsRequest = ({ paramMap }) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();
	const Router = useRouter();
	const curKeywords = decrypt(Router?.query?.keywords || '');
	const iSubmitQuote = i18Translate('i18Form.Submit Quote', 'SUBMIT QUOTE');
	const iSubmitInformation = i18Translate('i18FunBtnText.REQUEST A QUOTE', 'Request a quote'); // 所有位置
	const iLookingForTitle = i18Translate('i18CareersPage.LookingForTitle', "Can't find what you're looking for?");
	const iLookingForDes = i18Translate('i18CareersPage.LookingForDes', 'Please send us a quote to help you find the parts you need');

	return (
		<div className="tell-us-request custom-antd-btn-more pub-border15 box-shadow">
			<div className="mb10 pub-left-title">{iLookingForTitle}</div>
			<div className="mb10">{iLookingForDes}</div>

			<div className="pub-flex-align-center mb20">
				<div className="widget_content-item pub-flex-align-center mr20">
					<div className="sprite-home-min sprite-home-min-2-3"></div>
					<Link href={`mailto:${paramMap?.email || process.env.email}`} target="_blank">
						<a className="concat-text ml10 pub-color-link">{paramMap?.email || process.env.email}</a>
					</Link>
				</div>
				<div className="widget_content-item pub-flex-align-center ml30">
					{!curLanguageCodeZh() && <div className="sprite-home-min sprite-home-min-2-4"></div>}
					{curLanguageCodeZh() && <Image src="/static/img/common/qq.png" width={21} height={21} />}
					<a className="concat-text ml10 pub-color-link" target="_blank" href={`${curLanguageCodeZh() ? paramMap?.qqUrl : paramMap?.skype}`}>
						{i18Translate('i18CompanyInfo.Skype Live Chat', 'Skype Live Chat')}
					</a>
				</div>
			</div>

			<Flex className="mt5 pub-color555 pub-flex-align-center">
				<div className="sprite-account-icons sprite-account-icons-2-2 mr10"></div>
				{iSubmitInformation}
			</Flex>

			<div className="mt15" />
			<div style={{ width: '550px' }}>
				<QuoteModal
					product={{ name: curKeywords }}
					subName={iSubmitQuote}
					isShowCancle={false}
					btnStyle={{ margin: '15px 0 10px' }}
					isRepetitionShow={false}
					isShowOk={false}
					readOnly={false}
					isSaveQuteHistroy={false}
				/>
			</div>
		</div>
	);
};

export default tellUsRequest