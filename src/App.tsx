/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row } from 'antd'
import { useEffect } from 'react'
import Task from './Components/Task'
import Team from './Components/Team'
import Profile from './Components/Profile'

export default function App() {
    // const router = useRouter()

    useEffect(() => {
        const user = JSON.parse(localStorage?.getItem('loggedUser') as string)
        if (!user) {
            // router.replace('/login')
        }
    }, [])

    return (
        <div style={{ padding: '20px' }}>
            <Profile />
            <Row gutter={[20, 20]}>
                <Col xs={24} lg={12}>
                    <Task />
                </Col>
                <Col xs={24} lg={12}>
                    <Team />
                </Col>
            </Row>
        </div>
    )
}
