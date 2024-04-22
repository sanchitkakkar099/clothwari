import React, { useEffect, useState } from "react";
import { useClientOrderByIdQuery } from "../../service";
import { useParams } from "react-router-dom";
import './orderDetail.css'
import dayjs from 'dayjs'; // For date formatting
import DatePicker from 'react-datepicker'; // For date selection in search

import 'react-datepicker/dist/react-datepicker.css'; // Include datepicker CSS


function OrderDetials() {
  const params = useParams();
  const resClientOrderById = useClientOrderByIdQuery(params?.id);

  // // Define the columns for the table
  const headers = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Design No.', accessorKey: 'designNo' },
    { header: 'Thumbnail', accessorKey: 'thumbnail' },
    { header: 'Quantity/Combo', accessorKey: 'quantityPerCombo' },
    { header: 'Yardage', accessorKey: 'yardage' },
    { header: 'Fabric Details', accessorKey: 'fabricDetails' },
    { header: 'Strike Required', accessorKey: 'strikeRequired' },
    { header: 'Sample Delivery Date', accessorKey: 'sampleDeliveryDate' },
    { header: 'Price Per Meter', accessorKey: 'pricePerMeter' },
    { header: 'Bulk Order Delivery Date', accessorKey: 'bulkOrderDeliveryDate' },
    { header: 'Shipment Sample Date', accessorKey: 'shipmentSampleDate' },
  ]

const data = [
  {
    name: "DLNKD3037GE12144PC",
    designNo: "DLNKD3037GE12144APC",
    thumbnail: "6626106efc6037de95fbb477",
    quantityPerCombo: "10",
    yardage: "10",
    fabricDetails: "test 1",
    strikeRequired: "yes",
    sampleDeliveryDate: "2024-04-22T00:00:00+05:30",
    pricePerMeter: "10",
    bulkOrderDeliveryDate: "2024-04-23T00:00:00+05:30",
    shipmentSampleDate: "2024-04-24T00:00:00+05:30"
  },
  {
    name: "DLNKD3037GE12144PC",
    designNo: "DLNKD3037GE12144BPC",
    thumbnail: "66261065fc6037de95fbb465",
    quantityPerCombo: "20",
    yardage: "20",
    fabricDetails: "test 2",
    strikeRequired: "no",
    sampleDeliveryDate: "2024-04-25T00:00:00+05:30",
    pricePerMeter: "20",
    bulkOrderDeliveryDate: "2024-04-26T00:00:00+05:30",
    shipmentSampleDate: "2024-04-27T00:00:00+05:30"
  }
]

const [searchTerms, setSearchTerms] = useState(Array(headers.length).fill(''));
const [formattedData, setFormattedData] = useState([]);
  const [totalWidth, setTotalWidth] = useState(0);

  const calculateTotalWidth = () => {
    const defaultWidth = 300; // Default width for each column
    const minimumTableWidth = 800; // Minimum width for the table
    const calculatedWidth = headers.length * defaultWidth;
    return calculatedWidth < minimumTableWidth ? minimumTableWidth : calculatedWidth;
  };

  // Set the total width once when the component is mounted
  useEffect(() => {
    setTotalWidth(calculateTotalWidth());
  }, [headers]);

  useEffect(() => {
    // Format date columns using dayjs
    const newFormattedData = data.map((item) => ({
      ...item,
      bulkOrderDeliveryDate: dayjs(item.bulkOrderDeliveryDate).format('DD-MM-YYYY'),
      shipmentSampleDate: dayjs(item.shipmentSampleDate).format('DD-MM-YYYY'),
      sampleDeliveryDate: dayjs(item.sampleDeliveryDate).format('DD-MM-YYYY'),
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
    newSearchTerms[index] = date ? dayjs(date).format('DD-MM-YYYY') : null;
    setSearchTerms(newSearchTerms);
  };

  const filterRow = (row, searchTerms) => {
    return searchTerms.every((term, index) => {
      if (!term) return true; // If search term is null or empty, ignore it
      const key = headers[index]?.accessorKey;
      const value = row[key]?.toLowerCase() || '';
      return value.includes(term);
    });
  };

  


  return (
    <>
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
                <div className="table-container">
      <table className="design-table" style={{ width: `${totalWidth}px` }}>
        <thead>
          <tr className="search-row">
            {headers.map((header, index) => {
              if (header.accessorKey.toLowerCase().includes('date')) {
                return (
                  <th key={index}>
                    <DatePicker
                      selected={
                        searchTerms[index] ? dayjs(searchTerms[index], 'DD-MM-YYYY').toDate() : null
                      }
                      onChange={(date) => handleDateChange(index, date)}
                      dateFormat="dd-MM-yyyy"
                      placeholderText={`Search ${header.header}...`}
                      isClearable
                    />
                  </th>
                );
              } else {
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
          {formattedData.filter((row) => filterRow(row, searchTerms)).map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'striped' : ''}>
              {headers.map((header, idx) => (
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
    </>
  );
}

export default OrderDetials;
