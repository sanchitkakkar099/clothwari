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
  </Tooltip>
  );
}

export default ReportTooltip;
