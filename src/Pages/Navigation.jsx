import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const Navigation = () => {
    
    const TopBar = () => {
        return(
            <>
                <div style={{ width: '98%', height: '100%', backgroundColor: '#1976d2'}}>
                    <Container sx={{ mt: 3, mb: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={10}>
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
                            <Grid item xs={2} sx={{ display: "flex", justifyContent: "right" }}>
                                <Button color='error' sx={{ fontWeight: "bold" }}>Log Out</Button>
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

export default Navigation