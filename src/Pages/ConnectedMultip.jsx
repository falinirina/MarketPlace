import { Button } from "@mui/material"
import axios from "axios";
import { backendUrl } from "../Functions/connections";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';


const Connected2 = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate()
    const [refresh, setRefresh] = useState(true)

    const [idSingle, setIdSingle] = useState(0)
    const [resultSingle, setResultSingle] = useState("")


    const logOut = () => {
        localStorage.setItem("token", "")
        setRefresh(true)
    }

    const validerSingleResult = () => {
        axios
            .post(
                backendUrl + `tickets/payermulti/${idSingle[0]}/${idSingle[1]}`,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
                )
                .then((result) => {
                    if (result.status === 200) {
                        axios
                .get(
                    backendUrl + `tickets/payermulti/${idSingle[0]}/${idSingle[1]}`,
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    }
                )
                .then((result) => {
                    console.log(result)
                    if (result.status === 200) {

                        const resultat = result.data.result
                        
                        setResultSingle(<>
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                {resultat.map((result) => {
                                    const payer = (result.payerTicket) ? "Payer" : "non Payer"
                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'row', fontSize: "40px", justifyContent: "center"}}>
                                            <div style={{ width: "300px" }}><b>Ticket {result.idTicket}</b></div>
                                            <div style={{ marginLeft:"25px" }}>
                                                : {payer}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                        </>)
                    }
                })
                .catch((err) => {                
                    if (err.response.status === 401) {
                        navigate("/")
                    }
                });
                }
        })
    }

    const searchSingleResult = () => {
        const idTicketB = document.getElementById("idTicketBegin").value
        const idTicketE = document.getElementById("idTicketEnd").value
        setIdSingle([idTicketB, idTicketE])
        if (idTicketB > 0 && idTicketB < 1121 && idTicketE > 0 && idTicketE < 1121 && idTicketB < idTicketE)  {
            axios
            .get(
                backendUrl + `tickets/payermulti/${idTicketB}/${idTicketE}`,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            )
            .then((result) => {
                console.log(result)
                if (result.status === 200) {

                    const resultat = result.data.result
                    
                    setResultSingle(<>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            {resultat.map((result) => {
                                const payer = (result.payerTicket) ? "Payer" : "non Payer"
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'row', fontSize: "40px", justifyContent: "center"}}>
                                        <div style={{ width: "300px" }}><b>Ticket {result.idTicket}</b></div>
                                        <div style={{ marginLeft:"25px" }}>
                                            : {payer}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </>)
                }
            })
            .catch((err) => {                
                if (err.response.status === 401) {
                    navigate("/")
                }
            });
        } else {
            console.log("non non non");
            
        }
    }

    const MultiTicket = () => {
        return (<>
            <Container sx={{ mt: 3, mb: 2 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography
                            component="h1"
                            variant="h2"
                            color="black"
                            textAlign="center"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Mutiple Ticket
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="idTicketBegin"
                            label="Begin Ticket"
                            type="number"
                            variant="filled"
                            slotProps={{
                                inputLabel: {
                                shrink: true,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="idTicketEnd"
                            label="End Ticket"
                            type="number"
                            variant="filled"
                            slotProps={{
                                inputLabel: {
                                shrink: true,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button color='primary' onClick={searchSingleResult} sx={{ fontWeight: "bold" }}>Search</Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button color='primary' onClick={validerSingleResult} sx={{ fontWeight: "bold" }}>Validate</Button>
                    </Grid>
                    <Grid item xs={12}>
                        {resultSingle}
                    </Grid>
                </Grid>
            </Container>
        </>)
    }

    const refreshFalse = () => {
        setRefresh(false)
    }

    const changePageSingle = () => {
        navigate("/connected")
    }

    const Navigation = () => {
        
        const TopBar = () => {
            return(
                <>
                    <div style={{ width: '98%', height: '100%', backgroundColor: '#1976d2'}}>
                        <Container sx={{ mt: 3, mb: 2 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={8}>
                                    <Typography
                                        component="h1"
                                        variant="h6"
                                        color="white"
                                        noWrap
                                        sx={{ flexGrow: 1 }}
                                    >
                                        UNI-FIEST Web Admin
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button color='secondary' onClick={changePageSingle} sx={{ fontWeight: "bold" }}>Single</Button>
                                </Grid>
                                <Grid item xs={2} sx={{ display: "flex", justifyContent: "right" }}>
                                    <Button color='error' sx={{ fontWeight: "bold" }} onClick={logOut}>Log Out</Button>
                                </Grid>
                            </Grid>
                        </Container>
                    </div>
                </>
            )
        }
    
        return (<>
            <div style={{ position: 'fixed', top: '10px', left: '0', width: '100%', height: '75px', display: 'flex', justifyContent: 'center'}}>
                <TopBar />
            </div>
        </>)
    }
    
    useEffect(()=>{
        if (refresh) {
            var storage = localStorage.getItem('connected')
            if (storage === null || token === null) {
              localStorage.setItem('connected', false)
              localStorage.setItem('token', "")
              navigate("/")
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
                      }
                  })
                  .catch((err) => {
                        console.log(err);
                        
                        if (err.response.status === 401) {
                            navigate("/")
                        }
                  });
              }
            }
            refreshFalse()
            
        }
    })


    return (
        <>
            <Navigation />
            <div style={{ position: 'fixed', top: '100px', left: '0', width: '100%', height: 'calc(100% - 120px)', display: 'flex', justifyContent: 'center'}}>
                <MultiTicket />
            </div>
        </>
    )
}

export default Connected2