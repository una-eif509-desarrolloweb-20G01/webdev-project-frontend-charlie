import React from "react";
import { List, Card } from 'antd';
import {
    ClockCircleFilled,
    CopyFilled,
    PartitionOutlined
} from '@ant-design/icons';
import './Home.css';

const data = [
    {
        title: 'Department Management',
        content: "In this page you can manage departments information",
        icon: <PartitionOutlined/>,
        url: "/department"
    },
    {
        title: 'Add timesheets',
        content: "In this page you can add, delete and see timesheet details",
        icon: <CopyFilled />,
        url: "timeSheet"
    },
    {
        title: 'Timesheet Management',
        content: "In this page you can manage timesheets information",
        icon: <CopyFilled />,
        url: "/timesheetManagement"
    },
    {
        title: 'Add hours',
        content: "In this page you can add hours to a specific timesheet",
        icon: <ClockCircleFilled/>,
        url: "/hours"
    },
];

class Home extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)
        this.state = {
            user: JSON.parse(localStorage.getItem("user"))
        }
    }

    render() {

        /** General Methods **/
        return (
            <div style={{ width: "100%" }}>
                <h1>Welcome, {this.state.user.firstName + " " + this.state.user.lastName}</h1>
                <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <Card onClick={()=>{
                                this.props.history.push(item.url)
                            }} hoverable title={<div>{item.icon} {item.title}</div>}>{item.content}</Card>
                        </List.Item>
                    )}
                />

            </div>
        )
    }

};

export default Home;