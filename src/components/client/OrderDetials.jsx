import React, { useEffect, useRef, useState } from "react";
import { useApproveOrderMutation, useClientOrderByIdQuery } from "../../service";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import "./orderDetail.css";
import dayjs from "dayjs"; // For date formatting
import { CSVLink, CSVDownload } from "react-csv";
import DatePicker from "react-datepicker"; // For date selection in search
import "react-datepicker/dist/react-datepicker.css"; // Include datepicker CSS
import { useSelector } from "react-redux";
import { Button } from 'reactstrap';
import toast from "react-hot-toast";


function OrderDetials() {
  const navigate = useNavigate()
  const params = useParams();
  const location = useLocation()
  const userInfo = useSelector((state) => state?.authState.userInfo)
  const resClientOrderById = useClientOrderByIdQuery({id:params?.id,role:userInfo?.role});
  const [data,setData] = useState([])
  const [fileName, SetFileName] = useState('Default');

  const [reqApproveOrder, resApproveOrder] = useApproveOrderMutation();

  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  };

  useEffect(() => {
    if(resClientOrderById?.isSuccess && resClientOrderById?.data){
      SetFileName(resClientOrderById?.data?.data?.docs[0]?.customerName ? resClientOrderById?.data?.data?.docs[0]?.customerName : 'Default')
      setData(resClientOrderById?.data?.data?.docs?.map(el => el?.cartItem))
    }
  },[resClientOrderById?.isSuccess])


  // Define the columns for the table
  const headers = [
    { header: "Name", accessorKey: "name" },
    { header: "Designer Name", accessorKey: "uploadedByDesign" },
    { header: "Design No.", accessorKey: "designNo" },
    { header: "Thumbnail", accessorKey: "thumbnail" },
    { header: "Quantity/Combo", accessorKey: "quantityPerCombo" },
    { header: "Yardage", accessorKey: "yardage" },
    { header: "Fabric Details", accessorKey: "fabricDetails" },
    { header: "Strike Required", accessorKey: "strikeRequired" },
    { header: "Sample Delivery Date", accessorKey: "sampleDeliveryDate" },
    { header: "Price Per Meter", accessorKey: "pricePerMeter" },
    {
      header: "Bulk Order Delivery Date",
      accessorKey: "bulkOrderDeliveryDate",
    },
    { header: "Shipment Sample Date", accessorKey: "shipmentSampleDate" },
  ];

  const [searchTerms, setSearchTerms] = useState(
    Array(headers.length).fill("")
  );
  // console.log('searchTerms',searchTerms);
  const [formattedData, setFormattedData] = useState([]);
  const [totalWidth, setTotalWidth] = useState(0);

  const calculateTotalWidth = () => {
    const defaultWidth = 300; // Default width for each column
    const minimumTableWidth = 800; // Minimum width for the table
    const calculatedWidth = headers.length * defaultWidth;
    return calculatedWidth < minimumTableWidth
      ? minimumTableWidth
      : calculatedWidth;
  };

  // Set the total width once when the component is mounted
  useEffect(() => {
    setTotalWidth(calculateTotalWidth());
  }, []);

  useEffect(() => {
    // Format date columns using dayjs
    const newFormattedData = data.map((item) => ({
      ...item,
      bulkOrderDeliveryDate: formatDate(item.bulkOrderDeliveryDate),
      shipmentSampleDate: formatDate(item.shipmentSampleDate),
      sampleDeliveryDate: formatDate(item.sampleDeliveryDate),
    }));
    setFormattedData(newFormattedData);
  }, [data]);

  const handleSearchChange = (index, event) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = event?.target?.value?.toLowerCase() ?? null;
    setSearchTerms(newSearchTerms);
  };

  const handleDateChange = (index, date) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = date ? formatDate(date) : ""; // Format the date input
    setSearchTerms(newSearchTerms);
  };

  const filterRow = (row, searchTerms) => {
    return searchTerms.every((term, index) => {
      if (!term) return true; // If search term is null or empty, ignore it
      const key = headers[index]?.accessorKey;
      const value = row[key]?.toLowerCase() || '';
      console.log('ssssss', value, term);
      return value.includes(term);
    });
  };

  const backToViewOrder = (e) => {
    e.preventDefault()
    if(location?.state?.from  === 'view-orders-request'){
      navigate('/view-orders-request')
    }else{
      navigate("/view-my-orders")
    }
  }

  const onApproveAction = (e) => {
    e.preventDefault();
    reqApproveOrder({
      cartId:params?.id,
      status:"Approved"
    })
  };

  const onRejectAction = (e) => {
    e.preventDefault();
    reqApproveOrder({
      cartId:params?.id,
      status:"Rejected"
    })
  };

  useEffect(() => {
    if(resApproveOrder?.isSuccess){
      toast.success("Order Request SuccessFully Updated",{
        position:'top-center'
      })
      if(location?.state?.from  === 'view-orders-request'){
        navigate('/view-orders-request')
      }
    }
    if(resApproveOrder?.isError){
      toast.error("Something went wrong",{
        position:'top-center'
      })
      if(location?.state?.from  === 'view-orders-request'){
        navigate('/view-orders-request')
      }
    }
  },[resApproveOrder?.isSuccess,resApproveOrder?.isError])

  const handleDownloadCSV = () => {
    const csvDataTemp = [
      headers.map((header) => header.header),
      ...formattedData
        .filter((row) => filterRow(row, searchTerms, headers)) 
        .map((row) => headers.map((header) => row[header.accessorKey])) 
    ];
  const csvLink = document.createElement('a');
  csvLink.href = `data:text/csv;charset=utf-8,${encodeURI(
    csvDataTemp.map((e) => e.join(',')).join('\n')
  )}`;
  csvLink.download = fileName;
  csvLink.click();
  };
  
  


  return (
    <>
    {(userInfo?.role === 'Super Admin' || userInfo?.role === 'SalesPerson' || userInfo?.role === 'Client' || userInfo?.permissions?.some(el => el === "Order Approved/Rejected")) ?
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">Order Details</h4>

                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="#!">Clothwari</a>
                    </li>
                    <li className="breadcrumb-item active">Order Details</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

         

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                <div className="d-flex justify-content-end mb-4 gap-4">
                  <button className="btn btn-primary" onClick={(e) => backToViewOrder(e)}>Back To View Order</button>
                  {userInfo?.role === "Super Admin" && 
                  <button className="btn btn-primary" onClick={handleDownloadCSV}>Download CSV</button>
                  }
                </div>
                {(userInfo?.role === 'Super Admin' || userInfo?.permissions?.some((el) => el === "Order Approved/Rejected")) && (location?.state?.isClientApproved !== "Approved" && location?.state?.isClientApproved !== "Rejected") && 
                 location?.state?.from === "view-orders-request" &&
                  <>
                    <Button className="m-1" color="primary" onClick={(e) => onApproveAction(e)}>Approve</Button>
                    <Button className="ms-2 m-1" color="danger" onClick={(e) => onRejectAction(e)}>Reject</Button>
                  </>
                }
                <div className="table-wrapper">
                  <div className="table-container">
                    <table
                      className="design-table"
                      style={{ width: `${totalWidth}px` }}
                    >
                      <thead>
                        <tr className="search-row">
                          {headers.map((header, index) => {
                            const isDateFields = header.accessorKey.toLowerCase().includes("data");
                            const isUploadedByDesigner = header.accessorKey === "uploadedByDesign";
                            const isThumbnail = header.accessorKey === "thumbnail";
                            if(isDateFields) {
                              return (
                                <th key={index}>
                                  <DatePicker
                                    selected={
                                      searchTerms[index]
                                        ? dayjs(searchTerms[index], "DD-MM-YYYY").toDate()
                                        : null
                                    }
                                    onChange={(date) =>
                                      handleDateChange(index, date)
                                    }
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText={`Search ${header.header}...`}
                                    isClearable
                                    popperClassName="datepicker-popper"
                                  />
                                </th>
                              );
                            }
                            if(isThumbnail) {
                              return <th key={index}/>;
                            }
                            if(isUploadedByDesigner && userInfo?.role !== "Super Admin") {
                              return null;
                            }
                            return (
                              <th key={index}>
                                <input
                                  type="text"
                                  placeholder={`Search ${header.header}...`}
                                  value={searchTerms[index]}
                                  onChange={(e) => handleSearchChange(index, e)}
                                />
                              </th>
                            );
                          })}
                        </tr>
                        <tr>
                          {headers.map((header, index) => {
                            const isUploadedByDesigner = header.accessorKey === "uploadedByDesign";
                            if(isUploadedByDesigner && userInfo?.role !== "Super Admin") {
                              return null;
                            }
                            return <th key={index}>{header.header}</th>
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {formattedData
                          .filter((row) => filterRow(row, searchTerms,headers))
                          .map((row, index) => (
                            <tr
                              key={index}
                              className={index % 2 === 0 ? "striped" : ""}
                            >
                              {headers.map((header, idx) => {
                                const isUploadedByDesigner = header.accessorKey === "uploadedByDesign";
                                const isThumbnail = header.accessorKey === "thumbnail";
                                if(isThumbnail) {
                                  return <td key={idx}>{row[header.accessorKey] ? <img src={row[header.accessorKey]} height={50} width={50} alt="design" /> : ""}</td>;
                                }
                                if(isUploadedByDesigner && userInfo?.role !== "Super Admin") {
                                  return null;
                                }
                                return  <td key={idx}>{row[header.accessorKey]}</td>;
                                // header.accessorKey === "thumbnail" ?
                                // <td key={idx}>{row[header.accessorKey] ? <img src={row[header.accessorKey]} height={50} width={50} alt="design" /> : ""}</td>
                                // :
                                // <td key={idx}>{row[header.accessorKey]}</td>
                              })}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      :
      <Navigate to={"/dashboard"}/>
    }
    </>
  );
}

export default OrderDetials;
