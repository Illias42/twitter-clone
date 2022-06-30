import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import useLazyLoad from "../../hooks/useLazyLoad";
import {clearTweets, getLikedTweets} from "../../redux/tweets/actionCreators";
import {Tweet} from "../../components/tweet/Tweet";
import React, {useEffect} from "react";
import Empty from "./Empty";

const LikedTweetsList = ({triggerRef, userId}: any) => {
    const tweets = useAppSelector(state => state.tweets.items);
    const loadingStatus = useAppSelector(state => state.tweets.loading);
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearTweets());
        }
    }, [])

    useLazyLoad({
        trigger: triggerRef,
        getData: (skip: number, size: number) => {
            dispatch(getLikedTweets(userId, skip, size));
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

export default LikedTweetsList;