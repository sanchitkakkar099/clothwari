import React, { useEffect, useState } from "react";
import "./Pdf.css";
import { Button } from "reactstrap";
import { pdfGenerator } from "../../utils/pdfGenerator";
import { useDispatch, useSelector } from "react-redux";
import { useCreateDriveMutation } from "../../service";
import toast from "react-hot-toast";
import { clearPDFItems, removePDFItems } from "../../redux/clientSlice";
import { Navigate, useNavigate } from "react-router-dom";
import PdfGeneratorLoader from "./PdfGeneratorLoader";
import useLoader from "../../hook/useLoader";
import { X } from "react-feather";
function PDFDesign() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const selectedPDFItems = useSelector((state) => state?.clientState.selectedPDFItems)
  console.log('selectedPDFItems',selectedPDFItems);
  const [reqDrive, resDrive] = useCreateDriveMutation();
  const { isLoading, showLoader, hideLoader } = useLoader();
  const [pdfName,setPDFName] = useState('')
  const [isSubmit,setIsSubmit] = useState(false)


  const onCreateDrive = (e) => {
    e.preventDefault()
    setIsSubmit(true)
    if(selectedPDFItems && Array.isArray(selectedPDFItems) && selectedPDFItems?.length > 0){
      if(pdfName){
      // console.log('ddddd',{
      //   data:selectedPDFItems?.map(el => ({
      //     id:el?.id,
      //     designNo:el?.designNo,
      //     imgUrl: el?.image && Array.isArray(el?.image) && el?.image?.length > 0 && el?.image?.some(im => im?.tif_extract_img) ? el?.image[0]?.tif_extract_img : null,
      //     variation:el?.variation,
      //     pdfName:pdfName
      //   }))
      // });
      reqDrive({
        data:selectedPDFItems?.map(el => ({
          id:el?.id,
          designNo:el?.designNo,
          imgUrl: el?.thumbnail && Array.isArray(el?.thumbnail) && el?.thumbnail?.length > 0 && el?.thumbnail?.some(im => im?.pdf_extract_img) ? el?.thumbnail[0]?.pdf_extract_img : null,
          variation:el?.variation
        }))
      });
      showLoader()
      // pdfGenerator("my-pdf","MyPDf.pdf")
    }
    }
  }

  useEffect(() => {
    if(resDrive?.isSuccess){
      toast.success("Drive Created SuccessFully",{
        position:'top-center'
      })
      dispatch(clearPDFItems([]))
      hideLoader()
      navigate("/drive-list")
    }
    if(resDrive?.isError){
      toast.error("Something went wrong",{
        position:'top-center'
      })
      hideLoader()
    }
  },[resDrive?.isSuccess,resDrive?.isError])
 

  const handleRemove = (e,ele) => {
    const filterItem = selectedPDFItems?.filter(el => el?.id !== ele?.id)
    dispatch(removePDFItems(filterItem))
  }

  return (
    <>    
    {(selectedPDFItems && Array.isArray(selectedPDFItems) && selectedPDFItems?.length > 0) ?            
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
                    <div className="pdf_name_section">
                    <input type="text" className="form-control" placeholder="Enter PDF Name" onChange={(e) => setPDFName(e.target.value)}/>
                    {(!pdfName && isSubmit) && <span className="error-message" >PDF Name is required</span>}
                    </div>
                    <div className="pdf-images-container"> 
                    {(selectedPDFItems && Array.isArray(selectedPDFItems) && selectedPDFItems?.length > 0) &&
                      selectedPDFItems?.map((item,inx) => {
                        return (
                        <div className="pdf-image-wrapper" key={inx}>
                        {item?.thumbnail && Array.isArray(item?.thumbnail) && item?.thumbnail?.length > 0 && item?.thumbnail?.some(im => im?.pdf_extract_img) &&
                        <img
                          src={item?.thumbnail[0]?.pdf_extract_img}
                          alt="Image 1"
                        />
                        }
                        <div className="pdf-remove-icon">
                            <X size={20} onClick={(e) => handleRemove(e,item)} />
                        </div>
                        <div className="pdf-image-caption">
                        {item?.designNo}
                        </div>
                      </div>
                      )})
                    }
                    
                    </div>
                  </div>
                  {isLoading && <PdfGeneratorLoader/>}
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

export default PDFDesign;
