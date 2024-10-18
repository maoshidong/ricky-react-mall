
import React, { useState, useEffect, useRef } from 'react';

function DynamicCanvas() {
  const canvasRef = useRef(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 设置canvas的初始大小
    const { width, height } = canvas;

    // 绘制画布的初始内容
    function drawCanvas() {
      // 清除画布
      ctx.clearRect(0, 0, width, height);

      // 根据时间绘制动态内容
      // 这里是一个简单的示例，绘制一个随时间移动的圆
      ctx.beginPath();
      ctx.arc(time % width, height / 2, 50, 0, Math.PI * 2);
      ctx.fillStyle = 'blue';
      ctx.fill();

      // 更新时间状态以驱动动画
      setTime((prevTime) => prevTime + 1);

      // 使用requestAnimationFrame进行动画循环
      requestAnimationFrame(drawCanvas);
    }

    // 开始动画
    drawCanvas();

    // 清理函数，在组件卸载时调用
    return () => {
      cancelAnimationFrame(animationFrameId);
    };

    // 初始化动画帧ID
    let animationFrameId = null;

    // 在第一次绘制时设置动画帧ID
    drawCanvas();

    // 需要注意的是，因为requestAnimationFrame是在drawCanvas中调用的，
    // 所以我们不需要在useEffect的返回值中设置animationFrameId，
    // 因为requestAnimationFrame会自动处理动画的停止。
  }, []); // 注意这里的空数组，表示这个effect只会在组件挂载时运行一次

  return (
    <canvas ref={canvasRef} width={500} height={300} />
  );
}

export default DynamicCanvas;// import React, { Component } from 'react';
// // 检查，不需要就删除
// class CanvasComponent extends Component {
//   componentDidMount() {
//     this.canvas = this.refs.canvas;
//     this.ctx = this.canvas.getContext('2d');
//     this.drawCanvas();
//   }

//   componentDidUpdate() {
//     this.drawCanvas();
//   }

//   drawCanvas = () => {
//     const { width, height } = this.props;
//     this.canvas.width = width;
//     this.canvas.height = height;

//     // 绘制一个简单的矩形作为示例
//     this.ctx.fillStyle = '#DDD';
//     this.ctx.fillRect(0, 0, width, height);
//   };

//   render() {
//     return (
//       <canvas ref="canvas" />
//     );
//   }
// }

// CanvasComponent.defaultProps = {
//   width: 300,
//   height: 150
// };

// export default CanvasComponent;