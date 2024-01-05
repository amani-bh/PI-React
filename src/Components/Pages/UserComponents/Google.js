import React from 'react';
import GoogleLogin from 'react-google-login';
import AuthService from "../AuthServices/auth.service";


const Google = ({ informParent = f => f }) => {
    const responseGoogle = response => {
      //  console.log(response.tokenId);
      //  console.log(response);
      //  console.log(response.profileObj);
        AuthService.GoogleLogin (response.tokenId).then(
            (data) => {
               // console.log(data);
                informParent(data);
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
               // console.log(resMessage);
                informParent(resMessage);


            }
        );
            };

    return (
        <div className="pb-3">
            <GoogleLogin
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                render={renderProps => (
                    <button
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        className="form-control btn btn-danger rounded submit px-3 col-11"
                        style={{marginLeft:0 }}
                    >
                        <i className="fab fa-google pr-2"></i> Login with Google
                    </button>
                )}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
};

export default Google;
