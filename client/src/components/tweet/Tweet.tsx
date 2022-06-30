import React, {useState} from 'react';

import {Box, Avatar, Paper, Typography, Grid, IconButton} from '@material-ui/core';

import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../../redux/store";
import {IUserData} from "../../redux/user/contracts/user";
import {Tweet as ITweet} from "../../redux/tweets/contracts/state";
import axios from "../../utils/axios";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";

import styles from "./tweet.module.scss";
import {reloadUserData} from "../../redux/user/actionCreators";

interface TweetProps {
    tweet: ITweet
}

export const Tweet: React.FC<TweetProps> = ({tweet}: TweetProps): React.ReactElement => {
    const navigator = useNavigate();
    const dispatch = useDispatch();
    const [likes, setLikes] = useState<number>(tweet.likes);
    const [bookmarksCount, setBookmarksCount] = useState<number>(tweet.bookmarksCount);
    const {likedTweets, bookmarks} = useSelector((state: RootState) => state.user.userData as IUserData);
    const [counter, setCounter] = useState<number>(0);

    const nextPicture = (e: any) => {
        e.stopPropagation();
        if (counter >= (tweet.pics.length - 1)) {
            setCounter(0);
        } else {
            setCounter(counter + 1);
        }
    }

    const prevPicture = (e: any) => {
        e.stopPropagation();
        if (counter <= 0) {
            setCounter(tweet.pics.length - 1);
        } else {
            setCounter(counter - 1);
        }
    }

    const like = async (e: any) => {
        e.stopPropagation();
        if (likedTweets.includes(tweet._id as string)) {
            const response = await axios.post(`/tweet/${tweet._id}/unlike`);
            if (response.status === 200) {
                setLikes(likes - 1);
                dispatch(reloadUserData());
            }
        } else {
            const response = await axios.post(`/tweet/${tweet._id}/like`);
            if (response.status === 200) {
                setLikes(likes + 1);
                dispatch(reloadUserData());
            }
        }
    }

    const bookmark = async (e: any) => {
        e.stopPropagation();
        if (bookmarks.includes(tweet._id as string)) {
            const response = await axios.post(`/tweet/${tweet._id}/removebookmark`);
            if (response.status === 200) {
                setBookmarksCount(bookmarksCount - 1);
                dispatch(reloadUserData());
            }
        } else {
            const response = await axios.post(`/tweet/${tweet._id}/addbookmark`);
            if (response.status === 200) {
                setBookmarksCount(bookmarksCount + 1);
                dispatch(reloadUserData());
            }
        }
    }

    return (
        <Paper className={styles.tweet} onClick={() => tweet._id && navigator(`/tweet/${tweet._id}`)}>
            <Grid container>
                <Grid item xs={1}>
                    <IconButton onClick={(e) => {
                        e.stopPropagation();
                        navigator(`/profile/${tweet.user._id}`);
                    }}>
                        <Avatar src={`http://localhost:8000/images/avatars/${tweet.user.avatar}`} alt="User avatar"/>
                    </IconButton>
                </Grid>
                <Grid style={{paddingLeft: 10}} item xs={11}>
                    <Typography>
                        <b>{tweet.user.name}</b> <span
                        className={styles.tweetsUserName}>@{tweet.user.name} · 18 год</span>
                    </Typography>
                    <Typography variant="body1">
                        {tweet.text}
                    </Typography>
                </Grid>
                <Grid style={{paddingLeft: 60}} item xs={12}>

                    <Box className={styles.pictures}>
                        {tweet.pics.length > 0 && <>
                            <IconButton className={styles.navArrow} style={{marginRight: -48}} onClick={prevPicture}
                                        color="primary">
                                <ArrowBackIosRoundedIcon/>
                            </IconButton>
                            {tweet.pics.map((pic, index) => (
                                <img
                                    key={`${tweet._id}-${index}`}
                                    style={index === counter ? {display: "block"} : {}}
                                    src={`http://localhost:8000/images/${pic}`}
                                />
                            ))
                            }
                            <IconButton className={styles.navArrow} style={{marginLeft: -48}} onClick={nextPicture}
                                        color="primary">
                                <ArrowForwardIosRoundedIcon/>
                            </IconButton>
                        </>}
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box className={styles.tweetButtons}>
                        <div>
                            <IconButton color="primary" onClick={(like)}>
                                {likedTweets.includes(tweet._id) ?
                                    <FavoriteIcon fontSize="small"/> :
                                    <FavoriteBorderIcon fontSize="small"/>
                                }
                            </IconButton>
                            <span>{likes}</span>
                        </div>

                        <div>
                            <IconButton color="primary">
                                <ChatBubbleOutlineRoundedIcon fontSize="small"/>
                            </IconButton>
                            <span>{tweet.replyCount}</span>
                        </div>

                        <div>
                            <IconButton color="primary" onClick={bookmark}>
                                {bookmarks.includes(tweet._id) ?
                                    <BookmarkIcon fontSize="small"/> :
                                    <BookmarkBorderOutlinedIcon fontSize="small"/>
                                }
                            </IconButton>
                            <span>{bookmarksCount}</span>
                        </div>

                    </Box>
                </Grid>
            </Grid>
        </Paper>
    )
}