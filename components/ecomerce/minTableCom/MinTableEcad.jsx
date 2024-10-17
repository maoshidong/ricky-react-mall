const MinTableEcad = ({ record }) => {
    return (
        <div className='ps-product__meta_ECAD pub-flex mt3'>
            <span className='iconfont sprite-icon2-6-3 mr10'></span>
            <span className='pub-lh16'>{record?.ECAD||'PCB Symbol, Footprint & 3D Model'}</span>
        </div>
    )
}

export default MinTableEcad