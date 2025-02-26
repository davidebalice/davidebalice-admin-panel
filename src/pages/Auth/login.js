import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/img/logo.png";
import react_node from "../../assets/img/react_node.png";
import { Context } from "../../context/UserContext";

const Login = () => {
  // Ottieni la funzione di login dal contesto
  const { login } = useContext(Context);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Funzione per gestire il login
  const loginHandle = () => {
    axios
      .post(process.env.REACT_APP_API_BASE_URL + "/api/login", {
        email: formData.email,
        password: formData.password,
      })
      .then((response) => {
        // Se il login ha successo
        if (response.data.status === "success") {
          Swal.fire("Login success", "", "success");

          const token = response.data.token;
          localStorage.setItem("authToken", token);

          // Chiama la funzione di login dal contesto
          login(response.data.user);

          // Naviga alla pagina principale
          navigate("/");
        } else {
          // Se il login fallisce
          Swal.fire("Login failed", response.data.message, "error");
          localStorage.removeItem("authToken");
        }
      })
      .catch((error) => {
        // Gestione degli errori
        Swal.fire("Login failed", "Data incorrect", "error");
        localStorage.removeItem("authToken");
      });
  };

  // Funzione per gestire l'input del form
  const handleInput = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function onChange(value) {
    console.log("Captcha value:", value);
  }

  return (
    <>
      <div className="loginBackground">
        <div className="container">
          <div
            className="row justify-content-center align-items-center jumbotron"
            style={{ height: "65vh" }}
          >
            <div className="col-md-5">
              <div className="card">
                <div className="card-header border-bottom text-center">
                  <img src={logo} alt="db logo" style={{ width: "150px" }} />

                  <div className="dashboardDescription">
                    <b className="dashboardText1">
                      Demo admin panel
                      <br />
                      for davidebalice.dev
                    </b>
                    <img
                      src={react_node}
                      className="dashboardLogo mt-2"
                      alt="dashboard logo"
                    />
                  </div>
                </div>

                <div className="card-body">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInput}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    className="form-control my-3"
                    value={formData.password}
                    onChange={handleInput}
                  />

                  <button
                    type="sumit"
                    onClick={loginHandle}
                    className="btn  mt-2 login-button"
                  >
                    Login
                  </button>

                  <div className="login-demo-data">
                    <b> Demo data</b>:
                    <br />
                    <br />
                    email: mario@rossi.it
                    <br />
                    password: 12345678
                  </div>

                  {/* 
                    <Link to="/forgot-password">
                    <p>Forgot Password</p>
                  </Link>
                  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
