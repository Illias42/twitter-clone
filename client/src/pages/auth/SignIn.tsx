import React, {useEffect} from "react";
import styles from "./auth.module.scss";
import {useAppSelector} from "../../hooks/redux";
import {useNavigate} from "react-router-dom";
import {SignInModal, SignUpModal} from "../../components/dialogs/auth/Auth";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import TwitterIcon from '@material-ui/icons/Twitter';
import SearchIcon from '@material-ui/icons/Search';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';

const SignIn: React.FC = () => {
    const [open, setModalOpen] = React.useState<'Sign In' | 'Sign Up' | 'Close'>('Close');
    const navigator = useNavigate();

    const {isAuthenticated} = useAppSelector(state => state.user);

    useEffect(() => {
        if (isAuthenticated) {
            navigator("/");
        }
    })

    function handleModalClose() {
        setModalOpen('Close');
    }

    const openSignIn = () => setModalOpen("Sign In");
    const openSignUp = () => setModalOpen("Sign Up");

    return (
        <div className={styles.wrapper}>
            <SignInModal open={open === 'Sign In'} onClose={handleModalClose}/>
            <SignUpModal open={open === 'Sign Up'} onClose={handleModalClose}/>
            <Hidden mdDown>
                <Box className={styles.blueSide}>
                    <TwitterIcon color="primary" className={styles.blueSideBackgroundIcon}/>
                    <ul className={styles.blueSideListInfo}>
                        <li>
                            <Typography gutterBottom variant="h6">
                                <SearchIcon className={styles.blueSideListInfoIcons}/>
                                Follow your interests.
                            </Typography>
                        </li>
                        <li>
                            <Typography gutterBottom variant="h6">
                                <PeopleAltOutlinedIcon className={styles.blueSideListInfoIcons}/>
                                Hear what people are talking about.
                            </Typography>
                        </li>
                        <li>
                            <Typography gutterBottom variant="h6">
                                <ChatOutlinedIcon className={styles.blueSideListInfoIcons}/>
                                Join the conversation.
                            </Typography>
                        </li>
                    </ul>
                </Box>
            </Hidden>
            <Box className={styles.loginSide}>
                <div className={styles.loginSideWrapper}>
                    <TwitterIcon color="primary" className={styles.loginSideTwitterIcon}/>
                    <Typography className={styles.loginSideTitle}>See what's happening in the world right now</Typography>
                    <Typography>Join Twitter today</Typography>
                    <br/>
                    <Button  onClick={openSignUp} variant="contained" color="primary">Sing Up</Button>
                    <br/>
                    <Button
                        onClick={openSignIn}
                        variant="outlined"
                        color="primary"
                    >
                            Login
                    </Button>
                </div>
            </Box>
        </div>
    );
}

export default SignIn;