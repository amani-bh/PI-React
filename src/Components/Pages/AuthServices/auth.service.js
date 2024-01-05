import authApi from "./auth-refreshTokenApi";
import TokenService from "./auth-token.service";


/*
const register = (username, email, password) => {
  return authApi.post("/signup", {
    username,
    email,
    password
  });
};
};*/

const login = (email, password) => {
  return authApi
      .post("/signin", {
          email,
        password
      })
      .then((response) => {
        if (response.data.accessToken) {
          TokenService.setUser(response.data);
        }

        return response.data;
      });
};

const loginFace = (email) => {
    return authApi
        .post("/signinFace", {
            email
        })
        .then((response) => {
            if (response.data.accessToken) {
                TokenService.setUser(response.data);
            }

            return response.data;
        });
};

const logout = () => {
  TokenService.removeUser();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const verifyUser = (code) => {
    return authApi.get(  "/confirm/" + code).then((response) => {
        return response.data;
    });
};

const ForgotPasswordEmail = (email) => {
    return authApi
        .put("/forgot-password", {
            email
        })
        .then((response) => {
            return response.data;
        });
};

const ResetPassword = (reset_token, newPassword ) => {
    return authApi
        .put("/reset-password", {
            reset_token, newPassword
        })
        .then((response) => {
            return response.data;
        });
};

const GoogleLogin = (idToken ) => {
    return authApi
        .post("/google-login", {
            idToken
        })
        .then((response) => {
           // console.log('GOOGLE SIGNIN SUCCESS', response);
            return response;
        })
        .catch(error => {
          //  console.log('GOOGLE SIGNIN ERROR', error.response);
            return error.response;
        });
};

const AuthService ={
  // register,
  login,
    loginFace,
  logout,
  getCurrentUser,
    verifyUser,
    ForgotPasswordEmail,
    ResetPassword,
    GoogleLogin,
};

export default AuthService ;
