import produce, {Draft} from "immer";
import IUserState from "./contracts/state";
import {UserActionType} from "./actionCreators";
import {UserActions} from "./actionTypes";
import {deleteToken} from "../../utils/localStorage";

const initialUserState: IUserState = {
    isAuthenticated: false,
    userData: {},
    relatedUsers: []
}

export const userReducer = produce((draft: Draft<IUserState>, action: UserActions) => {
    if (action.type === UserActionType.AUTHENTICATE_USER) {
        const { payload } = action;
        draft.isAuthenticated = true;
        draft.userData = payload;
    }
    if (action.type === UserActionType.LOGOUT_USER) {
        deleteToken();
        draft.isAuthenticated = false;
        draft.userData = {};
    }
    if (action.type === UserActionType.SET_USER_DATA) {
        const { payload } = action;
        draft.userData = payload;
    }
    if (action.type === UserActionType.SET_RELATED_USERS) {
        const { payload } = action;
        draft.relatedUsers = payload;
    }
}, initialUserState);