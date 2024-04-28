import React, { useEffect, useState } from "react";
import { useClientOrderByIdQuery } from "../../service";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import "./orderDetail.css";
import dayjs from "dayjs"; // For date formatting
import DatePicker from "react-datepicker"; // For date selection in search
import "react-datepicker/dist/react-datepicker.css"; // Include datepicker CSS
import { useSelector } from "react-redux";


function OrderDetials() {
  const navigate = useNavigate()
  const params = useParams();
  const location = useLocation()
  const userInfo = useSelector((state) => state?.authState.userInfo)
  const resClientOrderById = useClientOrderByIdQuery({id:params?.id,role:userInfo?.role});
  const [data,setData] = useState([])

  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  };

  useEffect(() => {
    if(resClientOrderById?.isSuccess && resClientOrderById?.data){
      setData(resClientOrderById?.data?.data?.docs?.map(el => el?.cartItem))
    }
  },[resClientOrderById?.isSuccess])


  // Define the columns for the table
  const headers = [
    { header: "Name", accessorKey: "name" },
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
  console.log('searchTerms',searchTerms);
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
  
  


  return (
    <>
    {(userInfo?.role === 'Super Admin' || userInfo?.role === 'SalesPerson' || userInfo?.role === 'Client') ?
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
                <div className="d-flex justify-content-end mb-4">
            <button className="btn btn-primary" onClick={(e) => backToViewOrder(e)}>Back To View Order</button>
            </div>
                <div className="table-wrapper">
                  <div className="table-container">
                    <table
                      className="design-table"
                      style={{ width: `${totalWidth}px` }}
                    >
                      <thead>
                        <tr className="search-row">
                          {headers.map((header, index) => {
                            if (
                              header.accessorKey.toLowerCase().includes("date")
                            ) {
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
                            } else {
                              return (
                                (header.accessorKey === "thumbnail") ? <th key={index}/> :
                                <th key={index}>
                                  <input
                                    type="text"
                                    placeholder={`Search ${header.header}...`}
                                    value={searchTerms[index]}
                                    onChange={(e) =>
                                      handleSearchChange(index, e)
                                    }
                                  />
                                </th>
                              );
                            }
                          })}
                        </tr>
                        <tr>
                          {headers.map((header, index) => (
                            <th key={index}>{header.header}</th>
                          ))}
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
                              {headers.map((header, idx) => (
                                header.accessorKey === "thumbnail" ?
                                <td key={idx}>{row[header.accessorKey] ? <img src={row[header.accessorKey]} height={50} width={50} alt="design" /> : ""}</td>
                                :
                                <td key={idx}>{row[header.accessorKey]}</td>
                              ))}
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
