import React, {ChangeEvent, useState} from 'react';
import styles from "./tweetform.module.scss";

import {createTweet, getTweets} from "../../redux/tweets/actionCreators";
import {IUserData} from "../../redux/user/contracts/user";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';

export const AddTweetForm: React.FC = (): React.ReactElement => {
    const [pics, setPics] = useState<FileList | never[]>([]);
    const [urls, setUrls] = useState<string[]>([]);
    const [text, setText] = useState<string>('');

    const user = useAppSelector(state => state.user.userData as IUserData);
    const dispatch = useAppDispatch();

    const sendData = () => {
        const data = new FormData();
        data.append("text", text);
        Array.prototype.forEach.call(pics, function (pic) {
            data.append("pics", pic)
        });
        data.append('userId', user._id)
        console.log("data", data.get("pics"));
        dispatch(createTweet(data));
        setText('');
        setPics([]);
        setUrls([]);
        setTimeout(() => dispatch(getTweets(0, 5)), 600);
    }

    const uploadPics = (e: ChangeEvent<HTMLInputElement>) => {
        setPics(e.target.files as FileList);
        const urls: string[] = [];
        Array.prototype.forEach.call(e.target.files, function (file) {
            urls.push(URL.createObjectURL(file));
        });
        setUrls(urls);
    }

    return (
        <Paper>
            <Grid container className={styles.container}>
                <Grid item xs={1}>
                    <Avatar
                        style={{marginLeft: '10px'}}
                        src={user.avatar}
                        alt="User avatar"
                    />
                </Grid>
                <Grid item xs={11}>
                    <TextareaAutosize
                        className={styles.textArea}
                        minRows={4}
                        maxRows={10}
                        placeholder="Create tweet"
                        value={text}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box style={{marginLeft: 60}}>
                        {urls &&
                            urls.map((url) => (<img style={{margin: 5, maxWidth: 126, height: 76}} src={url}/>))
                        }
                    </Box>
                </Grid>
                <Grid item xs={12} className={styles.footer}>
                    <Box>
                        <input accept="image/*" type="file" onChange={uploadPics} hidden multiple id="file_input"/>
                        <label htmlFor="file_input">
                            <IconButton component="span">
                                <ImageOutlinedIcon color="primary"/>
                            </IconButton>
                        </label>
                        <IconButton>
                            <SentimentSatisfiedOutlinedIcon color="primary"/>
                        </IconButton>
                    </Box>

                    <Box style={{display: "flex", alignItems: "center"}}>
                        {/*<CircularProgress size={20} className={styles.progress} variant="determinate" value={45}/>*/}
                        <Button variant="contained" color="primary" onClick={sendData}>
                            Tweet
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    )
}