import React, {useEffect, useRef} from 'react';
import styles from "./home.module.scss";
import {useNavigate} from "react-router-dom";
import {useAppSelector, useAppDispatch} from "../../hooks/redux";
import {setEnd} from "../../redux/tweets/actionCreators";

import {AddTweetForm} from '../../components/tweetform/AddTweetForm';
import CircularProgress from '@mui/material/CircularProgress';
import Box from "@mui/material/Box";
import TweetsList from "./TweetsList";

const Home: React.FC = (): React.ReactElement => {
    const navigator = useNavigate();
    const triggerRef = useRef(null);
    const dispatch = useAppDispatch();

    const loading = useAppSelector(state => state.tweets.loading);
    const {isAuthenticated} = useAppSelector(state => state.user);
    const end = useAppSelector(state => state.tweets.end);

    useEffect(() => {
        if (!isAuthenticated) {
            navigator("/signin");
        }
        dispatch(setEnd(false));
    }, [])



    return (
            <Box className={styles.tweetsWrapper}>
                <Box className={styles.tweetsHeader}>
                    Main
                </Box>
                <AddTweetForm/>

                <TweetsList triggerRef={triggerRef}/>

                {!end ?
                    <>{
                        loading ?
                            <Box className={styles.loader}>
                                <CircularProgress color="primary" disableShrink/>
                            </Box> :
                            <div ref={triggerRef} style={{minHeight: 200}}></div>
                    }</>:
                    <Box style={{minHeight: 200}}></Box>
                }
            </Box>
    )
}

export default Home;