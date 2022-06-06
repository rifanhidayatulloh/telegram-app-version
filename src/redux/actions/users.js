import axios from "axios";

export const postUserLogin = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/login`, body)
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

export const postUserRegister = (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/register`, body)
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

// export const getUserDetailId = (token) => {
//   return {
//     type: "GET_USER_DETAIL_ID",
//     payload: axios({
//       url: `${process.env.REACT_APP_BACKEND_URL}/users-detail-id`,
//       method: "GET",
//       headers: {
//         token: token,
//       },
//     }),
//   };
// };
