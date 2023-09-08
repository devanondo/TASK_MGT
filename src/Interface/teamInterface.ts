import { IUser } from './userInterface'

export interface ITeam {
    title?: string
    team_id: string
    members?: IUser[]
}
