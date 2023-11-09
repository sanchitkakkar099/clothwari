import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function TimeElapsedApp() {
  const allowTime = useSelector((state) => state?.authState.allowTime)
  const loginTime = useSelector((state) => state?.authState.loginTime)
  console.log('allowTime',allowTime,'loginTime',loginTime,new Date(loginTime));
  const [leftTime, setLeftTime] = useState(null);

  const handleUserInteraction = () => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now - new Date(loginTime)) / 1000); // Convert milliseconds to seconds
      console.log('elapsedSeconds',elapsedSeconds);
      const remainingTime =  allowTime - elapsedSeconds
      setLeftTime(remainingTime)
  };

  useEffect(() => {
    const interval = setInterval(() => {
        handleUserInteraction()
    }, 1000);
    return () => clearInterval(interval) 
  },[])

  return (
    <div className="timer">
                <div className="time_left_txt">Time Left : {leftTime ? leftTime : allowTime}</div>
      </div>
  );
}

export default TimeElapsedApp;

