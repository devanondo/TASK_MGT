/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    Avatar,
    Button,
    Card,
    Form,
    Input,
    Modal,
    Select,
    Table,
    Typography,
    message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { PlusOutlined } from '@ant-design/icons'

import React, { useEffect, useState } from 'react'
import { ITeam } from '../Interface/teamInterface'
import { IUser } from '../Interface/userInterface'
import Flex from './Styled/Flex'

const Team: React.FC = () => {
    const [allUsers, setAllUsers] = useState<IUser[] | []>()
    const [teams, setTeams] = useState<Partial<ITeam[] | []>>()
    const [loggedUser, setLoggedUser] = useState<Partial<IUser | null>>()
    const [open, setOpen] = useState(false)
    const [inviteModal, setInviteModal] = useState<boolean>(false)
    const [inviteTeamId, setInviteTeamId] = useState<string>('')
    const [form] = Form.useForm()

    const generateTeamId = () => {
        const lastTeam = teams && teams[teams?.length - 1]

        if (lastTeam) {
            console.log(lastTeam)
            const id = (parseInt(lastTeam.team_id) + 1)
                .toString()
                .padStart(4, '0')
            return id
        } else {
            return '0001'
        }
    }

    useEffect(() => {
        const updateStateFromLocalStorage = () => {
            setAllUsers(JSON.parse(localStorage.getItem('users') as string))
            const teams: Partial<ITeam[] | null> = JSON.parse(
                localStorage.getItem('teams') as string
            )
            const loggedUserIn = JSON.parse(
                localStorage.getItem('loggedUser') as string
            )
            setTeams(teams || [])
            setLoggedUser(loggedUserIn)
        }
        window.addEventListener('storage', updateStateFromLocalStorage)

        updateStateFromLocalStorage()

        return () => {
            window.removeEventListener('storage', updateStateFromLocalStorage)
        }
    }, [
        localStorage.getItem('tasks'),
        localStorage.getItem('teams'),
        localStorage.getItem('users'),
    ])

    const handleOk = () => {
        setOpen(false)
        setInviteModal(false)
    }

    const handleCancel = () => {
        setOpen(false)
        setInviteModal(false)
    }

    const columns: ColumnsType<Partial<ITeam>> = [
        {
            title: '#',
            dataIndex: 'key',
            align: 'center',
            width: 50,
        },
        {
            title: 'ID',
            dataIndex: 'team_id',
        },
        {
            title: 'Title',
            dataIndex: 'title',
        },

        {
            title: 'Members',
            dataIndex: 'members',
            render: (value) => {
                return (
                    <>
                        <Avatar.Group
                            maxCount={2}
                            maxStyle={{
                                color: '#f56a00',
                                backgroundColor: '#fde3cf',
                            }}
                        >
                            {value?.map((itm: any, i: number) => (
                                <Avatar
                                    key={i + itm.username}
                                    style={{ backgroundColor: '#f56a00' }}
                                >
                                    {(itm?.username)
                                        .toString()
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </Avatar>
                            ))}
                        </Avatar.Group>
                    </>
                )
            },
        },
        {
            title: 'Invte ',
            dataIndex: 'invite',
            render: (_, val: any) => {
                return (
                    <>
                        {val?.creator === loggedUser?.username && (
                            <Button
                                size="small"
                                onClick={() => {
                                    setInviteModal(true)
                                    setInviteTeamId(val?.team_id)
                                }}
                            >
                                Invite
                            </Button>
                        )}
                    </>
                )
            },
        },
    ]

    const onFinish = (values: any) => {
        const data = { ...values }
        const id = generateTeamId()

        const memebers = data.members.map((member: string) => {
            const usr: IUser | undefined = allUsers?.find(
                (user) => user.username === member
            )
            if (usr) return usr
        })

        data.members = memebers
        data.team_id = id
        data.creator = loggedUser?.username

        const isTaksExist = teams?.find((team) => team?.team_id === id)

        if (isTaksExist) {
            alert('Team id already exixt!')
        } else {
            if (teams) {
                localStorage.setItem('teams', JSON.stringify([...teams, data]))
            } else {
                localStorage.setItem('teams', JSON.stringify([data]))
            }
        }
        message.success('Task Created')
        form.resetFields()
        setOpen(false)
    }

    const rows = teams?.map((team, i: number) => {
        return {
            key: i + 1,
            ...team,
        }
    })

    return (
        <Card
            title="Team List"
            extra={
                <>
                    <Button
                        size="small"
                        onClick={() => setOpen(true)}
                        type="primary"
                    >
                        <PlusOutlined /> Create Team
                    </Button>
                </>
            }
        >
            <Table
                columns={columns}
                size="small"
                dataSource={rows}
                scroll={{ x: 600 }}
            />
            <Modal
                open={open}
                title="Create Task"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
            >
                <Form
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="Team Name"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Tam name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="members"
                        label="Members"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Members!',
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select Members"
                            optionFilterProp="children"
                            options={
                                allUsers?.map((itm: IUser) => ({
                                    label: itm.username,
                                    value: itm.username,
                                })) || []
                            }
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={inviteModal}
                title="Invite Modal"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
            >
                {allUsers?.map((usr: any, i: number) => (
                    <Flex
                        padding="5px 0"
                        align="center"
                        key={i + usr.username}
                        justify="space-between"
                    >
                        <Typography.Text type="secondary" strong>
                            {usr.username}
                        </Typography.Text>

                        <Button
                            type="primary"
                            onClick={() => {
                                const isUserExist = teams
                                    ?.find((tm) => tm?.team_id === inviteTeamId)
                                    ?.members?.filter(
                                        (mem) => mem.username === usr.username
                                    )

                                if (!isUserExist?.length) {
                                    const updatedUser = allUsers?.map(
                                        (user: any) => {
                                            if (
                                                user.username ===
                                                    usr.username &&
                                                !user.invited?.includes(
                                                    inviteTeamId
                                                )
                                            ) {
                                                user?.invited.push(inviteTeamId)

                                                return user
                                            } else {
                                                return user
                                            }
                                        }
                                    )
                                    localStorage.setItem(
                                        'users',
                                        JSON.stringify(updatedUser) as string
                                    )
                                    message.success('Invite Send')
                                } else {
                                    message.warning('Already Exist')
                                }
                            }}
                        >
                            Invite
                        </Button>
                    </Flex>
                ))}
            </Modal>
        </Card>
    )
}

export default Team
