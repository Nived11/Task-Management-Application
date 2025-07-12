import React from "react";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import "./Registration.css";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ApiPath from "../ApiPath.js";
import logo from "../assets/logo.png";

export default function Registration() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${ApiPath()}/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
        cpassword: data.cpassword,
      });
      if (res.status === 201) {
        toast.success(res.data.msg, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/");
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
            <Link to="/about" className="nav-link">
              About us
            </Link>
            <Link to="/contacts" className="nav-link">
              Contacts
            </Link>
          </div>
        </div>

        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">Register</h2>
              <p className="auth-subtitle">
                Welcome! Sign in using your social account or email to continue
                us
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

            <form className="auth-form" onSubmit={registerUser}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  className="form-input"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </div>

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

              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="form-input"
                  value={data.cpassword}
                  onChange={(e) =>
                    setData({ ...data, cpassword: e.target.value })
                  }
                />
              </div>

              <button type="submit" className="submit-btn">
                Register
              </button>
            </form>

            <div className="auth-switch">
              <p>
                Already have an account?
                <Link to="/" className="switch-btn">
                  Login
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
