import React from 'react';
import {Box, Avatar, Paper, Typography, IconButton} from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import styles from "./reply.module.scss";

interface ReplyProps {
    text: string,
    user: {
        _id: string,
        name: string,
        avatar: string
    }
}

export const Reply: React.FC<ReplyProps> = (props: ReplyProps): React.ReactElement => {
    return (
        <Paper className={styles.container}>
            <Avatar
                src={`http://localhost:8000/images/avatars/${props.user.avatar}`}
                alt="User avatar"
            />
            <Box className={styles.content}>
                <Typography>
                    <b>{props.user.name}</b> <span
                    className={styles.userName}>@{props.user.name} · 18 год</span>
                </Typography>
                <Typography variant="body1">
                    {props.text}
                </Typography>
            </Box>
            <Box>
                <IconButton color="primary">
                    <FavoriteBorderIcon fontSize="small"/>
                </IconButton>
                <span>1</span>
            </Box>
        </Paper>
    )
}