import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "universal-cookie";
import { setIsLoggedIn, setTimer, setUserInfo, setUserToken } from '../redux/authSlice';
import { useClientLastActiveTimeMutation, useLogoutUserMutation } from '../service';
import { useNavigate } from 'react-router-dom';
const cookies = new Cookies();
const SessionTimer = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [lastActiveReq,lastActiveRes] = useClientLastActiveTimeMutation();
    const [logoutReq, logoutRes] = useLogoutUserMutation();
    const isLoggedIn = useSelector((state) => state?.authState.isLoggedIn)
    const timer = useSelector((state) => state?.authState.timer)
    const userInfo = useSelector((state) => state?.authState.userInfo)
    console.log('lastActiveRes',lastActiveRes);


    console.log('isLoggedIn',isLoggedIn);

    // const [timer, setTimer] = useState(0);
    console.log('timer',timer);

    useEffect(() => {
      const storedRemainingTime = cookies.get('remainingTime');
      if (storedRemainingTime && isLoggedIn) {
      dispatch(setTimer(parseInt(storedRemainingTime, 10)));
      }
    }, [isLoggedIn]);
  
    useEffect(() => {
      const loggedInStatus = cookies.get('isLoggedIn') === true;
      const lastActiveTime = cookies.get('lastActiveTime');
      const savedTimerValue = cookies.get('savedTimerValue');
      const clientAllowTime = cookies.get('client_allow_time');


      console.log('loggedInStatus',loggedInStatus,'lastActiveTime',lastActiveTime);
  
      if (loggedInStatus && lastActiveTime) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - parseInt(lastActiveTime, 10);
  
        if (timeDifference < clientAllowTime * 60 * 1000) {
            dispatch(setIsLoggedIn(true))
            const remainingTime = savedTimerValue ?
            parseInt(savedTimerValue, 10) : clientAllowTime * 60 * 1000 - timeDifference;
            console.log('remainingTime',remainingTime);
            dispatch(setTimer(remainingTime));
        }
      }
    }, [cookies]);
  
    useEffect(() => {
      let interval;
  
      if (isLoggedIn) {
        interval = setInterval(() => {
            const newTimer = timer - 1000;
            console.log('newTimer',newTimer);
            dispatch(setTimer(timer - 1000))  
            if (newTimer <= 0) {
               clearInterval(interval);
              logoutReq({
                userId:userInfo?._id,
                lastInActiveTime:"0"
              })
            }            
        }, 1000);
      }
  
      return () => {
        clearInterval(interval);
      };
    }, [isLoggedIn,timer]);

    useEffect(() => {
      const handleBeforeUnload = () => {
        if (isLoggedIn) {
          cookies.set('savedTimerValue', timer.toString());
          lastActiveReq({
            userId:userInfo?._id,
            lastInActiveTime:timer.toString()
          })
        }
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, [isLoggedIn, timer, cookies]);
  
    
    // const handleLogout = () => {
    //   dispatch(setIsLoggedIn(false))
    //   cookies.remove('isLoggedIn');
    //   cookies.remove('lastActiveTime');
    //   dispatch(setTimer(0));
    // };

    useEffect(() => {
      if(logoutRes?.isSuccess){
          cookies.remove("client_allow_time", { path: "/" });
          // clearInterval(interval);
          cookies.remove("clothwari", { path: "/" });
          cookies.remove("clothwari_user", { path: "/" });
          // cookies.set('lastInActiveTime', 0);
          cookies.remove('isLoggedIn');
          cookies.remove('lastActiveTime');
          cookies.remove('savedTimerValue');
          dispatch(setTimer(0))
          dispatch(setUserInfo({}))
          dispatch(setUserToken(''))
          navigate('/')
      }
    },[logoutRes?.isSuccess])
  
    return (
      <div>
        {isLoggedIn && (
          <div style={{marginTop:"22px"}}>
            <p>
              Timer: {Math.floor(timer / 60000)}:
              {('0' + Math.floor((timer % 60000) / 1000)).slice(-2)}
            </p>
          </div>
        )}
      </div>
    );
  };
  
  export default SessionTimer;