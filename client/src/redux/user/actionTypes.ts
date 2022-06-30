import {Action} from "redux";
import {IUserData, IUser} from "./contracts/user";
import {UserActionType} from "./actionCreators";

export interface Authenticate extends Action<UserActionType> {
    type: UserActionType.AUTHENTICATE_USER,
    payload: IUserData
}

export interface RegisterUser extends Action<UserActionType> {
    type: UserActionType.REGISTER_USER,
    payload: any
}

export interface SetUserData extends Action<UserActionType> {
    type: UserActionType.SET_USER_DATA,
    payload: IUserData
}

export interface LogOut extends Action<UserActionType> {
    type: UserActionType.LOGOUT_USER
}

export interface FetchUser extends Action<UserActionType> {
    type: UserActionType.GET_USER_DATA,
    payload: any
}

export interface GetFollowers extends Action<UserActionType> {
    type: UserActionType.GET_FOLLOWERS,
    payload: string
}

export interface GetFollowings extends Action<UserActionType> {
    type: UserActionType.GET_FOLLOWINGS,
    payload: string
}

export interface SetRelatedUsers extends Action<UserActionType> {
    type: UserActionType.SET_RELATED_USERS,
    payload: IUser[]
}

export interface ReloadUser extends Action<UserActionType> {
    type: UserActionType.RELOAD_USER_DATA
}

export type UserActions = Authenticate
    | LogOut
    | SetUserData
    | ReloadUser
    | FetchUser
    | GetFollowers
    | GetFollowings
    | SetRelatedUsers;