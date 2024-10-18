// export const config = { amp: 'hybrid' }; // 启用hybrid模式
import { useAmp } from 'next/amp';
// import { useContext } from 'react';

const AmpImageCom = ({ src, title, alt, width, height, layout="responsive", ...rest }) => {
  const isAmp = useAmp(); // 使用useAmp钩子来判断是否为AMP版本

  if (!isAmp) {
    // AMP 标签： 在使用 amp-img 组件时，必须确保在页面的头部正确引入 AMP 的 <script async src="https://cdn.ampproject.org/v0.js"></script> 标签，以及 <meta charset="utf-8"> 和 <meta name="viewport" content="width=device-width,minimum-scale=1"> 标签。 ？？？
    // 如果是AMP版本，则渲染<amp-img>元素, 页面组件不是指hybrid, 子组件不生效
    return (
      <amp-img
        src={src}
        title={title}
        alt={alt}
        width={width}
        height={height}
        layout={layout}
        // style={{width: '64px', height: '64px'}}  
        {...rest}
      />
    );
  } else {
    // 如果不是AMP版本，则渲染普通的<img>元素
    return <img src={src} alt={alt} width={width} height={height} {...rest} />;
  }
};

export default AmpImageCom;
export const config = { amp: 'hybrid' } // 'hybrid'