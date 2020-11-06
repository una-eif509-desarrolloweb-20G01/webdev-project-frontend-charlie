import React, { useState, useEffect } from "react";
/**
 * Components
 */
import { Alert, Table, Divider,  Form,  } from 'antd';


import UserService from "../../services/user.service";

const initialUserList = [
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
 *                            User Component
 * ************************************************************************
 * @param {*} props 
 */

const User = (props) => {
  const [form] = Form.useForm();
  const [userList, setUserList] = useState(initialUserList);
  const [error, setError] = useState(false);


  /**
   * *****************************
   * List Users
   * *****************************
  */

  useEffect(() => {
    getAllUsers();
  }, []);


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
      render: (user) => user.enabled? 'Yes':'No',
      width: '20%',
    }
  ];


  return (
    <div>
      <h1>User Management</h1>
      <Divider />
      <Table rowKey={userList => userList.id} columns={columns} dataSource={userList} />
      <Divider />
      
      {error ? (
        <Alert message="Error in the system. Try again later." type="error" showIcon closable />
      ) : null}
    </div>

  )
};

export default User;