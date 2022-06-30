import React, {useEffect} from "react";
import useLazyLoad from "../../hooks/useLazyLoad";
import {clearTweets, getTweets} from "../../redux/tweets/actionCreators";
import {Tweet} from "../../components/tweet/Tweet";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";


const TweetsList = ({triggerRef}: any) => {
    const tweets = useAppSelector(state => state.tweets.items);
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearTweets());
        }
    }, []);

    useLazyLoad({
        trigger: triggerRef,
        getData: (skip: number, size: number) => {
            dispatch(getTweets(skip, size));
        },
        options: {}}
    );

    return <>
        {tweets && tweets.map((tweet) => (
            <Tweet
                key={`-${tweet._id}-`}
                tweet={tweet}
            />
        ))}
    </>
}

export default TweetsList;