import React, { useEffect } from 'react'
import { getDesigner } from '../redux/designerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useDesignUploadListMutation, useDesignerListMutation } from '../service';
import { getDesignUpload } from '../redux/designUploadSlice';

function DashboardComponent() {
    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state?.authState.userInfo)
    const [reqDesigner,resDesigner] = useDesignerListMutation()
    const [reqDesign,resDesign] = useDesignUploadListMutation()

    const designerList = useSelector((state) => state?.designerState.designerList)
    const designUploadList = useSelector((state) => state?.designUploadState.designUploadList)

    useEffect(() => {
        reqDesigner({
        page: 0,
        limit: 0,
        search: "",
        });
    }, [userInfo]);

    useEffect(() => {
        if (resDesigner?.isSuccess) {
        dispatch(getDesigner(resDesigner?.data?.data?.docs));
        }
    }, [resDesigner?.isSuccess]);

    useEffect(() => {
        reqDesign({
          page: 0,
          limit: 0,
          search: "",
        });
      }, [userInfo]);
    
      useEffect(() => {
        if (resDesign?.isSuccess) {
          dispatch(getDesignUpload(resDesign?.data?.data?.docs));
        }
      }, [resDesign?.isSuccess]);

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
                                <h4 className="mt-1 mb-0">{designUploadList && Array.isArray(designUploadList) && designUploadList?.length > 0 ? designUploadList?.length : 0}</h4>
                                
                            </div>
                        </div>
                    </div>
                    {userInfo?.role === 'Super Admin' &&
                    <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-primary rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">Designer</p>
                                <h4 className="mt-1 mb-0">{designerList && Array.isArray(designerList) && designerList?.length > 0 ? designerList?.length : 0}</h4>

                                
                            </div>
                        </div>
                    </div>
                    }
                    {userInfo?.role === 'Super Admin' &&
                    <div className="col-lg-3 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="avatar">
                                    <span className="avatar-title bg-soft-primary rounded">
                                        <i className="mdi mdi-eye-outline text-success font-size-24"></i>
                                    </span>
                                </div>
                                <p className="text-muted mt-4 mb-0">Client Order</p>
                                <h4 className="mt-1 mb-0">0</h4>
                                
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
