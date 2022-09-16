import {
  CardMedia,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import { Form, Formik, useField } from "formik";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import { pageTransitions, pageVariant } from "../PageTransitions";

export const Store = () => {
  const [anime, setAnime] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);

  //custom fields to match properties of MUI components
  const CustomTextField = ({
    placeholder,
    variant,
    multiline,
    rows,
    ...props
  }) => {
    const [field, meta] = useField(props);

    // text field validation
    const errorMessage = meta.error && meta.touched ? meta.error : "";
    return (
      <TextField
        {...field}
        fullWidth
        multiline={multiline}
        rows={rows}
        variant={variant}
        placeholder={placeholder}
        helperText={errorMessage}
        error={!!errorMessage}
      ></TextField>
    );
  };

  const INITFORM = {
    partial: "",
  };
  // validation
  const validate = yup.object({
    partial: yup.string().max(15).required("Search text is required"),
  });

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
    setLoading(true);
    const fetchAnime = async () => {
      const data = await fetch("/rak/stock_amount");
      const animeData = await data.json();
      setLoading(false);
      setAnime(animeData);
    };
    fetchAnime();
    return () => {
      setAnime([]);
    };
  }, []);

  useEffect(() => {
    getUsername();
    return () => {
      setUsername("");
    };
  }, []);

  // build custom themes for mui , use of themeProvider to apply the theme to the component
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#496dce",
      },
      secondary: {
        main: "#1f4bc5",
      },
    },
  });

  // create styles
  const useStyles = makeStyles((theme) => ({
    gridContainer: {
      height: "30vh",
    },
    gridItemContainer: {
      margin: theme.spacing(4),
    },
    animeImage: {
      height: "300px",
      width: "225px",
      objectFit: "cover",
    },

    paper: {
      width: "100%",
      height: "100%",
      display: "flex",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    fieldContainer: {
      marginBottom: theme.spacing(4),
    },
    loadingScreen: {
      display: "flex",
      flexDirection: "column",
      margin: "450px 200px",
      alignItems: "center",
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
  }));

  const classes = useStyles();

  const addRental = async (title, format) => {
    const body = { title, format, username };
    try {
      setRenting(true);
      await fetch("/rak/rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      anime.forEach((anime) => {
        if (anime.title === title) {
          if (format === "DVD") {
            anime.dvd_stock = anime.dvd_stock - 1;
          } else if (format === "Blu-Ray") {
            anime.br_stock = anime.br_stock - 1;
          } else {
            anime.dig_stock = anime.dig_stock - 1;
          }
        }
      });

      setRenting(false);
      toast.success(`${title} has been added to your rental`);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Loading Screen response to fetching data
  if (loading) {
    return (
      <div className={classes.loadingScreen}>
        <CircularProgress />
      </div>
    );
  }

  //Renting Screen response to renting anime
  if (renting) {
    return (
      <div className={classes.loadingScreen}>
        <Typography variant="h5">Thank You For Buying on AnimeRAK!</Typography>
        <CircularProgress />
      </div>
    );
  }

  return (
    <motion.section
      exit="out"
      animate="in"
      initial="initial"
      variants={pageVariant}
      transition={pageTransitions}
    >
      <Grid container justify="center">
        <Grid
          item
          container
          xs={6}
          justify="center"
          className={classes.gridItemContainer}
        >
          <Formik
            initialValues={{
              ...INITFORM,
            }}
            onSubmit={async (data, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              const response = await fetch("/rak/store_search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });

              const newRental = await response.json();
              setAnime(newRental);
              setSubmitting(false);

              resetForm({});
            }}
            validationSchema={validate}
          >
            {({ values, isSubmitting, errors }) => (
              <Form>
                <ThemeProvider theme={theme}>
                  <Grid item container xs={12}>
                    <Typography variant="h6"> Quick Rent</Typography>
                  </Grid>
                  <Grid item container xs={12} alignItems="center">
                    <Grid item xs={8}>
                      <CustomTextField
                        placeholder="Search Anime"
                        type="input"
                        name="partial"
                        variant="outlined"
                      ></CustomTextField>
                    </Grid>
                    <Grid item xs={4} align="center">
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </ThemeProvider>
              </Form>
            )}
          </Formik>
        </Grid>
        {anime.map((serie) => {
          return (
            <Grid
              item
              container
              xs={8}
              key={serie.title}
              className={classes.gridItemContainer}
            >
              <ThemeProvider theme={theme}>
                <Paper elevation={1} className={classes.paper}>
                  <Grid item xs={3}>
                    <CardMedia
                      component="img"
                      alt=""
                      height="250"
                      image={serie.url}
                      title={serie.title}
                    />
                  </Grid>
                  <Grid item container xs={9} align="center">
                    <Grid item xs={12}>
                      <Typography variant="h6">{serie.title}</Typography>
                    </Grid>
                    <Divider />
                    <Grid item container xs={12}>
                      <Grid item xs={4}>
                        <Typography variant="subtitle1">
                          DVD : ${serie.dvd_cost}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          In stock: {serie.dvd_stock}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          value="dvd"
                          disabled={renting}
                          startIcon={<ShoppingCartOutlinedIcon />}
                          onClick={() =>
                            addRental(serie.title, serie.dvd_format)
                          }
                        >
                          Rent
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle1">
                          Blu-Ray ${serie.br_cost}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          In stock: {serie.br_stock}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          value="bluray"
                          disabled={renting}
                          startIcon={<ShoppingCartOutlinedIcon />}
                          onClick={() =>
                            addRental(serie.title, serie.br_format)
                          }
                        >
                          Rent
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle1">
                          Digital ${serie.dig_cost}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          In stock: {serie.dig_stock}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          value="digital"
                          disabled={renting}
                          startIcon={<ShoppingCartOutlinedIcon />}
                          onClick={() =>
                            addRental(serie.title, serie.dig_format)
                          }
                        >
                          Rent
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </ThemeProvider>
            </Grid>
          );
        })}
      </Grid>
    </motion.section>
  );
};

export default Store;
