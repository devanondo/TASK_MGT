/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button, Card, Form, Input, Typography, message } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Flex from '../Components/Styled/Flex'

const Login: React.FC = () => {
    const navigate = useNavigate()

    const onFinish = (values: any) => {
        const users = JSON.parse(localStorage.getItem('users') as string)

        const isUserExist = users.find(
            (user: any) =>
                user?.username === values.username &&
                user?.password === values.password
        )

        if (isUserExist) {
            localStorage.setItem('loggedUser', JSON.stringify(isUserExist))
            message.success('Logged In')
            navigate('/')
        } else {
            return message.error('Incorrect Information')
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    return (
        <Flex
            align="center"
            justify="center"
            padding="20px"
            style={{
                minHeight: '100vh',
                width: '100%',
            }}
        >
            <Form
                style={{
                    width: 400,
                }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
            >
                <Card title="Login here">
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Typography.Paragraph>
                        You do not have account,{' '}
                        <Link to="/register">
                            <Typography.Text type="secondary">
                                Register here.
                            </Typography.Text>
                        </Link>
                    </Typography.Paragraph>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Card>
            </Form>
        </Flex>
    )
}

export default Login
