import React, { useEffect, useState } from "react";
import "./Pdf.css";
import { Button } from "reactstrap";
import { pdfGenerator } from "../../utils/pdfGenerator";
import { useDispatch, useSelector } from "react-redux";
import { useCreateDriveMutation } from "../../service";
import toast from "react-hot-toast";
import { clearPDFItems } from "../../redux/clientSlice";
import { useNavigate } from "react-router-dom";
function PDFDesign() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const selectedPDFItems = useSelector((state) => state?.clientState.selectedPDFItems)
  console.log('selectedPDFItems',selectedPDFItems);
  const [reqDrive, resDrive] = useCreateDriveMutation();

  const onCreateDrive = (e) => {
    e.preventDefault()
    if(selectedPDFItems && Array.isArray(selectedPDFItems) && selectedPDFItems?.length > 0){
      // console.log('ddddd',{
      //   data:selectedPDFItems?.map(el => ({
      //     id:el?.id,
      //     designNo:el?.designNo,
      //     imgUrl: el?.image && Array.isArray(el?.image) && el?.image?.length > 0 && el?.image?.some(im => im?.tif_extract_img) ? el?.image[0]?.tif_extract_img : null,
      //     variation:el?.variation
      //   }))
      // });
      // reqDrive({
      //   data:selectedPDFItems?.map(el => ({
      //     id:el?.id,
      //     designNo:el?.designNo,
      //     imgUrl: el?.image && Array.isArray(el?.image) && el?.image?.length > 0 && el?.image?.some(im => im?.tif_extract_img) ? el?.image[0]?.tif_extract_img : null,
      //     variation:el?.variation
      //   }))
      // });
      pdfGenerator("my-pdf","MyPDf.pdf")
    }
  }

  useEffect(() => {
    if(resDrive?.isSuccess){
      toast.success("Drive Created SuccessFully",{
        position:'top-center'
      })
      dispatch(clearPDFItems([]))
      navigate("/drive-list")
    }
    if(resDrive?.isError){
      toast.error("Something went wrong",{
        position:'top-center'
      })
    }
  },[resDrive?.isSuccess,resDrive?.isError])

 



  return (
    <>                
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">PDF Design Generator</h4>

                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="#!">Clothwari</a>
                    </li>
                    <li className="breadcrumb-item active">PDF Design Generator</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                <div className="pdf_create_button d-flex">
                <Button style={{margin:'0 auto'}} onClick={(e) => onCreateDrive(e)}>Create PDF</Button>
                </div>
                  <div id="my-pdf">
                    <div className="pdf-title">
                      <h1>Textile Design PDF</h1>
                    </div>
                    <div className="pdf-images-container">
                    {(selectedPDFItems && Array.isArray(selectedPDFItems) && selectedPDFItems?.length > 0) &&
                      selectedPDFItems?.map((item,inx) => {
                        return (
                        <div className="pdf-image-wrapper" key={inx}>
                        {item?.image && Array.isArray(item?.image) && item?.image?.length > 0 && item?.image?.some(im => im?.tif_extract_img) &&
                        <img
                          src={item?.image[0]?.tif_extract_img}
                          alt="Image 1"
                        />
                        }
                        <div className="pdf-image-caption">
                        {item?.designNo}
                        </div>
                      </div>
                      )})
                     
                    }
                    </div>
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

export default PDFDesign;
