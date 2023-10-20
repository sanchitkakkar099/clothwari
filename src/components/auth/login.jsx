import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logosm from "../../assets/images/logo-sm.svg";


function Login() {
  const navigate = useNavigate()
  const [loginState,setLoginState] = useState(null)
  console.log('loginState',loginState);

  useEffect(() => {
    document.body.setAttribute('data-sidebar', 'dark')
  },[])
  
  const handleChange = (e) => {
    setLoginState({
      ...loginState,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(loginState?.username && loginState.password){
      navigate('/dashboard')
    }
  }

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
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label" for="username">
                          Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          placeholder="Enter username"
                          name="username"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>

                      <div className="mb-3">
                        <div className="float-end">
                          <Link to={""}
                            className="text-muted"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <label className="form-label" for="userpassword">
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="userpassword"
                          placeholder="Enter password"
                          name="password"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>

                      <div className="form-check">
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
                      </div>

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
