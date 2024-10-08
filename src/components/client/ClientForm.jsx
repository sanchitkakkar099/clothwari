import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Controller, set, useForm } from "react-hook-form";
import { FormFeedback, Label, Form, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleValidatePhone } from "../../constant/formConstant";
import { useClientByIdQuery, useSubmitClientMutation, useUserTagDropdownListQuery } from "../../service";
import toast from "react-hot-toast";
import ReactDatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
// Ensure proper method chaining to set hour, minute, and second
const MIN_TIME = dayjs()
  .set("hour", 9)
  .set("minute", 0)
  .set("second", 0)
  .toDate(); // 09:00 AM
const MAX_TIME = dayjs()
  .set("hour", 24)
  .set("minute", 0)
  .set("second", 0)
  .toDate(); // 12:00 PM

function ClientForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: locationState } = location;
  const [reqClient, resClient] = useSubmitClientMutation();
  const resClientById = useClientByIdQuery(locationState?.clientID, {
    skip: !locationState?.clientID,
  });
  const userTagList = useUserTagDropdownListQuery();
  const [userTagDropdowm,setUserTagDropdowm] = useState([])
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  console.log("startTime", startTime, "endTime", endTime);
  const userInfo = useSelector((state) => state?.authState.userInfo)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
  } = useForm();

  useEffect(() => {
    if(userTagList?.isSuccess && userTagList?.data?.data){
      setUserTagDropdowm(userTagList?.data?.data)
    }
  },[userTagList])

  useEffect(() => {
    if (resClientById?.isSuccess && resClientById?.data?.data) {
      reset({
        _id: resClientById?.data?.data?._id,
        name: resClientById?.data?.data?.name,
        email: resClientById?.data?.data?.email,
        to_time:resClientById?.data?.data?.to_time ? new Date(resClientById?.data?.data?.to_time) : null,
        from_time:resClientById?.data?.data?.from_time ? new Date(resClientById?.data?.data?.from_time) : null,
        tag: resClientById?.data?.data?.tag
      });
      setStartTime(resClientById?.data?.data?.from_time ? new Date(resClientById?.data?.data?.from_time) : null)
      setEndTime(resClientById?.data?.data?.to_time ? new Date(resClientById?.data?.data?.to_time) : null)
    }
  }, [resClientById]);

  const onNext = (state) => {
    console.log('state',{...state,
        to_time:endTime,
        from_time:startTime,
        tag:state?.tag?.map((el) => el._id)});
    reqClient({ 
      ...state,
      to_time:dayjs(endTime).format(),
      from_time:dayjs(startTime).format(),
      tag:state?.tag?.map((el) => el._id)
     });
  };

  useEffect(() => {
    if (resClient?.isSuccess) {
      toast.success(resClient?.data?.message, {
        position: "top-center",
      });
      reset();
      navigate("/client-list");
    }
    if (resClient?.isError) {
      setError("email", {
        type: "manual",
        message: resClient?.error?.data?.message,
      });
    }
  }, [resClient?.isSuccess, resClient?.isError]);

  const handleStartTimeChange = (date) => {
    setStartTime(date);
    if (endTime && dayjs(endTime).isBefore(date)) {
      setEndTime(null);
      setValue("to_time", "");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Create Client</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Client</a>
                  </li>
                  <li className="breadcrumb-item active">Create Client</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div id="addproduct-accordion" className="custom-accordion">
              <div className="card">
                <a
                  href="#addproduct-productinfo-collapse"
                  className="text-dark"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="addproduct-productinfo-collapse"
                >
                  <div className="p-4">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-size-16 mb-1">Client Info</h5>
                        <p className="text-muted text-truncate mb-0">
                          Fill all information below
                        </p>
                      </div>
                    </div>
                  </div>
                </a>

                <div
                  id="addproduct-productinfo-collapse"
                  className="collapse show"
                  data-bs-parent="#addproduct-accordion"
                >
                  <div className="p-4 border-top">
                    <Form onSubmit={handleSubmit(onNext)}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label className="form-label" for="name">
                              Name
                            </Label>
                            <Controller
                              id="name"
                              name="name"
                              control={control}
                              rules={{ required: "Name is required" }}
                              render={({ field }) => (
                                <Input
                                  placeholder="Enter Name"
                                  className="form-control"
                                  {...field}
                                  type="text"
                                />
                              )}
                            />
                            {errors.name && (
                              <FormFeedback>
                                {errors?.name?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label className="form-label" for="email">
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
                                    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(
                                      v
                                    ) ||
                                    "Email address must be a valid address",
                                },
                              }}
                              render={({ field }) => (
                                <Input
                                  placeholder="Enter Email"
                                  className="form-control"
                                  {...field}
                                  type="text"
                                />
                              )}
                            />
                            {errors.email && (
                              <FormFeedback>
                                {errors?.email?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="from_time">
                              From:
                            </Label>

                            <Controller
                              id="from_time"
                              name="from_time"
                              control={control}
                              rules={{ required: "From Time is required" }}
                              render={({ field: { onChange, value } }) => (
                                <ReactDatePicker
                                  selected={value}
                                  onChange={(date) => {
                                    onChange(date)
                                    handleStartTimeChange(date)
                                    }
                                  }
                                  showTimeSelect
                                  timeIntervals={30}
                                  className="form-control"
                                  minDate={new Date()}
                                  minTime={MIN_TIME}
                                  maxTime={MAX_TIME}
                                  dateFormat="MMMM d, yyyy h:mm aa"
                                />

                              )}
                            />
                            {errors.from_time && (
                              <FormFeedback>
                                {errors?.from_time?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mv-3">
                            <Label className="form-label" for="to_time">
                              To:
                            </Label>
                            <Controller
                              id="to_time"
                              name="to_time"
                              control={control}
                              rules={{ required: "To Time is required" }}
                              render={({ field: { onChange, value } }) => (
                                <ReactDatePicker
                                  selected={value}
                                  onChange={(date) => {
                                    onChange(date)
                                    setEndTime(date)
                                    }
                                  }
                                  showTimeSelect
                                  timeIntervals={30}
                                  className="form-control"
                                  minDate={startTime ? startTime : new Date()}
                                  maxDate={startTime ? startTime : new Date()}
                                  minTime={startTime ? startTime : MIN_TIME}
                                  maxTime={MAX_TIME}
                                  dateFormat="MMMM d, yyyy h:mm aa"
                                  disabled={!startTime}
                                />
                              )}
                            />
                            {errors.to_time && (
                              <FormFeedback>
                                {errors?.to_time?.message}
                              </FormFeedback>
                            )}
                          </div>
                        </div>
                        {!locationState?.isEdit && (
                          <div className="col-md-6">
                            <div className="mb-3">
                              <Label className="form-label" for="password">
                                Password
                              </Label>
                              <Controller
                                id="password"
                                name="password"
                                control={control}
                                rules={{ required: "Password is required" }}
                                render={({ field }) => (
                                  <Input
                                    placeholder="Enter Password"
                                    className="form-control"
                                    {...field}
                                    type="text"
                                  />
                                )}
                              />
                              {errors.password && (
                                <FormFeedback>
                                  {errors?.password?.message}
                                </FormFeedback>
                              )}
                            </div>
                          </div>
                        )}
                        {userInfo?.role === 'Super Admin' &&
                          <div className="col-md-6">
                            <div className="mb-3">
                              <Label for="permissions" className="form-label">
                                Zone Name
                              </Label>
                              <Controller
                                id="tag"
                                name="tag"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <Select
                                    isClearable
                                    isMulti
                                    options={userTagDropdowm}
                                    className="react-select"
                                    classNamePrefix="select"
                                    onChange={onChange}
                                    value={value ? value : null}
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: base => ({ ...base, zIndex: 9999 }), // Set a high z-index
                                      menu: base => ({ ...base, zIndex: 9999 }), // Set a high z-index
                                    }}
                                  />
                                )}
                              />
                              {errors.tag && (
                                <FormFeedback>
                                  {errors?.tag?.message}
                                </FormFeedback>
                              )}
                            </div>
                          </div>
                        }
                      </div>
                      <div className="row">
                        <div className="col text-end">
                          <Link
                            to="/client-list"
                            className="btn btn-danger m-1"
                          >
                            {" "}
                            <i className="bx bx-x mr-1"></i> Cancel{" "}
                          </Link>
                          <button
                            type="submit"
                            className="btn btn-success m-1"
                            data-bs-toggle="modal"
                            data-bs-target="#success-btn"
                          >
                            <i className=" bx bx-file me-1"></i> Save{" "}
                          </button>
                        </div>
                      </div>
                    </Form>
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

export default ClientForm;
