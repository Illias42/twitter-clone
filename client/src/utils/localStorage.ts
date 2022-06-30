import IUserState from "../redux/user/contracts/state";

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch {
        return undefined;
    }
}

export const saveState = (state: IUserState) => {
    try {
        const serializedState = JSON.stringify({
            user: {...state}
        });
        localStorage.setItem('state', serializedState);
    } catch {}
};

export const deleteToken = () => {
    try {
        localStorage.setItem("jwtToken", "")
    } catch {}
}