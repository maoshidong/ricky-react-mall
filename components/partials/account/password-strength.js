// import Password from 'antd/lib/input/Password';
import React, { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';
// import { Tag, Icon } from 'antd' 
import {
    // CheckOutlined,
    // CheckCircleOutlined,
    // ClockCircleOutlined,
    // CloseCircleOutlined,
    // ExclamationCircleOutlined,
    // MinusCircleOutlined,
    // SyncOutlined,
    CheckCircleTwoTone
  } from '@ant-design/icons';
import useLanguage from '~/hooks/useLanguage';

const PasswordStrength = ({password, passwordChange}) => {
    const { i18Translate } = useLanguage();
    const iWeak = i18Translate('i18Login.Weak', 'Weak')
    const iMedium = i18Translate('i18Login.Medium', 'Medium')
    const iStrong = i18Translate('i18Login.strong', 'strong')
    const iPasswordRequire1 = i18Translate('i18Login.PasswordRequire1', '8 to 20 characters')
    const iPasswordRequire2 = i18Translate('i18Login.PasswordRequire2', 'Containing lowercase letters, and numbers')
    

    const [strength, setStrength] = useState(0);
    const [strengthClass, setStrengthClass] = useState('');
    const [validate, setValidate] = useState(false)
    // 验证密码的长度是否合规
    const validatePasswordCharacters = password => {
        const passwordRegex = /^.{8,20}$/;
        return passwordRegex.test(password);
    }
    // 验证密码是否符合规则
    const checkPassword = () =>  {
        // 判断密码是否包含至少一个大写字母、一个小写字母和一个数字
        // const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password.toLowerCase());
        const hasNumber = /\d/.test(password);
      
        return hasLowerCase && hasNumber;
      }
    // 密码强度
    const getIconState = () => {
        if(!password) {
            return <div className="check-icon" />
        } else {
            if(validatePasswordCharacters(password)) {
                return <CheckCircleTwoTone twoToneColor="#52c41a" /> // 52c41a 47922A
                // return <CheckOutlined className="check-icon check-icon-suc" />
            } else {
                return <div className='check-icon check-icon-err'>x</div>
                // return <CheckOutlined className="check-icon check-icon-err" />
            }
        }
    }
    // 密码状态对应的icon
    const getIconStateNum = () => {
        if(!password) {
            return <div className="check-icon" />
        } else {
            if(checkPassword(password)) {
                return <CheckCircleTwoTone twoToneColor="#52c41a" />
            } else {
                return <div className='check-icon check-icon-err'>x</div>
            }
        }
    }
    
    useEffect(() => {

        if(validatePasswordCharacters(password) && checkPassword(password)) {
            passwordChange(true)
            setValidate(true)
        } else {
            passwordChange(false)
            setValidate(false)
        }

        const passwordLength = password.length;
        setStrength(zxcvbn(password).score);
        setStrengthClass(['strength-meter mt-2', passwordLength > 0 ? 'visible' : ''].join(' ').trim());
    }, [password]);

    return (
        <div className='password-strength'>
            <div className='password-strength-top'>
                {/* <div className={strengthClass}>
                    <div className="strength-meter-fill" data-strength={strength}></div>
                </div> */}
                <div className='strength-meter-box'>
                    <div className='strength-meter-item active'></div>
                    <div className={'strength-meter-item ' + (strength >= 2 ? 'active' : '')}></div>
                    <div className={'strength-meter-item ' + (strength >= 3 ? 'active' : '')}></div>
                </div>
                <span className='strength-text'>{strength == 1 ? iWeak : (strength == 2 ? iMedium : iStrong)}</span>
            </div>
            <div className='strength-rule'>
                {getIconState()}
                <div className='strength-t'>{iPasswordRequire1}</div>
            </div>
            <div className='strength-rule numbers'>
                {getIconStateNum()}
                {/* uppercase letters,  */}
                <div className='strength-t'>{iPasswordRequire2}</div>
            </div>
        </div>
    )
}

export default PasswordStrength;