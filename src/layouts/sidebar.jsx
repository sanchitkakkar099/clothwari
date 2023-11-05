import React, { useState } from 'react'
import Logosm from "../assets/images/logo-sm.svg";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


function SidebarComponent() {
  const [sidebarEnable,setSidebarEnable] = useState(false)
  const userInfo = useSelector((state) => state?.authState.userInfo)
  console.log('userInfo',userInfo);
  console.log('sidebarEnable',sidebarEnable);
  const toggleSidebar = (e,sde) => {
    e.preventDefault()
    if(sidebarEnable){
        setSidebarEnable(false)
        document.body.setAttribute('data-sidebar-size','lg')
    }else{
        setSidebarEnable(true)
        document.body.setAttribute('data-sidebar-size','sm')
    }
  }
  return (
    <div className="vertical-menu">

    <div className="navbar-brand-box">
        <Link className="logo logo-dark" to={"/dashboard"}>
            <span className="logo-sm">
                <img src={Logosm} alt="" height="22"/> 
            </span>
            <span className="logo-lg">
                <img src={Logosm} alt="" height="22"/> <span className="logo-txt">Clothwari</span>
            </span>
        </Link>

        <Link className="logo logo-light" to={"/dashboard"}>
            <span className="logo-lg">
                <img src={Logosm} alt="" height="22"/> <span className="logo-txt">Clothwari</span>
            </span>
            <span className="logo-sm">
                <img src={Logosm} alt="" height="22"/>
            </span>
        </Link>
    </div>

    <button type="button" className="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn" onClick={(e) => toggleSidebar(e,sidebarEnable)}>
        <i className="fa fa-fw fa-bars"></i>
    </button>

    <div data-simplebar className="sidebar-menu-scroll">

        <div id="sidebar-menu">
            <ul className="metismenu list-unstyled" id="side-menu">
                <li className="menu-title" data-key="t-menu">Menu</li>

                <li>
                    <Link to="/dashboard">
                        {/* <i className="bx bx-tachometer icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">Dashboard</span>                    
                    </Link>
                </li>

                {userInfo?.role === 'Super Admin' &&
                <li>
                    <Link to="/design-list-v1">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">View Design</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }

                {(userInfo?.role === 'Super Admin' || userInfo?.role === 'Designer') &&
                <li>
                    <Link to="/design-list-v2">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">Upload Design</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }

                {userInfo?.role === 'Super Admin' &&
                <li>
                    <Link to="/staff-list">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">Staff</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }

                {userInfo?.role === 'Super Admin' &&
                <li>
                    <Link to="/client-list">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">Client</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }

                {userInfo?.role === 'Super Admin' &&
                <li>
                    <Link to="/category-list">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">Category</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }


                {/* {userInfo?.role === 'Super Admin' && */}
                {/* <li>
                    <Link to="/tag-list">
                        <span className="menu-item" data-key="t-dashboards">Tag</span>
                    </Link>
                </li> */}
                {/* } */}

                {userInfo?.role === 'Client' &&
                <li>
                    <Link to="">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">Client Show Design</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }

            </ul>
        </div>
    </div>
</div>
  )
}

export default SidebarComponent
