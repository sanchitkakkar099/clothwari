import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardData } from '../redux/dashboardSlice';
import { useDashboardCountQuery } from '../service';
import { useNavigate } from 'react-router-dom';

function DashboardComponent() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userInfo = useSelector((state) => state?.authState.userInfo)
    const dashData = useSelector((state) => state?.dashboardState.dash_data)
    const resDashboard = useDashboardCountQuery(undefined,{refetchOnMountOrArgChange:true});
    const designerList = useSelector((state) => state?.designerState.designerList)
    const designUploadList = useSelector((state) => state?.designUploadState.designUploadList)

    useEffect(() => {
        if(resDashboard?.isSuccess && resDashboard?.data?.data){
            dispatch(getDashboardData(resDashboard?.data?.data))
        }
    },[resDashboard])

    const navigateToPage = (navTo) => {
        if(userInfo?.role === 'Client'){
            navigate("/client-view-design")
        }else{
            navigate(navTo)
        }
    }

  return (
    <div className="page-content">
    <div className="container-fluid">
        <div className="row">
            <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                    <h4 className="mb-0">Welcome !</h4>
                    <div className="page-title-right">
                        <ol className="breadcrumb m-0">
                            <li className="breadcrumb-item"><a href="#!">Clothwari</a></li>
                            <li className="breadcrumb-item active">Welcome !</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-xl-12">
                <div className="row">
                {(userInfo?.role === 'Super Admin') &&
                    <div className="col-lg-3 col-md-6">
                        <div className="card" style={{cursor: 'pointer'}} onClick={() => navigateToPage('/admin-list')}>
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-success rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">Admin</p>
                                <h4 className="mt-1 mb-0">{dashData?.admin ? dashData?.admin : 0}</h4> 
                            </div>
                        </div>
                    </div>
                    }
                    {(userInfo?.role === 'Super Admin') &&
                    <div className="col-lg-3 col-md-6">
                        <div className="card" style={{cursor: 'pointer'}} onClick={() => navigateToPage('/client-list')}>
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-success rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">Client</p>
                                <h4 className="mt-1 mb-0">{dashData?.client ? dashData?.client : 0}</h4> 
                            </div>
                        </div>
                    </div>
                    }
                    {/* {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some(el => el === "Upload Design Create" || el === "Upload Design View" || el === "Upload Design Edit" || el === "Upload Design Download")) && */}
                    {((userInfo?.role === 'Super Admin' || userInfo?.role === 'Admin' || userInfo?.role === 'Client' || userInfo?.role === 'Designer')) &&
                    
                    <div className="col-lg-3 col-md-6">
                        <div className="card" style={{cursor: 'pointer'}} onClick={() => navigateToPage('/design-list-v1')}>
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-success rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">Design</p>
                                {/* <h4 className="mt-1 mb-0">{dashData?.uploaddesign ? dashData?.uploaddesign : 0}</h4>  */}
                                <h4 className="mt-1 mb-0">{dashData?.uploaddesignwithvariant ? dashData?.uploaddesignwithvariant : 0}</h4> 
                            </div>
                        </div>
                    </div>
                    }

                    {(userInfo?.role === 'Designer') &&
                    <div className="col-lg-3 col-md-6">
                        <div className="card" style={{cursor: 'pointer'}} onClick={() => navigateToPage('/design-list-v1')}>
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-success rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">My Design</p>
                                <h4 className="mt-1 mb-0">{dashData?.uploaddesign ? dashData?.uploaddesign : 0}</h4> 
                            </div>
                        </div>
                    </div>
                    }

                    {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some(el => el === "Staff Create" || el === "Staff View" || el === "Staff Edit" || el === "Staff Delete")) &&
                    <div className="col-lg-3 col-md-6">
                        <div className="card" style={{cursor: 'pointer'}} onClick={() => navigateToPage('/staff-list')}>
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-primary rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">Staff</p>
                                <h4 className="mt-1 mb-0">{dashData?.staff ? dashData?.staff : 0}</h4>
                            </div>
                        </div>
                    </div>
                    }
                    {userInfo?.role === 'Super Admin' &&
                    <div className="col-lg-3 col-md-6">
                        <div className="card" style={{cursor: 'pointer'}} onClick={() => navigateToPage('/staff-approval')}>
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-primary rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">Staff Approval</p>
                                <h4 className="mt-1 mb-0">{dashData?.newStaff ? dashData?.newStaff : 0}</h4>
                            </div>
                        </div>
                    </div>
                    }
                    {/* {(userInfo?.role === 'Client') &&
                    <div className="col-lg-3 col-md-6">
                        <div className="card" style={{cursor: 'pointer'}} onClick={() => navigate("/view-my-orders")}>
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-success rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">My Orders</p>
                                <h4 className="mt-1 mb-0">{dashData?.clientBagCount ? dashData?.clientBagCount : 0}</h4> 
                            </div>
                        </div>
                    </div>
                    } */}

                    {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some(el => el === "Order Approved/Rejected") || userInfo?.role === 'Client' || userInfo?.role === 'SalesPerson') &&
                    <div className="col-lg-3 col-md-6">
                        <div className="card" style={{cursor: 'pointer'}} 
                        onClick={() => navigate("/view-my-orders")}
                        >
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-success rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">{(userInfo?.role === 'Client' || userInfo?.role === 'SalesPerson') ? "My Orders" : "Client Orders"}</p>
                                <h4 className="mt-1 mb-0">{dashData?.clientBagCount ? dashData?.clientBagCount : 0}</h4> 
                            </div>
                        </div>
                    </div>
                    }

                    {((userInfo?.role === 'Super Admin') || (userInfo?.role === 'Admin' && userInfo?.permissions?.some(el => el === "Drive")) || (userInfo?.role === 'SalesPerson')) &&
                    <div className="col-lg-3 col-md-6">
                        <div className="card" style={{cursor: 'pointer'}} onClick={() => navigate("/drive-list")}>
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-success rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">Drive</p>
                                <h4 className="mt-1 mb-0">{dashData?.drive ? dashData?.drive : 0}</h4> 
                            </div>
                        </div>
                    </div>
                    }

                </div>
            </div>
        </div>
        </div>
        </div>
  )
}

export default DashboardComponent
