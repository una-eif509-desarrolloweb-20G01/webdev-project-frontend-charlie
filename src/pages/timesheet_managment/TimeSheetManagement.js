import React from "react";
import TimeSheetService from "../../services/timesheet.service";
import DepartmentService from "../../services/department.service";
import { Descriptions, Button, Select, Table, Divider, Checkbox } from 'antd';
import './TimeSheetManagement.css';
const { Option } = Select;

class TimeSheetManagement extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)
        this.state = {
            departments: [],
            timeSheets: [],
            error: -1,
            user: this.getCurrentUser(),
            list: [{ id: "1", name: "Juan Perez", week: 54 }, { id: "2", name: "Pancho Villa", week: 54 }, { id: "1", name: "Meneco Menequin", week: 54 }]
        }
        this.getAlltimeSheets()
        this.getAllDeparments()
    }
    getAlltimeSheets() {
        TimeSheetService.getAll().then(data => {
            var array = []
            array.push(...data.data);
            this.setState({ timeSheets: array })
            console.log(this.state.timeSheets)
        })

    }
    getAllDeparments() {
        DepartmentService.getAll().then(data => {
            var array = []
            array.push(...data.data);
            this.setState({ departments: array })
            console.log(this.state.departments)
        })

    }
    listDepartmentOptions(data) {
        var array = []

        data.forEach(element => {
            array.push(<Option key={element.id}>{element.nombre}</Option>)
        });

        return array;
    }

    getCurrentUser = () => {
        return JSON.parse(localStorage.getItem("user.data"));
    };
    listTimeSheetsOptions(data) {
        var array = []

        data.forEach(element => {
            array.push(<Option key={element.id}>{element.name}</Option>)
        });

        return array;
    }

    render() {

        /** General Methods **/
        const onDepartmentChange = (value) => {
            this.setState({ ...this.state, timeRecord: { departmentId: value } })
        };
        const onTimeSheetChange = (value) => {
            this.setState({ ...this.state, timeRecord: { timesheetId: value } })
        };
        const columns = [
            {
                title: 'Employee',
                render: (timesheet) => timesheet.name,
                width: '20%',
            },
            {
                title: 'Week Hours',
                render: (timesheet) => timesheet.week,
                width: '20%',
            },
            {
                title: 'Approve',
                dataIndex: (timesheet) => timesheet.id,
                render: (timesheet, element) => {
                    return <div>
                        <Button style={{ marginRight: 5 }} type="primary">Yes</Button>
                        <Button type="danger">No</Button>
                    </div>
                }

            },
            {
                title: 'Mark Paid',
                dataIndex: (timesheet) => timesheet.id,
                render: (timesheet, element) => {
                    return <div>
                        <Checkbox onChange={() => { }}>Paid</Checkbox>
                    </div>
                }

            }
        ];
        return (
            <div>
                <Descriptions title="Manage time sheets hours" layout="horizontal" bordered>
                    <Descriptions.Item label="User">{this.state.user.firstName + " " + this.state.user.lastName}</Descriptions.Item>
                    <Descriptions.Item label="Role">{this.state.user.roleList[0].name}</Descriptions.Item>
                    <Descriptions.Item label="Department">
                        {this.state.user.department.nombre + ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Time sheet">
                        <Select
                            placeholder="Select a timesheet"
                            onChange={onTimeSheetChange}
                            allowClear={true}
                        >
                            {this.listTimeSheetsOptions(this.state.timeSheets)}
                        </Select>
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left" plain>List of hours by user for this time sheet</Divider>
                <Table rowKey={timeSheets => timeSheets.id} columns={columns} dataSource={this.state.list} />
            </div>
        )
    }
    // columns={columns} 
};

export default TimeSheetManagement;