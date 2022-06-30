import axios from "../utils/axios";

function fetchUser(data: any) {
    return axios.post("/login", data);
}

function registerUser(data: any) {
    return axios.post("/register", data);
}

function reloadUserData() {
    return axios.get("/userdata");
}

function getFollowers(id: string) {
    return axios.get(`/profile/${id}/followers`);
}

function getFollowings(id: string) {
    return axios.get(`/profile/${id}/followings`);
}

export default {
    fetchUser,
    registerUser,
    reloadUserData,
    getFollowers,
    getFollowings
}
