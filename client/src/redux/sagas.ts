import { all } from "redux-saga/effects";
import watchUser from "./user/sagas";
import watchTweets from "./tweets/sagas";

export default function* rootSaga() {
    yield all([
        watchTweets(),
        watchUser()
    ])
}