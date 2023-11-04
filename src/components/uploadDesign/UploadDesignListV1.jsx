import React, { useEffect } from 'react'
import One from '../../assets/images/product/five.jpg'
import Two from '../../assets/images/product/seven.jpg'
import Three from '../../assets/images/product/four.jpg'
import Four from '../../assets/images/product/three.jpg'
import Five from '../../assets/images/product/one.jpg'
import Six from '../../assets/images/product/six.jpg'
import { useDesignUploadListMutation } from '../../service'
import { useDispatch, useSelector } from 'react-redux'
import { getDesignUpload } from '../../redux/designUploadSlice'



function UploadDesignListV1() {
  const dispatch = useDispatch()
  const [reqDesign,resDesign] = useDesignUploadListMutation()
  const designUploadList = useSelector((state) => state?.designUploadState.designUploadList)
  console.log('designUploadList',designUploadList);

  useEffect(() => {
    reqDesign({
      page: 1,
      limit: 6,
      search: "",
    });
  }, []);

  useEffect(() => {
    if (resDesign?.isSuccess) {
      dispatch(getDesignUpload(resDesign?.data?.data?.docs));
    }
  }, [resDesign]);


  const handleSearch = (search) => {
        reqDesign({
          page: 1,
          limit: 6,
          search: search,
        });
  }

  return (
    <div className="page-content">
    <div className="container-fluid">
        <div className="row">
            <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                    <h4 className="mb-0">Designs</h4>

                    <div className="page-title-right">
                        <ol className="breadcrumb m-0">
                            <li className="breadcrumb-item"><a href="javascript: void(0);">Clothwari</a></li>
                            <li className="breadcrumb-item active">Designs</li>
                        </ol>
                    </div>

                </div>
            </div>
        </div>

        <div className="row">
            <div className="col-xl-3 col-lg-4">
                <div className="card">
                    <div className="card-header bg-transparent border-bottom">
                        <h5 className="mb-0">Filters</h5>
                    </div>

                    {/* <div className="p-4">
                        <h5 className="font-size-14 mb-3">Categories</h5> */}
                        {/* <div className="custom-accordion">
                            <a className="text-body fw-semibold pb-2 d-block" data-bs-toggle="collapse" href="#categories-collapse" role="button" aria-expanded="false" aria-controls="categories-collapse">
                                <i className="mdi mdi-chevron-up accor-down-icon text-primary me-1"></i> Footwear
                            </a>
                            <div className="collapse show" id="categories-collapse">
                                <div className="card p-2 border shadow-none">
                                    <ul className="list-unstyled categories-list mb-0">
                                        <li><a href="#"><i className="mdi mdi-circle-medium me-1"></i> Formal Shoes</a></li>
                                        <li className="active"><a href="#"><i className="mdi mdi-circle-medium me-1"></i> Sports Shoes</a></li>
                                        <li><a href="#"><i className="mdi mdi-circle-medium me-1"></i> casual Shoes</a></li>
                                        <li><a href="#"><i className="mdi mdi-circle-medium me-1"></i> Sandals</a></li>
                                        <li><a href="#"><i className="mdi mdi-circle-medium me-1"></i> Slippers</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div> */}
                        
                    {/* </div> */}

                    {/* <div className="p-4 border-top">
                        <div>
                            <h5 className="font-size-14 mb-3">Price</h5>
                            <div id="priceslider" className="mb-4"></div>
                        </div>
                    </div> */}

                    <div className="custom-accordion">
                        {/* <div className="p-4 border-top">
                            <div>
                                <h5 className="font-size-14 mb-0"><a href="#filtersizes-collapse" className="text-dark d-block" data-bs-toggle="collapse">Sizes <i className="mdi mdi-chevron-up float-end accor-down-icon"></i></a></h5>

                                <div className="collapse show" id="filtersizes-collapse">
                                    <div className="mt-4">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h5 className="font-size-15 mb-0">Select Sizes</h5>
                                            </div>
                                            <div className="w-xs">
                                                <select className="form-select">
                                                    <option value="1">3</option>
                                                    <option value="2">4</option>
                                                    <option value="3">5</option>
                                                    <option value="4">6</option>
                                                    <option value="5" selected>7</option>
                                                    <option value="6">8</option>
                                                    <option value="7">9</option>
                                                    <option value="8">10</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div> */}

                        <div className="p-4 border-top">
                            <div>
                                <h5 className="font-size-14 mb-0"><a href="#filterprodductcolor-collapse" className="text-dark d-block" data-bs-toggle="collapse">Colors <i className="mdi mdi-chevron-up float-end accor-down-icon"></i></a></h5>

                                <div className="collapse show" id="filterprodductcolor-collapse">
                                    <div className="mt-4">
                                        <div className="form-check mt-2">
                                            <input type="checkbox" className="form-check-input" id="productcolorCheck1"/>
                                            <label className="form-check-label" for="productcolorCheck1"><i className="mdi mdi-circle text-dark mx-1"></i> Black</label>
                                        </div>
                                        {/* <div className="form-check mt-2">
                                            <input type="checkbox" className="form-check-input" id="productcolorCheck2"/>
                                            <label className="form-check-label" for="productcolorCheck2"><i className="mdi mdi-circle text-light mx-1"></i> White</label>
                                        </div> */}
                                        <div className="form-check mt-2">
                                            <input type="checkbox" className="form-check-input" id="productcolorCheck3"/>
                                            <label className="form-check-label" for="productcolorCheck3"><i className="mdi mdi-circle text-secondary mx-1"></i> Gray</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="checkbox" className="form-check-input" id="productcolorCheck4"/>
                                            <label className="form-check-label" for="productcolorCheck4"><i className="mdi mdi-circle text-primary mx-1"></i> Blue</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="checkbox" className="form-check-input" id="productcolorCheck5"/>
                                            <label className="form-check-label" for="productcolorCheck5"><i className="mdi mdi-circle text-success mx-1"></i> Green</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="checkbox" className="form-check-input" id="productcolorCheck6"/>
                                            <label className="form-check-label" for="productcolorCheck6"><i className="mdi mdi-circle text-danger mx-1"></i> Red</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="checkbox" className="form-check-input" id="productcolorCheck7"/>
                                            <label className="form-check-label" for="productcolorCheck7"><i className="mdi mdi-circle text-warning mx-1"></i> Yellow</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="checkbox" className="form-check-input" id="productcolorCheck8"/>
                                            <label className="form-check-label" for="productcolorCheck8"><i className="mdi mdi-circle text-purple mx-1"></i> Purple</label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* <div className="p-4 border-top">
                            <div>
                                <h5 className="font-size-14 mb-0"><a href="#filterproduct-color-collapse" className="text-dark d-block" data-bs-toggle="collapse">Customer Rating <i className="mdi mdi-chevron-up float-end accor-down-icon"></i></a></h5>

                                <div className="collapse show" id="filterproduct-color-collapse">
                                    <div className="mt-4">
                                        <div className="form-check mt-2">
                                            <input type="radio" id="productratingRadio1" name="productratingRadio1" className="form-check-input"/>
                                            <label className="form-check-label" for="productratingRadio1">4 <i className="mdi mdi-star text-warning"></i>  & Above</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="radio" id="productratingRadio2" name="productratingRadio1" className="form-check-input"/>
                                            <label className="form-check-label" for="productratingRadio2">3 <i className="mdi mdi-star text-warning"></i>  & Above</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="radio" id="productratingRadio3" name="productratingRadio1" className="form-check-input"/>
                                            <label className="form-check-label" for="productratingRadio3">2 <i className="mdi mdi-star text-warning"></i>  & Above</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="radio" id="productratingRadio4" name="productratingRadio1" className="form-check-input"/>
                                            <label className="form-check-label" for="productratingRadio4">1 <i className="mdi mdi-star text-warning"></i></label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="p-4 border-top">
                            <div>
                                <h5 className="font-size-14 mb-0"><a href="#filterproduct-discount-collapse" className="collapsed text-dark d-block" data-bs-toggle="collapse">Discount <i className="mdi mdi-chevron-up float-end accor-down-icon"></i></a></h5>

                                <div className="collapse" id="filterproduct-discount-collapse">
                                    <div className="mt-4">
                                        <div className="form-check mt-2">
                                            <input type="radio" id="productdiscountRadio1" name="productdiscountRadio" className="form-check-input"/>
                                            <label className="form-check-label" for="productdiscountRadio1">50% or more</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="radio" id="productdiscountRadio2" name="productdiscountRadio" className="form-check-input"/>
                                            <label className="form-check-label" for="productdiscountRadio2">40% or more</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="radio" id="productdiscountRadio3" name="productdiscountRadio" className="form-check-input"/>
                                            <label className="form-check-label" for="productdiscountRadio3">30% or more</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="radio" id="productdiscountRadio4" name="productdiscountRadio" className="form-check-input"/>
                                            <label className="form-check-label" for="productdiscountRadio4">20% or more</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="radio" id="productdiscountRadio5" name="productdiscountRadio" className="form-check-input"/>
                                            <label className="form-check-label" for="productdiscountRadio5">10% or more</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input type="radio" id="productdiscountRadio6" name="productdiscountRadio" className="form-check-input"/>
                                            <label className="form-check-label" for="productdiscountRadio6">Less than 10%</label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div> */}

                    </div>

                </div>
            </div>

            <div className="col-xl-9 col-lg-8">
                <div className="card">
                    <div className="card-body">
                        <div>
                            <div className="row">
                                <div className="col-md-6 mt-1">
                                    <div>
                                        <h5>Designs</h5>
                                        {/* <ol className="breadcrumb p-0 bg-transparent mb-2">
                                            <li className="breadcrumb-item"><a href="javascript: void(0);">Footwear</a></li>
                                            <li className="breadcrumb-item active">Shoes</li>
                                        </ol> */}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-inline float-md-end">
                                        <div className="search-box ms-2">
                                            <div className="position-relative">
                                                <input type="text" 
                                                onChange={(e) => handleSearch(e.target.value)}
                                                className="form-control bg-light border-light rounded" placeholder="Search..."/>
                                                <i className="bx bx-search search-icon"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <ul className="nav nav-tabs nav-tabs-custom mt-3 mb-2 ecommerce-sortby-list">
                                <li className="nav-item">
                                    <a className="nav-link disabled fw-medium" href="#" tabindex="-1" aria-disabled="true">Sort by:</a>
                                  </li>
                                <li className="nav-item">
                                    <a className="nav-link active" data-bs-toggle="tab" href="#popularity" role="tab">Popularity</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-bs-toggle="tab" href="#newest" role="tab">Newest</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-bs-toggle="tab" href="#discount" role="tab">Discount</a>
                                </li>
                            </ul> */}

                                <div className="tab-content p-3 text-muted">
                                    <div className="tab-pane active" id="popularity" role="tabpanel">
                                        <div className="row">
                                        {designUploadList && Array.isArray(designUploadList) && designUploadList?.length > 0 ?
                                            designUploadList?.map((el,i) => {
                                                return(
                                                    <div className="col-xl-4 col-sm-6" key={i}>
                                                <div className="product-box">
                                                    {/* <div className="product-ribbon">
                                                        - 20 %
                                                    </div> */}
                                                    <div className="product-img pt-4 px-4">
                                                        {/* <div className="product-wishlist">
                                                            <a href="#">
                                                                <i className="mdi mdi-heart-outline"></i>
                                                            </a>
                                                        </div> */}
                                                        <img src={el?.image[0]?.filepath} alt="" className="img-fluid mx-auto d-block"/>
                                                    </div>
                                                    
                                                    <div className="product-content p-4">
                                                        
                                                        <div className="d-flex justify-content-between align-items-end">
                                                            <div>
                                                                <h5 className="mb-1"><a href="#!" className="text-dark font-size-16">{el?.name}</a></h5>
                                                                {/* <p className="text-muted font-size-13">Gray, Shoes</p> */}
                                                                {/* <h5 className="mt-3 mb-0">$260</h5> */}
                                                            </div>
                                                            <div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                                )
                                            })
                                            :
                                            <h4 className='text-center mt-5'>No Design Found</h4>
                                        }
                                            
                                            
                                        </div>
                                    </div>

                                   
                                    
                                </div>

                            <div className="row mt-4">
                                <div className="col-sm-6">
                                    <div>
                                        <p className="mb-sm-0">Page 1 of 1</p>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="float-sm-end">
                                        <ul className="pagination pagination-rounded mb-sm-0">
                                            <li className="page-item disabled">
                                                <a href="#" className="page-link"><i className="mdi mdi-chevron-left"></i></a>
                                            </li>
                                            <li className="page-item active">
                                                <a href="#" className="page-link">1</a>
                                            </li>
                                            {/* <li className="page-item">
                                                <a href="#" className="page-link">2</a>
                                            </li>
                                            <li className="page-item">
                                                <a href="#" className="page-link">3</a>
                                            </li>
                                            <li className="page-item">
                                                <a href="#" className="page-link">4</a>
                                            </li>
                                            <li className="page-item">
                                                <a href="#" className="page-link">5</a>
                                            </li> */}
                                            <li className="page-item">
                                                <a href="#" className="page-link"><i className="mdi mdi-chevron-right"></i></a>
                                            </li>
                                        </ul>
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
  )
}

export default UploadDesignListV1
