import React, {ChangeEvent, useState} from "react";
import {RootState} from "../../../redux/store";
import {IUserData} from "../../../redux/user/contracts/user";
import {createTweet, getTweets} from "../../../redux/tweets/actionCreators";
import {Box, Button, Dialog, DialogActions, DialogContent, Grid, IconButton, TextareaAutosize} from "@material-ui/core";
import {Avatar} from "@mui/material";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import SentimentSatisfiedOutlinedIcon from "@material-ui/icons/SentimentSatisfiedOutlined";
import styles from "./createtweet.module.scss";
import {useSelector, useDispatch} from "react-redux";

import {motion, AnimatePresence} from "framer-motion";
import {overlayAnimation, modalAnimation} from "../animations";

interface ModalProps {
    open: boolean,
    onClose: () => void,
    close?: () => void
}

const CreateTweetDialog: React.FC<ModalProps> = ({open, close, onClose}) => {
    const user = useSelector((state: RootState) => (state.user.userData as IUserData));
    const dispatch = useDispatch();

    const [text, setText] = useState<string>('')

    const sendData = () => {
        const data = new FormData();
        data.append('text', text);
        data.append('userId', user._id);
        dispatch(createTweet(data));
        setTimeout(() => dispatch(getTweets(0, 5)), 600);
        if (close !== undefined) close();
        setText('');
    }

    return (
        <AnimatePresence>
            {open &&
                <motion.div
                    {...overlayAnimation}
                    className={styles.overlay}
                    onClick={onClose}
                >
                    <motion.div
                        {...modalAnimation}
                        className={styles.container}
                        onClick={(e: any) => e.stopPropagation()}
                    >
                        <Box className={styles.content}>
                            <Avatar src={`http://localhost:8000/images/avatars/${user.avatar}`}/>
                            <TextareaAutosize
                                className={styles.textArea}
                                minRows={4}
                                maxRows={10}
                                value={text}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                                placeholder="Create tweet"
                            />
                        </Box>
                        <Box className={styles.buttons}>
                            <Box>
                                <IconButton>
                                    <ImageOutlinedIcon color="primary"/>
                                </IconButton>
                                <IconButton>
                                    <SentimentSatisfiedOutlinedIcon color="primary"/>
                                </IconButton>
                            </Box>
                            <Box style={{display: "flex", alignItems: "center"}}>
                                <Button variant="contained" color="primary" onClick={sendData}>
                                    Tweet
                                </Button>
                            </Box>
                        </Box>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default CreateTweetDialog;