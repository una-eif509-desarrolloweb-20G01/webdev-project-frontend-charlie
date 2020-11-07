import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
    ClockCircleFilled,
    LogoutOutlined,
    HomeFilled,
    CopyFilled,
    LoginOutlined,
    EditFilled,
    SettingOutlined,
    PartitionOutlined
} from '@ant-design/icons';
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
import User from "./pages/user/User";
import TimeSheetManagement from "./pages/timesheet_managment/TimeSheetManagement";

const { SubMenu } = Menu;
function App() {
    const { Header, Content, Footer } = Layout;
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(undefined);
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
    const handleClick = e => {
        console.log('click ', e);
        setCurrentPage(e.key);
    };
    return (
        <Router>
            <Layout className="layout">
                <Header>
                    <div className="logo" />

                    {!loggedIn ?

                        <Menu theme="dark" mode="horizontal" onClick={handleClick} selectedKeys={[currentPage]}>

                            <Menu.Item key="Home" icon={<HomeFilled />}>
                                <Link to={"/"} className="nav-link">
                                    Home
                                </Link>
                            </Menu.Item>

                            <Menu.Item key="Sign Up" icon={<EditFilled />}>
                                <Link to={"/signup"} className="nav-link">
                                    Sign up
                                </Link>
                            </Menu.Item>

                            <Menu.Item key="Login" icon={<LoginOutlined />}>
                                <Link to={"/login"} className="nav-link">
                                    Login
                                </Link>
                            </Menu.Item>
                        </Menu>

                        :

                        <Menu theme="dark" mode="horizontal" onClick={handleClick} selectedKeys={[currentPage]}>

                            <Menu.Item key="Home" icon={<HomeFilled />}>
                                <Link to={"/"} className="nav-link">
                                    Home
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="Time Sheet" icon={<CopyFilled />}>
                                <Link to={"/timeSheet"} className="nav-link">
                                    Time Sheet
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="Hours" icon={<ClockCircleFilled />}>
                                <Link to={"/hours"} className="nav-link">
                                    Hours
                                </Link>
                            </Menu.Item>
                            <SubMenu key="SubMenu" icon={<SettingOutlined />} title="Management">
                                <Menu.Item key="Time Sheet Managment" icon={<CopyFilled />}>
                                    <Link to={"/timesheetManagement"} className="nav-link">
                                        Time Sheet Management
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="Department" icon={<PartitionOutlined />}>
                                    <Link to={"/department"} className="nav-link">
                                        Department
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                            
                            <Menu.Item key="Logout" icon={<LogoutOutlined />}>
                                <Link to={"/logout"} className="nav-link" onClick={logOut}>
                                    Log out
                                </Link>
                            </Menu.Item>
                        </Menu>
                    }

                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>{currentPage}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-content">
                        <Switch>
                            <Route exact path={["/", "/home"]} component={Home} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/timesheet" component={TimeSheet} />
                            <Route exact path="/timesheetManagement" component={TimeSheetManagement} />
                            <Route exact path="/signup" component={Signup} />
                            <Route exact path="/department" component={Department} />
                            <Route exact path="/hours" component={Hours} />
                            <Route exact path="/timeSheetDetails/:id" component={TimeSheetDetails} />
                            <Route exact path="/users" component={User} />
                        </Switch>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2020 Created by Charlie Team</Footer>
            </Layout>
        </Router>
    );
}

export default App;