import {IUser, IUserData} from "./contracts/user";
import {action} from "typesafe-actions";
import * as actionTypes from "./actionTypes";

export enum UserActionType {
    AUTHENTICATE_USER = "user/AUTHENTICATE_USER",
    REGISTER_USER = "user/REGISTER_USER",
    LOGOUT_USER = "user/LOGOUT_USER",
    SET_USER_DATA = "user/SET_USER_DATA",
    GET_USER_DATA = "user/GET_USER_DATA",
    RELOAD_USER_DATA = "user/RELOAD_USER_DATA",
    GET_FOLLOWERS = "user/GET_FOLLOWERS",
    GET_FOLLOWINGS = "user/GET_FOLLOWINGS",
    SET_RELATED_USERS = "user/SET_RELATED_USERS"
}

export const authenticateUser = (payload: IUserData): actionTypes.Authenticate => (
    action(UserActionType.AUTHENTICATE_USER, payload)
)

export const registerUser = (payload: any): actionTypes.RegisterUser => (
    action(UserActionType.REGISTER_USER, payload)
)

export const setUserData = (payload: IUserData): actionTypes.SetUserData => (
    action(UserActionType.SET_USER_DATA, payload)
)

export const logoutUser = (): actionTypes.LogOut => (
    action(UserActionType.LOGOUT_USER)
)

export const fetchUser = (payload: any): actionTypes.FetchUser => (
    action(UserActionType.GET_USER_DATA, payload)
)

export const reloadUserData = (): actionTypes.ReloadUser => (
    action(UserActionType.RELOAD_USER_DATA)
)

export const getFollowers = (payload: string): actionTypes.GetFollowers => (
    action(UserActionType.GET_FOLLOWERS, payload)
)

export const getFollowings = (id: string): actionTypes.GetFollowings => (
    action(UserActionType.GET_FOLLOWINGS, id)
)

export const setRelatedUsers = (payload: IUser[]): actionTypes.SetRelatedUsers => (
    action(UserActionType.SET_RELATED_USERS, payload)
)