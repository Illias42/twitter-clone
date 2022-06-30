import React from "react";
import styles from "./user.module.scss";
import {RootState} from "../../../redux/store";
import {IUserData} from "../../../redux/user/contracts/user";
import {Button} from "@material-ui/core";
import {Avatar, Paper, Typography} from "@mui/material";
import {logoutUser} from "../../../redux/user/actionCreators";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

import {motion, AnimatePresence} from "framer-motion";
import {overlayAnimation, modalAnimation} from "../animations";

interface ModalProps {
    open: boolean,
    onClose: () => void,
    close?: () => void
}

const UserDialog: React.FC<ModalProps> = ({open, onClose}) => {
    const user = useSelector((state: RootState) => state.user.userData as IUserData);
    const navigator = useNavigate();
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(logoutUser())
        navigator("/signin");
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
                        <div className={styles.title}>
                            <Avatar src={`http://localhost:8000/images/avatars/${user.avatar}`}/>
                            <div className={styles.user}>
                                {user.name}
                                <span>@{user.name}</span>
                            </div>
                        </div>
                        <div>
                            <Button variant="contained" color="secondary" onClick={logout} fullWidth>
                                Log out
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default UserDialog;