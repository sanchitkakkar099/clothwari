import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logosm from "../../assets/images/logo-sm.svg";
import { useChangePasswordMutation } from "../../service";
import { FormFeedback, Input, Label } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

function ChangePassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [passwordShow, setPasswordShow] = useState(false);
  const [changeReq, changeRes] = useChangePasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if(!location?.state?.isChangePassword){
      navigate('/dashboard')
    }
  },[location])

  useEffect(() => {
    document.body.setAttribute('data-sidebar', 'dark')
  },[])
  
  const handleChangePassword = (state) => {
    const reqData = {
      password: state?.password,
    };
    changeReq(reqData);
  };

  useEffect(() => {
    if(changeRes?.isSuccess){
      toast.success('Password change successfully',{
        position:'top-center',
        duration:1000
      })
      navigate('/dashboard')
    }
  },[changeRes])

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
                    <h5 className="text-primary">Change Password</h5>
                  </div>
                  <div className="p-2 mt-4">
                    <form onSubmit={handleSubmit(handleChangePassword)}>
                      <div className="mb-3">
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

                      

                      <div className="mt-3 text-end">
                      <Link
                          to={"/dashboard"}
                          className="btn btn-secondary w-sm waves-effect waves-light "
                        >Back</Link>
                        <input
                          className="btn btn-primary w-sm waves-effect waves-light ms-2"
                          type="submit"
                          value={"Save"}
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

export default ChangePassword;
