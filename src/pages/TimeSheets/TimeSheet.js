import React, { useState, useEffect } from "react";
/**
 * Components
 */
import { Alert, Table, Tooltip, Button, Divider, Modal, Form, Input } from 'antd';
/**
 * Icons
 */
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';


import TimeSheetService from "../../services/timesheet.service";

const initialPriorityListState = [
  {
    "id": 0,
    "name": "",
    "hours": 0
  }
];
/**
 * Create new time Sheet layout
 */
const layout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 4,
  },
};

/**
 * ************************************************************************
 *                            Time Sheets component
 * ************************************************************************
 * @param {*} props 
 */

const TimeSheet = (props) => {
  const [form] = Form.useForm();
  const [timeSheetList, setTimeSheetList] = useState(initialPriorityListState);
  const [error, setError] = useState(false);
  const [validTimeSheetName, setTimeSheetName] = useState(true);
  const [state, setState] = useState({ "visible": false });
  let timeSheetName = "";
  /**
   * Modal functions
  */
  const showModal = () => {
    setState({
      visible: true,
    });
  };

  const handleOk = e => {
    console.log(e);
    setState({
      visible: false,
    });
  };

  const handleCancel = e => {
    console.log(e);
    setState({
      visible: false,
    });
  };

  useEffect(() => {
    getAllThimeSheetsMethod();
  });


  /**
   * *****************************
   * Create Time Sheets functions
   * *****************************
  */

  const handleInputChange = (event) => {
    timeSheetName = event.target.value;
    timeSheetName.trim().length>5 ? setTimeSheetName(false):setTimeSheetName(true);
  };

  const createTimesheet = () => {
    TimeSheetService.getAll()
      .then(response => {
        sumTimeSheetHours(response);
      })
      .catch(err => {
        console.log(err);
        setError(err)
        if (err.response.status === 401) {
          props.history.push("/login");
          window.location.reload();
        }
      });
  }

  /**
   * *****************************
   * List Time Sheets functions
   * *****************************
  */
  const getAllThimeSheetsMethod = () => {
    TimeSheetService.getAll()
      .then(response => {
        sumTimeSheetHours(response);
      })
      .catch(err => {
        console.log(err);
        setError(err)
        if (err.response.status === 401) {
          props.history.push("/login");
          window.location.reload();
        }
      });
  }


  const timeSheetDetails = (id) => {
    props.history.push(`/timeSheetDetails/${id}`);
  }

  const sumTimeSheetHours = (response) => {
    let array = [];
    let sum = 0;
    response.data.forEach(element => {
      let timeSheet = {
        "id": element.id,
        "name": element.name,
        "hours": 0
      }
      sum = 0;
      element.timeRecordList.forEach((element) => {
        sum += element.fridayHours;
        sum += element.mondayHours;
        sum += element.saturdayHours;
        sum += element.sundayHours;
        sum += element.thursdayHours;
        sum += element.tuesdayHours;
        sum += element.wednesdayHours;
      });
      timeSheet.hours = sum;
      array.push(timeSheet)
    });
    setTimeSheetList(array);
  }

  const columns = [
    {
      title: 'Id',
      render: (timesheet) => timesheet.id,
      width: '20%',
    },
    {
      title: 'Name',
      render: (timesheet) => timesheet.name,
      width: '20%',
    },
    {
      title: 'Hours',
      render: (timesheet) => timesheet.hours,
      width: '20%',
    },
    {
      title: 'Details',
      dataIndex: (timesheet) => timesheet.id,
      render: (timesheet, element) =>
        <EyeOutlined onClick={() => timeSheetDetails(element.id)} />

    }
  ];


  return (
    <div>
      <h1>Time Sheets</h1>
      <>
        <Tooltip title="Create Time Sheet">
          <Button onClick={showModal} type="primary" shape="circle" icon={<PlusOutlined />} />
        </Tooltip>

        <Modal title="Create New Time Sheet" visible={state.visible} onOk={handleOk} onCancel={handleCancel}
          footer={[
            <Button danger key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" disabled={validTimeSheetName} loading={false} onClick={handleOk}>
              Submit
            </Button>,
          ]}>

          <Form {...layout} form={form} name="control-hooks">
            <Form.Item
              name="name"
              label="Time Sheet Name"
              rules={[{ required: true }]}
            >
              <Input
                name="name"
                onChange={handleInputChange}
                placeholder="January"
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{ width: 200, margin: '0 10px' }}
              />
            </Form.Item>

          </Form>
        </Modal>
      </>
      <Divider />
      <Table rowKey={timeSheetList => timeSheetList.id} columns={columns} dataSource={timeSheetList} />
      {error ? (
        <Alert message="Error in the system. Try again later." type="error" showIcon closable />
      ) : null}
    </div>

  )
};

export default TimeSheet;