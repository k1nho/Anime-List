import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useEffect, useState } from "react";

export const Streamer = ({ streamerName, seriesLinks }) => {
  const [streamObj, setStreamObj] = useState({});
  const [streamerSeries, setStreamerSeries] = useState([]);
  const [link, setLink] = useState(seriesLinks);

  const useStyles = makeStyles({
    root: {
      maxWidth: 500,
      margin: "30px 30px",
      padding: "30px 100px",
    },
    blue: {
      color: "#2e51a2",
    },
    atag: {
      textDecoration: "none",
    },
  });

  const classes = useStyles();

  useEffect(() => {
    const getStreamerSeries = async () => {
      const data = await fetch(link);
      const parseData = await data.json();
      setStreamObj(parseData);
      setStreamerSeries(parseData.data);
    };
    getStreamerSeries();
    return () => {
      setStreamerSeries([]);
    };
  }, [seriesLinks, link]);

  const nextPage = () => {
    setLink(streamObj.links.next);
  };

  const prevPage = () => {
    // test if it is the first page
    if (streamObj.links.prev !== undefined) {
      setLink(streamObj.links.prev);
    }
  };

  return (
    <Grid
      item
      container
      direction="row"
      justify="center"
      alignItems="center"
      xs={12}
      sm={6}
      md={4}
    >
      <Card className={classes.root}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2" align="center">
              {streamerName}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Grid container direction="column" justify="center">
            {streamerSeries.map((data, index) => (
              <Grid item xs={12} key={data.id}>
                {index + 1}.{"     "}
                <span>
                  <a
                    href={data.attributes.url}
                    target="_blank"
                    rel="noreferrer"
                    className={classes.atag}
                  >
                    Anime Link generate name here
                  </a>
                </span>
              </Grid>
            ))}
          </Grid>
        </CardActions>
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="center"
          spacing={2}
        >
          <Grid item>
            <Button
              onClick={prevPage}
              startIcon={<ArrowBackIcon />}
              color="primary"
              variant="contained"
            ></Button>
          </Grid>
          <Grid item>
            <Button
              onClick={nextPage}
              endIcon={<ArrowForwardIcon />}
              color="primary"
              variant="contained"
            ></Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
