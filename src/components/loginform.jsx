import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import "./loginform.css";

const LoginForm = () => {
  const [popupStyle, showPopup] = useState("hide");

  const popup = () => {
    showPopup("login-popup");
    setTimeout(() => showPopup("hide"), 3000);
  };

  const onSuccess = (response) => {
    alert("User signed in");
    console.log(response);
  };

  const onFailure = (error) => {
    alert("User sign in Failed");
    console.log(error);
  };

  return (
    <div
      className="page"
      style={{ background: "linear-gradient(to bottom, #889281, #FFFFFF)" }}
    >
      <div className="cover">
        <h1>Login</h1>
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" placeholder="Enter your email" />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
        />

        <div className="login-btn" onClick={popup}>
          Login
        </div>

        <p className="text">Or login using</p>

        <div className="alt-login">
          <GoogleLogin
            clientId="79474543031-tmjo35916ufn421ej3u1i2ljao2apr4s.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={false}
            theme="dark"
          />
        </div>

        <div className={popupStyle}>
          <h3>Login Failed</h3>
          <p>Username or password incorrect</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
