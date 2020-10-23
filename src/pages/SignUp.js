import React from "react";
import { Form, Alert, Input, Button, Select } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';
import UserService from "../services/user.service";
import DepartmentService from "../services/deparment.service";
import RoleService from "../services/role.service";
const { Option } = Select;
const layout = {
    labelCol: {
        span: 2,
    },
    wrapperCol: {
        span: 3,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 2,
        span: 8,
    },
};

const roles = [];
class Signup extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            user : {
                "id": null,
                "firstName": "",
                "lastName": "",
                "email": "",
                "username": "",
                "password": "",
                "department": {
                    "id": 1
                },
                "createDate": "2020-08-31T00:23:52.000+00:00",
                "enabled": true,
                "tokenExpired": false,
                "roleList": [
                    {
                        "idRole": 1,
                        "name": "ROLE_ADMIN"
                    }
                ]
            },
            departments : [],
            roles : [{idRole : "1", name: "ROLE_ADMIN"},{idRole : "2", name: "ROLE_USER"}],
            error : false
        }
        this.getAllDeparments()
        this.getAllRoles()
    }
    handleMultiSelectChange(value) {
        console.log(`selected ${value}`);
    }

    getAllDeparments(){
        DepartmentService.getAll().then(data =>{
            var array = [] 
            array.push(...data.data);
            this.setState({departments : array})
            console.log(this.state.departments)
        })
        
    }
    getAllRoles(){
        RoleService.getAll().then(data =>{
            var array = [] 
            array.push(...data.data);
            this.setState({roles : array})
            console.log(this.state.roles)
        })
        
    }
    listDepartmentOptions(data){
        var array = []
        
        data.forEach(element => {
            array.push(<Option key={element.id}>{element.nombre}</Option>)
        });
                    
        return array;
    }
    listRolesOptions(data){
        var array = []
        
        data.forEach(element => {
            array.push(<Option key={element.idRole}>{element.name}</Option>)
        });
                    
        return array;
    }
    render() {
        //const [form] = Form.useForm()
        /**
         * React Hooks
         * https://reactjs.org/docs/hooks-reference.html
         */

        /** Service methods **/
        const signUpMethod = () => {
            UserService.signup(this.state.user)
                .then(response => {
                    this.setState({user : response.data});
                    Form.useForm.resetFields();
                    this.setState({error : false});
                })
                .catch(err => {
                    console.log(err);
                    this.setState({error : err})
                });
        }

        /** Handle actions in the Form **/

        const handleInputChange = event => {
            let { name, value } = event.target;
            this.setState({user : { ...this.state.user, [name]: value }});
        };

        /** General Methods **/

        const onFinish = data => {
            console.log(this.state.user);
            signUpMethod();
        };

        const onReset = () => {
            this.setState({user : this.user});
            Form.useForm.resetFields();
        };
        const onDepartmentChange = (value) => {
            switch (value) {
                case 'male':
                    alert("Male")
                    return;

                case 'female':
                    alert("Female")
                    return;

                case 'other':
                    alert("Other")
                    return;
                default:return;
            }
        };

        return (
            <div>
                <Form {...layout} /*form={form}*/ name="control-hooks" onFinish={onFinish}>
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input
                            name="firstName"
                            onChange={handleInputChange}
                            placeholder="First Name"
                        />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input
                            name="lastName"
                            onChange={handleInputChange}
                            placeholder="Last Name"
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input
                            name="email"
                            onChange={handleInputChange}
                            placeholder="Email"
                        />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="User Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input
                            name="username"
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            onChange={handleInputChange}
                            placeholder="User Name"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input.Password
                            name="password"
                            onChange={handleInputChange}
                            placeholder="your password"
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
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
                            placeholder="Select a department"
                            onChange={onDepartmentChange}
                            allowClear
                        >
                            {this.listDepartmentOptions(this.state.departments)}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Roles"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select the roles"
                            onChange={this.handleMultiSelectChange}
                        >
                             {this.listRolesOptions(this.state.roles)}
                        </Select>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                    </Form.Item>

                </Form>
                {this.state.user.idUser > 0 ? (
                    <Alert message="User Saved" type="success" showIcon closable />
                ) : null}
                {this.state.error ? (
                    <Alert message="Error in the system. Try again later." type="error" showIcon closable />
                ) : null}
            </div>
        )
    }

};

export default Signup;