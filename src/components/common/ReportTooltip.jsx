import React from "react";
import { Tooltip } from "reactstrap";
function ReportTooltip({imageurl, target, setTooltipOpen, tooltipOpen}) {

  if (!target) {
    return null; // Optionally return null or handle the absence of `target`
  }
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <Tooltip
    placement="top"
    isOpen={tooltipOpen}
    target={target}
    toggle={toggle}
    style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px' }}
  >
    <img src={imageurl?imageurl:'https://www.bootdey.com/image/250x200/FFB6C1/000000'} alt="image" style={{ width: '200px', height: '200px', borderRadius: '10px'}} />
    <div style={{
          position: "absolute",
          top: "51%",
          left: "51%",
          fontSize: "1.25vw",
          transform: "translate(-50%, -50%)",
          color: "rgb(184, 180, 180)",
          pointerEvents: "none",
          userSelect: "none",
          fontWeight: "bold",
    }}>Clothwari</div>
  </Tooltip>
  );
}

export default ReportTooltip;
