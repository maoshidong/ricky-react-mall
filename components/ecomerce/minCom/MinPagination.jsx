import React from 'react';
import { Pagination } from 'antd';
import { useRouter } from 'next/router';

// 分页组件
// currentUrl: 页面不带参数的url
const CustomPagination = ({
    total=0, pageNum=1, pageSize=20, totalPages=1,
    paginationChange, onShowSizeChange,
    currentUrl, otherUrlParams,
    isItemRender=true, // 是否使用seo分页跳转
    pageSizeOptionsParams,
    curClassName="mt20"
}) => {
    const Router = useRouter();

    const handleHref = (e, href) => {
        e.preventDefault();
        Router.push(href)
    }

    const itemRender = (page, type, originalElement) => {

        // if(page - 5 > Number(pageNum)) {
        //     return null
        // }
        // (page) // 各种类型的num: 如jump-prev 上5页 页码  jump-next 下5页 页码
        // (type)
        // 自定义分页项目渲染
        if (type === 'page' && isItemRender) {
            const href = `${currentUrl}?pageNum=` + page + '&pageSize=' + pageSize + (otherUrlParams ? ('&' + otherUrlParams) : '')
            return <a href={href} onClick={(e) => handleHref(e, href)}>{page}</a>;
        }
        if (type === 'prev' && isItemRender) {
            const href = `${currentUrl}?pageNum=` + (Number(pageNum) - 1 || 1) + '&pageSize=' + pageSize + (otherUrlParams ? ('&' + otherUrlParams) : '')
        return <a href={href} onClick={(e) => handleHref(e, href)}>
                        <svg className='mt5' viewBox="64 64 896 896" focusable="false" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                            <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z">
                            </path>
                        </svg>
             {/* className="ant-pagination-prev" */}
            {/* <li title="Previous Page" aria-disabled="false" tabIndex="0">
                <button className="ant-pagination-item-link" type="button" tabIndex="-1">
                    <span role="img" aria-label="left" className="anticon anticon-left">
                        <svg viewBox="64 64 896 896" focusable="false" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                            <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z">
                            </path>
                        </svg>
                        </span>
                    </button>
            </li> */}
            
            {/* <li title="Previous Page" className="ant-pagination-prev ant-pagination-disabled" aria-disabled="true"><button className="ant-pagination-item-link" type="button" tabIndex="-1" disabled=""><span role="img" aria-label="left" className="anticon anticon-left"><svg viewBox="64 64 896 896" focusable="false" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg></span></button></li> */}
        </a>;
        
        // </Link> <Link href={href}>
        }
        if (type === 'next' && isItemRender) {
            // if((Number(pageNum) + 1) >= totalPages) {

            // }
            const curPageNum = (Number(pageNum) + 1) >= totalPages ? totalPages : (Number(pageNum) + 1)
            const href = `${currentUrl}?pageNum=` + curPageNum + '&pageSize=' + pageSize + (otherUrlParams ? ('&' + otherUrlParams) : '')
        return <a href={href} onClick={(e) => handleHref(e, href)}>
              <svg className='mt5' viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                    </svg>
            {/* className="ant-pagination-next"  */}
            {/* <li title="Next Page" aria-disabled="false" tabIndex="0">
                <button className="ant-pagination-item-link" type="button" tabIndex="-1"><span role="img" aria-label="right" className="anticon anticon-right">
                    <svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                    </svg>
                </span>
                </button>
            </li> */}
        </a>;
        }
        return originalElement; // Previous Next
    };

    const onChange = (pageNumber, pageSize) => {

        if(paginationChange) {        
            paginationChange(pageNumber, pageSize)
        }
    };
    const handleShowSizeChange = (pageNumber, pageSize) => {
        if(onShowSizeChange) {        
            onShowSizeChange(pageNumber, pageSize)
        }
    };
    // showSizeChanger 是否展示 pageSize 切换器，当 total 大于 50 时默认为 true
    // showLessItems 是否显示较少页面内容
    // showTotal	用于显示数据总量和当前数据顺序
    const pageSizeOptions = pageSizeOptionsParams || ['20', '50', '100']; // 可选的每页显示数量
    const total1 = Number(total) > 100 ? (100 + Number(pageNum) * 20) : Number(total)
    // if(Number(total) <= 20) return null
    return (
        // <Pagination
        //     style={{textAlign: 'right'}}
        //     className='mt20' size="small"
        //     total={Number(total)}
        //     // current={Number(pageNum)}
        //     pageSize={Number(pageSize)}
        //     itemRender={itemRender}
        //     showLessItems={false}
        //     showTotal={null}
        //     showQuickJumper={false} // 禁用快速跳转输入框
        //     showSizeChanger={false}
        //     current={10}
        //     onChange={onChange}
        //     pageSizeOptions={pageSizeOptions}
        //     onShowSizeChange={handleShowSizeChange}
        // />
        <Pagination
            style={{textAlign: 'right'}}
            className={curClassName} size="small"
            total={Number(total)}
            current={Number(pageNum)}
            pageSize={Number(pageSize)}
            itemRender={itemRender}
            // simple={true} // 简单分页
            // showLessItems={true} // 是否显示较少页面内容
            showQuickJumper={false} // 禁用快速跳转输入框
            showSizeChanger={false}
            // itemRender={isItemRender ? (value, record, index) => { itemRender } : () => {}}
            // {
            //     ...aaa
            // }
            onChange={onChange}
            pageSizeOptions={pageSizeOptions}
            onShowSizeChange={handleShowSizeChange}
        />
    );
};

export default CustomPagination;