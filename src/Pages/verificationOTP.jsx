import { MuiOtpInput } from 'mui-one-time-password-input'
import { useState } from 'react'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';
import { Snackbar, Alert } from '@mui/material';
import Link from '@mui/material/Link';
import axios from 'axios';
import { backendUrl } from '../Functions/connections';
import { useNavigate } from 'react-router-dom';


function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://uni-fiest.dzyanino.com/">
          ENI-FEST
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}

const VerificationOTP = () => {
    const { params } = useParams();
    const tab = params.split("-");
    const [notifData, setNotifData] = useState(["This is a notification", "info"])
    const [openN, setOpenN] = useState(false);
    const navigate = useNavigate()
    const handleClickNotif = () => {
        setOpenN(true);
    };
    const handleCloseNotif = (event, reason) => {
        setOpenN(false);
    };
    // console.log(params);
    
    const resendOTP = () => {

        axios.post(backendUrl+"users/resend-OTP", {
            email: tab[1],
            id: tab[0]
        })
        .then(result => {
            // console.log(result.data.message);
            if (result.status === 202) {
                setNotifData(["Wait after 1minute before asking for a new code", "warning"])
                handleClickNotif()
            } else if (result.status === 200) {
                setNotifData(["OTP Sent to your mail, please check it", "success"])
                handleClickNotif()
            }
        })
        .catch(error => {
            if (error.status === 404) {
                navigate("/")
            } else {
                setNotifData(["Error from the Server", "error"])
                handleClickNotif()
                console.log(error);  
            }
        })
    }

    const NotificationAlert = (props) => {
        return (
          <>
            <Snackbar open={openN} autoHideDuration={6000} onClose={handleCloseNotif}>
                <Alert
                onClose={handleCloseNotif}
                severity={props.severity}
                variant="filled"
                sx={{ width: '100%' }}
                >
                    {props.text}
                </Alert>
            </Snackbar>
          </>
        )
    }

    const { control, handleSubmit } = useForm({
        defaultValues: {
          otp: ""
        }
    });

    const onSubmit = (data) => {
        if (testeOTP(data.otp) === true) {

            axios.post(backendUrl+"users/verify-OTP", {
                otp: data.otp,
                id: tab[0]
            })
            .then(result => {
                console.log(result.data);
                if (result.status === 200) {
                    localStorage.setItem('connected', true)
                    localStorage.setItem('token', result.data.token)
                    navigate("/connected")
                } 
            })
            .catch(error => {
                const status = error.response.status

                if (status === 401) {
                    navigate("/")
                } else if (status === 403) {
                    setNotifData(["Incorrect OTP password", "error"])
                    handleClickNotif()
                } else {
                    setNotifData(["Error from the Server", "error"])
                    handleClickNotif()
                    console.log(error);  
                }
            })
        }
    };
    const testeOTP = (otp) => {
        const otpNumber = parseInt(otp)
        console.log({otp, otpNumber });
        
        if (otpNumber < 100000) {
            return false
        } else {
            // console.log("Ato")
            return true
        }
    }

    return (<>
        <div style={{ 
            position: "fixed",
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            justifyContent: "center",
        }}>
            <div style={{ width: "500px" }}>
                <div>
                    <Typography variant="h1" gutterBottom>
                        2FA
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        A One-Time Password was sent to your mail: <b>{tab[1]}</b>.
                    </Typography>
                </div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="otp"
                            control={control}
                            rules={{ validate: (value) => value.length === 6 }}
                            render={({ field, fieldState }) => (
                            <Box>
                                <MuiOtpInput sx={{ gap: 1 }} {...field} length={6} />
                                {fieldState.invalid ? (
                                <FormHelperText error>OTP invalid</FormHelperText>
                                ) : null}
                            </Box>
                            )}
                        />
                        <div>
                            <Button variant='contained' color='secondary' onClick={resendOTP} sx={{ mt: 2 }}>
                                Resend
                            </Button>
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                                Confirm
                            </Button>
                        </div>
                    </form>
                </div>
                {/* <MuiOtpInput  gap={3} value={otp} onChange={handleChange} />
                <div style={{ marginTop: "15px" }}>
                    <Button fullWidth variant="contained" color='primary'>Valider</Button>
                </div> */}
            </div>
        </div>
        <div style={{position: "fixed", bottom: "0", left: "0", width: "100%", display: "flex", justifyContent: "center"}}>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </div>
        <NotificationAlert text={notifData[0]} severity={notifData[1]} />
    </>)
}

export default VerificationOTP