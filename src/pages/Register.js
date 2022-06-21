import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';
import { postUserRegister } from '../redux/actions/users';

import styles from '../assets/styles/Register.module.css';
import imgBack from '../assets/images/registerBack.svg';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: ''
  });
  const onSubmit = (e) => {
    e.preventDefault();
    if (form.email === '' || form.password === '' || form.fullname === '') {
      swal.fire({
        title: 'Error!',
        text: 'All field must be filled!',
        icon: 'error'
      });
    } else {
      postUserRegister(form)
        .then(() => {
          swal
            .fire({
              title: 'Success!',
              text: 'Registrasi Success, Please check your email for confirm',
              icon: 'success'
            })
            .then(() => {
              navigate('/');
            });
        })
        .catch((err) => {
          console.log(err);
          swal.fire({
            icon: 'error',
            title: 'Ooops... Register Failed',
            text: 'Register Failed'
          });
        });
    }
  };
  return (
    <>
      <section className={`container-fluid ${styles.fluid}`}>
        <div className={`row ${styles.container}`}>
          <div>
            <div className={`row ${styles.divlogin}`}>
              <div className={`col-1`}>
                <Link to="/">
                  <img src={imgBack} alt="back" />
                </Link>
              </div>
              <div className={`col-11 ${styles.register}`}>
                <h4>Register</h4>
              </div>
            </div>
            <div className={styles.title}>Lets create your account!</div>
            <form onSubmit={(e) => onSubmit(e)}>
              <div className={styles.divForm}>
                <div className={styles.divEmail}>
                  <label htmlFor="name" className={styles.labelEmail}>
                    Name
                  </label>
                  <input
                    onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                    placeholder=" Input your name"
                    id="name"
                    className={styles.inputEmail}
                    type="text"
                  />
                </div>
                <div className={styles.divEmail}>
                  <label htmlFor="email" className={styles.labelEmail}>
                    Email
                  </label>
                  <input
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder=" Create password"
                    id="password"
                    className={styles.inputEmail}
                    type="password"
                  />
                </div>
              </div>
              <div className={styles.divButton}>
                <button className={styles.button}>Register</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
