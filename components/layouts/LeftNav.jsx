import { nanoid } from 'nanoid';
import { Link as ScrollLink, Element } from 'react-scroll';

// 左侧导航公共组件
const LeftNav = ({
    current= '',
    leftNavTitle="Nav",
    leftNavList=[],
    clickCurItem,
}) => {
    const leftNavListElm = leftNavList?.map(item => (
        <h2
            // className={(current === item.id ? 'menu-item-has-children-current' : '') + ' menu-item-has-children'}
            className='menu-item-has-children'
            key={nanoid()}
            // onClick={() => handleCurrentChoose('nav' + item.id)}
        >
            
             {
                <ScrollLink
                    to={'nav' + item?.id} 
                    // to={'nav' + item.id} 
                    spy={true}
                    offset={-84}
                    duration={0}
                    activeClass="menu-item-has-children-current menu-item-has-children"
                    className={(current === item.id ? 'menu-item-has-children-current' : '')}
                    onClick={(e) => clickCurItem(e, item)}
                    // style={{display: (allCatalogsIds.find(i => i?.id == item?.id) || searchKeywordArr?.length === 0) ? '' : 'none'}}
                >
                    {item?.name}
                </ScrollLink>
            }
        </h2>
    ));

    return (
        <div className="pub-layout-left catalogs__top-fixed">
            <div className='layout-left-nav'>
                {
                    leftNavTitle && <div className='layout-left-header'>
                        <h2 className='mb5 pub-left-title'>{leftNavTitle}</h2>
                    </div>
                }

                <div className='layout-left-content'>
                    <div className="layout-menu-box">
                        {leftNavListElm}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftNav  