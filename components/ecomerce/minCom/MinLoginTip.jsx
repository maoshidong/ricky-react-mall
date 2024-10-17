import { connect } from 'react-redux'
import MinLoginRegister from '~/components/ecomerce/minCom/MinLoginRegister'

// 登录提示
const MinLoginTip = ({ auth, tipText, routerPath = '/', className = 'mt20 mb10', email }) => {
	const { isAccountLog } = auth

	if (isAccountLog) return null
	return (
		<>
			{/* 登录提示 */}
			{!isAccountLog && <div className={`pub-flex-align-center ps-quote-tip ${className}`}>
				<div>
					<span className='mr10 sprite-icon4-cart sprite-icon4-cart-6-3' style={{ verticalAlign: 'sub' }}></span>
					<MinLoginRegister routerPath={routerPath} />
					{tipText}
					{
						email && <a
							className="pub-color-link"
							href={`mailto:${email || process.env.email}`}>
							&nbsp;{email || process.env.email}
						</a>
					}
				</div>
				{/* <span> {tipText}</span> */}
			</div>
			}
		</>
	)
}

export default connect(state => state)(MinLoginTip)