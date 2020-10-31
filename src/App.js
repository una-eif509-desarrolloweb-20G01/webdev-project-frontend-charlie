import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

import AuthService from "./services/auth.service";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TimeSheet from "./pages/TimeSheets/TimeSheet";
import Signup from "./pages/signup/SignUp";
import Department from "./pages/department/Department";
import TimeSheetDetails from "./pages/TimeSheets/TimeSheetDetails";
import Hours from "./pages/hours/Hours";

function App() {
    const { Header, Content, Footer } = Layout;
    const [currentUser, setCurrentUser] = useState(undefined);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        const logged = AuthService.isLoggedIn();
        setLoggedIn(logged);
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        setLoggedIn(AuthService.isLoggedIn());
    };

    return (
        <Router>
            <Layout className="layout">
                <Header>
                    <div className="logo" />

                    {!loggedIn ?

                        < Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>

                            <Menu.Item key="1">
                                <Link to={"/"} className="nav-link">
                                    Home
                        </Link>
                            </Menu.Item>

                            <Menu.Item key="2">
                                <Link to={"/signup"} className="nav-link">
                                    Sign up
                        </Link>
                            </Menu.Item>

                            <Menu.Item key="3">
                                <Link to={"/login"} className="nav-link">
                                    Login
                        </Link>
                            </Menu.Item>
                        </Menu>

                        :

                        < Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>

                            <Menu.Item key="1">
                                <Link to={"/"} className="nav-link">
                                    Home
                        </Link>
                            </Menu.Item>

                            <Menu.Item key="2">
                                <Link to={"/department"} className="nav-link">
                                    Departamento
                        </Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to={"/timeSheet"} className="nav-link">
                                    Time Sheet
                        </Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Link to={"/hours"} className="nav-link">
                                    Hours
                        </Link>
                            </Menu.Item>
                            <Menu.Item key="5">
                                <Link to={"/logout"} className="nav-link" onClick={logOut}>
                                    Log out
                        </Link>
                            </Menu.Item>
                        </Menu>

                    }

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
                            <Route exact path="/department" component={Department} />
                            <Route exact path="/hours" component={Hours} />
                            <Route exact path="/timeSheetDetails/:id" component={TimeSheetDetails} />
                        </Switch>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2020 Created by Charlie Team</Footer>
            </Layout>
        </Router>
    );
}

export default App;