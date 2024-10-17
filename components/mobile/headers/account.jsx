import { Popover,Button } from "antd-mobile"
import { useRouter } from 'next/router'
import { connect } from 'react-redux';
import { LOGIN, REGISTER } from '~/utilities/sites-url'

const LoginAndLogout = ({auth}) => {
    const router = useRouter()

    return <div className="m-account">
        <div onClick={() => {
            router.push('/account/user-information')
        }}>Personal Details</div>
        <div onClick={() => {
            router.push('/account/orders')
        }}>My Orders</div>
        <div onClick={() => {
            router.push('/account/quote-history')
        }}>Inquiry & quotation</div>
        <div onClick={() => {
            router.push('/account/inventory-solutions')
        }}>Value-added services</div>

        {
            auth.isLoggedIn 
            ? <Button className="btn" block>Logout</Button>
            : <>
                <Button className="btn" color="primary" block onClick={() => {
                    router.push(LOGIN)
                }}>Login</Button>
                <Button className="btn" block onClick={() => {
                    router.push(REGISTER)
                }}>Register</Button>
            </>
        }
        
    </div>
}

const Account = ({children,auth}) => {
    return <Popover 
        placement="bottom-center"
        trigger='click'
        content={<LoginAndLogout auth={auth} />}
    >
        {children}
    </Popover>
}

export default connect((state) => state)(Account)