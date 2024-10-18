import LazyLoad from 'react-lazyload';
import { Image } from 'antd'

// 新闻没封面图时的默认图片(目前只在博客使用)
const DefaultImg = ({ title, coverImage, contentImageStatus }) => {
    const srcImg = coverImage || (contentImageStatus ? "https://oss.origin-ic.net/otherFile/bog.jpg" : '')
    if (!srcImg) return null

    return <LazyLoad>
        <div className='pub-object-fit-contain w200' style={{float:'right'}}>
            <Image
                style={{ float: 'right' }}
                preview={true}
                width={200}
                alt={'Image of ' + title} title={title}
                src={coverImage || "https://oss.origin-ic.net/otherFile/bog.jpg"}
            />
        </div>
    </LazyLoad>
}

export default DefaultImg