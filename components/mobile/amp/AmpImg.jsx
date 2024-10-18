export const config = { amp: 'hybrid' }; // 启用hybrid模式
import { useAmp } from 'next/amp';

const AmpImageCom = ({ src, title, alt, width, height, layout="responsive", ...rest }) => {
  const isAmp = useAmp(); // 使用useAmp钩子来判断是否为AMP版本

  if (isAmp) {
    // 如果是AMP版本，则渲染<amp-img>元素
    return (
      <amp-img
        src={src}
        title={title}
        alt={alt}
        width={width}
        height={height}
        layout={layout}
        {...rest}
      />
    );
  } else {
    // 如果不是AMP版本，则渲染普通的<img>元素
    return <img src={src} alt={alt} width={width} height={height} {...rest} />;
  }
};

export default AmpImageCom;