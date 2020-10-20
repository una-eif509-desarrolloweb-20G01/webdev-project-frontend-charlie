import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

import AuthService from "./services/auth.service";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TimeSheet from "./pages/TimeSheets";
import Signup from "./pages/SignUp";

function App() {
    const { Header, Content, Footer } = Layout;
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const logOut = () => {
        AuthService.logout();
    };

    return (
        <Router>
            <Layout className="layout">
                <Header>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <Menu.Item key="1">
                            <Link to={"/login"} className="nav-link">
                                Login
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to={"/signup"} className="nav-link">
                                Sign up
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to={"/logout"} className="nav-link"  onClick={logOut}>
                                    LogOut
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-content">
                        <Switch>
                            <Route exact path={["/", "/home"]} component={Home} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/timesheet" component={TimeSheet} />
                            <Route exact path="/signup" component={Signup} />
                        </Switch>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Router>
    );
}

export default App;