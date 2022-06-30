import React from "react";
import useLazyLoad from "../../hooks/useLazyLoad";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {getBookmarks} from "../../redux/tweets/actionCreators";
import {Tweet} from "../../components/tweet/Tweet";


const BookmarksList = ({triggerRef}: any) => {
    const tweets = useAppSelector(state => state.tweets.items);
    const dispatch = useAppDispatch();

    useLazyLoad({
        trigger: triggerRef,
        getData: async (skip: number, size: number) => {
            dispatch(getBookmarks(skip, size));
        },
        options: {}
    });

    return <>
        {tweets && tweets.map((tweet) => (
            <Tweet
                key={`-${tweet._id}-`}
                tweet={tweet}
            />
        ))}
    </>
}

export default BookmarksList;