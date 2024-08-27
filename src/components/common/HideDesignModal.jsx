import React from "react";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, ModalBody, Form, Label, ModalFooter, FormFeedback } from "reactstrap";
const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

function HideDesignModal(props) {
  const userInfo = useSelector((state) => state?.authState.userInfo);
    const [isHidden, setIsHidden] = useState(false)
    const [isHiddenTime, setIsHiddenTime] = useState(false)
    const handleClick = (e, key) => {
        if(key === "isHidden"){
          setIsHidden(true);
          setIsHiddenTime(false);
        }else if (key === "isHiddenTime"){
          setIsHiddenTime(true);
          setIsHidden(false);
        }
    }

  const onNext = (state) => {

  }

     
  return (
    <>
      <Form onSubmit={handleSubmit(onNext)}>
        {(userInfo?.role === "Super Admin" ||
          (userInfo?.permissions?.some((el) => el === "Design View/Hide") &&
            userInfo?.role === "Admin")) && (
          <div className="row m-1 ">
            <Modal isOpen={isOpen}>
              <ModalBody>
                <label className="option">
                  <input
                    type="checkbox"
                    name="isHidden"
                    value={"isHidden"}
                    checked={isHidden}
                    onChange={(e) => handleClick(e, "isHidden")}
                  />{" "}
                  Hide Design
                </label>
                <br />
                <label className="option">
                  <input
                    type="checkbox"
                    name="isHiddenTime"
                    value={"isHiddenTime"}
                    checked={isHiddenTime}
                    onChange={(e) => handleClick(e, "isHiddenTime")}
                  />{" "}
                  Hide Design Time Dependency
                </label>
                {isHiddenTime && (
                  <div className="row">
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
                                onChange(date);
                                handleStartTimeChange(date);
                              }}
                              timeIntervals={30}
                              className="form-control"
                              minDate={new Date()}
                              // minTime={MIN_TIME}
                              // maxTime={MAX_TIME}
                              dateFormat="MMMM d, yyyy"
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
                      <div className="mb-3">
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
                                onChange(date);
                                setEndTime(date);
                              }}
                              timeIntervals={30}
                              className="form-control"
                              minDate={startTime ? startTime : new Date()}
                              // maxDate={startTime ? startTime : new Date()}
                              // minTime={startTime ? startTime : new Date()}
                              // maxTime={MAX_TIME}
                              dateFormat="MMMM d, yyyy"
                              // disabled={!startTime}
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
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={(e) => setIsOpen(!isOpen)}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        )}

        <div className="row">
          <div className="col text-end">
            <Link to="/design-list-v2" className="btn btn-danger m-1">
              {" "}
              <i className="bx bx-x mr-1"></i> Cancel{" "}
            </Link>
            <button
              type="submit"
              className="btn btn-success m-1"
              disabled={resDesignUpload?.isLoading || !hasChanges}
            >
              <i className=" bx bx-file me-1"></i> Save{" "}
            </button>
          </div>
        </div>
      </Form>
    </>
  );
}

export default HideDesignModal;
