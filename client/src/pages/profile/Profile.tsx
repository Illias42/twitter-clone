import React, {useEffect, useRef, useState} from "react";
import styles from "./profile.module.scss";
import {useNavigate} from "react-router-dom";
import {IUserData} from "../../redux/user/contracts/user";
import {useParams} from "react-router";
import axios from "../../utils/axios";
import {setEnd} from "../../redux/tweets/actionCreators";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {reloadUserData} from "../../redux/user/actionCreators";

import UserTweetsList from "./UserTweetsList";
import LikedTweetsList from "./LikedTweetsList";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';

const Profile = () => {
    const [userData, setUserData] = useState<any>({name: "", id: "", followers: [], followings: []});
    const [activeTab, setActiveTab] = useState<"Tweets" | "Likes">("Tweets");
    const [isMyProfile, setIsMyProfile] = useState<boolean>(true);
    const triggerRef = useRef(null);

    const {id} = useParams();
    const navigator = useNavigate();

    const loadingStatus = useAppSelector(state => state.tweets.loading);
    const user = useAppSelector(state => state.user.userData as IUserData);
    const end = useAppSelector(state => state.tweets.end);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setEnd(false));
        if (id === user._id) {
            setIsMyProfile(true);
            setUserData(user);
        } else {
            setIsMyProfile(false);
            axios.get(`/profile/${id}`).then(res => setUserData(res.data));
        }
    }, []);


    const follow = () => {
        axios.post(`/profile/${id}/follow`)
            .then(() => dispatch(reloadUserData()));
    }

    const unfollow = () => {
        axios.post(`/profile/${id}/unfollow`)
            .then(() => dispatch(reloadUserData()));
    }

    return (
        <Box>
            <Box className={styles.pageHeader}>
                <IconButton onClick={() => navigator(-1)}>
                    <ArrowBackRoundedIcon/>
                </IconButton>
                {userData.name}
            </Box>
            <Box className={styles.profileHeader}>
                <Box className={styles.profileBackground}/>
                <Box className={styles.userDescription}>
                    <Box>
                        <Avatar src={`http://localhost:8000/images/avatars/${userData.avatar}`}/>
                        {!isMyProfile && <>
                            {user.followings.includes(id as string) ?
                                <Button onClick={unfollow} id="followingBtn"
                                        variant="outlined"><span>Following</span></Button> :
                                <Button onClick={follow} id="followBtn" variant="contained">Follow</Button>
                            }
                        </>}
                    </Box>
                    <Box>
                        <div className={styles.name}>
                            {userData.name} {userData.surname}
                        </div>
                        <div className={styles.follows}>
                            <span onClick={() => navigator(`/profile/${id}/follows`)}>
                                {userData.followings.length} Following
                            </span>
                            <span onClick={() => navigator(`/profile/${id}/follows`)}>
                                {userData.followers.length} Followers
                            </span>
                        </div>
                    </Box>
                </Box>
            </Box>
            <Box className={styles.navigation}>
                <Box
                    className={activeTab === "Tweets" ? "active" : ""}
                    onClick={() => {
                        setActiveTab("Tweets")
                        dispatch(setEnd(false));
                    }}
                >
                    <Typography>Tweets</Typography>
                </Box>
                <Box
                    className={activeTab === "Likes" ? "active" : ""}
                    onClick={() => {
                        setActiveTab("Likes")
                        dispatch(setEnd(false));
                    }}
                >
                    <Typography>Likes</Typography>
                </Box>
            </Box>
            <Box>
                {activeTab === "Tweets" &&
                    <UserTweetsList triggerRef={triggerRef} userId={id} />
                }

                {activeTab === "Likes" &&
                    <LikedTweetsList triggerRef={triggerRef} userId={id} />
                }

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
        </Box>
    )
}

export default Profile;