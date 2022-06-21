import axios from 'axios';
const token = localStorage.getItem('token');

export const postUserLogin = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}login`, body)
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const postUserRegister = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}register`, body)
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const getUserDetailId = (id) => {
  return {
    type: 'GET_USER_DETAIL_ID',
    payload: axios({
      url: `${process.env.REACT_APP_BACKEND_URL}users/${id}`,
      method: 'GET',
      headers: {
        token: token
      }
    })
  };
};

export const getAllUser = (search = '') => {
  return {
    type: 'GET_ALL_USER',
    payload: axios({
      url: `${process.env.REACT_APP_BACKEND_URL}users?search=${search}`,
      method: 'GET',
      headers: {
        token: token
      }
    })
  };
};

export const updatePhoto = (formData) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}users/update/photo`, formData, {
        headers: {
          token: token,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const updateUser = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}users/update/profile`, data, {
        headers: {
          token: token
        }
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
