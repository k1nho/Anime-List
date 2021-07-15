import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import GradeIcon from "@material-ui/icons/Grade";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Serie = ({
  title,
  description,
  rating,
  image_url,
  cost,
  filter,
  authentication,
}) => {
  const useStyles = makeStyles({
    root: {
      maxWidth: 380,
      margin: "30px 30px",
    },
    blue: {
      color: "#2e51a2",
    },
  });

  const iconStyle = makeStyles({
    root: {
      color: "#ebd40a",
    },
    green: {
      color: "#1e8d02",
    },
  });

  const classes = useStyles();
  const iconClass = iconStyle();

  const [username, setUsername] = useState("");

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
    if (authentication) {
      getUsername();
    }
    return () => {
      setUsername("");
    };
  }, [authentication]);

  const addFavorite = async (title) => {
    const body = { title, username };

    await fetch("/rak/favorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    toast.success(`${title} has been added to your favorites`);
  };

  return (
    <Grid item xs={12} sm={6} md={4} key={title} align="center">
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt=""
            height="250"
            image={image_url}
            title={title}
          />
          <CardContent>
            <Typography gutterBottom variant="subtitle1" component="h2">
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              align="left"
            >
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="large"
            startIcon={<GradeIcon className={iconClass.root} />}
          >
            {rating}
          </Button>
          {authentication ? (
            filter === "content_high_low" || filter === "content_low_high" ? (
              <div></div>
            ) : (
              <Button
                size="medium"
                variant="contained"
                color="primary"
                onClick={() => addFavorite(title)}
              >
                Add to Favorites
              </Button>
            )
          ) : (
            <div></div>
          )}
          {filter === "content_high_low" || filter === "content_low_high" ? (
            <Button
              size="large"
              startIcon={<AttachMoneyIcon className={iconClass.green} />}
            >
              {cost}
            </Button>
          ) : (
            <div></div>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default Serie;
