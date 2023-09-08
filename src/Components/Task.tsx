/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Button,
    Card,
    DatePicker,
    Table,
    Form,
    Input,
    Modal,
    Select,
    message,
} from 'antd'
import React, { useEffect, useState } from 'react'
import type { ColumnsType, TableProps } from 'antd/es/table'
import moment from 'moment'
import type {
    FilterValue,
    SorterResult,
    TableRowSelection,
} from 'antd/es/table/interface'
import { ITask } from '../Interface/taskInterface'
import { ITeam } from '../Interface/teamInterface'
import { IUser } from '../Interface/userInterface'
import Flex from './Styled/Flex'

const Task: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [tasks, setTasks] = useState<Partial<ITask[] | []>>()
    const [teams, setTeams] = useState<Partial<ITeam[] | []>>()
    const [selectedTeam, setSelectedTeam] = useState<ITeam>()
    const [allUsers, setAllUsers] = useState<Partial<IUser[] | []>>()
    const [selectedTasks, setSelectedTasks] = useState<Partial<ITask>[]>()
    const [form] = Form.useForm()
    const [filteredInfo, setFilteredInfo] = useState<
        Record<string, FilterValue | null>
    >({})
    const [sortedInfo, setSortedInfo] = useState<SorterResult<ITask>>({})

    useEffect(() => {
        const updateStateFromLocalStorage = () => {
            const tasks: Partial<ITask[] | null> = JSON.parse(
                localStorage.getItem('tasks') as string
            )
            const teams: Partial<ITeam[] | null> = JSON.parse(
                localStorage.getItem('teams') as string
            )
            const users: Partial<IUser[] | null> = JSON.parse(
                localStorage.getItem('users') as string
            )
            setTasks(tasks || [])
            setTeams(teams || [])
            setAllUsers(users || [])
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

    const { TextArea } = Input

    const generateTaskId = () => {
        const lastTask = tasks && tasks[tasks?.length - 1]

        if (lastTask) {
            console.log(lastTask)
            const id = (parseInt(lastTask.task_id) + 1)
                .toString()
                .padStart(4, '0')
            console.log(id)
            return id
        } else {
            return '0001'
        }
    }

    const handleOk = () => {
        setOpen(false)
    }

    const handleCancel = () => {
        setOpen(false)
    }
    const onFinish = (values: any) => {
        const id = generateTaskId()
        const data = { ...values }
        data.task_id = id
        data.team = teams?.find((tm) => tm?.team_id === values?.team)
        data.assignedTo = allUsers?.find(
            (itm: any) => itm?.username === values.assignedTo
        )
        data.assignedBy = JSON.parse(
            localStorage.getItem('loggedUser') as string
        )
        const isTaksExist = tasks?.find((task) => task?.task_id === id)

        if (isTaksExist) {
            alert('Task id already exixt!')
        } else {
            if (tasks) {
                localStorage.setItem('tasks', JSON.stringify([...tasks, data]))
            } else {
                localStorage.setItem('tasks', JSON.stringify([data]))
            }
        }

        message.success('Task Created')
        form.resetFields()
        setOpen(false)
    }
    const handleChange: TableProps<ITask>['onChange'] = (
        _pagination,
        filters,
        sorter
    ) => {
        setFilteredInfo(filters)
        setSortedInfo(sorter as SorterResult<ITask>)
    }

    const columns: ColumnsType<Partial<ITask>> = [
        {
            title: '#',
            dataIndex: 'key',
            align: 'center',
            width: 50,
        },
        {
            title: 'ID',
            dataIndex: 'task_id',
        },
        {
            title: 'Title',
            dataIndex: 'title',
        },
        {
            title: 'Assign By',
            dataIndex: 'assignedBy',
            render: (value) => <>{value?.username}</>,
        },
        {
            title: 'Assign to',
            dataIndex: 'assignedTo',
            render: (value) => <>{value?.username}</>,
        },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date',
            sorter: (a: any, b: any) =>
                new Date(a?.due_date) - new Date(b?.due_date),

            sortOrder:
                sortedInfo.columnKey === 'due_date' ? sortedInfo.order : null,
            render: (date: string) => <>{moment(date).format('ll')}</>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Processing', value: 'processing' },
                { text: 'Done', value: 'done' },
            ],
            filteredValue: filteredInfo.status || null,
            onFilter: (value: string, record) => record.status?.includes(value),
            ellipsis: true,

            render: (value, pd: any) => {
                return (
                    <Select
                        placeholder="Select Status"
                        defaultValue={value}
                        style={{ width: 110 }}
                        onChange={(value) => {
                            const task = tasks?.map((ts: any) => {
                                if (ts?.task_id === pd.task_id) {
                                    ts.status = value

                                    return ts
                                } else {
                                    return ts
                                }
                            })

                            localStorage.setItem('tasks', JSON.stringify(task))
                            message.success('Updated')
                        }}
                        size="small"
                        options={[
                            {
                                value: 'pending',
                                label: 'pending',
                            },
                            {
                                value: 'processing',
                                label: 'processing',
                            },
                            {
                                value: 'done',
                                label: 'done',
                            },
                        ]}
                    />
                )
            },
        },
        {
            title: 'Priority',
            dataIndex: 'priority_level',
            key: 'priority_level',
            sorter: (a, b) => a.priority_level.length - b.priority_level.length,
            sortOrder:
                sortedInfo.columnKey === 'priority_level'
                    ? sortedInfo.order
                    : null,
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
    ]

    const team = teams?.filter((tm: any) =>
        tm.members.some(
            (member: any) =>
                member.username ===
                JSON.parse(localStorage.getItem('loggedUser') as string)
                    ?.username
        )
    )

    function filterArrayBasedOnAnother(
        dataArray: ITask[],
        filterArray: ITeam[],
        keyToCompare: string
    ) {
        console.log(dataArray)
        const filterValues = filterArray?.map((item: any) => item[keyToCompare])
        console.log(filterValues)
        const de = dataArray?.filter(
            (item: any) => filterValues?.includes(item['team'].team_id)
        )
        console.log(de)
        return de
    }

    const rows = filterArrayBasedOnAnother(
        tasks as ITask[],
        team as ITeam[],
        'team_id'
    )?.map((task, i: number) => {
        return {
            key: i + 1,
            ...task,
        }
    })

    // const rows = tasks?.map((task, i: number) => {
    //     return {
    //         key: i + 1,
    //         ...task,
    //     }
    // })

    const rowSelection: TableRowSelection<Partial<ITask>> = {
        onChange: (_, selectedRows) => {
            setSelectedTasks(selectedRows)
        },
    }

    return (
        <Card
            title="Task List"
            extra={
                <>
                    <Flex gap={10}>
                        <Button
                            size="small"
                            onClick={() => setOpen(true)}
                            type="primary"
                        >
                            Add Task
                        </Button>
                        <Select
                            placeholder="Change Status"
                            style={{ width: '120px' }}
                            size="small"
                            onChange={(value) => {
                                const task = tasks?.map((tak: any) => {
                                    const seTask = selectedTasks?.find(
                                        (itm) => itm.task_id === tak?.task_id
                                    )

                                    if (seTask) {
                                        tak.status = value
                                        return tak
                                    } else {
                                        return tak
                                    }
                                })
                                localStorage.setItem(
                                    'tasks',
                                    JSON.stringify(task)
                                )
                                message.success('Status Updated')
                            }}
                            options={[
                                {
                                    value: 'pending',
                                    label: 'pending',
                                },
                                {
                                    value: 'processing',
                                    label: 'processing',
                                },
                                {
                                    value: 'done',
                                    label: 'done',
                                },
                            ]}
                        />
                    </Flex>
                </>
            }
        >
            <Table
                columns={columns}
                size="small"
                rowSelection={{ ...rowSelection }}
                dataSource={rows}
                scroll={{ x: 1000 }}
                onChange={handleChange}
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
                        name="title"
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Title!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="priority_level"
                        label="Priority Level"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your priority_level!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select a Priority"
                            optionFilterProp="children"
                            options={[
                                {
                                    value: 'high',
                                    label: 'high',
                                },
                                {
                                    value: 'mideum',
                                    label: 'mideum',
                                },
                                {
                                    value: 'low',
                                    label: 'low',
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="due_date"
                        label="Due Date"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Date!',
                            },
                        ]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your status!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select Status"
                            optionFilterProp="children"
                            options={[
                                {
                                    value: 'pending',
                                    label: 'pending',
                                },
                                {
                                    value: 'processing',
                                    label: 'processing',
                                },
                                {
                                    value: 'done',
                                    label: 'done',
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="team"
                        label="Team"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your team!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select Team"
                            optionFilterProp="children"
                            onChange={(id) => {
                                const teamData = teams?.find(
                                    (tm: any) => tm.team_id === id
                                )

                                setSelectedTeam(teamData)
                            }}
                            options={teams?.map((tem) => ({
                                value: tem?.team_id,
                                label: tem?.title,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="assignedTo"
                        label="Assign To"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your user!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Assign To"
                            optionFilterProp="children"
                            options={selectedTeam?.members?.map((itm) => ({
                                value: itm?.username,
                                label: itm?.username,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Descrption!',
                            },
                        ]}
                    >
                        <TextArea showCount rows={3} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}

export default Task
