import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import RolService from "../../services/role.service";
import DepartmentService from "../../services/department.service";
import { EditOutlined } from '@ant-design/icons';
import { Alert, Table, Divider, Form, Input, Button, Checkbox, Select, Space } from 'antd';
import './user.css';
const initialUserList = [
];


/**
 * ************************************************************************
 *                            User Component
 * ************************************************************************
 * @param {*} props 
 */
const defaultUser = {
  idUser: -1,
  firstName: "",
  lastName: "",
  password: "",
  username: "",
  email: "",
  createDate: "",
  enabled: false,
  tokenExpired: false,
  department: {
    id: 1,
    nombre: ""
  },
  roleList: [
    {
      idRole: 2,
      name: ""
    }
  ]
}


const User = (props) => {
  const [form] = Form.useForm();
  const [userList, setUserList] = useState(initialUserList);
  const [error, setError] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [currentUser, setCurrentUser] = useState(defaultUser);
  const [state, setState] = useState({ checked: currentUser.enabled, disabled: false, });
  const [fields, setFields] = useState(
    [
      {
        name: ['username'],
        value: ''
      },
      {
        name: ['firstName'],
        value: ''
      },
      {
        name: ['lastname'],
        value: ''
      }

    ]);


  const { Option } = Select;

  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {

    //form.setFieldsValue(values);
    getAllUsers();
    getAllRoles();
    getAllDeparments();
  }, []);

  /**
   * *****************************
   * List Roles
   * *****************************
  */
  const getAllRoles = () => {
    RolService.getAll()
      .then(response => {
        setRolesList(response.data);
      })
      .catch(err => {
        setError(err)
        if (err.response.status === 401) {
          props.history.push("/login");
          window.location.reload();
        }
      });
  }

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
    },
    {
      title: 'Edit',
      dataIndex: (user) => user.id,
      render: (user, element) =>
        <EditOutlined onClick={() => tableRowSelected(element)} />
    }
  ];

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 6, offset: 1 },
  };
  const tailLayout = {
    wrapperCol: { offset: 1, span: 8 },

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

  /**
  * *****************************
  *     Roles selector
  * *****************************
 */
  const listRoleOptions = (data) => {
    var array = []

    data.forEach(element => {
      array.push(<Option key={element.idRole}>{element.name}</Option>)
    });

    return array;
  }




  const tableRowSelected = user => {
    updateFormFields(user);
  };


  const updateFormFields = (user) => {

    setFields([
      {
        name: ['username'],
        value: user.username
      },
      {
        name: ['firstName'],
        value: user.firstName
      },
      {
        name: ['lastname'],
        value: user.lastName
      },
      {
        name: ['department'],
        value: user.department.nombre
      },
      {
        name: ['role'],
        value: user.roleList[0].name
      }
    ]);

    setState({ checked: user.enabled, disabled: false, });
    setCurrentUser(user)
  };
  const onDepartmentChange = (value) => {
    let user = currentUser;
    user.department = departments[value > 0 ? value - 1 : value];
    setCurrentUser(user);
  };

  const onRoleChange = (value) => {
    let user = currentUser;
    user.roleList = [rolesList[value > 0 ? value - 1 : value]];
    setCurrentUser(user);
  };

  const handleInputChange = event => {
    let user = currentUser;
    switch (event.target.id) {
      case "basic_username": {
        user.username = event.target.value;
        setCurrentUser(user)
        break;
      }
      case "basic_firstName": {
        user.firstName = event.target.value;
        setCurrentUser(user)
        break;
      }
      case "basic_lastname": {
        user.lastName = event.target.value;
        setCurrentUser(user)
        break;
      }
    }
  };

  const onChange = e => {
    console.log('checked = ', e.target.checked);
    setState({
      checked: e.target.checked,
    });
    currentUser.enabled = e.target.checked;
    setCurrentUser(currentUser);
  };

  /**
   * *****************************
   * Update User
   * *****************************
  */

  const updateUser = () => {
    //setLoading(true);
    UserService.update(currentUser)
      .then(response => {
        setCurrentUser(defaultUser);
        updateFormFields(defaultUser);
        getAllUsers();
      })
      .catch(err => {
        setError(err)
        if (err.response.status === 401) {
          props.history.push("/login");
        }
      });
  }

  const label = `${state.checked ? 'Checked' : 'Unchecked'}-${state.disabled ? 'Disabled' : 'Enabled'}`;
  return (
    <div>
      <h1>User Management</h1>
      <Divider />
      <Table
        rowKey={userList => userList.id}
        columns={columns}
        dataSource={userList}
        onChange={tableRowSelected}
      />
      <Divider />
      <h2>User Details </h2>
      <>
        <Form
          size="default"
          fields={fields}
          form={form}
          {...layout}
          name="basic"
          initialValues={{ remember: false }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            onChange={handleInputChange}
            label="username"
            name="username"
            rules={[{ required: true, message: '' }]}
          >
            <Input />

          </Form.Item>

          <Form.Item
            onChange={handleInputChange}
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: '' }]}
          >
            <Input
              required
            />
          </Form.Item>

          <Form.Item
            onChange={handleInputChange}
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: '' }]}
          >
            <Input
              required

            />
          </Form.Item>


          <Form.Item
            onChange={handleInputChange}
            {...tailLayout}
            label="Enabled"
            name="enabled"
          >
            <Checkbox
              checked={state.checked}
              disabled={state.disabled}
              onChange={onChange}
            >
            </Checkbox>

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
              onChange={onDepartmentChange}
              allowClear
            >
              {listDepartmentOptions(departments)}
            </Select>
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              onChange={onRoleChange}
              allowClear
            >
              {listRoleOptions(rolesList)}
            </Select>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button id="s" type="primary" htmlType="submit" disabled={false} loading={false} onClick={updateUser} >
              Save
           </Button>

            <Button type="danger" htmlType="submit">
              Cancel
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