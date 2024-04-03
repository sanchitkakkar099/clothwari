import React, { useEffect, useState } from 'react'
import { useDesignUploadByIdQuery, useStaffApprovalBySuperAdminMutation } from '../../service';
import { Link, useParams } from 'react-router-dom';

function ProductView() {
    const params = useParams()
    const resDesignById = useDesignUploadByIdQuery(params?.id, {
        skip: !params?.id,
      });
      console.log('resDesignById',resDesignById);
      const [productView,setProductView] = useState(null)
      useEffect(() => {
        if (resDesignById?.isSuccess && resDesignById?.data?.data) {
            setProductView(resDesignById?.data?.data)
        }
      }, [resDesignById]);
  const [variationImg,setVariationImg] = useState(null)

  const handleChangeVariation = (e,variation) => {
    e.preventDefault()
    if(variation?.label && (productView?.variations && Array.isArray(productView?.variations) && productView?.variations?.length > 0)){
      const variationObj = productView?.variations?.find(el => el?.color === variation?.label)
      if(variationObj?.variation_thumbnail[0]?.pdf_extract_img){
        setVariationImg(variationObj?.variation_thumbnail[0]?.pdf_extract_img)
      }
    }
    console.log('variation',variation);
  }

  const handleChangePrimary = (e) => {
    e.preventDefault()
    setVariationImg(null)
  }

    
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">View Design</h4>

              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">Design</a>
                  </li>
                  <li className="breadcrumb-item active">View Design</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
   
            <div className="panel panel-white post panel-shadow">
                
                <div className="post-image">
                {Array.isArray(productView?.thumbnail) && productView?.thumbnail[0]?.pdf_extract_img  ? 
                  <img src={variationImg ? variationImg : productView?.thumbnail[0]?.pdf_extract_img} className="image" alt="image post"/>
:
                    <img src="https://www.bootdey.com/image/400x200/FFB6C1/000000" className="image" alt="image post"/>
                }
                </div>
                <div className='product_details'>
                <div className="post-description">
                    <h4>{productView?.name}</h4>
                    <p>Category : {productView?.category?.label}</p>
                    <p>Tags : {productView?.tag && Array.isArray(productView?.tag) && productView?.tag?.length > 0 ? productView?.tag?.map(el => el?.label)?.join(',') : ''}</p>

                    
                </div>
                <div className="stats">
                {productView?.primary_color_code  &&
                        <Link to="" className="stat-item" 
                        style={{backgroundColor:productView?.primary_color_code,fontSize:'18px',
                        width: '17px',
                        height: '17px',
                        borderRadius: '50%',
                        border: '1px solid #c7c7c7'
                        }}
                        onClick={(e) => handleChangePrimary(e)}>
                          <span className="" />
                        </Link>
                }
                {productView?.color && Array.isArray(productView?.color) && productView?.color?.length > 0 && 
                  productView?.color?.map((cl, cinx) => {
                    return(
                      <Link to="" className="stat-item"
                      style={{backgroundColor:cl?.value,fontSize:'18px',
                        width: '17px',
                        height: '17px',
                        borderRadius: '50%',
                        border: '1px solid #c7c7c7'
                        }}
                       key={cinx} onClick={(e) => handleChangeVariation(e,cl)}>
                        <span className="" />
                        </Link>
                    )
                  })}
                    
                  
                        
                    </div>
                    </div>
               
            </div>
       
</div>
</div>
</div></div>

  )
}

export default ProductView
