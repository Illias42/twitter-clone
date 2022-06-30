import {IUser, IUserData} from "../../redux/user/contracts/user";
import Box from "@material-ui/core/Box";
import styles from "./followers.module.scss";
import Avatar from "@material-ui/core/Avatar";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "../../utils/axios";
import {reloadUserData} from "../../redux/user/actionCreators";
import React from "react";
import {useAppSelector, useAppDispatch} from "../../hooks/redux";

const User = ({_id, name, avatar}: IUser) => {
    const navigator = useNavigate();
    const myId = useAppSelector(state => (state.user.userData as IUserData)._id);
    const myFollowings = useAppSelector(state => (state.user.userData as IUserData).followings);
    const dispatch = useAppDispatch();

    const isMyProfile = _id === myId;

    const follow = (e: any) => {
        e.stopPropagation();
        axios.post(`/profile/${_id}/follow`)
            .then(() => dispatch(reloadUserData()));
    }

    const unfollow = (e: any) => {
        e.stopPropagation();
        axios.post(`/profile/${_id}/unfollow`)
            .then(() => dispatch(reloadUserData()));
    }

    const toProfile = () => {
        navigator(`/profile/${_id}`);
    }

    return <Box className={styles.user} onClick={toProfile}>
        <Avatar src={avatar}/>
        <Box className={styles.content}>
            {name}<span>@{name}</span>
        </Box>
        <Box>
            {!isMyProfile && <>
                {myFollowings.includes(_id as string) ?
                    <Button onClick={unfollow} id="followingBtn"
                            variant="outlined"><span>Following</span></Button> :
                    <Button onClick={follow} id="followBtn" variant="contained">Follow</Button>
                }
            </>}
        </Box>
    </Box>
}

export default User