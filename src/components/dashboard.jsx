import React from 'react'

function DashboardComponent() {
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
                <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-success rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">Design</p>
                                <h4 className="mt-1 mb-0">0 </h4>
                                
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-primary rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">Designer</p>
                                <h4 className="mt-1 mb-0">0</h4>
                                
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-primary rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">User</p>
                                <h4 className="mt-1 mb-0">0</h4>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        </div>
  )
}

export default DashboardComponent
