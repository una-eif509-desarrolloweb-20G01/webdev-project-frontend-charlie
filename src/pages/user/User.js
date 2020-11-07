import React, { useState, useEffect } from "react";
/**
 * Components
 */
import { Alert, Table, Divider, Form, Input, Button, Checkbox, Select } from 'antd';
import { } from 'antd';


import UserService from "../../services/user.service";
import DepartmentService from "../../services/department.service";

const initialUserList = [
];


/**
 * ************************************************************************
 *                            User Component
 * ************************************************************************
 * @param {*} props 
 */

const User = (props) => {
  const [userList, setUserList] = useState(initialUserList);
  const [selectedDepartment, setSelectedDepartment] = useState(0);
  const [error, setError] = useState(false);
  const [departments, setDepartments] = useState([]);
  const { Option } = Select;

  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    getAllUsers();
    getAllDeparments();
  }, []);


  /**
   * *****************************
   * List Users
   * *****************************
  */

  const getAllUsers = () => {
    UserService.getAll()
      .then(response => {
        setUserList(response.data);
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
   * List Departments
   * *****************************
  */
  const getAllDeparments = () => {
    DepartmentService.getAll().then(response => {
      setDepartments(response.data);
    })
  }

  /**
   * *****************************
   * Table Columns and Layout
   * *****************************
  */

  const columns = [
    {
      title: 'User Name',
      render: (user) => user.username,
      width: '20%',
    },
    {
      title: 'Rol',
      render: (user) => user.roleList[0].name,
      width: '20%',
    },
    {
      title: 'Active',
      render: (user) => user.enabled ? 'Yes' : 'No',
      width: '20%',
    }
  ];

  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 8 },
  };
  const tailLayout = {
    wrapperCol: { offset: 3, span: 8 },
  };

  /**
   * *****************************
   *     Department selector
   * *****************************
  */

  const listDepartmentOptions = (data) => {
    var array = []

    data.forEach(element => {
      array.push(<Option key={element.id}>{element.nombre}</Option>)
    });

    return array;
  }

  const onDepartmentChange = (value) => {
    setSelectedDepartment(value);
  };

  return (
    <div>
      <h1>User Management</h1>
      <Divider />
      <Table rowKey={userList => userList.id} columns={columns} dataSource={userList} />
      <Divider />
      <>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: false }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="Name"
            rules={[{ required: true, message: '' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="uname"
            rules={[{ required: true, message: '' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            {...tailLayout}
            rules={[{ required: true, message: '' }]}
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>Is Active</Checkbox>
          </Form.Item>

          <Form.Item
            name="department"
            label="Department"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              defaultValue={departments[0]}
              placeholder="Select a department"
              onChange={onDepartmentChange}
              allowClear
            >
              {listDepartmentOptions(departments)}
            </Select>
          </Form.Item>


          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
        </Button>
          </Form.Item>
        </Form>
      </>
      {error ? (
        <Alert message="Error in the system. Try again later." type="error" showIcon closable />
      ) : null}
    </div>

  )
};

export default User;