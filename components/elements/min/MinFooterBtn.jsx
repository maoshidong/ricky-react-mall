import { Button } from 'antd'
// 检查
const MinFooterBtn = ({ handleCancel, handleSubmit, form }) => {
    const onHandleSubmit = () => {
        if(form) {
            form.submit(); // 提交表单
        } else {
            handleSubmit()
        }
    }
    return (
        <div className='ps-add-cart-footer'>
            <Button
                type="primary" ghost='true'
                className='login-page-login-btn ps-add-cart-footer-btn w150'
                onClick={handleCancel}
            >Cancel</Button>
            <Button
                type="submit" ghost='true'
                className='login-page-login-btn ps-add-cart-footer-btn custom-antd-primary w150'
                onClick={onHandleSubmit}
            >
                Submit
            </Button>
        </div>
    )
}

export default MinFooterBtn