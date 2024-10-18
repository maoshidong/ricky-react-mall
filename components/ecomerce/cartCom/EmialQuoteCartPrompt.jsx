import useLanguage from '~/hooks/useLanguage';
import useI18 from '~/hooks/useI18';
import MinModalTip from '~/components/ecomerce/minCom/MinModalTip' // 公共提示
// 邮件报价产品
const EmialQuoteCartPromptCom = ({ cancel, handleOk }) => {
    const { i18Translate } = useLanguage();
    const { iIsCreateNewCartTip, iAddCurrentCart, iAddNewCart, } = useI18();
    const iCartPrompt = i18Translate('i18MyCart.Cart Prompt', 'Cart Prompt')
    return <MinModalTip
        isShowTipModal={true}
        width={550}
        tipTitle={iCartPrompt}
        tipText={iIsCreateNewCartTip}
        cancelText={iAddCurrentCart}
        submitText={iAddNewCart}
        onCancel={() => cancel()}
        handleOk={() => { handleOk ? handleOk() : null}} 
    />
}

export default EmialQuoteCartPromptCom