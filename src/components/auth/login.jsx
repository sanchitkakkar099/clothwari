import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logosm from "../../assets/images/logo-sm.svg";
import { useLoginAuthMutation } from "../../service";
import { FormFeedback, Input, Label } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo, setUserToken } from "../../redux/authSlice";
const cookies = new Cookies();

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userToken = useSelector((state) => state?.authState.userToken)
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordShow, setPasswordShow] = useState(false);
  const [loginReq, loginRes] = useLoginAuthMutation();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if(userToken){
      navigate('/dashboard')
    }
  },[userToken])

  useEffect(() => {
    document.body.setAttribute('data-sidebar', 'dark')
  },[])
  

  const handleLogin = (state) => {
    const reqData = {
      email: state?.email,
      password: state?.password,
    };
    loginReq(reqData);
  };

  useEffect(() => {
    if(loginRes?.isSuccess){
        cookies.set("clothwari", loginRes?.data?.data?.token, { path: "/" });
        cookies.set("clothwari_user", loginRes?.data?.data, { path: "/" });
        dispatch(setUserToken(loginRes?.data?.data?.token))
        dispatch(setUserInfo(loginRes?.data?.data))
        setErrorMessage('')
        navigate('/dashboard')
    } else if(loginRes?.isError){
      setErrorMessage('Invalid credential')
    }
  },[loginRes]) 


  return (
    <div className="authentication-bg min-vh-100">
      <div className="bg-overlay"></div>
      <div className="container">
        <div className="d-flex flex-column min-vh-100 px-3 pt-4">
          <div className="row justify-content-center my-auto">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="text-center mb-4">
                <Link to="">
                  <img
                    src={Logosm}
                    alt=""
                    height="22"
                  />{" "}
                  <span className="logo-txt">Clothwari</span>
                </Link>
              </div>

              <div className="card">
                <div className="card-body p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Welcome Back !</h5>
                    <p className="text-muted">Sign in to continue to Clothwari.</p>
                  </div>
                  <div className="p-2 mt-4">
                    <form onSubmit={handleSubmit(handleLogin)}>
                      <div className="mb-3">
                      <Label className="form-label" for="login-email">
                          Email
                        </Label>
                        <Controller
                          id="email"
                          name="email"
                          control={control}
                          rules={{
                            required: "Email is required",
                            validate: {
                              matchPattern: (v) =>
                                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v) ||
                                "Email address must be a valid address",
                            },
                          }}
                          render={({ field }) => (
                            <Input type="email" {...field} />
                          )}
                        />
                        {errors?.email && (
                          <FormFeedback>{errors?.email?.message}</FormFeedback>
                        )}
                      </div>

                      <div className="mb-3">
                        <div className="float-end">
                          <Link to={""}
                            className="text-muted"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="d-flex justify-content-between">
                          <Label className="form-label" for="login-password">
                            Password
                          </Label>

                        </div>
                        <div className="input-group-merge input-group">
                          <Controller
                            id="password"
                            name="password"
                            control={control}
                            rules={{
                              required: "Password is required",
                            }}
                            render={({ field }) => (
                              <Input
                                placeholder="············"
                                id="login-password"
                                type={passwordShow ? "text" : "password"}
                                className="form-control"
                                {...field}
                              />
                            )}
                          />
                          <span
                            className="cursor-pointer input-group-text"
                            onClick={() => setPasswordShow(!passwordShow)}
                          >
                            {passwordShow ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                              </svg>
                            )}
                          </span>
                        </div>
                        {errors?.password && (
                          <FormFeedback>
                            {errors?.password?.message}
                          </FormFeedback>
                        )}
                         
                      </div>

                      {/* <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="auth-remember-check"
                        />
                        <label
                          className="form-check-label"
                          for="auth-remember-check"
                        >
                          Remember me
                        </label>
                      </div> */}
                      <div className="mt-3 text-end">
                        <input
                          className="btn btn-primary w-sm waves-effect waves-light"
                          type="submit"
                          value={"Log in"}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
