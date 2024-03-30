import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearBagItems, removeBagItems } from "../../redux/clientSlice";
import { useAddToBagByClientMutation } from "../../service";
import toast from "react-hot-toast";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FormFeedback, Input } from "reactstrap";

function ClientCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    customerName: { value: '', type: 'text', isValid: true },
    customerCode: { value: '', type: 'text', isValid: true },
    marketingPerson: { value: '', type: 'text', isValid: true },
    salesOrderNumber: { value: '', type: 'text', isValid: true },
    designNo: { value: '', type: 'readonly', isValid: true }, // This field will be readonly
    quantityPerCombo: { value: '', type: 'number', isValid: true },
    yardage: { value: '', type: 'number', isValid: true },
    baseFabrics: { value: '', type: 'text', isValid: true },
    strikeRequired: { value: '', type: 'radio', options: ['Yes', 'No'], isValid: true }, // Radio options for strikeRequired
    sampleDeliveryDate: { value: '', type: 'date', isValid: true },
    pricePerMeter: { value: '', type: 'number', isValid: true },
    bulkOrderDeliveryDate: { value: '', type: 'date', isValid: true },
    shipmentSampleDate: { value: '', type: 'date', isValid: true }
  });

  const handleChange = (event, id) => {
    const { value } = event.target;
    setFields({
      ...fields,
      [id]: { ...fields[id], value }
    });
  };

  const submitCart = (event) => {
    event.preventDefault();

    // Validate all fields before submission
    let isFormValid = true;
    const updatedFields = {};
    for (const id in fields) {
      const isValid = validateField(id, fields[id].value.trim());
      updatedFields[id] = { ...fields[id], isValid };
      if (!isValid) {
        isFormValid = false;
      }
    }

    setFields(updatedFields);

    if (isFormValid) {
      // Submit the form
      console.log('Form submitted:', fields);
    } else {
      alert('Please fill in all required fields correctly.');
    }
  };

  const validateField = (id, value) => {
    let isValid = true;

    // Validation rules
    if (id === 'customerName' && value === '') {
      isValid = false;
    } else if (id === 'customerCode' && value === '') {
      isValid = false;
    } else if (id === 'marketingPerson' && value === '') {
      isValid = false;
    } else if (id === 'salesOrderNumber' && value === '') {
      isValid = false;
    } else if (id === 'quantityPerCombo' && value === '') {
      isValid = false;
    } else if (id === 'yardage' && (value === '' || parseInt(value) < 1 || parseInt(value) > 100)) {
      isValid = false;
    } else if (id === 'baseFabrics' && value === '') {
      isValid = false;
    } else if (id === 'strikeRequired' && value === '') {
      isValid = false;
    } else if (id === 'sampleDeliveryDate' && value === '') {
      isValid = false;
    } else if (id === 'pricePerMeter' && value === '') {
      isValid = false;
    } else if (id === 'bulkOrderDeliveryDate' && value === '') {
      isValid = false;
    } else if (id === 'shipmentSampleDate' && value === '') {
      isValid = false;
    }

    return isValid;
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">BAG</h4>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
          <form onSubmit={handleSubmit(submitCart)}>
        {Object.entries(fields).map(([id, field]) => (
          <div key={id} className="form-group">
            <label htmlFor={id}>{id.replace(/([A-Z])/g, ' $1').toLowerCase()}</label>
            <input
              type="text"
              className={`form-control ${!field.isValid ? 'is-invalid' : ''}`}
              id={id}
              value={field.value}
              onChange={(e) => handleChange(e, id)}
              placeholder={`Enter ${id.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            />
            {!field.isValid && id === 'yardage' && (parseInt(field.value) < 1 || parseInt(field.value) > 100) && (
              <div className="invalid-feedback">Yardage must be between 1 and 100.</div>
            )}
            {!field.isValid && id !== 'yardage' && <div className="invalid-feedback">This field is required.</div>}
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="designNo">Design No. Selected</label>
          {/* Render your design images here */}
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientCart;
