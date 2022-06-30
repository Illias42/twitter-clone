import React, {ChangeEvent, useEffect, useState} from 'react';
import styles from "./tweetpage.module.scss";
import {useNavigate, useParams} from "react-router-dom";
import {useAppSelector, useAppDispatch} from "../../hooks/redux";
import {getTweet, replyTweet, getReplies} from "../../redux/tweets/actionCreators";
import {IUserData} from "../../redux/user/contracts/user";

import {Paper, IconButton, Button, TextareaAutosize} from '@material-ui/core';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {Avatar} from "@mui/material";

import {Reply} from '../../components/reply/Reply';
import {Tweet} from '../../components/tweet/Tweet';

const TweetPage: React.FC = (): React.ReactElement => {
    const [replyText, setReplyText] = useState<string>('');

    const navigator = useNavigate();
    const {id} = useParams();

    let tweet = useAppSelector(state => state.tweets.items[0]);
    let replies = useAppSelector(state => state.tweets.replies);
    const {isAuthenticated} = useAppSelector(state => state.user);
    const user = useAppSelector(state => state.user.userData as IUserData);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            navigator("/signin");
        }
        dispatch(getTweet(id as string));
        dispatch(getReplies(id as string));
    }, [])

    const sendReply = () => {
        setReplyText('');
        dispatch(replyTweet({id: (id as string), text: replyText}));
        setTimeout(() => dispatch(getReplies(id as string)), 400);
    }

    return (
            <Paper variant="outlined" className={styles.tweetsWrapper}>
                <Paper className={styles.tweetsHeader} variant="outlined">
                    <IconButton onClick={() => navigator(-1)}>
                        <ArrowBackRoundedIcon/>
                    </IconButton>
                    Tweet
                </Paper>
                {tweet &&
                    <><Tweet
                        key={tweet._id}
                        tweet={tweet}
                    />
                        <Paper className={styles.replyForm}>
                            <Avatar
                                src={`http://localhost:8000/images/avatars/${user.avatar}`}
                                alt="User avatar"
                            />
                            <TextareaAutosize
                                className={styles.textarea}
                                minRows={2}
                                maxRows={10}
                                value={replyText}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
                                placeholder="Reply this tweet"
                            />

                            <Button color="primary" variant="contained" onClick={sendReply}>
                                Reply
                            </Button>
                        </Paper>
                        <Paper className={styles.replies}>
                            {replies &&
                                replies.map((reply: any, key: number) => <Reply key={key} text={reply.text} user={reply.user}><h1>asd</h1></Reply>)
                            }
                        </Paper>
                    </>}
            </Paper>
    )
}

export default TweetPage;