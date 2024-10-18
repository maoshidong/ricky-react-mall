import React from 'react';
import PageContainer from '~/components/layouts/PageContainer';

import { changeServerSideLanguage } from '~/utilities/easy-helpers';   

// 检查，不需要就删除
const PaymentFailurePage = ({ paramMap }) => {
   
    return (
            <PageContainer paramMap={paramMap}>          
                <div style={{textAlign:'center',padding:'50px 0'}}>  
                    <img style={{display:'inline-block',height:'60px',width:'60px'}} src="/static/img/icons/expired.png" alt="" />
                    <p style={{fontSize:'16px',fontWeight:'600',marginTop:'20px'}}>Payment Failure</p>  
                    <p>Due to the long time no response, this payment has been invalid. Please return to the merchant's website and place a new order.</p> 
                </div>            
            </PageContainer> 
    );
};

export default PaymentFailurePage;

export async function getServerSideProps({ req }) {
    const translations = await changeServerSideLanguage(req)

    return {
        props: {
            ...translations,
        }
    }
}