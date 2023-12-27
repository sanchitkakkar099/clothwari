import React, { useEffect, useState } from "react";
import Logosm from "../assets/images/logo-sm.svg";
import Avatar1 from '../assets/images/users/avatar-1.jpg'
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setTimer, setUserInfo, setUserToken } from "../redux/authSlice";
import { useLoginAsAdminMutation, useLogoutUserMutation } from "../service";
import TimeElapsedApp from "../components/TimeElapsed";
import SessionTimer from "../components/SessionTimer";
const cookies = new Cookies();

function HeaderComponent() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [logoutReq, logoutRes] = useLogoutUserMutation();
  const [loginBackAdminReq, loginBackAdminRes] = useLoginAsAdminMutation();
  const userInfo = useSelector((state) => state?.authState.userInfo)
  const timer = useSelector((state) => state?.authState.timer)
  const [openMenu,setOpenMenu] = useState(false)
  
  const handleLogout = () => {
    if(userInfo?.role === 'Client'){
      const remainingTime = timer <= 0 ? 0 : timer; // Get remaining time or 0 upon logout
      cookies.set('lastInActiveTime', remainingTime.toString());
      logoutReq({
        userId:userInfo?._id,
        lastInActiveTime:remainingTime.toString()
      })
    }else{
      logoutReq({
        userId:userInfo?._id,
      })
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
  }

  useEffect(() => {
    if(logoutRes?.isSuccess){
      cookies.remove("clothwari", { path: "/" });
      cookies.remove("clothwari_user", { path: "/" });
      cookies.remove("client_allow_time", { path: "/" });
      clearInterval(timer);
      // const remainingTime = timer <= 0 ? 0 : timer; // Get remaining time or 0 upon logout
      // cookies.set('lastInActiveTime', remainingTime.toString());
      cookies.remove('isLoggedIn');
      cookies.remove('lastActiveTime');
      cookies.remove('savedTimerValue');
      dispatch(setTimer(0))
      dispatch(setUserInfo({}))
      dispatch(setUserToken(''))
      navigate('/')
    }
  },[logoutRes?.isSuccess])

  const handleBackToAdmin = (e,adminId) => {
    e.preventDefault();
    loginBackAdminReq({
      designerById: adminId
    })
    setOpenMenu(false)
  }

  useEffect(() => {
    if(loginBackAdminRes?.isSuccess && loginBackAdminRes?.data?.data){
      console.log('loginAs',loginBackAdminRes?.data);
      cookies.set("clothwari", loginBackAdminRes?.data?.data?.token, { path: "/" });
      cookies.set("clothwari_user", loginBackAdminRes?.data?.data, { path: "/" });
      dispatch(setUserToken(loginBackAdminRes?.data?.data?.token))
      dispatch(setUserInfo(loginBackAdminRes?.data?.data))
      navigate('/dashboard')
    }
  },[loginBackAdminRes])

  const handleChangePassword = (e) => {
    e.preventDefault()
      navigate('/change-password',{
        state:{
            isChangePassword:true
        }
      })
  }

  return (
    <header id="page-topbar" className="isvertical-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          <div className="navbar-brand-box">
            <a href="index.html" className="logo logo-dark">
              <span className="logo-sm">
                <img src={Logosm} alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src={Logosm} alt="" height="22" />{" "}
                <span className="logo-txt">Clothwari</span>
              </span>
            </a>

            <a href="index.html" className="logo logo-light">
              <span className="logo-sm">
                <img src={Logosm} alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src={Logosm} alt="" height="22" />{" "}
                <span className="logo-txt">Clothwari</span>
              </span>
            </a>
          </div>

          <button
            type="button"
            className="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn"
          >
            <i className="fa fa-fw fa-bars"></i>
          </button>

          {/* <form className="app-search d-none d-lg-block">
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
              />
              <span className="bx bx-search"></span>
            </div>
          </form> */}
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
          {userInfo?.role === 'Client' &&
          <SessionTimer/>
          }
          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item user text-start d-flex align-items-center show"
              id="page-header-user-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <img
                className="rounded-circle header-profile-user"
                src={Avatar1}
                alt="Header Avatar"
              />
            </button>
            <div className={`dropdown-menu dropdown-menu-end pt-0 ${openMenu ? "show" : ""} dropdown-user`}>
              {/* <a
                className="dropdown-item"
                href="#!"
              >
                <i className="bx bx-user-circle text-muted font-size-18 align-middle me-1"></i>{" "}
                <span className="align-middle">My Account</span>
              </a>
              <a className="dropdown-item" href="#!">
                <i className="bx bx-chat text-muted font-size-18 align-middle me-1"></i>{" "}
                <span className="align-middle">Chat</span>
              </a>
              <a
                className="dropdown-item"
                href="#!"
              >
                <i className="bx bx-buoy text-muted font-size-18 align-middle me-1"></i>{" "}
                <span className="align-middle">Support</span>
              </a>
              <div className="dropdown-divider"></div>
              <a
                className="dropdown-item"
                href="#!"
              >
                <i className="bx bx-lock text-muted font-size-18 align-middle me-1"></i>{" "}
                <span className="align-middle">Lock screen</span>
              </a> */}
              <Link
                className="dropdown-item"
                to=""
              >
                <i className="bx bx-user-circle text-muted font-size-18 align-middle me-1"></i>{" "}
                <span className="align-middle text-capitalize">{(userInfo?.firstName || userInfo?.lastName) ? `${userInfo?.firstName} ${userInfo?.lastName}` : userInfo?.name}</span>
              </Link>

              {/* {userInfo?.role !== 'Super Admin' && */}
              <Link
                className="dropdown-item"
                to=""
                onClick={(e) => handleChangePassword(e)}
              >
                <i className="bx bx-user-circle text-muted font-size-18 align-middle me-1"></i>{" "}
                <span className="align-middle text-capitalize">Change Password</span>
              </Link>
              {/* } */}
              {userInfo?.asAdminFlag ?
                <Link className="dropdown-item" to="" onClick={(e) => handleBackToAdmin(e,userInfo?.adminId)}>
                <i className="bx bx-log-out text-muted font-size-18 align-middle me-1"></i>{" "}
                <span className="align-middle">Bact To Admin</span>
              </Link>
              :
              <Link className="dropdown-item" to="" onClick={handleLogout}>
                <i className="bx bx-log-out text-muted font-size-18 align-middle me-1"></i>{" "}
                <span className="align-middle">Logout</span>
              </Link>
              }
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
