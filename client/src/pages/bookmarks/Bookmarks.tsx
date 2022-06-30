import React, {useEffect, useRef} from 'react';
import styles from "../home/home.module.scss";

import {useAppSelector, useAppDispatch} from "../../hooks/redux";
import {useNavigate} from "react-router-dom";
import {setEnd} from "../../redux/tweets/actionCreators";

import BookmarksList from "./BookmarksList";

import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import CircularProgress from '@material-ui/core/CircularProgress';

const Bookmarks: React.FC = () => {
    const navigator = useNavigate();
    const dispatch = useAppDispatch();
    const loadingStatus = useAppSelector(state => state.tweets.loading);
    const {isAuthenticated} = useAppSelector(state => state.user);
    const end = useAppSelector(state => state.tweets.end);
    const triggerRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigator("/signin");
        }
        dispatch(setEnd(false));
    }, [])

    return (
            <Box className={styles.tweetsWrapper}>
                <Box className={styles.tweetsHeader}>
                    <IconButton onClick={() => navigator(-1)}>
                        <ArrowBackRoundedIcon />
                    </IconButton>
                    Bookmarks
                </Box>

                <BookmarksList triggerRef={triggerRef}/>

                {!end ?
                    <>{
                        loadingStatus ?
                            <Box style={{
                                minHeight: 200,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <CircularProgress color="primary" disableShrink/>
                            </Box> :
                            <div ref={triggerRef} style={{minHeight: 200}}></div>
                    }</> :
                    <Box style={{minHeight: 200}}></Box>
                }
            </Box>
    )
}

export default Bookmarks;