import React from "react";
import Grid from "@material-ui/core/Grid";
import { Formik, Form, useField } from "formik";
import {
  Button,
  createMuiTheme,
  FormLabel,
  makeStyles,
  MuiThemeProvider,
  Radio,
  Typography,
  Container,
  Paper,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as yup from "yup";
import Loading from "../Loading/Loading";
import { toast } from "react-toastify";

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

const CustomRadio = ({ label, ...props }) => {
  const [field] = useField(props);

  return (
    <FormControlLabel
      {...field}
      control={<Radio />}
      label={label}
    ></FormControlLabel>
  );
};

const CustomDateTimePicker = ({ name, type, ...props }) => {
  const [field, meta] = useField(name);

  const configDateTimePicker = {
    ...field,
    ...props,
    variant: "outlined",
    fullWidth: true,
    InputLabelProps: {
      shrink: true,
    },
  };

  if (meta && meta.touched && meta.error) {
    configDateTimePicker.error = true;
    configDateTimePicker.helperText = meta.error;
  }

  return <TextField {...configDateTimePicker} type={type}></TextField>;
};

// validation
const validate = yup.object({
  username: yup
    .string()
    .matches(/^[A-Za-z ]*$/, "Please enter valid name")
    .max(40)
    .required("Please Provide Username"),
  password: yup.string().max(40).required("Please Provide a Password"),
  birthDate: yup.date().required("Please Provide Your Date of Birth"),
  creditCardNum: yup
    .string()
    .required("Credit Card information is Necessary for Rental"),
  address: yup.string().required("Please Provide an Address"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is a required field"),
});

const INITFORM = {
  username: "",
  password: "",
  gender: "male",
  birthDate: "",
  creditCardNum: "",
  address: "",
  email: "",
};

const Register = ({ setAuth }) => {
  const classes = useStyles();
  return (
    <Paper elevation={3}>
      <Grid container>
        <Grid item xs={12} align="center" className={classes.typography}>
          <Typography variant="h5">Register</Typography>
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
                  const response = await fetch("/auth/register", {
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
                    toast.success("You have been registered successfully");
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
                        <Grid item xs={12} sm={6}>
                          <CustomTextField
                            placeholder="Username"
                            type="input"
                            name="username"
                            variant="outlined"
                          ></CustomTextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <CustomTextField
                            placeholder="Password"
                            type="password"
                            name="password"
                            variant="outlined"
                          ></CustomTextField>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        justify="center"
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
                      </Grid>
                      <Grid
                        container
                        justify="center"
                        className={classes.fieldContainer}
                      >
                        <Grid item xs={12}>
                          <CustomTextField
                            placeholder="Address"
                            type="input"
                            name="address"
                            variant="outlined"
                          ></CustomTextField>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        justify="center"
                        className={classes.fieldContainer}
                      >
                        <FormLabel component="legend">Gender</FormLabel>
                        <Grid container item justify="center">
                          <CustomRadio
                            name="gender"
                            value="male"
                            type="radio"
                            label="Male"
                          ></CustomRadio>
                          <CustomRadio
                            name="gender"
                            value="female"
                            type="radio"
                            label="Female"
                          ></CustomRadio>
                          <CustomRadio
                            name="gender"
                            value="other"
                            type="radio"
                            label="Other"
                          ></CustomRadio>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        justify="center"
                        className={classes.fieldContainer}
                      >
                        <CustomDateTimePicker
                          name="birthDate"
                          label="Date of Birth"
                          type="date"
                        />
                      </Grid>
                      <Grid
                        container
                        justify="center"
                        className={classes.fieldContainer}
                      >
                        <Grid item xs={12}>
                          <CustomTextField
                            placeholder="Credit Card Number"
                            type="input"
                            name="creditCardNum"
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
                          Submit
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
  );
};

export default Register;
