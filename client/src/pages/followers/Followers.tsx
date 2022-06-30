import React, {useLayoutEffect, useState} from 'react';

import {useAppSelector, useAppDispatch} from "../../hooks/redux";
import {useNavigate} from "react-router-dom";

import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/Button";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";

import styles from "./followers.module.scss";
import Typography from "@mui/material/Typography";
import {getFollowers, getFollowings} from "../../redux/user/actionCreators";
import {useParams} from "react-router-dom";
import User from "./User";

const Followers: React.FC = () => {
    const navigator = useNavigate();
    const dispatch = useAppDispatch();
    const users = useAppSelector(state => state.user.relatedUsers);
    const {isAuthenticated} = useAppSelector(state => state.user);
    const [activeTab, setActiveTab] = useState<"Followers" | "Followings">("Followers")
    const {id} = useParams();

    useLayoutEffect(() => {
        if (!isAuthenticated) {
            navigator("/signin");
        }
        dispatch(getFollowers(id as string));
    }, [])

    return (
        <Box className={styles.wrapper}>
            <Box className={styles.header}>
                <IconButton onClick={() => navigator(-1)}>
                    <ArrowBackRoundedIcon/>
                </IconButton>
                Profile
            </Box>


            <Box className={styles.navigation}>
                <Box
                    className={activeTab === "Followers" ? "active" : ""}
                    onClick={() => {
                        dispatch(getFollowers(id as string));
                        setActiveTab("Followers");
                    }}
                >
                    <Typography>Followers</Typography>
                </Box>
                <Box
                    className={activeTab === "Followings" ? "active" : ""}
                    onClick={() => {
                        dispatch(getFollowings(id as string));
                        setActiveTab("Followings")
                    }}
                >
                    <Typography>Followings</Typography>
                </Box>
            </Box>
            {users && users.map((user) =>
                <User {...user} />
            )}
        </Box>
    )
}

export default Followers;