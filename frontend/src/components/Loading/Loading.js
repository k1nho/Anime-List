import {
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  loadingScreen: {
    display: "flex",
    flexDirection: "column",
    margin: "400px 200px",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

const Loading = () => {
  const classes = useStyles();
  return (
    <div className={classes.loadingScreen}>
      <Grid container direction="column" alignItems="center">
        <Typography variant="h6">Processing Your Request</Typography>
        <CircularProgress />
      </Grid>
    </div>
  );
};

export default Loading;
