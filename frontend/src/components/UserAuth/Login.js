import {
  Button,
  Container,
  createMuiTheme,
  makeStyles,
  MuiThemeProvider,
  Paper,
  Typography,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { Form, Formik, useField } from "formik";
import React from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import Loading from "../Loading/Loading";

const customTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#496dce",
    },
    secondary: {
      main: "#496dce",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "150px",
  },
  formContainer: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8),
  },
  typography: {
    marginTop: theme.spacing(5),
  },
  fieldContainer: {
    marginBottom: theme.spacing(4),
  },
  atag: {
    textDecoration: "none",
  },
}));

//custom fields to match properties of MUI components
const CustomTextField = ({
  placeholder,
  variant,
  multiline,
  rows,
  type,
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
      type={type}
      rows={rows}
      variant={variant}
      placeholder={placeholder}
      helperText={errorMessage}
      error={!!errorMessage}
    ></TextField>
  );
};

// validation
const validate = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is a required field"),

  password: yup.string().max(40).required("Please Provide a Password"),
});

const INITFORM = {
  email: "",
  password: "",
};

const Login = ({ setAuth }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.container}
    >
      <Paper elevation={3}>
        <Grid container>
          <Grid item xs={12} align="center" className={classes.typography}>
            <Typography variant="h5">Log In</Typography>
            <Typography variant="body2">
              Don't have an account?
              <span>
                <a href="/register" className={classes.atag}>
                  Register
                </a>
              </span>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Container maxwidth="md">
              <div className={classes.formContainer}>
                <Formik
                  initialValues={{
                    ...INITFORM,
                  }}
                  onSubmit={async (data, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    // async calls
                    const response = await fetch("/auth/login", {
                      method: "post",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(data),
                    });

                    setSubmitting(false);
                    const parseResponse = await response.json();

                    if (parseResponse.token) {
                      // Set the Token on the Local Storage
                      localStorage.setItem("token", parseResponse.token);
                      //update state of Authentication on ancestor
                      setAuth(true);
                      toast.success("You have logged in successfully");
                    } else {
                      setAuth(false);
                      toast.error(parseResponse);
                    }
                    resetForm({});
                  }}
                  validationSchema={validate}
                >
                  {({ values, isSubmitting, errors }) => (
                    <Form>
                      <MuiThemeProvider theme={customTheme}>
                        {isSubmitting && <Loading />}
                        <Grid
                          container
                          spacing={2}
                          className={classes.fieldContainer}
                        >
                          <Grid item xs={12}>
                            <CustomTextField
                              placeholder="Email"
                              type="input"
                              name="email"
                              variant="outlined"
                            ></CustomTextField>
                          </Grid>
                          <Grid item xs={12}>
                            <CustomTextField
                              placeholder="Password"
                              type="password"
                              name="password"
                              variant="outlined"
                            ></CustomTextField>
                          </Grid>
                        </Grid>

                        <Grid container justify="center">
                          <Button
                            disabled={isSubmitting}
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                          >
                            Login
                          </Button>
                        </Grid>
                      </MuiThemeProvider>
                    </Form>
                  )}
                </Formik>
              </div>
            </Container>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Login;
