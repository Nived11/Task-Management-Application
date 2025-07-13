import React from "react";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ApiPath from "../ApiPath.js";
import Dashboard from "./Dashboard.jsx";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${ApiPath()}/login`, data);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        console.log(res.data);
        toast.success(res.data.msg, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          progress: undefined,
          theme: "light",
        });
        setData({ email: "", password: "" });
        setTimeout(() => {
          navigate(`/dashboard`);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.msg, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };
  return (
    <>
      <div className="auth-page">
        <div className="wave-background"></div>

        <div className="nav">
          <div className="nav-left">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
          </div>
          <div className="nav-right">
            <Link to="#" className="nav-link">
              About us
            </Link>
            <Link to="#" className="nav-link">
              Contacts
            </Link>
          </div>
        </div>

        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">Login</h2>
              <p className="auth-subtitle">
                Welcome back! Sign in using your social account or email to
                continue us
              </p>
            </div>

            <div className="social-buttons">
              <button className="social-btn facebook">
                <FaFacebookF />
              </button>
              <button className="social-btn google">
                <FcGoogle />
              </button>
              <button className="social-btn apple">
                <FaApple />
              </button>
            </div>

            <form className="auth-form" onSubmit={loginUser}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-input"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-input"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
              </div>

              <button type="submit" className="submit-btn">
                Login
              </button>
            </form>

            <div className="auth-switch">
              <p>
                Don't have an account?
                <Link to="/register" className="switch-btn">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
