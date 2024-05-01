import React from "react";
import dayjs from "dayjs";

function TimeElapsedApp({ expiredTime }) {
  return (
    <div className="timer">
      <div className="time_left_txt">
        Session Expired At :{" "}
        {expiredTime ? dayjs(expiredTime).format("hh:mm A") : null}
      </div>
    </div>
  );
}

export default TimeElapsedApp;
