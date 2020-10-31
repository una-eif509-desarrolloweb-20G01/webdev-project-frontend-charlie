import React from "react";
import { Form, Alert, Input, Button, Select } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';
import UserService from "../../services/user.service";
import DepartmentService from "../../services/department.service";
import './SignUp.css';
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
class Signup extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props)
        this.state = {
            user: {
                "id": null,
                "firstName": "",
                "lastName": "",
                "email": "",
                "username": "",
                "password": "",
                "department": {
                    "id": 1
                },
                //"createDate": "2020-08-31T00:23:52.000+00:00",
                "enabled": true,
                "tokenExpired": false,
                "roleList": []
            },
            departments: [],
            error: false
        }
        this.getAllDeparments()
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

    render() {
        /** Service methods **/
        const signUpMethod = () => {
            UserService.signup(this.state.user)
                .then(response => {
                    this.setState({ user: response.data });
                    this.formRef.current.resetFields();
                    this.setState({ error: false });
                })
                .catch(err => {
                    console.log(err);
                    this.setState({ error: err })
                });
        }

        /** Handle actions in the Form **/

        const handleInputChange = event => {
            let { name, value } = event.target;
            this.setState({ user: { ...this.state.user, [name]: value } });
        };

        /** General Methods **/

        const onFinish = data => {
            console.log(this.state.user);
            signUpMethod();
        };

        const onReset = () => {
            this.setState({ user: this.state.user });
            this.formRef.current.resetFields();
        };
        const onDepartmentChange = (value) => {
            this.setState({ department: { id: value } })
        };
        

        return (
            <div style={{ width: "100%", maxWidth: 500 }}>
                <Form {...layout} ref={this.formRef} name="control-hooks" onFinish={onFinish}>
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

                
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" id="submit-btn">
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