import React, {ChangeEvent, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import classNames from "classnames";
import styles from "./auth.module.scss"

import SignUpValidation from "../../../validation/Signup";
import LoginValidation from "../../../validation/Login";

import {fetchUser, registerUser} from "../../../redux/user/actionCreators";

import Button from '@material-ui/core/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@material-ui/core/TextField';
import Avatar from "@mui/material/Avatar";
import Typography from "@material-ui/core/Typography";

import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

import {motion, AnimatePresence} from "framer-motion";
import {overlayAnimation, modalAnimation} from "../animations";

interface ModalProps {
    open: boolean,
    onClose: () => void,
    close?: () => void
}

export const SignInModal: React.FC<ModalProps> = ({open, onClose}) => {
    const dispatch = useDispatch();
    const {control, handleSubmit, reset, formState: {errors}} = useForm({
        resolver: yupResolver(LoginValidation)
    });

    const sendData = (data: any) => {
        dispatch(fetchUser({username: data.email, password: data.password}));
        reset();
    }

    return (<AnimatePresence>
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
                <Typography variant="h5" id="form-dialog-title">
                    Sign In
                </Typography>
                <form onSubmit={handleSubmit(sendData)}>
                    <Controller
                        name="email"
                        control={control}
                        render={({field: {value, onChange}, fieldState: {invalid, error}}) =>
                            <TextField
                                autoFocus
                                id='email'
                                label='Email'
                                variant="standard"
                                fullWidth
                                value={value}
                                onChange={onChange}
                                error={invalid}
                                helperText={error?.message}
                            />}
                    />

                    <Controller
                        name="password"
                        control={control}
                        render={({field: {value, onChange}, fieldState: {invalid, error}}) =>
                            <TextField
                                margin='dense'
                                id='password'
                                label='Password'
                                type="password"
                                variant="standard"
                                value={value}
                                onChange={onChange}
                                fullWidth
                                error={invalid}
                                helperText={error?.message}
                            />}
                    />


                    <Button disabled={!!errors?.email || !!errors?.password} variant="contained" color="primary"
                            fullWidth
                            type="submit">
                        Sign In
                    </Button>
                </form>

            </motion.div>
            </motion.div>
        }</AnimatePresence>)
}

export const SignUpModal: React.FC<ModalProps> = ({open, onClose}) => {
    const [avatar, setAvatar] = useState<any>(null);
    const [avatarUrl, setAvatarUrl] = useState<any>(null);
    const navigator = useNavigate();
    const dispatch = useDispatch();

    const {control, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(SignUpValidation)
    });

    const isInvalid = !!errors?.name || !!errors?.surname || !!errors?.email || !!errors?.password || !!errors?.confirmPassword;

    const selectAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        setAvatar(e.target.files[0]);
        // @ts-ignore
        setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }

    const sendData = (data: any) => {
        const form = new FormData();
        for (let key in data) {
            form.append(key, data[key]);
        }
        form.append("avatar", avatar);
        dispatch(registerUser(form));
        // axios.post("/register", form)
    }

    return (<AnimatePresence>
        {open &&
            <motion.div
                {...overlayAnimation}
                className={styles.overlay}
                onClick={onClose}
            >
                <motion.div {...modalAnimation}
                            className={classNames(styles.container)}
                            onClick={(e: any) => e.stopPropagation()}>
                    <div className={styles.title}>
                        <input
                            accept="image/*"
                            type="file"
                            hidden
                            id="avatar_input"
                            onChange={selectAvatar}/>
                        <label htmlFor="avatar_input">
                            <IconButton component="span">
                                {avatarUrl ?
                                    <Avatar src={avatarUrl}/> :
                                    <Avatar src={"/images/avatars/blank.png"}/>
                                }
                            </IconButton>
                        </label>
                    </div>
                    <form onSubmit={handleSubmit(sendData)}>

                        <Controller
                            name="name"
                            control={control}
                            render={({field: {value, onChange}, fieldState: {invalid, error}}) =>
                                <TextField
                                    autoFocus
                                    margin='dense'
                                    id='name'
                                    label='Name'
                                    fullWidth
                                    value={value}
                                    onChange={onChange}
                                    error={invalid}
                                    helperText={error?.message}
                                />}
                        />


                        <Controller
                            name="surname"
                            control={control}
                            render={({field: {value, onChange}, fieldState: {invalid, error}}) =>

                                <TextField
                                    margin='dense'
                                    id='surname'
                                    label='Surname'
                                    fullWidth
                                    value={value}
                                    onChange={onChange}
                                    error={invalid}
                                    helperText={error?.message}
                                />}
                        />


                        <Controller
                            name="email"
                            control={control}
                            render={({field: {value, onChange}, fieldState: {invalid, error}}) =>

                                <TextField
                                    margin='dense'
                                    id='email'
                                    label='Email'
                                    fullWidth
                                    value={value}
                                    onChange={onChange}
                                    error={invalid}
                                    helperText={error?.message}
                                />}
                        />


                        <Controller
                            name="password"
                            control={control}
                            render={({field: {value, onChange}, fieldState: {invalid, error}}) =>
                                <TextField
                                    margin='dense'
                                    id='password'
                                    label='Password'
                                    type="password"
                                    fullWidth
                                    value={value}
                                    onChange={onChange}
                                    error={invalid}
                                    helperText={error?.message}
                                />}
                        />


                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({field: {value, onChange}, fieldState: {invalid, error}}) =>

                                <TextField
                                    margin='dense'
                                    id='confirmPassword'
                                    label='Confirm password'
                                    type="password"
                                    fullWidth
                                    value={value}
                                    onChange={onChange}
                                    error={invalid}
                                    helperText={error?.message}
                                />}
                        />

                        <Button disabled={isInvalid} type="submit" onClick={sendData} color="primary"
                                variant="contained"
                                fullWidth>
                            Sign Up
                        </Button>
                    </form>

                </motion.div>
            </motion.div>
        }
        </AnimatePresence>
    )
}