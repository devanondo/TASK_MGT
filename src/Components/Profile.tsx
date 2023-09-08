/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { ITeam } from '../Interface/teamInterface'
import { IUser } from '../Interface/userInterface'
import { Button, Card, Image, Typography, message } from 'antd'
import Flex from './Styled/Flex'

const Profile = () => {
    const [teams, setTeams] = useState<Partial<ITeam[] | []>>()
    const [allUsers, setAllUsers] = useState<Partial<IUser[] | []>>()
    const [profileInfo, setProfileInfo] = useState<Partial<IUser | null>>()

    useEffect(() => {
        const updateStateFromLocalStorage = () => {
            const teams: Partial<ITeam[] | null> = JSON.parse(
                localStorage.getItem('teams') as string
            )
            const users: Partial<IUser[] | null> = JSON.parse(
                localStorage.getItem('users') as string
            )
            const loggedUser: Partial<IUser | null> = JSON.parse(
                localStorage.getItem('loggedUser') as string
            )
            setTeams(teams || [])
            setAllUsers(users || [])

            const loged = users?.find(
                (u: any) => u.username === loggedUser?.username
            )

            setProfileInfo(loged)
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
    console.log(profileInfo)
    return (
        <div>
            <Card style={{ marginBottom: '20px' }} title="Profile Info">
                <Image
                    width={80}
                    style={{
                        borderRadius: '50%',
                    }}
                    src={
                        profileInfo?.profilePicture ||
                        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                    }
                />
                <Typography.Paragraph strong>
                    Username : {profileInfo?.username}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    Email : {profileInfo?.email}
                </Typography.Paragraph>
                <Typography.Text>Bio : {profileInfo?.bio}</Typography.Text>

                <Typography.Paragraph style={{ marginTop: '10px' }} strong>
                    Invitations:
                </Typography.Paragraph>
                {profileInfo?.invited?.map((fp) => (
                    <Flex
                        width={300}
                        style={{
                            border: '1px solid lightgray',
                            marginTop: '3px',
                        }}
                        align="center"
                        justify="space-between"
                        key={fp}
                    >
                        <Typography.Text>{fp}</Typography.Text>
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => {
                                let userInfo = allUsers?.find(
                                    (usr) =>
                                        usr?.username === profileInfo?.username
                                )

                                const updatedUser = allUsers?.map(
                                    (user: any) => {
                                        if (
                                            user.username ===
                                            profileInfo?.username
                                        ) {
                                            const invite =
                                                user?.invited?.filter(
                                                    (u: string) => u !== fp
                                                )
                                            user.invited = invite
                                            userInfo = user
                                            return user
                                        } else {
                                            return user
                                        }
                                    }
                                )

                                const updatedTeam = teams?.map((tm: any) => {
                                    if (tm.team_id === fp) {
                                        const memb = tm.members.filter(
                                            (m: any) =>
                                                m.username !==
                                                userInfo?.username
                                        )
                                        memb.push(userInfo)
                                        tm.members = memb
                                        return tm
                                    } else {
                                        return tm
                                    }
                                })

                                localStorage.setItem(
                                    'users',
                                    JSON.stringify(updatedUser)
                                )
                                localStorage.setItem(
                                    'teams',
                                    JSON.stringify(updatedTeam)
                                )
                                localStorage.setItem(
                                    'loggedUser',
                                    JSON.stringify(userInfo)
                                )

                                message.success('Invite accepted')
                                window.location.reload()
                            }}
                        >
                            Accept
                        </Button>
                        <Button size="small" danger type="primary">
                            Reject
                        </Button>
                    </Flex>
                ))}
            </Card>
        </div>
    )
}

export default Profile
