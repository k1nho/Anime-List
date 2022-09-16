import {
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import GradeIcon from "@material-ui/icons/Grade";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import SortByAlphaIcon from "@material-ui/icons/SortByAlpha";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "../../index.css";
import { pageTransitions, pageVariant } from "../PageTransitions";
import Serie from "./Serie";

const Anime = ({ auth }) => {
  const [anime, setAnime] = useState([]);
  const [filter, setFilter] = useState("content_default");
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    const fetchAnime = async () => {
      const data = await fetch(`/rak/${filter}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const animeData = await data.json();
      setLoading(false);
      setAnime(animeData);
    };
    fetchAnime();
  }, [filter, auth]);

  const useStyles = makeStyles((theme) => ({
    gridContainer: {
      height: "30vh",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
    },
    icon: {
      marginRight: theme.spacing(2),
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
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
    red: {
      color: "#ff3333",
      marginRight: "0.5rem",
    },
    green: {
      color: "#1e8d02",
      marginRight: "0.5rem",
    },
    yellow: {
      color: "#ebd40a",
      marginRight: "0.5rem",
    },
    blue: {
      color: "#2e51a2",
      marginRight: "0.5rem",
    },
  }));

  const classes = useStyles();

  // Loading Screen response to fetching data
  if (loading) {
    return (
      <div className={classes.loadingScreen}>
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
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.gridContainer}
      >
        <InputLabel id="select-label">Sort By</InputLabel>
        <FormControl className={classes.formControl}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            variant="outlined"
            value={filter}
            onChange={handleChange}
            className={classes.menuItem}
          >
            <MenuItem value="content_default" className={classes.menuItem}>
              <FilterNoneIcon fontSize="small" className={classes.blue} />
              <ListItemText primary="None" />
            </MenuItem>
            <MenuItem value="content_rating" className={classes.menuItem}>
              <GradeIcon fontSize="small" className={classes.yellow} />
              <ListItemText primary="Rating" />
            </MenuItem>
            <MenuItem value="content_alpha_desc" className={classes.menuItem}>
              <SortByAlphaIcon fontSize="small" className={classes.red} />
              <ListItemText primary="Alphabet Descending" />
            </MenuItem>
            <MenuItem value="content_high_low" className={classes.menuItem}>
              <MonetizationOnIcon fontSize="small" className={classes.green} />
              <ListItemText primary="Cost" />
            </MenuItem>
            <MenuItem value="content_low_high" className={classes.menuItem}>
              <MonetizationOnIcon fontSize="small" className={classes.green} />
              <ListItemText primary="Cheaper" />
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid container direction="row">
        {anime.map((serie) => {
          return (
            <Serie
              key={serie.title}
              {...serie}
              filter={filter}
              authentication={auth}
            />
          );
        })}
      </Grid>
    </motion.section>
  );
};

export default Anime;
