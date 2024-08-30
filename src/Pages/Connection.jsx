import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { backendUrl } from '../Functions/connections';
import { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
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


const defaultTheme = createTheme();

const Connection = () => {
  const [mailInvalid, setMailInvalid] = useState(false)
  const [passwordInvalid, setPasswordInvalid] = useState(false)
  const [password, setPassword] = useState("")
  const [mail, setMail] = useState("")
  const [notifData, setNotifData] = useState(["This is a notification", "info"])
  const navigate = useNavigate()

  const [refresh, setRefresh] = useState(true)


  const refreshFalse = () => {
        setRefresh(false)
  }
  

  const [openN, setOpenN] = useState(false);
  const handleClickNotif = () => {
    setOpenN(true);
  };
  const handleCloseNotif = (event, reason) => {
    setOpenN(false);
  };

  // const connectedClient = () => {
  //   navigate("/connected")
  // }

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

  const validate = (email) => {
    // custom email regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.length === 0) {
      setMailInvalid(true)
      setNotifData(["Email is required", "error"])
      handleClickNotif()
      return 'Email is required';
    }

    if (!regex.test(email)) {
      setMailInvalid(true)
      return 'Invalid email format';
    }

    // other custom validations...
    setMailInvalid(false)
    return "valide";
  }

  const submitForm = (data) => {
    if (password.length > 7) {
      
      axios.post(backendUrl+"users/user-signin", {
          email: mail,
          password: password
      })
      .then(result => {
        console.log(result.data);
        if (result.status === 200) {
          navigate(`/verificationOTP/${result.data.data.id}-${result.data.data.email}`)
        }
      })
      .catch(error => {
        console.log(error);
        
        setNotifData(["Authentication Failed", "error"])
        handleClickNotif()
      })
    } else {
      setNotifData(["Password Required", "error"])
      handleClickNotif()
    }
    
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const valid = validate(data.get("email"))

    if (valid === "valide") {
      submitForm(data)
    } else {
      setNotifData(["Invalid email format", "error"])
      handleClickNotif()
    }
  };

  const handleChange = (event) => {
    const id = event.target.id
    const value = event.target.value
    if (id === "email") {
      setMail(value)
      validate(value)
    } else if (id === "password") {
      setPassword(value)
      if (value.length > 0) {
        setPasswordInvalid(false)
      } else {
        setPasswordInvalid(true)
      }
    }
  }
  
  useEffect(()=>{
    if (refresh)
    {
      var storage = localStorage.getItem('connected')
      var token = localStorage.getItem('token')
  
      if (storage === null || token === null) {
        localStorage.setItem('connected', false)
        localStorage.setItem('token', "")
      } else {
        if (token.length > 0) {
          axios
            .post(
                backendUrl + "users/verify-token",
                {},
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            )
            .then((result) => {
                if (result.status === 200) {
                  console.log("teste");
                  navigate("/connected")
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
      }
      document.title = "Uni-Fiest MarketPlace: Connection Required"
      refreshFalse()
    }
  })

  return (
    <>
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
    }}>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div style={{
            marginTop: "-191px",
            border: "2px solid lightgrey",
            borderRadius: "10px",
            padding: "15px",
            boxShadow: "7px 7px 5px #a5a19b"
          }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            >
            <Avatar sx={{ width: "75px", height: "75px", m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon sx={{ fontSize: "60px" }} />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{ fontWeight: "bold"}} >
              LOGIN
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField 
                error={mailInvalid}
                margin="normal"
                required
                fullWidth
                id="email"
                variant='standard'
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={mail}
                onChange={handleChange}
              />
              <TextField
                error={passwordInvalid}
                margin="normal"
                required
                fullWidth
                variant='standard'
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handleChange}
              />
              <FormControlLabel
                sx={{ marginTop: "15px" }}
                control={<Checkbox value="remember" id='rememberMe' color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container sx={{ marginBottom: "15px" }}>
                <Grid item xs>
                  <Link sx={{ cursor: "pointer" }} variant="body2">
                    Forgot password ?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          </div>
          <div style={{position: "fixed", bottom: "0", left: "0", width: "100%", display: "flex", justifyContent: "center"}}>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </div>
        </Container>
      </ThemeProvider>
      <NotificationAlert text={notifData[0]} severity={notifData[1]} />
    </div>
    </>
    );
}

export default Connection