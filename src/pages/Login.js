import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { postUserLogin } from "../redux/actions/users";
import Swal from "sweetalert2";

import styles from "../assets/styles/Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const onSubmit = (e) => {
    e.preventDefault();
    if (form.email === "" || form.password === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All data must be filled",
      });
    } else {
      postUserLogin(form).then((response) => {
        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate("/chat");
      });
    }
  };
  return (
    <>
      <section className={`container-fluid ${styles.fluid}`}>
        <div className={`row ${styles.container}`}>
          <div>
            <div className={styles.divlogin}>
              <h4 className={styles}>Login</h4>
            </div>
            <div className={styles.title}>Hi, Welcome back!</div>
            <form onSubmit={(e) => onSubmit(e)}>
              <div className={styles.divForm}>
                <div className={styles.divEmail}>
                  <label htmlFor="email" className={styles.labelEmail}>
                    Email
                  </label>
                  <input
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder=" Input your email"
                    id="email"
                    className={styles.inputEmail}
                    type="email"
                  />
                </div>
                <div className={styles.divEmail}>
                  <label htmlFor="password" className={styles.labelEmail}>
                    Password
                  </label>
                  <input
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder=" Input your password"
                    id="password"
                    className={styles.inputEmail}
                    type="password"
                  />
                </div>
              </div>
              <div className={styles.forgotPassword}>
                <div className={styles.forgot}>Forgot password?</div>
              </div>
              <div className={styles.divButton}>
                <button className={styles.button}>Login</button>
              </div>
            </form>
            <div className={styles.divSignup}>
              Don't have an account?{" "}
              <Link to="/register" style={{ textDecoration: "none" }}>
                <span className={styles.span}>Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
