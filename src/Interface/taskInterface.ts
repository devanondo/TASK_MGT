import { ITeam } from './teamInterface'
import { IUser } from './userInterface'

export interface ITask {
    task_id: string
    title: string
    description: string
    due_date?: string
    priority_level: string
    status: 'done' | 'pending' | 'processing'
    assignedBy: IUser
    assignedTo?: IUser
    team: ITeam[]
}
