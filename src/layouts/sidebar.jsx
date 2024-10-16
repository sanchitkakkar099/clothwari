import React, { useState } from 'react'
import Logosm from "../assets/images/logo-sm.svg";
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';


function SidebarComponent() {
  const location = useLocation()
  const [sidebarEnable,setSidebarEnable] = useState(false)
  const [menuOpen,setMenuOpen] = useState()

  const userInfo = useSelector((state) => state?.authState.userInfo)

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

  const handleShowMenu = (e,id) => {
    e.preventDefault()
    if(menuOpen && id === menuOpen){
        setMenuOpen(null)
    } else {
        setMenuOpen(id)
    }
  }
  return (
    <div className="vertical-menu" id='v-menu'>

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

    {/* <button type="button" className="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn" onClick={(e) => toggleSidebar(e,sidebarEnable)}>
        <i className="fa fa-fw fa-bars"></i>
    </button> */}

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
                    <Link to="" className={`has-arrow ${(menuOpen === 'accounts' || location?.pathname === '/staff-list' || location?.pathname === '/client-list') ? "" : 'mm-collapsed'}`} id="accounts" onClick={(e) => handleShowMenu(e,'accounts')}>
                        {/* <i className="bx bx-user-circle icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-email">Accounts</span>
                    </Link>
                    <ul className={`sub-menu ${(menuOpen === 'accounts' || location?.pathname === '/staff-list' || location?.pathname === '/client-list') ?  "" : "mm-collapse"}`} aria-expanded="false">
                        <li><Link to="/admin-list" data-key="t-inbox">Admin</Link></li>
                        <li><Link to="/staff-list" data-key="t-inbox">Staff</Link></li>
                        <li><Link to="/client-list" data-key="t-read-email">Client</Link></li>
                        <li><Link to="/sales-person-list" data-key="t-read-email">Marketing</Link></li>
                        <li><Link to="/user-tag-list" data-key="t-read-email">Zone</Link></li>
                    </ul>
                </li>
                }

                {(userInfo?.role === 'Super Admin' || (userInfo?.role === 'Admin' && userInfo?.permissions?.some(el  => el === "Upload Design View")) ||
                (userInfo?.role === 'Designer' && userInfo?.permissions?.some(el  => el === "Upload Design View")))    
                &&
                <li>
                    <Link to="/design-list-v1">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">View/Search Design</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }

                {(
                    userInfo?.role === 'Super Admin' 
                    || 
                    (userInfo?.role === 'Admin' && userInfo?.permissions?.some(el  => el === "Upload Design Create" || el === "Upload Design View" || el === "Upload Design Edit" || el === "Uploaded Design Download"))
                    || 
                    (userInfo?.role === 'Designer' && userInfo?.permissions?.some(el  => el === "Upload Design Create" || el === "Upload Design View" || el === "Upload Design Edit" || el === "Uploaded Design Download"))    

                ) &&
                <li>
                    <Link to="/design-list-v2">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">Upload Design</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }

                {
                   (userInfo?.role === 'Super Admin' ||
                    (userInfo?.role === 'Admin' && userInfo?.permissions?.some(el  => el === "Drive")) || userInfo?.role === 'SalesPerson' || userInfo?.role === 'Client')
                    &&
                    <li>
                        <Link to="/drive-list">
                            <span className="menu-item" data-key="t-dashboards">Drive</span>
                        </Link>
                    </li>
                }

                

                {userInfo?.role === 'Admin' && (userInfo?.permissions?.some(el => el === "Staff Create" ||  el === "Staff View" ||  el === "Staff Edit" ||  el === "Staff Delete") || userInfo?.permissions?.some(el =>  el === "Client Create" ||  el === "Client View" ||  el === "Client Edit" ||  el === "Client Delete")) &&
                <li>
                    <Link to="" className={`has-arrow ${(menuOpen === 'accounts' || location?.pathname === '/staff-list' || location?.pathname === '/client-list') ? "" : 'mm-collapsed'}`} id="accounts" onClick={(e) => handleShowMenu(e,'accounts')}>
                        {/* <i className="bx bx-user-circle icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-email">Accounts</span>
                    </Link>
                    <ul className={`sub-menu ${(menuOpen === 'accounts' || location?.pathname === '/staff-list' || location?.pathname === '/client-list') ?  "" : "mm-collapse"}`} aria-expanded="false">
                        {userInfo?.permissions?.some(el => el === "Staff Create" ||  el === "Staff View" ||  el === "Staff Edit" ||  el === "Staff Delete") &&
                        <li><Link to="/staff-list" data-key="t-inbox">Staff</Link></li>
                        }
                        {userInfo?.permissions?.some(el =>  el === "Client Create" ||  el === "Client View" ||  el === "Client Edit" ||  el === "Client Delete") &&
                        <li><Link to="/client-list" data-key="t-read-email">Client</Link></li>
                        }
                    
                    </ul>
                </li>
                }

                {/* {userInfo?.role === 'Super Admin' &&
                <li>
                    <Link to="/staff-list">
                        <span className="menu-item" data-key="t-dashboards">Staff</span>
                    </Link>
                </li>
                }

                {userInfo?.role === 'Super Admin' &&
                <li>
                    <Link to="/client-list">
                        <span className="menu-item" data-key="t-dashboards">Client</span>
                    </Link>
                </li>
                } */}

                {userInfo?.role === 'Super Admin' &&
                <li>
                    <Link to="/category-list">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">Category</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }


                {(userInfo?.role === 'Super Admin' || userInfo?.role === 'Admin' || userInfo?.role === 'Designer') &&
                 <li>
                    <Link to="/tag-list">
                        <span className="menu-item" data-key="t-dashboards">Tag</span>
                    </Link>
                </li>
                }

                {userInfo?.role === 'Client' &&
                <li>
                    <Link to="/client-view-design">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">View Design</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }


                {userInfo?.role === 'SalesPerson' &&
                <li>
                    <Link to="/pdf-maker-view-design">
                        <span className="menu-item" data-key="t-dashboards">View Design</span>
                    </Link>
                </li>
                }

                {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some(el  => el === "Drive")) &&
                <li>
                    <Link to="/pdf-maker-view-design">
                        <span className="menu-item" data-key="t-dashboards">PDF Maker</span>
                    </Link>
                </li>
                }

                {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some(el => el === "Color Variation")) &&
                <li>
                    <Link to="/color-variation-list">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">Color Variation</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }

                {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some((el) => el === "Staff Approval")) &&
                <li>
                    <Link to="/staff-approval">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">Staff Approval</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }
                {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some((el) => el === "Design Approval")) &&
                <li>
                    <Link to="/design-approval-list">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">Design Approval</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }
                {(userInfo?.role === 'Super Admin' || (userInfo?.permissions?.some((el) => el === "Design View/Hide") && userInfo?.role === 'Admin')) &&
                 <li>
                    <Link to="/hidden-design-list">
                        {/* <i className="bx bx-store icon nav-icon"></i> */}
                        <span className="menu-item" data-key="t-dashboards">Classified Design</span>
                        {/* <span className="badge rounded-pill bg-success">5+</span> */}
                    </Link>
                </li>
                }

                {/* {(userInfo?.role === 'Super Admin') &&
                <li>
                    <Link to="/client-orders">
                        <span className="menu-item" data-key="t-dashboards">Client Orders</span>
                    </Link>
                </li>
                } */}

                {(userInfo?.role === 'Super Admin' || userInfo?.role === 'SalesPerson' || userInfo?.role === 'Client') &&
                 <li>
                    <Link to="/view-my-orders">
                        <span className="menu-item" data-key="t-dashboards">View Orders</span>
                    </Link>
                </li>
                }

                {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some((el) => el === "Order Approved/Rejected")) &&
                 <li>
                    <Link to="/view-orders-request">
                        <span className="menu-item" data-key="t-dashboards">Orders Request</span>
                    </Link>
                </li>
                }
                {(userInfo?.role === 'Super Admin') &&
                 <li>
                    <Link to="/report-list">
                        <span className="menu-item" data-key="t-dashboards">Report</span>
                    </Link>
                </li>
                }
                {(userInfo?.role === 'Super Admin' || userInfo?.role === 'Admin' || userInfo?.role === 'Designer' ) &&
                 <li>
                    <Link to="/view-mocks-domestic">
                        <span className="menu-item" data-key="t-dashboards">Create Mocks</span>
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
