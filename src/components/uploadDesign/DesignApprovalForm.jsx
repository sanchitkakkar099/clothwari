import React, { useEffect, useState } from "react";
import { useNavigate,Link, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDesignUploadApprovalByIdQuery, useDeleteRejectDesignUploadReqMutation, useSubmitApprovalDesignUploadMutation  } from "../../service";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Download, Edit, Eye, Image, MoreVertical, Trash } from "react-feather";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown } from "reactstrap";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'; // Import UTC plugin
import { getArrayDifferences } from '../../utils/compareEditDesign'
// Extend dayjs with the utc plugin
dayjs.extend(utc);


function DesignApprovalForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();
  const { state: locationState} =location;
  const userInfo = useSelector((state) => state?.authState.userInfo)
  // const [reqDesign,resDesign] = useDesignUploadListMutation()
  const resDesignById = useDesignUploadApprovalByIdQuery(locationState?.designID,{
    skip: !locationState?.designID
  })
  const [reqDelete, resDelete] = useDeleteRejectDesignUploadReqMutation();
  const [reqApprove, resApprove] = useSubmitApprovalDesignUploadMutation();

  // pagination 
  const [TBLData, setTBLData] = useState('')
  const [TBLEditData, setTBLEditData] = useState('')
  const [displayVariations, setDisplayVariations] = useState([])
  const [displayFields, setDisplayFields] = useState({
    name:false,
    designNo:false,
    category:false,
    tag:false,
    image:false,
    thumbnail:false,
    primary_color_name:false,
    primary_color_code:false,
    variations:false
    })

  useEffect(() => {
    if (resDesignById?.isSuccess) {
      console.log(resDesignById?.data?.data);
      setTBLData(resDesignById?.data?.data?.Design);
      setTBLEditData(resDesignById?.data?.data?.editDesign);
    }
  }, [resDesignById]);

  const compareArrayFields = (element, TBLData, TBLEditData) => {
    let originalArray = TBLData?.[element] || [];
    let editedArray = TBLEditData?.[element] || [];
    let flag = originalArray.length !== editedArray.length;

    for (let i = 0; !flag && i < originalArray.length; i++) {
        if (element === 'tag') {
            if (originalArray[i]?.label !== editedArray[i]?.label) {
              flag = true;
              break;
            }
          } else {
            if (originalArray[i]?._id !== editedArray[i]?._id) {
              flag = true;
              break;
            }
          }
    }

    if (flag) {
      setDisplayFields(prevState => ({
        ...prevState,
        [element]: true
      }));
    }
  };

  useEffect(()=>{
    const fields = ['name', 'designNo', 'primary_color_name', 'primary_color_code'];
    const arrayFields = ['category', 'tag', 'image','thumbnail'];
    fields.forEach(field => {
        setDisplayFields(prev => ({
            ...prev,
            [field]: TBLData[field] !== TBLEditData[field],
          }));
    });
    arrayFields.forEach(element => {
        if (element === 'category') {
            setDisplayFields(prev => ({
              ...prev,
              [element]: TBLData?.[element]?._id !== TBLEditData?.[element]?._id,
            }));
          } else {
            compareArrayFields(element, TBLData, TBLEditData);
          }
    }); 
    if(TBLData && TBLEditData){
        const differences = getArrayDifferences(TBLEditData?.variations , TBLData?.variations);
        setDisplayVariations(differences);
    }       
  },[TBLData, TBLEditData])

  useEffect(()=>{
    if(resDelete?.isSuccess){
      toast.success('Successfully Rejected',{
        position: "top-center"
      })
      navigate("/design-approval-list");
    }
    if(resDelete?.isError){
      toast.error(resDelete?.message ? resDelete?.message : "Somethings went wrong",{
        position: "top-center"
      })
    }

  },[resDelete])

  useEffect(()=>{
    if(resApprove?.isSuccess){
      toast.success('Successfully Updated',{
        position: "top-center"
      })
      navigate("/design-approval-list");
    }
    if(resApprove?.isError){
      toast.error(resApprove?.message ? resApprove?.message : "Somethings went wrong",{
        position: "top-center"
      })
    }

  },[resApprove])

  const handleReject = (e) => {
    e.preventDefault();
    reqDelete(TBLEditData._id);
  };
  const handleApprove = (e) => {
    e.preventDefault();
    const payload = {
      _id:TBLEditData?._id,
      designId:TBLEditData?.designId,
      color:TBLEditData?.color,
      status: "Approved",
      ...(displayFields.name ? { name: TBLEditData?.name } : {}),
      ...(displayFields.designNo ? { designNo: TBLEditData?.designNo } : {}),
      ...(displayFields.category ? { category: TBLEditData?.category?._id } : {}),
      ...(displayFields.tag ? { tag: TBLEditData?.tag } : {}),
      ...(displayFields.thumbnail ? { thumbnail: TBLEditData?.thumbnail?.map((tf) => tf?._id) } : {}),
      ...(displayFields.image ? { image: TBLEditData?.image?.map((tf) => tf?._id) } : {}),
      ...(displayFields.primary_color_name ? { primary_color_name: TBLEditData?.primary_color_name } : {}),
      ...(displayFields.primary_color_code ? { primary_color_code: TBLEditData?.primary_color_code } : {}),
      ...(displayVariations.length > 0 ? {
          variations: displayVariations.map((el, index) => {
              const variation = {};
              if (el.color || el.variation_designNo || el.variation_name || el.variation_image || el.variation_thumbnail) {
                  variation._id = TBLData?.variations[index]?._id ?  TBLData?.variations[index]?._id : null;
                  if (el.color) {
                      variation.color = TBLEditData?.variations[index]?.color;
                  }
                  if (el.variation_designNo) {
                      variation.variation_designNo = TBLEditData?.variations[index]?.variation_designNo;
                  }
                  if (el.variation_name) {
                      variation.variation_name = TBLEditData?.variations[index]?.variation_name;
                  }
                  if (el.variation_image?.length) {
                      variation.variation_image = TBLEditData?.variations[index]?.variation_image?.map((vi) => vi?._id);
                  }
                  if (el.variation_thumbnail?.length) {
                      variation.variation_thumbnail = TBLEditData?.variations[index]?.variation_thumbnail?.map((vi) => vi?._id);
                  }
              }
              return variation;
          }).filter(v => Object.keys(v).length > 0) // Filter out empty objects
      } : {})
  };
  console.log("payload", payload);
  reqApprove(payload);
  }  


  useEffect(()=>{
    console.log("displayVariations",displayVariations)
  ,[displayVariations]})

  return (
    <>
    {(userInfo?.role === 'Super Admin') ?
    <>
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Design Approval</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Clothwari</a>
                  </li>
                  <li className="breadcrumb-item active">Design Approval</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card p-4">
              <div className="">
                <div className="position-relative">
                {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.includes("Upload Design Create")) &&
                  <div className="modal-button modal-button-s mt-1">
                  
                  </div>
                  }
                  
                  </div>
                  
                  {/* <DataTable data={designUploadList} columns={columns} /> */}
                  <table className="filter-table mb-5">
                    <thead>
                      <tr>
                      {userInfo?.role === 'Super Admin'}
                        <th>Field Name</th>
                        <th>Previous</th>
                        <th>Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                        {displayFields.name && (
                          <tr>
                          <td>Design Name</td>
                          <td>{TBLData?.name}</td>
                          <td>{TBLEditData?.name}</td>
                          </tr>
                        )}
                        {displayFields.designNo && (
                          <tr>
                          <td>Design Number</td>
                          <td>{TBLData?.designNo}</td>
                          <td>{TBLEditData?.designNo}</td>
                          </tr>
                        )}
                        {displayFields.category && (
                          <tr>
                          <td>Category</td>
                          <td>{TBLData?.category?.name}</td>
                          <td>{TBLEditData?.category?.name}</td>
                          </tr>
                        )}                       
                        {displayFields.tag && (
                          <tr>
                          <td>Tag</td>
                          <td>{TBLData?.tag?.map(ele => ele.label).join(', ')}</td>
                          <td>{TBLEditData?.tag?.map(ele => ele.label).join(', ')}</td>
                          </tr>
                        )}
                        {displayFields.image && (
                          <tr>
                          <td>Image</td>
                          <td>{TBLData?.image?.length>0 && (TBLData?.image?.map(ele => (
                            <a href={ele?.filepath} target="_blank"> <img src={ele.filepath} width={100} height={100}/></a>
                          )))}</td>
                          <td>{TBLEditData?.image?.length>0 && (TBLEditData?.image?.map(ele => (
                            <a href={ele?.filepath} target="_blank"> <img src={ele.filepath} width={100} height={100}/></a>
                          )))}</td>
                          </tr>
                        )}
                        {displayFields.thumbnail && (
                          <tr>
                          <td>Thumbnail</td>
                          <td>{TBLData?.thumbnail?.length>0 && (TBLData?.thumbnail?.map(ele => (
                            <a href={ele?.filepath} target="_blank">Pdf</a>
                          )))}
                          </td>
                          <td>{TBLEditData?.thumbnail?.length>0 && (TBLEditData?.thumbnail?.map(ele => (
                            <a href={ele?.filepath} target="_blank"> Pdf</a>
                          )))}
                          </td>         
                          </tr>
                        )}
                        {displayFields.primary_color_name && (
                          <tr>
                          <td>Primary Color Name</td>
                          <td>{TBLData?.primary_color_name}</td>
                          <td>{TBLEditData?.primary_color_name}</td>
                          </tr>
                        )}
                        {displayFields.primary_color_code && (
                          <tr>
                          <td>Primary Color Code</td>
                          <td>{TBLData?.primary_color_code}</td>
                          <td>{TBLEditData?.primary_color_code}</td>
                          </tr>
                        )}
                        {displayVariations.length > 0 &&(
                          displayVariations?.map((differences, index ) => (
                            <>
                            {(differences?.color || differences?.variation_name || differences?.variation_designNo || differences?.variation_image || differences?.variation_thumbnail ) && (
                            <tr className="bg-primary">
                              <td colSpan={3}>{(!TBLData?.variations[index]?.color && TBLEditData?.variations[index]?.color) ? "New " : ""}variantion {index+1}</td>
                            </tr>)}
                            {differences?.color &&(
                              <tr key={index}>
                              <td>Color</td> 
                              <td>{TBLData?.variations[index]?.color}</td>
                              <td>{TBLEditData?.variations[index]?.color}</td>
                              </tr>
                            )}
                            {differences?.variation_name &&(
                              <tr key={index}>
                              <td>Name</td> 
                              <td>{TBLData?.variations[index]?.variation_name}</td>
                              <td>{TBLEditData?.variations[index]?.variation_name}</td>
                              </tr>
                            )}
                            {differences?.variation_designNo &&(
                              <tr key={index}>
                              <td>Design Number</td> 
                              <td>{TBLData?.variations[index]?.variation_designNo}</td>
                              <td>{TBLEditData?.variations[index]?.variation_designNo}</td>
                              </tr>
                            )}
                            {differences?.variation_image &&(
                              <tr key={index}>
                              <td>Image</td>
                              <td>{TBLData?.variations[index]?.variation_image?.length>0 && (TBLData?.variations[index]?.variation_image?.map(ele => (
                                <a href={ele?.filepath} target="_blank">Pdf</a>
                                )))}
                              </td>
                              <td>{TBLEditData?.variations[index]?.variation_image?.length>0 && (TBLEditData?.variations[index]?.variation_image?.map(ele => (
                                <a href={ele?.filepath} target="_blank"> Pdf</a>
                                )))}
                              </td> 
                              </tr>
                            )}
                            {differences?.variation_thumbnail &&(
                              <tr key={index}>
                              <td>Thumbnail </td> 
                              <td>{TBLData?.variations[index]?.variation_thumbnail?.length>0 && (TBLData?.variations[index]?.variation_thumbnail?.map(ele => (
                                <a href={ele?.filepath} target="_blank">Pdf</a>
                                )))}
                              </td>
                              <td>{TBLEditData?.variations[index]?.variation_thumbnail?.length>0 && (TBLEditData?.variations[index]?.variation_thumbnail?.map(ele => (
                                <a href={ele?.filepath} target="_blank"> Pdf</a>
                              )))}
                              </td> 
                              </tr>
                            )}
                            </>
                          ))
                        )}
                    </tbody>
                  </table>
              </div>
              <div className="row">
                <div className="col text-end">
                <Link
                  to="/design-approval-list"
                  className="btn btn-danger m-1"
                >
                {" "}
                  <i className="bx bx-x mr-1"></i> Cancel{" "}
                </Link>
                <button onClick={handleReject} className="btn btn-secondary m-1">
                  <i className=" bx bx-file me-1"></i> Reject{" "}
                </button>
                <button onClick={handleApprove} className="btn btn-success m-1">
                  <i className=" bx bx-file me-1"></i> Approve{" "}
                </button>
              </div>
              
        </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </>
      :
      <Navigate to={"/dashboard"} />
    }
    </>
  );
}

export default DesignApprovalForm;
