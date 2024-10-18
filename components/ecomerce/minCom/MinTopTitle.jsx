// 公共的左侧标题
const MinTopTitleCom = ({ className='sprite-icon4-cart sprite-icon4-cart-3-3', text, children }) => {

    // { className='sprite-icon4-cart sprite-icon4-cart-3-3', text, children }
    return (
        <div>
            <div className='pub-top-label mt15'>
                <div className='pub-top-label-left'>
                    <div className={className}></div>
                    <div className='pub-top-label-left-name ml10'>{children}</div>
                </div>
            </div>
        </div>
    )
}

export default MinTopTitleCom