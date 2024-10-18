import React from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// 新闻标题+内容公共组件
const Content = ({ data, showTitle = true }) => {
  return (
    <div className="page-privacy-policy ps-our-team vue-ueditor-wrap">
        <div className="">
            {showTitle &&
            // ps-section__header
                <div className="">
                    <h1 className='title pub-font22'>{data?.title}</h1>
                </div>
            }
            {/* ps-section__content */}
            <div className="ps-section__content help-center-detail" style={{ display: 'block' }}>
              <div className='pub-flex-grow pub-link-a' dangerouslySetInnerHTML={{ __html: data?.content }}></div>
                {/* <ReactMarkdown
                    remarkPlugins={remarkGfm}
                >
                    {data?.content}
                </ReactMarkdown> */}
            </div>
        </div>
    </div>
  );
}

export default Content;
