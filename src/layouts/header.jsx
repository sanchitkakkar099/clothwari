import React, { useEffect, useRef, useState } from "react";
import Logosm from "../assets/images/users/logo.jpg";
import Avatar1 from "../assets/images/users/logo.jpg";
import Avatar3 from "../assets/images/users/avatar-3.jpg";
import Avatar4 from "../assets/images/users/avatar-4.jpg";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setTimer, setUserInfo, setUserToken } from "../redux/authSlice";
import { useClientBagListByAdminMutation, useGetBagNotificationQuery, useLoginAsAdminMutation, useLogoutUserMutation, useNotificationReadMutation } from "../service";
import TimeElapsedApp from "../components/TimeElapsed";
import SessionTimer from "../components/SessionTimer";
import { Bell, FilePlus, ShoppingCart } from "react-feather";
import SimpleBar from "simplebar-react";
const cookies = new Cookies();

function HeaderComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutReq, logoutRes] = useLogoutUserMutation();
  const [loginBackAdminReq, loginBackAdminRes] = useLoginAsAdminMutation();
  const notication = useGetBagNotificationQuery()
  const [reqBagListByAdmin, resBagListByAdmin] = useClientBagListByAdminMutation();
  const [reqReadNotification,resReadNotification] = useNotificationReadMutation()
  const userInfo = useSelector((state) => state?.authState.userInfo);
  const timer = useSelector((state) => state?.authState.timer);
  const selectedBagItems = useSelector(
    (state) => state?.clientState.selectedBagItems
  );

  const selectedPDFItems = useSelector(
    (state) => state?.clientState.selectedPDFItems
  );
  const [openMenu, setOpenMenu] = useState(false);
  useEffect(() => {
    reqBagListByAdmin({
      page: 1,
      limit: '',
      search: "",
    });
  }, []);

  console.log('resBagListByAdmin',resBagListByAdmin?.data);
  console.log('notication',notication);

  const handleLogout = () => {
    if (userInfo?.role === "Client") {
      const remainingTime = timer <= 0 ? 0 : timer; // Get remaining time or 0 upon logout
      cookies.set("lastInActiveTime", remainingTime.toString());
      logoutReq({
        userId: userInfo?._id,
        lastInActiveTime: remainingTime.toString(),
      });
    } else {
      logoutReq({
        userId: userInfo?._id,
      });
    }
    // cookies.remove("clothwari", { path: "/" });
    // cookies.remove("clothwari_user", { path: "/" });
    // if(userInfo?.role === 'Client'){
    //   cookies.remove("client_allow_time", { path: "/" });
    //   clearInterval(timer);
    //   const remainingTime = timer <= 0 ? 0 : timer; // Get remaining time or 0 upon logout
    //   console.log('remainingTime',remainingTime);
    //   cookies.set('lastInActiveTime', remainingTime.toString());
    //   cookies.remove('isLoggedIn');
    //   cookies.remove('lastActiveTime');
    //   cookies.remove('savedTimerValue');
    //   dispatch(setTimer(0))
    //   dispatch(setUserInfo({}))
    //   dispatch(setUserToken(''))
    // }
    // dispatch(setUserInfo({}))
    // dispatch(setUserToken(''))
    // setOpenMenu(false)
    // navigate('/')
  };

  useEffect(() => {
    if (logoutRes?.isSuccess) {
      cookies.remove("clothwari", { path: "/" });
      cookies.remove("clothwari_user", { path: "/" });
      cookies.remove("client_allow_time", { path: "/" });
      clearInterval(timer);
      // const remainingTime = timer <= 0 ? 0 : timer; // Get remaining time or 0 upon logout
      // cookies.set('lastInActiveTime', remainingTime.toString());
      cookies.remove("isLoggedIn");
      cookies.remove("lastActiveTime");
      cookies.remove("savedTimerValue");
      dispatch(setTimer(0));
      dispatch(setUserInfo({}));
      dispatch(setUserToken(""));
      navigate("/");
    }
  }, [logoutRes?.isSuccess]);

  const handleBackToAdmin = (e, adminId) => {
    e.preventDefault();
    loginBackAdminReq({
      designerById: adminId,
    });
    setOpenMenu(false);
  };

  useEffect(() => {
    if (loginBackAdminRes?.isSuccess && loginBackAdminRes?.data?.data) {
      console.log("loginAs", loginBackAdminRes?.data);
      cookies.set("clothwari", loginBackAdminRes?.data?.data?.token, {
        path: "/",
      });
      cookies.set("clothwari_user", loginBackAdminRes?.data?.data, {
        path: "/",
      });
      dispatch(setUserToken(loginBackAdminRes?.data?.data?.token));
      dispatch(setUserInfo(loginBackAdminRes?.data?.data));
      navigate("/dashboard");
    }
  }, [loginBackAdminRes]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    navigate("/change-password", {
      state: {
        isChangePassword: true,
      },
    });
  };

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const settingRef = useRef(null);

  const simpleBarRef = useRef();

  const toggleDropdown = (event) => {
    event.preventDefault();
    setDropdownVisible(!isDropdownVisible);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
    if (settingRef.current && !settingRef.current.contains(event.target)) {
      setOpenMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleViewOder = (e,dt) => {
    e.preventDefault()
    reqReadNotification({
      notificationId:dt?._id
    })
    reqBagListByAdmin({
      page: 1,
      limit: '',
      search: "",
    });
    navigate(`/view-orders`,{
      state:{
        data:dt?.design
      }
    })
  }

  useEffect(() => {
    if(resReadNotification?.isSuccess){
      notication.refetch()
    }
  },[resReadNotification?.isSuccess])

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    const targetElement = document.getElementById('v-menu');
    if(!isVisible){
      targetElement.style.display = "block"
      setIsVisible(true);
    }else{
      targetElement.style.display = "none"


      setIsVisible(false);
    }
  };

  return (
    <header id="page-topbar" className="isvertical-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          <button
            type="button"
            className="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn"
            onClick={() => toggleVisibility()}
          >
            <i className="fa fa-fw fa-bars"></i>
          </button>  
        </div>

        <div className="d-flex">
          <div className="dropdown d-inline-block d-lg-none">
            <button
              type="button"
              className="btn header-item"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="icon-sm" data-feather="search"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
              <form className="p-2">
                <div className="search-box">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control rounded bg-light border-0"
                      placeholder="Search..."
                    />
                    <i className="mdi mdi-magnify search-icon"></i>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="dropdown d-none d-sm-inline-block">
            <button
              type="button"
              className="btn header-item light-dark"
              id="mode-setting-btn"
            >
              <i data-feather="moon" className="icon-sm layout-mode-dark"></i>
              <i data-feather="sun" className="icon-sm layout-mode-light"></i>
            </button>
          </div>
          {/* <TimeElapsedApp/> */}
          {/* {userInfo?.role === 'Client' &&
          <SessionTimer/>
          } */}
          {userInfo?.role === 'Super Admin' &&
          <div className="dropdown d-inline-block">
            <button
              type="button"
              className={`btn header-item noti-icon ${
                isDropdownVisible ? "show" : ""
              }`}
              id="page-header-notifications-dropdown"
              onClick={(e) => toggleDropdown(e)}
            >
              <Bell />
              {(notication?.isSuccess && notication?.data?.data) ?
              <span className="noti-dot bg-danger rounded-pill">{notication?.data?.data}</span>
              :""}
            </button>
            {isDropdownVisible && (
              <div
                className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                style={{
                  position: "absolute",
                  inset: "0px 0px auto auto",
                  margin: "0px",
                  transform: "translate(0px, 72px)",
                }}
                ref={dropdownRef}
              >
                <div className="p-3">
                  <div className="row align-items-center">
                    <div className="col">
                      <h5 className="m-0 font-size-15"> Notifications </h5>
                    </div>
                  </div>
                </div>
                <SimpleBar style={{ maxHeight: "250px" }} ref={simpleBarRef}>
                  <div style={{ maxHeight: "250px" }}>
                    <h6 className="dropdown-header bg-light">New</h6>
                    {resBagListByAdmin?.isSuccess &&
                      resBagListByAdmin?.data?.data?.docs
                      && Array.isArray(resBagListByAdmin?.data?.data?.docs)
                      && resBagListByAdmin?.data?.data?.docs?.length > 0
                      &&
                      resBagListByAdmin?.data?.data?.docs?.map((el,inx) => {
                        return(
                          <Link to="" onClick={(e) => handleViewOder(e,el)} className="text-reset notification-item" key={inx}>
                      <div className="d-flex border-bottom align-items-start" style={{backgroundColor: el?.adminView ? '#33a18640' : '#FFF'}} >
                        {/* <div className="flex-shrink-0">
                          <img
                            src={Avatar3}
                            className="me-3 rounded-circle avatar-sm"
                            alt="user-pic"
                          />
                        </div> */}
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{el?.userId?.name}</h6>
                          <div className="text-muted">
                            <p className="mb-1 font-size-13">
                              {`${el?.userId?.name} orders ${el?.design?.length} designs`}
                              {/* <span className="badge badge-soft-success">
                                Review
                              </span> */}
                            </p>
                            {/* <p className="mb-0 font-size-10 text-uppercase fw-bold">
                              <i className="mdi mdi-clock-outline"></i> 1 hour
                              ago
                            </p> */}
                          </div>
                        </div>
                      </div>
                    </Link>
                        )
                      })
                    
                    }
                  
                    {/* <a href="" className="text-reset notification-item">
                      <div className="d-flex border-bottom align-items-start">
                        <div className="flex-shrink-0">
                          <div className="avatar-sm me-3">
                            <span className="avatar-title bg-primary rounded-circle font-size-16">
                              <i className="bx bx-shopping-bag"></i>
                            </span>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">New order has been placed</h6>
                          <div className="text-muted">
                            <p className="mb-1 font-size-13">
                              Open the order confirmation or shipment
                              confirmation.
                            </p>
                            <p className="mb-0 font-size-10 text-uppercase fw-bold">
                              <i className="mdi mdi-clock-outline"></i> 5 hours
                              ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </a> */}
                    {/* <h6 className="dropdown-header bg-light">Earlier</h6>
                    <a href="" className="text-reset notification-item">
                      <div className="d-flex border-bottom align-items-start">
                        <div className="flex-shrink-0">
                          <div className="avatar-sm me-3">
                            <span className="avatar-title bg-soft-success text-success rounded-circle font-size-16">
                              <i className="bx bx-cart"></i>
                            </span>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">Your item is shipped</h6>
                          <div className="text-muted">
                            <p className="mb-1 font-size-13">
                              Here is somthing that you might light like to
                              know.
                            </p>
                            <p className="mb-0 font-size-10 text-uppercase fw-bold">
                              <i className="mdi mdi-clock-outline"></i> 1 day
                              ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </a> */}

                    {/* <a href="" className="text-reset notification-item">
                      <div className="d-flex border-bottom align-items-start">
                        <div className="flex-shrink-0">
                          <img
                            src={Avatar4}
                            className="me-3 rounded-circle avatar-sm"
                            alt="user-pic"
                          />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">Salena Layfield</h6>
                          <div className="text-muted">
                            <p className="mb-1 font-size-13">
                              Yay ! Everything worked!
                            </p>
                            <p className="mb-0 font-size-10 text-uppercase fw-bold">
                              <i className="mdi mdi-clock-outline"></i> 3 days
                              ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </a> */}
                  </div>
                </SimpleBar>
                {/* <div className="p-2 border-top d-grid">
                  <a
                    className="btn btn-sm btn-link font-size-14 btn-block text-center"
                    href="javascript:void(0)"
                  >
                    <i className="uil-arrow-circle-right me-1"></i>{" "}
                    <span>View More..</span>
                  </a>
                </div> */}
              </div>
            )}
          </div>
          }
          {userInfo?.role === 'Client' || userInfo?.role === 'SalesPerson' &&
          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item noti-icon"
              id="page-header-notifications-dropdown"
              onClick={() => navigate('/view-bag')}
              // onClick={toggleDropdown}
            >
              <ShoppingCart />
              {selectedBagItems && Array.isArray(selectedBagItems) && selectedBagItems?.length > 0 ?
              <span className="noti-dot bg-danger rounded-pill">

              {selectedBagItems?.length}
              </span>
             : ''
              }
            </button>
            </div>
          }
          {userInfo?.role === 'Client' || userInfo?.role === 'SalesPerson' &&
          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item noti-icon"
              id="page-header-notifications-dropdown"
              onClick={() => navigate('/pdf-item')}
              // onClick={toggleDropdown}
            >
              <FilePlus/>
              {selectedPDFItems && Array.isArray(selectedPDFItems) && selectedPDFItems?.length > 0 ?
              <span className="noti-dot bg-danger rounded-pill">

              {selectedPDFItems?.length}
              </span>
             : ''
              }
            </button>
            </div>
          }
          <div className="dropdown d-inline-block" >
            <button
              type="button"
              className="btn header-item user text-start d-flex align-items-center show"
              id="page-header-user-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={() => setOpenMenu(!openMenu)}
              ref={settingRef}

            >
              <img
                className="rounded-circle header-profile-user"
                src={Avatar1}
                alt="Header Avatar"

              />
            </button>
            <div
              className={`dropdown-menu dropdown-menu-end pt-0 ${
                openMenu ? "show" : ""
              } dropdown-user`}
            > 
             
              <Link className="dropdown-item" to="" onClick={(e) => e.preventDefault()} >
                <i className="bx bx-user-circle text-muted font-size-18 align-middle me-1"></i>{" "}
                <span className="align-middle text-capitalize">
                  {userInfo?.firstName || userInfo?.lastName
                    ? `${userInfo?.firstName} ${userInfo?.lastName}`
                    : userInfo?.name}
                </span>
              </Link>

              {/* {userInfo?.role !== 'Super Admin' && */}
              <Link
                className="dropdown-item"
                to=""
                onClick={(e) => handleChangePassword(e)}
              >
                <i className="bx bx-user-circle text-muted font-size-18 align-middle me-1"></i>{" "}
                <span className="align-middle text-capitalize">
                  Change Password
                </span>
              </Link>
              {/* } */}
              {userInfo?.asAdminFlag ? (
                <Link
                  className="dropdown-item"
                  to=""
                  onClick={(e) => handleBackToAdmin(e, userInfo?.adminId)}
                >
                  <i className="bx bx-log-out text-muted font-size-18 align-middle me-1"></i>{" "}
                  <span className="align-middle">Bact To Super Admin</span>
                </Link>
              ) : (
                <Link className="dropdown-item" to="" onClick={handleLogout}>
                  <i className="bx bx-log-out text-muted font-size-18 align-middle me-1"></i>{" "}
                  <span className="align-middle">Logout</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
