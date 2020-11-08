import React from "react";
import TimeSheetService from "../../services/timesheet.service";
import DepartmentService from "../../services/department.service";
import { Descriptions, Button, Select, Table, Divider, Modal } from 'antd';
import './TimeSheetManagement.css';
import TimeRecordService from "../../services/timerecord.service";
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
            hours: [],
            modal: {
                modalText: "Modal content",
                modalTitle: "Modal title",
                modalMode: "none", //approve_true, mark_paid_true, mark_paid_false, mark_paid_true, none
                modalVisible: false,
                modalLoading: false,
                modalData: null
            },
            table: {
                loading: false
            },
            currentTimeSheet: null,
            report: {
                averageHours: 0,
                totalHours: 0 ,
                totalNonApproved: 0,
                totalNonPaid: 0
            }
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
        return JSON.parse(localStorage.getItem("user"));
    };
    listTimeSheetsOptions(data) {
        var array = []

        data.forEach(element => {
            array.push(<Option key={element.id}>{element.name}</Option>)
        });

        return array;
    }
    sumTimeSheetHours = (timesheet) => {
        let array = []
        let sum = 0, paidSum = 0, approvedSum = 0;
        let reportSums = {
            averageHours: 0,
            totalHours: 0,
            totalNonApproved: 0,
            totalNonPaid: 0,
            totalRows: 0
                
        }
        const grouped = this.groupBy(timesheet.timeRecordList, record => record.user.username);
        grouped.forEach((entry) => {
            let currentEntryUser = entry.entries().next().value[1].user;
            let timeSheet = {
                id: currentEntryUser.idUser,
                name: currentEntryUser.firstName + " " + currentEntryUser.lastName,
                approvedHours: 0,
                paidHours: 0,
                totalHours: 0
            }
            sum = 0;
            paidSum = 0
            approvedSum = 0

            entry.forEach((element) => {
                sum += element.fridayHours;
                sum += element.mondayHours;
                sum += element.saturdayHours;
                sum += element.sundayHours;
                sum += element.thursdayHours;
                sum += element.tuesdayHours;
                sum += element.wednesdayHours;

                paidSum += element.isPaid ? element.fridayHours : 0;
                paidSum += element.isPaid ? element.mondayHours : 0;
                paidSum += element.isPaid ? element.saturdayHours : 0;
                paidSum += element.isPaid ? element.sundayHours : 0;
                paidSum += element.isPaid ? element.thursdayHours : 0;
                paidSum += element.isPaid ? element.tuesdayHours : 0;
                paidSum += element.isPaid ? element.wednesdayHours : 0;

                approvedSum += element.isApproved ? element.fridayHours : 0;
                approvedSum += element.isApproved ? element.mondayHours : 0;
                approvedSum += element.isApproved ? element.saturdayHours : 0;
                approvedSum += element.isApproved ? element.sundayHours : 0;
                approvedSum += element.isApproved ? element.thursdayHours : 0;
                approvedSum += element.isApproved ? element.tuesdayHours : 0;
                approvedSum += element.isApproved ? element.wednesdayHours : 0;

                reportSums.totalRows++

            })
            timeSheet.totalHours = sum;
            timeSheet.approvedHours = approvedSum;
            timeSheet.paidHours = paidSum;

            reportSums.totalHours += sum;
            reportSums.averageHours += sum;
            reportSums.totalNonApproved += sum - approvedSum;
            reportSums.totalNonPaid += sum - paidSum;
            array.push(timeSheet);

        });
        this.setState({
            report: {
                averageHours: reportSums.totalHours/reportSums.totalRows,
                totalHours: reportSums.totalHours ,
                totalNonApproved: reportSums.totalNonApproved,
                totalNonPaid: reportSums.totalNonPaid
            }
        })
        this.setState({ hours: array }, () => {

        });
    }
    groupBy = (list, keyGetter) => {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    updateTable = (value) => {
        this.setState({ table: { loading: true } }, () => {
            TimeSheetService.getAll().then(data => {
                var array = []
                array.push(...data.data);
                this.setState({ timeSheets: array })
                this.sumTimeSheetHours(this.state.timeSheets.find(x => {
                    return x.id === parseInt(value)
                }))
            })
        })
        this.setState({ table: { loading: false }})
    }
    render() {

        /** General Methods **/
        const onDepartmentChange = (value) => {
            this.setState({ ...this.state, timeRecord: { departmentId: value } })
        };
        const onTimeSheetChange = (value) => {
            this.updateTable(value);
            this.setState({ currentTimeSheet: parseInt(value) })
        };
        const showModal = () => {
            this.setState({ modal: { modalVisible: true } });
        };

        const handleOk = () => {
            this.setState({ modal: { modalText: 'Wait a second while we apply the changes...', modalLoading: true } });
            let timeRecordData = {
                "timesheetId": this.state.currentTimeSheet,
                "user": {
                    "idUser": this.state.modal.modalData.id
                }
            }
            let executeFunction;
            switch (this.state.modal.modalMode) {
                case "approve_true":
                    timeRecordData["isApproved"] = true
                    executeFunction = TimeRecordService.approveByTimeSheet(timeRecordData);
                    break;
                case "approve_false":
                    timeRecordData["isApproved"] = false
                    executeFunction = TimeRecordService.approveByTimeSheet(timeRecordData);
                    break;
                case "mark_paid_true":
                    timeRecordData["isPaid"] = true
                    executeFunction = TimeRecordService.paidByTimeSheet(timeRecordData);
                    break;
                case "mark_paid_false":
                    timeRecordData["isPaid"] = false
                    executeFunction = TimeRecordService.paidByTimeSheet(timeRecordData);
                    break;
                default:
                    break;
            }

            executeFunction.then(response => {
                this.setState({ modal: { modalLoading: false, modalVisible: false } });
                this.updateTable(this.state.currentTimeSheet);
            }).catch(error => {
                this.setState({ modal: { modalLoading: false, modalVisible: false } });
            })

        };

        const handleCancel = () => {
            console.log('Clicked cancel button');
            this.setState({ modal: { modalVisible: false } });
        };
        const columns = [
            {
                title: 'Employee',
                render: (timesheet) => timesheet.name,
                width: '20%',
                sortDirections: ["ascend", "descend"],
                sorter: (a, b) => a.name.length - b.name.length
            },
            {
                title: 'Non approved hours',
                render: (timesheet) => timesheet.totalHours - timesheet.approvedHours,
                width: '20%',
                sortDirections: ["ascend", "descend"],
                sorter: (a, b) => a.approvedHours - b.approvedHours,
            },
            {
                title: 'Non paid hours',
                render: (timesheet) => timesheet.totalHours - timesheet.paidHours,
                width: '20%',
                sortDirections: ["ascend", "descend"],
                sorter: (a, b) => a.paidHours - b.paidHours,
            },
            {
                title: 'Total Hours',
                render: (timesheet) => timesheet.totalHours,
                width: '20%',
                sortDirections: ["ascend", "descend"],
                sorter: (a, b) => a.totalHours - b.totalHours,
            },
            {
                title: 'Approve',
                dataIndex: (timesheet) => timesheet.id,
                render: (timesheet, element) => {
                    return <div>
                        <Button style={{ marginRight: 5 }} type="primary" disabled={!(element.approvedHours < element.totalHours)} onClick={() => {
                            this.setState({
                                modal: {
                                    modalData: element,
                                    modalText: `Do you really want to approve ${element.name}'s hours?`,
                                    modalMode: "approve_true",
                                    modalTitle: "Approve hours",
                                    modalLoading: false,
                                    modalVisible: true
                                }
                            })
                        }}>Yes</Button>
                        <Button type="danger" disabled={element.totalHours - element.approvedHours > element.approvedHours} onClick={() => {
                            this.setState({
                                modal: {
                                    modalData: element,
                                    modalText: `Do you really want to refuse ${element.name}'s hours?`,
                                    modalMode: "approve_false",
                                    modalTitle: "Refuse hours",
                                    modalLoading: false,
                                    modalVisible: true
                                }
                            })
                        }}>No</Button>
                    </div>
                }

            },
            {
                title: 'Mark Paid',
                dataIndex: (timesheet) => timesheet.id,
                render: (timesheet, element) => {
                    return <div>
                        <Button style={{ marginRight: 5 }} type="primary" disabled={!(element.paidHours < element.totalHours)} onClick={() => {
                            this.setState({
                                modal: {
                                    modalData: element,
                                    modalText: `Do you really want to mark paid ${element.name}'s hours?`,
                                    modalMode: "mark_paid_true",
                                    modalTitle: "Mark paid hours",
                                    modalLoading: false,
                                    modalVisible: true
                                }
                            })
                        }}>Yes</Button>
                        <Button type="danger" disabled={element.totalHours - element.paidHours > element.paidHours} onClick={() => {
                            this.setState({
                                modal: {
                                    modalData: element,
                                    modalText: `Do you really want to mark not paid ${element.name}'s hours?`,
                                    modalMode: "mark_paid_false",
                                    modalTitle: "Mark not paid hours",
                                    modalLoading: false,
                                    modalVisible: true
                                }
                            })
                        }}>No</Button>
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
                            allowClear={false}
                        >
                            {this.listTimeSheetsOptions(this.state.timeSheets)}
                        </Select>
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left" plain>List of hours by user for this time sheet</Divider>
                <Table loading={this.state.table.loading} rowKey={timeSheets => timeSheets.id} columns={columns} dataSource={this.state.hours}  footer={() => {
                    return <div>
                        <Descriptions layout="horizontal" bordered size="small" column={5}>
                            <Descriptions.Item label="Average Hours">{this.state.report.averageHours}</Descriptions.Item>
                            <Descriptions.Item label="Total Hours">{this.state.report.totalHours}</Descriptions.Item>
                            <Descriptions.Item label="Total Non Approved">{this.state.report.totalNonApproved}</Descriptions.Item>
                            <Descriptions.Item label="Total Non Paid">{this.state.report.totalNonPaid}</Descriptions.Item>
                            <Descriptions.Item >  <Button type="primary" onClick={()=>{window.print();}} >Generate Report</Button></Descriptions.Item>
                        </Descriptions>
                    </div>
                }}/>

                <Modal
                    title={this.state.modal.modalTitle}
                    visible={this.state.modal.modalVisible}
                    onOk={handleOk}
                    confirmLoading={this.state.modal.modalLoading}
                    onCancel={handleCancel}
                    showSorterTooltip={true}
                >
                    <p>{this.state.modal.modalText}</p>
                </Modal>
            </div>
        )
    }
    // columns={columns} 
};

export default TimeSheetManagement;