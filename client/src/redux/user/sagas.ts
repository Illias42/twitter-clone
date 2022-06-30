import {call, put, takeEvery, takeLatest} from "redux-saga/effects";
import {AxiosResponse} from "axios";
import userApi from "../../api/userApi";
import {authenticateUser, setRelatedUsers, setUserData, UserActionType} from "./actionCreators";
import { GetFollowings, GetFollowers } from "./actionTypes";
import {IUser} from "../user/contracts/user"

function* fetchUser(action: any) {
    try {
        const userData: AxiosResponse<any> = yield call(userApi.fetchUser, action.payload);
        localStorage.setItem("jwtToken", userData.data.token);
        delete userData.data.token;
        yield put(authenticateUser(userData.data));
    } catch (err) {
        console.log(err);
    }
}

function* registerUser(action: any) {
    try { 
        const userData: AxiosResponse<any> = yield call(userApi.registerUser, action.payload);
        localStorage.setItem("jwtToken", userData.data.token);
        delete userData.data.token;
        yield put(authenticateUser(userData.data));
    } catch (err) { 
        console.log(err);
    }
}

function* reloadUserData() {
    try {
        const userData: AxiosResponse<any> = yield call(userApi.reloadUserData);
        yield put(setUserData(userData.data));
    } catch (err) {
        console.log(err);
    }
}

function* getFollowers(action: GetFollowers) {
    try {
        const {payload} = action;
        yield put(setRelatedUsers([]));
        const followers: AxiosResponse<IUser[]> = yield call(userApi.getFollowers, payload);
        yield put(setRelatedUsers(followers.data));
    } catch (err) {
        console.log(err);
    }
}

function* getFollowings(action: GetFollowings) {
    try {
        const {payload} = action;
        yield put(setRelatedUsers([]));
        const followings: AxiosResponse<IUser[]> = yield call(userApi.getFollowings, payload);
        yield put(setRelatedUsers(followings.data));
    } catch (err) {
        console.log(err);
    }
}

export default function* watchUser() {
    yield takeEvery(UserActionType.GET_USER_DATA, fetchUser);
    yield takeLatest(UserActionType.REGISTER_USER, registerUser);
    yield takeLatest(UserActionType.GET_FOLLOWERS, getFollowers);
    yield takeLatest(UserActionType.GET_FOLLOWINGS, getFollowings);
    yield takeLatest(UserActionType.RELOAD_USER_DATA, reloadUserData);
}