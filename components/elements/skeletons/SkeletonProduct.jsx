import React from 'react';
import { Skeleton } from 'antd';
// 检查，不需要就删除
// Skeleton骨架屏 在需要等待加载内容的位置提供一个占位图形组合。
const SkeletonProduct = () => {
    return (
        <div className="ps-skeleton ps-skeleton--product">
            <Skeleton.Input active={true} size={350} style={{height: 160}} />
            <Skeleton paragraph={{ rows: 4, title: true }} />
        </div>
    );
};

export default SkeletonProduct;
