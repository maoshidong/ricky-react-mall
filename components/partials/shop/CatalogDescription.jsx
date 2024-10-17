import useLanguage from '~/hooks/useLanguage';

const CatalogDescriptionCom = ({ catalogName, description, children, style, className }) => {
	const { i18Translate, curLanguageCodeZh } = useLanguage();

	const iAbout = i18Translate('i18SmallText.About', 'About');
	if (!description) return null;

	return (
		<>
			{typeof description !== 'object' && (
				<div className={className} style={style}>
					<div className="pub-flex-center">
						<h2 className="pub-title mt20 mb30">
							{iAbout}
							{curLanguageCodeZh() ? '' : <>&nbsp;</>}
							{catalogName}
						</h2>
						{children}
					</div>
					{/* 管理端换成富文本编辑器后需要更换 */}
					{/* dangerouslySetInnerHTML 只能使用div标签  */}
					<div className="vue-ueditor-wrap mt0" dangerouslySetInnerHTML={{ __html: description }}></div>
				</div>
			)}
		</>
	);
};

export default CatalogDescriptionCom