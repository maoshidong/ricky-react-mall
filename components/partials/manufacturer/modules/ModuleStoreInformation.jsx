import React from 'react';
import { Button } from 'antd';
// import LazyLoad from 'react-lazyload'; 
import useLanguage from '~/hooks/useLanguage';

// 检查，不需要就删除
const ModuleStoreInformation = ({ manufacturer }) => {    
    const { i18Translate } = useLanguage();

    const { introduce, name, website } = manufacturer || {}
    if (manufacturer) {
        return (
            <div className="pub-border15 ps-block--vendor pr-0">
                <div className="ps-block__container">
                    <div className="ps-block__header">
                        <h1 className='mb10 pub-left-title'>{name}</h1>
                    </div>

                    <div className="ps-block__content pub-color555">
                        <p className='pr-15' style={{
                            maxHeight: '250px',
                            overflow: 'auto'
                        }}>
                            <div dangerouslySetInnerHTML={{ __html: introduce }}></div>
                        </p>
                    </div>
                    {
                        website && (
                            <div className="ps-block__footer pub-flex-center mt20 mb10 pr-20" onClick={() => window.open(website, '_blank')}>
                                <Button type="primary" ghost className='pub-flex-center w150 mt10'>
                                    {i18Translate('i18CatalogHomePage.Our Website', 'Our Website')}
                                </Button>
                            </div>
                        )
                    }

                    {/* <div className="ps-block__footer">
                        <a
                            className="ps-btn ps-btn--fullwidth"
                            href={manufacturer.website}
                            target='_blank'
                        >
                            Goto website
                        </a>
                    </div> */}
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default ModuleStoreInformation;
