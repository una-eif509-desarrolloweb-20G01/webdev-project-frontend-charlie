import React from "react";
import { List, Card } from 'antd';
import {
    ClockCircleFilled,
    CopyFilled,
    PartitionOutlined,
    UserOutlined
} from '@ant-design/icons';
import './Home.css';
import AuthService from "../../services/auth.service"
var data = [
    {
        title: 'Department Management',
        content: "In this page you can manage departments information",
        icon: <PartitionOutlined />,
        url: "/department",
        isEnabled: true,
        isPublic: false
    },
    {
        title: 'Timesheet details',
        content: "In this page you can add, delete and see timesheet details",
        icon: <CopyFilled />,
        url: "timeSheet",
        isEnabled: true,
        isPublic: true
    },
    {
        title: 'Timesheet Management',
        content: "In this page you can manage timesheets information",
        icon: <CopyFilled />,
        url: "/timesheetManagement",
        isEnabled: true,
        isPublic: false
    },
    {
        title: 'Add hours',
        content: "In this page you can add hours to a specific timesheet",
        icon: <ClockCircleFilled />,
        url: "/hours",
        isEnabled: true,
        isPublic: true
    },
    {
        title: 'User Management',
        content: "In this page you can manage users.",
        icon: <UserOutlined />,
        url: "/users",
        isEnabled: true,
        isPublic: false
    }
];

class Home extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)

        data.forEach(element => {
            if ( AuthService.isAdminUser() || element.isPublic) {
                element.isEnabled = true;
            } else
                element.isEnabled = false;
        });
        this.state = {
            user: JSON.parse(localStorage.getItem("user"))
        }
        if (!this.state.user)
            props.history.push("/login");
    }



    render() {

        /** General Methods **/
        return (
            <div style={{ width: "100%" }}>
                <h1>Welcome, {this.state.user != undefined ? this.state.user.firstName + " " + this.state.user.lastName : ''}</h1>
                <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <Card className={!item.isEnabled ? "disabled-card" : ""} onClick={() => {
                                if (item.isEnabled)
                                    this.props.history.push(item.url)
                            }} hoverable={item.isEnabled} title={<div>{item.icon} {item.title}</div>}>{item.content}
                            </Card>

                        </List.Item>
                    )}
                />

            </div>
        )
    }

};

export default Home;