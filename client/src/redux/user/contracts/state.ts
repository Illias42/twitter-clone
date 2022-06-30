import {IUserData, IUser} from "./user";

export default interface IUserState {
    isAuthenticated: boolean,
    userData: IUserData | {},
    relatedUsers: IUser[]
}