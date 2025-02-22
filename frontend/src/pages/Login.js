import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Auth from "../middleware/auth";
import { Redirect, Route } from "react-router";
import "../style/login.css";
import "../style/style.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [startedLogin, setStartedLogin] = useState(false);
  const [finishedLogin, setFinishedLogin] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setStartedLogin(true);
    const f = await Auth.login({ username, password });
    setFinishedLogin(true);
  };

  if (startedLogin && !finishedLogin) {
    return <p>Aan het inloggen...</p>;
  }

  if (!Auth.isAuthenticated() && !Auth.isValidToken()) {
    console.log("Not logged in");
    return (
      <div class="full_page">
        <Navbar />
        <main class="container">
          <div class="login">
            <h1>Login Page</h1>
            <form onSubmit={login} class="login-form">
              <input
                type="text"
                value={username}
                placeholder="Gebruikersnaam"
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <input
                type="password"
                value={password}
                placeholder="Wachtwoord"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <button type="submit">Login</button>
              <br />
              <br />
              <a href="/users/forgot">Wachtwoord vergeten</a>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  } else {
    console.log("Logged in");
    return <Redirect to="/backoffice/activities" />;
  }
};

export default LoginPage;
