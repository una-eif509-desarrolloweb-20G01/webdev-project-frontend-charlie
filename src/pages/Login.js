import React, { useState } from "react";
import { Form, Input, Button, Alert, Row, Card } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';

import AuthService from "../services/auth.service";

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

const Login = (props) => {
    const [form] = Form.useForm();
    const [login, setLogin] = useState({});
    const [error, setError] = useState(false);

    /**
     * React Hooks
     * https://reactjs.org/docs/hooks-reference.html
     */

    /** Service methods **/
    const loginMethod = () => {
        AuthService.login(login)
            .then(response => {
                setLogin(response.data);
                form.resetFields();
                props.history.push("/");
                window.location.reload();
            })
            .catch(err => {
                setError(true);
                console.log(err);
            });
    }

    /** Handle actions in the Form **/

    const handleInputChange = event => {
        let { name, value } = event.target;
        setLogin({ ...login, [name]: value });
    };

    /** General Methods **/

    const onFinish = data => {
        console.log(login);
        loginMethod();
    };

    return (
        <Row type="flex" justify="center" align="middle">
            <Card title="Login" style={{ width: "100%", maxWidth: 500, textAlign: "center", padding: "0px 0px" }}>
                <div>
                    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
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
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                Login
                    </Button>
                        </Form.Item>
                    </Form>
                    {error ? (
                        <Alert message="Error in the system. Try again later." type="error" showIcon closable />
                    ) : null}
                </div>
            </Card>
        </Row>
    )
};

export default Login;