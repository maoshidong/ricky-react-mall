import LazyLoad from 'react-lazyload';
import useLanguage from '~/hooks/useLanguage';

const textOne =
	"Looking to move your surplus or excess inventory of electronic components? We're interested. We buy surplus or excess inventory, whether it is a truckload or a small box, we're always ready to help you reclaim your warehouse space while realizing the best recovery possible, in cash, from surplus.";
const textTwo =
	"If you're considering selling excess or surplus inventory, just phone, fax or email us with your surplus of electronic components, and we will contact you with our best cash offer the same day.";
const textThree = "If you don't have proper count or no time to count inventory, we will come to see inventory & give you offer on the spot. You will save lot of time, space & money by selling your surplus to us Guaranteed!"
const textFive = "Notice: We buy only brand new and original parts."


const InventorySolutionsCom = ({ paramMap }) => {
    const { i18Translate, curLanguageCodeEn } = useLanguage();
    const iInventorySolutions = i18Translate('i18MenuText.Inventory Solutions', 'Inventory Solutions')
    const iInventoryDes = i18Translate('i18Ueditor.InventoryDes', "Looking to move your surplus or excess inventory of electronic components? We're interested. We buy surplus or excess inventory, whether it is a truckload or a small box, we're always ready to help you reclaim yourwarehouse space while realizing the best recovery possible, in cash, from surplus.")
    const iContactUsMore = i18Translate('i18CareersPage.ContactUsMore', "Contact us for more info at")

    return (
        <div className='account-inventory-solutions'>
            <div className="ps-section--account-setting pub-border15 box-shadow" style={{paddingBottom: '50px'}}>
                <div className='mb7 pub-left-title'>{iInventorySolutions}</div>
                <div className="pub-flex account-inventory-content mb15">

                            <div className='pub-color555 pub-lh18'>
                                {
                                    !curLanguageCodeEn() && <div className='pub-color555 pub-lh18 vue-ueditor-wrap' dangerouslySetInnerHTML={{ __html: iInventoryDes }}></div>
                                }
                                {
                                    curLanguageCodeEn() && <>
                                        <div className='mb10'>{textOne}</div>
                                        <div className='mb10'>{textTwo}</div>
                                        <div className='mb10'>{textThree}</div>
                                        <div className='mb10'>{textFive}</div>
                                    </>
                                }
                                
                                <div className='mb10'>{iContactUsMore}
                                    <a className='pub-color-link' href={`mailto:${paramMap?.excessEmail || 'excess@origin-ic.net'}`}> {paramMap?.excessEmail || 'excess@origin-ic.net'}</a>
                                </div>
                            </div>
                      
                     
                        <div className='inventory-img pub-flex-shrink ml50'>
                            <LazyLoad>
                                <img src={"/static/img/users/inventory.png"} />
                            </LazyLoad>
                        </div>
                        
                    
                </div>
            </div>
        </div>
    )
}

export default InventorySolutionsCom;