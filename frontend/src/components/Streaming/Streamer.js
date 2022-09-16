import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
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
  let image = "";

  if (streamerName === "Hulu") {
    image = "https://allears.net/wp-content/uploads/2020/12/Hulu-Logo.png";
  } else if (streamerName === "Funimation") {
    image = "https://i.imgur.com/KpAalyU.jpg";
  } else if (streamerName === "Crunchyroll") {
    image =
      "https://applexgen.com/wp-content/uploads/2019/12/Cancel-Crunchyroll-Subscription-1.jpg";
  } else if (streamerName === "CONtv") {
    image =
      "https://media.comicbook.com/uploads1/2014/12/contv-phs2-logo43c-r13-wht-115204-1280x0.jpg";
  } else if (streamerName === "Netflix") {
    image =
      "https://d26oc3sg82pgk3.cloudfront.net/files/media/edit/image/641/article_full%401x.jpg";
  } else if (streamerName === "HIDIVE") {
    image = "https://www.tadaima.com.mx/wp-content/uploads/2019/08/hidive.jpeg";
  } else if (streamerName === "TubiTV") {
    image = "https://i.ytimg.com/vi/V-x8pEUwv-Q/maxresdefault.jpg";
  } else if (streamerName === "Amazon") {
    image =
      "http://sentineldaily.com/wp-content/uploads/2017/01/Amazon-logo-on-orange-background.jpg";
  } else if (streamerName === "YouTube") {
    image =
      "https://9to5mac.com/wp-content/uploads/sites/6/2017/08/youtube_logo_light.jpg?quality=82&strip=all";
  } else {
    image =
      "http://www.capsulecomputers.com.au/wp-content/uploads/2014/06/animelab-logo.png";
  }

  const useStyles = makeStyles({
    root: {
      maxWidth: 600,
      margin: "30px 30px",
      padding: "20px 20px",
    },
    cardAction: {
      padding: "20px 20px",
    },
    blue: {
      color: "#2e51a2",
    },
    atag: {
      textDecoration: "none",
      color: "inherit",
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
          <CardMedia
            component="img"
            alt=""
            height="250"
            image={image}
            title={streamerName}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2" align="center">
              {streamerName}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Grid container direction="column" justify="center">
            {streamerSeries.map((data, index) => (
              <Grid item container xs={12} key={data.id} direction="row">
                <a
                  href={data.attributes.url}
                  target="_blank"
                  rel="noreferrer"
                  className={classes.atag}
                >
                  <Typography variant="subtitle1">
                    {index + 1}. {data.attributes.url.split(".com/")[1]}
                  </Typography>
                </a>
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
