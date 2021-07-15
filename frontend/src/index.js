import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer/Footer";
import AnimeList from "./components/Home/AnimeList";
import Navbar from "./components/Navbar/Navbar";
import Rental from "./components/Rental/Rental";
import Store from "./components/Store/Store";
import Streaming from "./components/Streaming/Streaming";
import Login from "./components/UserAuth/Login";
import Register from "./components/UserAuth/Register";
import "./index.css";

toast.configure();

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const setAuth = (boolean) => {
    setIsAuth(boolean);
  };

  // Function to log out an user pass to navbar to display the button
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    toast.success("Log Out Succesfully");
  };

  //Keep user logged in while in session (stop refreshes)
  useEffect(() => {
    async function authConfirm() {
      try {
        const response = await fetch("/auth/verify-user", {
          method: "GET",
          headers: { token: localStorage.token },
        });

        const parseResponse = await response.json();

        parseResponse === true ? setIsAuth(true) : setAuth(false);
      } catch (err) {
        console.log(err.message);
      }
    }
    authConfirm();
  }, []);

  return (
    <div className="page-container">
      <div className="content-wrap">
        <Router>
          <Navbar logout={logout} auth={isAuth} />
          <AnimatePresence>
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => <AnimeList {...props} auth={isAuth} />}
              />
              <Route
                path="/register"
                render={(props) =>
                  !isAuth ? (
                    <Register {...props} setAuth={setAuth} />
                  ) : (
                    <Redirect to="/rental" />
                  )
                }
              />
              <Route
                path="/login"
                render={(props) =>
                  !isAuth ? (
                    <Login {...props} setAuth={setAuth} />
                  ) : (
                    <Redirect to="/rental" />
                  )
                }
              />
              <Route
                path="/rental"
                render={(props) =>
                  isAuth ? (
                    <Rental {...props} setAuth={setAuth} />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              <Route
                path="/store"
                render={(props) =>
                  isAuth ? (
                    <Store {...props} setAuth={setAuth} />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              <Route
                path="/streaming"
                render={(props) => <Streaming {...props} />}
              />
              <Route path="*">Error page</Route>
            </Switch>
          </AnimatePresence>
        </Router>
        <Footer />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
