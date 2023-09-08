/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Form, Input, message } from 'antd'
import React, { useState } from 'react'

import { Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import Flex from '../Components/Styled/Flex'
import { IUser } from '../Interface/userInterface'
import ImgbbUpload from '../Components/UploadImage/UploadImage'

const Register: React.FC = () => {
    const navigate = useNavigate()
    const [profilePic, setProfilePic] = useState<string>()
    const { TextArea } = Input

    const onFinish = (values: any) => {
        values.invited = []
        values.profilePicture = profilePic
        const users: Partial<IUser[] | null> = JSON.parse(
            localStorage.getItem('users') as string
        )

        const isUserExist = users?.find(
            (usr) => usr?.username === values.username
        )

        if (isUserExist) {
            message.error('username already exist!')
        } else {
            if (users) {
                localStorage.setItem(
                    'users',
                    JSON.stringify([...users, values])
                )
                message.success('User created!')
                navigate('/login')
                message.success('Please login!')
            } else {
                localStorage.setItem('users', JSON.stringify([values]))
                message.success('User created!')
                navigate('/login')
                message.success('Please login!')
            }
        }
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
                layout="vertical"
            >
                <Card title="Register Here">
                    <Form.Item
                        label="Profile Picture"
                        name="profilePicture"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your profile picture!',
                            },
                        ]}
                    >
                        <ImgbbUpload
                            onChange={(url) => {
                                setProfilePic(url)
                            }}
                        />
                    </Form.Item>
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
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
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

                    <Form.Item
                        name="bio"
                        label="Bio Data"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Bio!',
                            },
                        ]}
                    >
                        <TextArea showCount rows={3} />
                    </Form.Item>

                    <Typography.Paragraph>
                        Already have account,{' '}
                        <Link to="/login">
                            <Typography.Text type="secondary">
                                Login here.
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

export default Register
