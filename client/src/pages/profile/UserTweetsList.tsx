import React, {useEffect} from "react";
import {Tweet} from "../../components/tweet/Tweet";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import useLazyLoad from "../../hooks/useLazyLoad";
import {clearTweets, getUserTweets} from "../../redux/tweets/actionCreators";
import Empty from "./Empty";

const UserTweetsList = ({triggerRef, userId}: any) => {
    const tweets = useAppSelector(state => state.tweets.items);
    const loadingStatus = useAppSelector(state => state.tweets.loading);
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearTweets());
        }
    }, []);

    useLazyLoad({
        trigger: triggerRef,
        getData: (skip: number, size: number) => {
            dispatch(getUserTweets(userId, skip, size));
        },
        options: {}}
    );

    return tweets.length === 0 && !loadingStatus ? 
    <Empty />
    :
    <>
        {
            tweets.map((tweet: any, key: number) => <Tweet
                key={`tweet_${key}`}
                tweet={tweet}
            />)
        }
    </>
}

export default UserTweetsList;