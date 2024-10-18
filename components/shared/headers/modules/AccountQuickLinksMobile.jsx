import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';
import { logOut } from '../../../../store/auth/action';
import { Dropdown, Menu } from 'antd';
// 检查，不需要就删除
class AccountQuickLinks extends Component {
    constructor(props) {
        super(props);
    }

    handleLogout = e => {
        e.preventDefault();
        this.props.dispatch(logOut());
        Router.push('/')
    };

    render() {
        const { accountProps } = this.props;
        const { logout, accountActions } = accountProps;

        const menu = (
            <Menu>
                {accountActions.map(link => (
                    <Menu.Item key={link.href}>
                        <Link href={link.href}>
                            <a>{link.label}</a>
                        </Link>
                    </Menu.Item>
                ))}

                <Menu.Item>
                    <a href="#" onClick={this.handleLogout.bind(this)}>
                        {logout.label}
                    </a>
                </Menu.Item>
            </Menu>
        );

        return (
            <Dropdown dropdownRender={menu} placement="bottomLeft">
                <div>
                    <a href="#" className="header__extra ps-user--mobile">
                        <i className="icon-user"></i>
                    </a>
                </div>
            </Dropdown>
        );
    }
}
const mapStateToProps = state => {
    return state;
};
export default connect(mapStateToProps)(AccountQuickLinks);
