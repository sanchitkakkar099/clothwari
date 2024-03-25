import React, { useEffect, useState } from "react";
import "./Pdf.css";
import { Button } from "reactstrap";
import { pdfGenerator } from "../../utils/pdfGenerator";
function PDFDesign() {

  return (
    <>                
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">PDF Design</h4>

                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="#!">Clothwari</a>
                    </li>
                    <li className="breadcrumb-item active">PDF Design</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                <Button style={{margin:'0 auto'}} onClick={() => pdfGenerator('my-pdf','sample-creator')}>Save PDF</Button>
                  <div id="my-pdf">
                    <div className="pdf-title">
                      <h1>PDF Title</h1>
                    </div>
                    <div className="pdf-images-container">
                      <div className="pdf-image-wrapper">
                        <img
                          src={'https://clothwaris3.s3.ap-south-1.amazonaws.com/pdf_img/file_1711203683655.png'}
                          alt="Image 1"
                        />
                        <div className="pdf-image-caption">
                          DLSU0000GE2467PW
                        </div>
                      </div>
                      <div className="pdf-image-wrapper">
                        <img
                          src="https://clothwaris3.s3.ap-south-1.amazonaws.com/pdf_img/file_1711203683655.png"
                          alt="Image 2"
                        />
                        <div className="pdf-image-caption">
                          DLSU0000GE2467PU
                        </div>
                      </div>
                    </div>
                    <div className="pdf-images-container">
                      <div className="pdf-image-wrapper">
                        <img
                          src="https://clothwaris3.s3.ap-south-1.amazonaws.com/pdf_img/file_1711203683655.png"
                          alt="Image 1"
                        />
                        <div className="pdf-image-caption">
                          DLSU0000GE2467PW
                        </div>
                      </div>
                      <div className="pdf-image-wrapper">
                        <img
                          src="https://clothwaris3.s3.ap-south-1.amazonaws.com/pdf_img/file_1711203683655.png"
                          alt="Image 2"
                        />
                        <div className="pdf-image-caption">
                          DLSU0000GE2467PU
                        </div>
                      </div>
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
