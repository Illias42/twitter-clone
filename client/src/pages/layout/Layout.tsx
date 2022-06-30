import React, {useEffect} from 'react';
import styles from "./layout.module.scss";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {RootState} from "../../redux/store";
import {IUserData} from "../../redux/user/contracts/user";
import { Outlet } from "react-router-dom";

import UserDialog from "../../components/dialogs/user/User";
import CreateTweetDialog from "../../components/dialogs/createtweet/CreateTweet";
import ErrorBoundary from "../../components/errorboundary/ErrorBoundary";

import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Hidden from '@material-ui/core/Hidden';

import TwitterIcon from '@material-ui/icons/Twitter';
import SearchIcon from '@material-ui/icons/Search';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';


const Layout: React.FC = ({children}) => {
    const navigator = useNavigate();
    const user = useSelector((state: RootState) => state.user.userData as IUserData);
    const {isAuthenticated} = useSelector((state: RootState) => state.user);
    const [open, setModalOpen] = React.useState<'CreateTweet' | 'User' | 'Close'>('Close');

    useEffect(() => {
        if (!isAuthenticated) {
            navigator("/signin");
        }
    })

    function handleModalClose(): void {
        setModalOpen('Close');
    }

    return (
        <Container maxWidth="lg">
            <UserDialog open={open === "User"} onClose={handleModalClose}/>
            <CreateTweetDialog open={open === "CreateTweet"} close={() => setModalOpen("Close")}
                               onClose={handleModalClose}/>

            <Grid container>
                <Grid className={styles.leftSide} item xs={1} sm={1} md={1}>
                    <List className={styles.menuList}>
                        <ListItem className={styles.listItem}>
                            <IconButton onClick={() => navigator('/')} color="primary">
                                <TwitterIcon/>
                            </IconButton>
                        </ListItem>

                        <ListItem onClick={() => navigator('/')} className={styles.listItem}>
                            <IconButton>
                                <HomeRoundedIcon/>
                            </IconButton>
                        </ListItem>

                        <ListItem className={styles.listItem}>
                            <IconButton>
                                <SearchIcon/>
                            </IconButton>
                        </ListItem>

                        <ListItem className={styles.listItem}>
                            <ErrorBoundary>
                                <IconButton onClick={() => {
                                    throw new Error("test")
                                }}>
                                    <NotificationsNoneOutlinedIcon/>
                                </IconButton>
                            </ErrorBoundary>

                        </ListItem>

                        <ListItem className={styles.listItem}>
                            <IconButton>
                                <EmailOutlinedIcon/>
                            </IconButton>
                        </ListItem>

                        <ListItem className={styles.listItem}>
                            <IconButton onClick={() => navigator('/bookmarks')}>
                                <BookmarkBorderOutlinedIcon/>
                            </IconButton>
                        </ListItem>

                        <ListItem className={styles.listItem}>
                            <IconButton onClick={() => navigator(`/profile/${user._id}`)}>
                                <PersonOutlineOutlinedIcon/>
                            </IconButton>
                        </ListItem>

                        <ListItem className={styles.listItem}>
                            <IconButton color="primary" onClick={() => setModalOpen("CreateTweet")}>
                                <AddCircleRoundedIcon sx={{width: 46, height: 46}}/>
                            </IconButton>
                        </ListItem>
                    </List>

                    <IconButton className={styles.userOptions} onClick={() => setModalOpen("User")}>
                        <Avatar src={user.avatar}/>
                    </IconButton>

                </Grid>
                <Grid item xs={11} sm={11} md={8}>

                    <Outlet />

                </Grid>
                <Hidden smDown>
                    <Grid className={styles.rightSide} item md={3}>
                        <TextField className={styles.searchField} size="small" variant="outlined"
                                   label="Search in Twitter"/>
                        <Paper className={styles.trendsContainer}>
                            <Typography className={styles.trendsTitle}>Trends</Typography>
                            <Paper className={styles.trendsList}>
                                <Paper className={styles.trend}>
                                    <Typography>#tag</Typography>
                                    <Typography>10K Tweets</Typography>
                                </Paper>
                                <Paper className={styles.trend}>
                                    <Typography>#tag</Typography>
                                    <Typography>10K Tweets</Typography>
                                </Paper>
                                <Paper className={styles.trend}>
                                    <Typography>#tag</Typography>
                                    <Typography>10K Tweets</Typography>
                                </Paper>
                            </Paper>
                        </Paper>
                    </Grid>
                </Hidden>
            </Grid>
        </Container>
    )
}

export default Layout;