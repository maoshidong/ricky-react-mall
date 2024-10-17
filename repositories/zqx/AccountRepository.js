import Repository, { backendServerUrl, getAuthorizeRequest, postAuthorizeRequest } from '../Repository';
// 多语言-检查完了
class AccountRepsitory {
    // billing_address/list_my_address
    // billing_address/add
    //  billing_address/update
    
    // delivery_address/list_my_address
    // delivery_address/add
    // delivery_address/update
    // 这是以前的接口-现在也是用这个  
    async handleLogout(data) {
        const responseData = await Repository.post(`${backendServerUrl}/logout`);
    }

    async registerRequest(data) {
        const responseData = await Repository.post(`${backendServerUrl}/user/register`, {
            languageType: 'en', ...data,
        });
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }

    async sendEmailCode(data) {
        const responseData = await Repository.post(`${backendServerUrl}/user/send_code`, {
            languageType: 'en', ...data,
        });
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }

    async CheckSendCode(data) {
        const responseData = await Repository.post(`${backendServerUrl}/user/checkSendCode`, {...data});
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }
    // 找回密码
    async handleForgot(data) {
        const responseData = await Repository.post(`${backendServerUrl}/user/forgot`, {...data});
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }
		// 邮箱被锁定15分钟， 开锁
		async apiLoginOpen(data, accountType=1) {
			const res = await Repository.post(`${backendServerUrl}/user/deleteLogin`, {accountType, ...data});
			if (res && res.status === 200) {
					return res.data;
			}
			return null;
	}
		// 登录前检查账户的状态 密码错误3次以后，显示验证码，输入10次以后，账号锁定30分钟  accountType: 1 
		async apiLoginCheck(data, accountType=1) {
			const res = await Repository.post(`${backendServerUrl}/user/loginCheck`, {accountType, ...data});
			if (res && res.status === 200) {
					return res.data;
			}
			return null;
	}
    // (账号密码登录： 默认1,   accountType: 1 账号登录 2.第三方登录)
    async loginRequest(data) {
        const responseData = await Repository.post(`${backendServerUrl}/user/login`, {...data, accountType: 1});
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }



    async anonymousAuth(data) {
        const responseData = await getAuthorizeRequest(`${backendServerUrl}/user/anonymousAuth`);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }
    // 验证匿名登录
    async checkAnonymousAuth(token) {
        const responseData = await postAuthorizeRequest(`${backendServerUrl}/user/checkIsAnonymous`, {}, token);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }
    // 第三方登录
    async checkOtherLogin(data) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/user/otherLogin`, data);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }
    // 保存用户信息
    async getProfile(token) {
        const responseData = await getAuthorizeRequest(`${backendServerUrl}/user/profile`, token);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }

    async updateProfile(data, token) {
        const responseData = await postAuthorizeRequest(`${backendServerUrl}/user/profile`, data, token);
        if (responseData && responseData.status === 200) {
            return true;
        }
        return null;
    }

    // 配送地址列表
    async getAddresses(token, languageType="en") {
        const responseData = await getAuthorizeRequest(`${backendServerUrl}/delivery_address/list_my_address?languageType=${languageType}`, token);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }

    async saveOrUpdateAddress(data, token) {
        let url = `${backendServerUrl}/delivery_address/add`;
        if (data.id) {
            url = `${backendServerUrl}/delivery_address/update`;
        }
        const responseData = await postAuthorizeRequest(url, data, token);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }
    // 删除配送地址
    async deliveryAddressDel(ids, token) {
        let url = `${backendServerUrl}/delivery_address/delete`;
        const responseData = await postAuthorizeRequest(url, {ids}, token);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }

    // /userDeliveryInfo/add
    // ​/userDeliveryInfo​/delete删除邮递账号
    // /userDeliveryInfo/update
    // 查询邮递账号列表
    async getAdd(token) {
        const responseData = await getAuthorizeRequest(`${backendServerUrl}/userDeliveryInfo/list`, token);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }


    // bill地址
    async getBillingAddresses(token, languageType="en") {
        const responseData = await getAuthorizeRequest(`${backendServerUrl}/billing_address/list_my_address?languageType=${languageType}`, token);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }
    // 优惠券列表
    async getCoupon(data, token) {
        let url = `${backendServerUrl}/coupon/list?type=`+data.type+`&pageSize=`+data.pageSize+`&pageNum=`+data.pageNum;
        const responseData = await getAuthorizeRequest(url,token);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }
    // 添加账单地址
    async saveOrUpdateBillingAddress(data, token) {
        let url = `${backendServerUrl}/billing_address/add`;
        if (data.id) {
            url = `${backendServerUrl}/billing_address/update`;
        }
        const responseData = await postAuthorizeRequest(url, data, token);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }
    // 删除账单地址
    async billingAddressDel(ids, token) {
        let url = `${backendServerUrl}/billing_address/delete`;
        const responseData = await postAuthorizeRequest(url, {ids}, token);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }

    async saveOrUpdateAddress(data, token) {
        let url = `${backendServerUrl}/delivery_address/add`;
        if (data.id) {
            url = `${backendServerUrl}/delivery_address/update`;
        }
        const responseData = await postAuthorizeRequest(url, data, token);
        if (responseData && responseData.status === 200) {
            return responseData.data;
        }
        return null;
    }

    // vat列表
    async getVatNumberList(token) {
        const res = await getAuthorizeRequest(`${backendServerUrl}/userVat/list`, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }   

    // 添加
    async addVatNumber(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/userVat/add`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }   
    // 删除
    async delVatNumber(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/userVat/delete`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }   
    // 修改
    async updateVatNumber(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/userVat/update`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }


    // Delivery列表
    async getDeliveryList(token) {
        const res = await getAuthorizeRequest(`${backendServerUrl}/userDeliveryInfo/list`, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }   

    // 添加
    async addDelivery(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/userDeliveryInfo/add`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }   
    // 删除
    async delDelivery(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/userDeliveryInfo/delete`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }   
    // 修改
    async updateDelivery(data, token) {
        const res = await postAuthorizeRequest(`${backendServerUrl}/userDeliveryInfo/update`, data, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }   

    // ip访客
    async apiUserCheckIpCountry(token) {
        const res = await getAuthorizeRequest(`${backendServerUrl}/user/checkIpCountry`, token);
        if (res && res.status === 200) {
            return res.data;
        }
        return null;
    }   

}

export default new AccountRepsitory();
