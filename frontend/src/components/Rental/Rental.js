import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  createMuiTheme,
  Paper,
  Typography,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import GradeIcon from "@material-ui/icons/Grade";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Rental = ({ setAuth }) => {
  const useStyles = makeStyles((theme) => ({
    loadingScreen: {
      display: "flex",
      flexDirection: "column",
      margin: "450px 200px",
      alignItems: "center",
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
    root: {
      maxWidth: 380,
      margin: "30px 30px",
    },
    paper: {
      width: "100%",
      height: "100%",
    },
    gridAvatar: {
      margin: theme.spacing(5),
    },
    yellow: {
      color: "#ebd40a",
    },
  }));

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#496dce",
      },
      secondary: {
        main: "#dd3333",
      },
    },
  });

  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [loadingContent, setLoadingContent] = useState(true);
  const [userRentals, setUserRentals] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [bill, setBill] = useState(0);

  let initialRender = useRef(true);

  async function getUsername() {
    try {
      const response = await fetch("/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseResponse = await response.json();

      setUsername(parseResponse.username);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getUsername();

    return () => {
      setUsername("");
    };
  }, []);

  useEffect(() => {
    const getUserRentals = async () => {
      if (initialRender.current) {
        initialRender.current = false;
      } else {
        const body = { username };
        const data = await fetch("/rak/user_rentals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const favoriteData = await fetch("/rak/user_favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const getbill = await fetch("/rak/amount_due", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const rentals = await data.json();
        const favorites = await favoriteData.json();
        const totalbill = await getbill.json();
        // get all information related to user on mount
        setUserRentals(rentals);
        setUserFavorites(favorites);

        setBill(Number(totalbill[0].cost));

        setLoadingContent(false);
      }
    };
    getUserRentals();
    return () => {
      setUserRentals([]);
      setUserFavorites([]);
    };
  }, [username]);

  const cancelRental = async (title, format, cost) => {
    const body = { title, format, username };
    await fetch("/rak/return", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setUserRentals(
      userRentals.filter(
        (rental) => rental.title.concat(rental.format) !== title.concat(format)
      )
    );

    if (userRentals.length === 1) {
      setBill(0);
    } else {
      setBill(Number((bill - Number(cost)).toFixed(2)));
    }

    toast.success(`${title} has been removed from your rentals`);
  };

  const cancelFavorite = async (title) => {
    const body = { title, username };
    await fetch("/rak/unfavorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setUserFavorites(
      userFavorites.filter((favorite) => favorite.title !== title)
    );
    toast.success(`${title} has been removed from your favorites`);
  };

  // Loading Screen response to fetching data
  if (loadingContent) {
    return (
      <div className={classes.loadingScreen}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container justify="center">
        <Grid item xs={6} align="center" className={classes.gridAvatar}>
          <Paper elevation={2} className={classes.paper}>
            <Typography variant="h5">Welcome {username}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={3} align="center" className={classes.gridAvatar}>
          <Paper elevation={2} className={classes.paper}>
            <Typography variant="h5">Balance: ${bill} </Typography>
          </Paper>
        </Grid>
        <Grid item container>
          {userRentals.map((rental) => {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={rental.title + rental.format}
                align="center"
              >
                <Card variant="outlined" className={classes.root}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt=""
                      height="250"
                      image={rental.image_url}
                      title={rental.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2">
                        {rental.title}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="h2"
                      >
                        Return By: {rental.due_date.split("T")[0]}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="medium" variant="contained" color="primary">
                      {rental.format}
                    </Button>

                    <Button
                      size="medium"
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        cancelRental(rental.title, rental.format, rental.cost)
                      }
                    >
                      Cancel
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <Grid container justify="center" className={classes.gridAvatar}>
          <Paper elevation={2} className={classes.paper}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center"
            >
              <Grid item>
                <GradeIcon className={classes.yellow}></GradeIcon>
              </Grid>
              <Grid item>
                <Typography variant="h5" align="center">
                  Your Favorites
                </Typography>
              </Grid>
              <Grid item>
                <GradeIcon className={classes.yellow}></GradeIcon>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item container>
          {userFavorites.map((anime) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={anime.title} align="center">
                <Card variant="outlined" className={classes.root}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt=""
                      height="250"
                      image={anime.image_url}
                      title={anime.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2">
                        {anime.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      size="medium"
                      color="primary"
                      startIcon={<GradeIcon className={classes.yellow} />}
                    >
                      {anime.rating}
                    </Button>

                    <Button
                      size="medium"
                      variant="contained"
                      color="secondary"
                      onClick={() => cancelFavorite(anime.title)}
                    >
                      remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Rental;
