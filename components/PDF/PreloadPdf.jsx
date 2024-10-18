import { useEffect, useState, useRef } from 'react';
import { usePDF, Font, Page, Text, View, Document, Image as PDFImage, StyleSheet } from '@react-pdf/renderer';
import PDFComponent from '@/components/PDF/PDFComponent';
// https://react-pdf.org/fonts#registerhyphenationcallback
/**
 * register chinese character
 */
Font.register(
	{
		family: 'Noto Serif SC',
		src: '/static/fonts/pdfFont.ttf',
		// src: 'https://cdn.jsdelivr.net/fontsource/fonts/noto-serif-sc@latest/chinese-simplified-400-normal.ttf', // 请求太慢
	}
)
// pdfFont.ttf 字体加载慢，所以需要预加载 pdfFont.ttf
export const GeneratePDF111 = () => {
    const styles = StyleSheet.create({
        page: {
            padding: 26,
            paddingBottom: 150,
            backgroundColor: '#fff',
            fontFamily: 'Noto Serif SC',
        },
    })
    return <Document>
        <Page size={'A3'} wrap>
            <View style={styles.page}>预加载的pdf</View>
        </Page>
    </Document>
}

export const GeneratePDF = () => {
	const [instance, updateInstance] = usePDF({ document: <GeneratePDF111 /> });
	return null
	return <div>
		<button onClick={() => {
			window.open(instance.url)
		}}>Generate PDF</button>
	</div>
}

// 日期展示判断
// Ship Date: Scheduled date (日期)
// Ship Date: Ship immediately sendDateType：60
// Ship Date: Merge together  sendDateType：61  同时修改所有的DownloadPDF传参等
export const DownloadPDFPreLoad = ({

}) => {
    const [isShow, setIsShow] = useState(false);
    useEffect(() => {
        setIsShow(true)
    }, [])

	return <div>
		{ isShow ? <GeneratePDF /> : null}
        </div>
}
