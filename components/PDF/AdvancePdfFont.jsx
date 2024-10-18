import { Page, View, Font } from '@react-pdf/renderer';
// pdf主体提前加载
const AdvancePdfFontCom = () => {

    Font.register(
        {
            family: 'Noto Serif SC',
            src: '/static/fonts/pdfFont.ttf',
            // src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-serif-sc@latest/chinese-simplified-400-normal.ttf', // 请求太慢
        }
    )
        return null
    return <Page>
        <View>111</View>
    </Page>
}

export default AdvancePdfFontCom