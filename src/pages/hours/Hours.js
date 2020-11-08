import React from "react";
import { Form, Button, Slider, Input, Select, Alert } from 'antd';
import DepartmentService from "../../services/department.service";
import TimeSheetService from "../../services/timesheet.service";
import TimeRecordService from "../../services/timerecord.service";
import './Hours.css';
const { Option } = Select;
const layout = {
    labelCol: {
        span: 5
    },
    wrapperCol: {
        span: 20
    }
};

const tailLayout = {
    labelCol: {
        span: 5
    },
    wrapperCol: {
        offset: 5
    }
};
class Hours extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)
        this.state = {
            departments: [],
            timeSheets: [],
            error: -1,
            timeRecord: {
                mondayHours: 0,
                tuesdayHours: 0,
                wednesdayHours: 0,
                thursdayHours: 0,
                fridayHours: 0,
                saturdayHours: 0,
                sundayHours: 0,
                departmentId: null,
                timesheetId: null,
                isApproved: false,
                isPaid: false,
                user: {
                    idUser: JSON.parse(localStorage.getItem("user")).idUser
                }
            }
        }
        this.getAllDeparments()
        this.getAlltimeSheets()
    }

    getAllDeparments() {
        DepartmentService.getAll().then(data => {
            var array = []
            array.push(...data.data);
            this.setState({ departments: array })
        })

    }
    getAlltimeSheets() {
        TimeSheetService.getAll().then(data => {
            var array = []
            array.push(...data.data);
            this.setState({ timeSheets: array })
        })

    }
    listDepartmentOptions(data) {
        var array = []

        data.forEach(element => {
            array.push(<Option key={element.id}>{element.nombre}</Option>)
        });

        return array;
    }

    listTimeSheetsOptions(data) {
        var array = []

        data.forEach(element => {
            array.push(<Option key={element.id}>{element.name}</Option>)
        });

        return array;
    }
    render() {

        /** General Methods **/

        const onFinish = data => {
            let idUser = JSON.parse(localStorage.getItem("user")).idUser;
            this.setState({ timeRecord: { user: { idUser }, ...data, isApproved: false, isPaid: false } }, () => {
                console.log(this.state.timeRecord)
                TimeRecordService.create(this.state.timeRecord)
                    .then(response => {
                        this.setState({ timeRecord: response.data });
                        this.formRef.current.resetFields();
                        this.setState({ error: 0 });
                    })
                    .catch(err => {
                        console.log(err);
                        this.setState({ error: 1 })
                    });
            })

        };

        const onAlertClose = () => {
            this.setState({ error: -1 })
        }

        const onReset = () => {
            this.setState({ timeRecord: this.state.timeRecord })
            this.formRef.current.resetFields();
        };
        const onDepartmentChange = (value) => {
            this.setState({ ...this.state, timeRecord: { departmentId: value } })
        };
        const onTimeSheetChange = (value) => {
            this.setState({ ...this.state, timeRecord: { timesheetId: value } })
        };

        const alerta = (type) => {
            switch (type) {
                case "success":
                    return <Alert message="Hours saved" type="success" showIcon closable onClose={onAlertClose} />
                default:
                    return <Alert message="Error in the system. Try again later." type="error" showIcon closable onClose={onAlertClose} />
            }
        }
        return (
            <div style={{ width: "100%", maxWidth: 500 }}>
                <h1>Add hours</h1>
                <Form {...layout} labelAlign="left" ref={this.formRef} name="control-hooks" onFinish={onFinish}>
                    <Form.Item
                        name="timesheetId"
                        label="Timesheet"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select a timesheet"
                            onChange={onTimeSheetChange}
                            allowClear={true}
                        >
                            {this.listTimeSheetsOptions(this.state.timeSheets)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="departmentId"
                        label="Department"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select a department"
                            onChange={onDepartmentChange}
                            allowClear={true}
                        >
                            {this.listDepartmentOptions(this.state.departments)}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="mondayHours"
                        label="Monday"
                        initialValue={0}>
                        <Slider max={8} min={0} marks={[0, 1, 2, 3, 4, 5, 6, 7, 8]} />
                    </Form.Item>

                    <Form.Item
                        name="tuesdayHours"
                        label="Tuesday"
                        initialValue={0}>
                        <Slider max={8} min={0} marks={[0, 1, 2, 3, 4, 5, 6, 7, 8]} />
                    </Form.Item>

                    <Form.Item
                        name="wednesdayHours"
                        label="Wednesday"
                        initialValue={0}>
                        <Slider max={8} min={0} marks={[0, 1, 2, 3, 4, 5, 6, 7, 8]} />
                    </Form.Item>

                    <Form.Item
                        name="thursdayHours"
                        label="Thursday"
                        initialValue={0}>
                        <Slider max={8} min={0} marks={[0, 1, 2, 3, 4, 5, 6, 7, 8]} />
                    </Form.Item>

                    <Form.Item
                        name="fridayHours"
                        label="Friday"
                        initialValue={0}>
                        <Slider max={8} min={0} marks={[0, 1, 2, 3, 4, 5, 6, 7, 8]} />
                    </Form.Item>

                    <Form.Item
                        name="saturdayHours"
                        label="Saturday"
                        initialValue={0}>
                        <Slider max={8} min={0} marks={[0, 1, 2, 3, 4, 5, 6, 7, 8]} />
                    </Form.Item>

                    <Form.Item
                        name="sundayHours"
                        label="Sunday"
                        initialValue={0}>
                        <Slider max={8} min={0} marks={[0, 1, 2, 3, 4, 5, 6, 7, 8]} />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" id="submit-btn">
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
                {this.state.error === 0 ? (
                    alerta("success")
                ) : null}
                {this.state.error === 1 ? (
                    alerta("error")
                ) : null}
            </div>
        )
    }

};

export default Hours;