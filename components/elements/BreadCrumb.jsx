import React from 'react';
import Link from 'next/link';
import { ShortShare } from '~/components/elements'
// import styles from "scss/module/_minPage.module.scss";
// 公共面包屑组件
const BreadCrumb = ({ breacrumb, isShowShare=true }) => {
    
    return (
        <div className="ps-breadcrumb">
            <div className='pub-flex-between'>
                <ul className="breadcrumb">
                    {breacrumb.map((item, index) => {
                        if (!item.url) {
                            return <li key={index}>{item.text}</li>;
                        } else if (index == breacrumb.length -1) {
                            return <li key={index}>{item.text}</li>;
                        } else {
                            return (
                                <li key={item.text}>
                                    <Link href={item.url}>
                                        <a>{item.text}</a>
                                    </Link>
                                </li>
                            );
                        }
                    })}
                </ul>
								
								{ isShowShare && <ShortShare /> }
            </div>
        </div>
    );
};

export default BreadCrumb;
