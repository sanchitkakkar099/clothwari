import React from 'react'
import { Button, Card, CardBody, CardFooter, CardHeader, Table } from 'reactstrap'
import { useAdminByIdQuery } from '../../service';
import { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AdminView() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state: locationState } = location;
  const [viewData,setViewData] = useState(null)
  const resAdminById = useAdminByIdQuery(locationState?.adminID, {
    skip: !locationState?.adminID,
  });
  useEffect(() => {
    if (resAdminById?.isSuccess && resAdminById?.data?.data) {
      setViewData(resAdminById?.data?.data);
    }
  }, [resAdminById]);
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
    <Card>
    <CardHeader className='d-flex justify-content-between'>
      <h5 style={{marginTop:'8px'}}>Admin Details</h5>
      <Button className='btn btn-primary' onClick={() => navigate('/admin-list')}>Back</Button>
    </CardHeader>
    <CardBody >
      <Table bordered>
        <tbody>
          <tr>
            <th style={{ width: "20%" }}>Name</th>
            <td style={{ width: "80%" }}>{viewData?.name}</td>
          </tr>
          <tr>
            <th style={{ width: "20%" }}>Email</th>
            <td style={{ width: "80%" }}>{viewData?.email}</td>
          </tr>
        </tbody>
      </Table>
    </CardBody>
  <CardFooter>
  </CardFooter>
  </Card>
  </div>
  </div>
  </div>
  </div>
  )
}

export default AdminView
