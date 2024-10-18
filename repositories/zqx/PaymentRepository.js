import { backendServerUrl, postAuthorizeRequest } from '../Repository';
// 多语言-检查完了
class PaymentRepository {
    // 提交支付 flag为从管理端或者邮箱调整的url, flag为true则重新获取payId isEmailFlag:1 不登录也可以调起支付 - 如果没有成功调用就不要跳转下一页
    async requestPayment(data, token) {
        const responseData = await postAuthorizeRequest(`${backendServerUrl}/pay/submitPay`,data,token);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }
}

export default new PaymentRepository();
