import { CircularProgress, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { pageTransitions, pageVariant } from "../PageTransitions";
import { Streamer } from "./Streamer";

const Streaming = () => {
  const [streamingPlatforms, setStreamingPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);

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
  }));

  const classes = useStyles();

  const getStreamingPlatforms = async () => {
    const fetchStreaming = await fetch("https://kitsu.io/api/edge/streamers");
    const parseResponse = await fetchStreaming.json();
    const data = parseResponse.data;
    setStreamingPlatforms(
      data.filter((streamer) => streamer.attributes.siteName !== "YouTube")
    );
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getStreamingPlatforms();

    return () => {
      setStreamingPlatforms([]);
    };
  }, []);

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
      <Grid container direction="row" alignItems="center">
        {streamingPlatforms.map((data) => (
          <Streamer
            key={data.id}
            streamerName={data.attributes.siteName}
            seriesLinks={data.relationships.streamingLinks.links.related}
          />
        ))}
      </Grid>
    </motion.section>
  );
};

export default Streaming;
