// Importing necessary dependencies and components
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useFormik, Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup'
import PetRegAPIList from '@/Components/api/PetRegAPIList'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'
import { useNavigate, useParams } from 'react-router-dom'
import moment from "moment";
import { contextVar } from '@/Components/context/contextVar';
import useSetTitle from '@/Components/Common/useSetTitle'
import ApiHeader2 from '@/Components/api/ApiHeader2'
import {resizeFile} from "@/Components/Common/ImageResizer/UseImgResizer";

// Styling object for consistent styles
const style = {
  required: 'text-red-700 font-semibold',
  label: 'text-sm',
  textFiled: 'block w-full h-9 border px-2 border-gray-300 rounded shadow text-gray-700',
  textArea: 'block w-full border px-2 border-gray-300 rounded shadow'
}

// Component for Pet Renewal Form
const PetRenewalFormIndex = (props) => {
  // Extracting parameters from the URL
  const { id } = useParams()

  // State variables
  const [masterData, setMasterData] = useState()
  const { notify } = useContext(contextVar);
  const [isChecked, setIsChecked] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [userDetails, setUserDetails] = useState()
  const [loader, setLoader] = useState(false);
  const [fitnessImage, setFitnessImage] = useState();
  const [taxCopyImage, setTaxCopyImage] = useState();
  const [licenseImage, setLicenseImage] = useState();
  const dialogRef = useRef()
  const navigate = useNavigate();
  const { header, api_PetApproveViewApplication, api_RigApplyRenewalForm, header1 } = PetRegAPIList();
  const [fileSizeError, setFileSizeError] = useState('');
  // ==== Formik Start
  // Form validation schema
  const validationSchema = yup.object({
    fitness: yup.string().required("Kindly enter a value."),
    taxCopy: yup.string().required("Kindly enter a value."),
    license: yup.string().required("Kindly enter a value."),
  })
  useSetTitle("Renewal form")
  // Initial form values
  const initialValues = {
    // ulb: "",
    // ulbId: "",
    // applicantName: "",
    // ownerCategory: "",
    // ward: "",
    // mobileNo: "",
    // email: "",
    // address: "",
    // vehicleComapny: "",
    fitness: "",
    taxCopy: "",
    license: "",
    // registrationNumber: "",

  }
  let payloadFormData = new FormData();
  // Formik configuration
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values, resetForm) => {
      // Callback function for form submission
      submitForm(values)
      // alert(values)
      console.log("Value.....", values)
    },
    validationSchema
  })

  // Change event handler for form inputs
  // const handleChange = (event) => {
  //   let name = event.target.name
  //   let value = event.target.value
  //   setErrorMessage(false)
  // };
  // ==== Formik End
  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setErrorMessage(false);

    {
      name == "driverName" &&
        formik.setFieldValue(
          "driverName",
          allowCharacterInput(value, formik.values.driverName, 20)
        );
    }

    {
      name == "fitness" && setFitnessImage(event.target.files[0]);
    }
    {
      name == "taxCopy" && setTaxCopyImage(event.target.files[0]);
    }
    {
      name == "license" && setLicenseImage(event.target.files[0]);
    }
  };
  // Function to submit the form data
  const submitForm = (data) => {
    setFormSubmitting(true)
    // Payload for API request
    console.log("datadatadata", data)
    const payload = {

      // ... (your payload properties)
      // address: data?.address,
      // applyThrough: data?.applyThrough,
      // ownerCategory: data?.categoryApplication,
      // mobileNo: data?.mobileNo,
      // ulbId: data?.ulb,
      // ward: data?.ward,
      registrationId: id,
      // applicantName: data?.applicantName,
      // mobileNo: data?.mobileNo,
      // email: data?.email,
      // registrationNumber: data?.vehicle_no
    };
    console.log(payload, "payload====>>");

    for (let key in payload) {
      payloadFormData.append(key, payload[key]);
    }

    payloadFormData.append("documents[0][image]", formik?.values?.fitness);
    payloadFormData.append("documents[0][docCode]", "FITNESS");
    payloadFormData.append("documents[0][ownerDtlId]", "");

    payloadFormData.append("documents[1][image]", formik?.values?.taxCopy);
    payloadFormData.append("documents[1][docCode]", "TAX");
    payloadFormData.append("documents[1][ownerDtlId]", "");

    payloadFormData.append("documents[2][image]", formik?.values?.license);
    payloadFormData.append("documents[2][docCode]", "LICENSE");
    payloadFormData.append("documents[2][ownerDtlId]", "");

    // Making API request for form submission
    AxiosInterceptors.post(api_RigApplyRenewalForm, payloadFormData, ApiHeader2())
      .then((res) => {
        setFormSubmitting(false)
        if (res.data.status) {
          setUserDetails(res.data.data)
          openDialogTag()
          console.log("Form applied successfully");
          notify(res?.data?.message, "success");
        } else {
          notify(res?.data?.message, "error");
          setErrorMessage(res?.data?.message)
          console.log("Failed to apply pet registration")
        }
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.error)
        notify("Something Went wrong", "error");
        setFormSubmitting(false)
        console.log("Error while applying for pet registration..", err?.response?.data?.error)
      })
  }


  const handleFileChange =async (e) => {
   
    const file = e.target.files[0];
    if (file) {
      const compressImg = await resizeFile(file);
      const CFile = new File([compressImg], e?.target?.files[0]?.name, {
        type: e?.target?.files[0]?.type
      });
      // setPreviewImage2(URL.createObjectURL(CFile));
      formik.setFieldValue('fitness', CFile);
    } else {
      formik.setFieldValue('fitness', null);
    }
  };

  const handleFileChange2 =async (e) => {
   
    const file = e.target.files[0];
    if (file) {
      const compressImg = await resizeFile(file);
      const CFile = new File([compressImg], e?.target?.files[0]?.name, {
        type: e?.target?.files[0]?.type
      });
      // setPreviewImage2(URL.createObjectURL(CFile));
      formik.setFieldValue('taxCopy', CFile);
    } else {
      formik.setFieldValue('taxCopy', null);
    }
  };

  const handleFileChange3 =async (e) => {
   
    const file = e.target.files[0];
    if (file) {
      const compressImg = await resizeFile(file);
      const CFile = new File([compressImg], e?.target?.files[0]?.name, {
        type: e?.target?.files[0]?.type
      });
      // setPreviewImage2(URL.createObjectURL(CFile));
      formik.setFieldValue('license', CFile);
    } else {
      formik.setFieldValue('license', null);
    }
  };




  // Function to open a dialog
  const openDialogTag = () => {
    dialogRef.current.showModal()
  }

  // Effect hook to fetch data on component mount
  useEffect(() => {
    AxiosInterceptors.post(api_PetApproveViewApplication, { "registrationId": id }, header1)
      .then((res) => {
        if (res.data.status) {
          setMasterData(res.data.data)
          console.log("pet Renewal data", res.data)
          console.log("pet Renewal data====>", res.data.data.address)
        } else {
          console.log("Error fetching pet master list")
        }
      })
      .catch((err) => {
        console.log("Error while getting pet master list")
      })
  }, [])

  return (
    // JSX for the component
    <>
      <form onSubmit={formik.handleSubmit} onChange={handleChange}>
        <div className='overflow-y-auto'>
          <h1 className='px-4 font-semibold text-lg text-center'> Application no -<span className='text-blue-600'> {masterData?.application_no}</span></h1>
          <div className='col-span-12 ml-2 my-2'>
            <div className='text-lg text-left text-gray-600 font-semibold'># Property Details </div>
            {/* <p className='border-b border-gray-500'></p> */}
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3  bg-white shadow-md rounded-md py-2'>
            <div className='m-3'>
              <label className={style?.label} htmlFor="ulb">ULB </label>
              <input value={masterData?.ulb_name} disabled type="text" name='ulb' className={style?.textFiled} />
              <p className='text-red-500 text-xs'>{formik.touched.ulb && formik.errors.ulb ? formik.errors.ulb : null}</p>
            </div>

            <div className='m-3'>
              <label className={style?.label} htmlFor="categoryApplication">Category of Application</label>
              <input disabled value={masterData?.application_type == "New_Apply" ? "Renewal" : ""} type="text" name='holdingNo' className={style?.textFiled} />
              <p className='text-red-500 text-xs'>{formik.touched.categoryApplication && formik.errors.categoryApplication ? formik.errors.categoryApplication : null}</p>
            </div>
            <div className='m-3'>
              <label className={style?.label} htmlFor="ward">Ward Number</label>
              <input type="text" disabled value={masterData?.ward_name} name='ward' className={style?.textFiled} />
              <p className='text-red-500 text-xs'>{formik.touched.ward && formik.errors.ward ? formik.errors.ward : null}</p>
            </div>
          </div>
          <div className='col-span-12 ml-2 my-2'>
            <div className='text-lg text-left text-gray-600 font-semibold'># Applicant Details</div>
          </div>
          <div className='bg-white shadow-md rounded-md py-2'>
            <div className='grid grid-cols-1 md:grid-cols-3 '>
              <div className='m-3'>
                <label className={style?.label} htmlFor="applicantName">Name of Applicant</label>
                <input disabled value={masterData?.applicant_name} className={style?.textFiled} />
                <p className='text-red-500 text-xs'>{formik.touched.applicantName && formik.errors.applicantName ? formik.errors.applicantName : null}</p>
              </div>
              <div className='m-3'>
                <label className={style?.label} htmlFor="mobileNo">Mobile No</label>
                <input disabled value={masterData?.mobile_no} type="number" name='mobileNo' className={style?.textFiled} />
                <p className='text-red-500 text-xs'>{formik.touched.mobileNo && formik.errors.mobileNo ? formik.errors.mobileNo : null}</p>
              </div>
              <div className='m-3'>
                <label className={style?.label} htmlFor="email">Email</label>
                <input disabled value={masterData?.email} type="email" name='email' className={style?.textFiled} />
                <p className='text-red-500 text-xs'>{formik.touched.email && formik.errors.email ? formik.errors.email : null}</p>
              </div>

            </div>
            <div className='m-3'>
              <label className={style?.label} htmlFor="address">Address</label>
              <textarea disabled value={masterData?.address} name='address' maxLength="500" rows="3" className={style?.textArea} ></textarea>
              <p className='text-red-500 text-xs'>{formik.touched.address && formik.errors.address ? formik.errors.address : null}</p>
            </div>
          </div>
          <div className='col-span-12 ml-2 my-2'>
            <div className='text-lg text-left text-gray-600 font-semibold'>
              # Vehicle Details
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 bg-white shadow-md rounded-md py-2'>
            <div className='m-3'>
              <label className={style?.label} htmlFor='registrationNumber'>
                Registration No.<span className={style?.required}>*</span>
              </label>
              <input
                disabled
                value={masterData?.vehicle_no}
                // {...formik.getFieldProps("registrationNumber")}
                maxLength='10'
                type='text'
                name='registrationNumber'
                className={style?.textFiled}
                onChange={(e) => {
                  // Convert the input value to uppercase
                  const upperCaseValue = e.target.value.toUpperCase();
                  // Call formik's handleChange method with the transformed value
                  formik.setFieldValue("registrationNumber", upperCaseValue);
                }}
              />
              <p className='text-red-500 text-xs'>
                {formik.touched.registrationNumber &&
                  formik.errors.registrationNumber
                  ? formik.errors.registrationNumber
                  : null}
              </p>
            </div>
            <div className='m-3'>
              <label className={style?.label} htmlFor='vehicleComapny'>
                VIN Number<span className={style?.required}>*</span>
              </label>
              <input
                disabled
                // {...formik.getFieldProps("vehicleComapny")}
                value={masterData?.vehicle_name}
                maxLength='17'

                type='text'
                name='vehicleComapny'
                className={style?.textFiled}
                onChange={(e) => {
                  // Convert the input value to uppercase
                  const upperCaseValue = e.target.value.toUpperCase();
                  // Call formik's handleChange method with the transformed value
                  formik.setFieldValue("vehicleComapny", upperCaseValue);
                }}
              />
              <p className='text-red-500 text-xs'>
                {formik.touched.vehicleComapny && formik.errors.vehicleComapny
                  ? formik.errors.vehicleComapny
                  : null}
              </p>
            </div>

            <div className='m-3'>
              <label className={style?.label} htmlFor='fitness'>
                Pollution Certificate<span className={style?.required}>*</span>
              </label>
              <input
                onChange={handleFileChange}
                // {...formik.getFieldProps("fitness")}
                maxLength='50'
                type='file'
                name='fitness'
                className={style?.textFiled}
              />
              <p className='text-red-500 text-xs'>
              {fileSizeError}
              </p>
            </div>
            <div className='m-3'>
              <label className={style?.label} htmlFor='taxCopy'>
                Tax Copy<span className={style?.required}>*</span>
              </label>
              <input
                onChange={handleFileChange2}
                // {...formik.getFieldProps("taxCopy")}

                maxLength='50'
                type='file'
                name='taxCopy'
                className={style?.textFiled}
              />
              <p className='text-red-500 text-xs'>
                {fileSizeError}
              </p>
            </div>
            <div className='m-3'>
              <label className={style?.label} htmlFor='license'>
                Registration Of Certificate<span className={style?.required}>*</span>
              </label>
              <input
                onChange={handleFileChange3}
                // {...formik.getFieldProps("license")}
                maxLength='50'
                type='file'
                name='license'
                className={style?.textFiled}
              />
              <p className='text-red-500 text-xs'>
              {fileSizeError}
              </p>
            </div>
          </div>
        </div>
        <p className='flex mt-3 gap-x-3'>
          <input type="checkbox" checked={isChecked} name="" id="" onChange={(e) => setIsChecked(e.target.checked)} />
          <p className='cursor-pointer select-none' onClick={() => setIsChecked(!isChecked)}>
            I have entered the correct information and agree to the terms and conditions.
          </p>
        </p>
        <p className='text-red-500 font-semibold text-center mt-3'>{errorMessage && errorMessage}</p>
        <div className='flex justify-center my-5'>
          {formSubmitting ? <p>Form Submitting..</p> :
            <button type='submit' disabled={!isChecked} className='disabled:opacity-40 bg-indigo-600 hover:bg-indigo-700 px-8 py-2 text-white rounded shadow'>Submit Application</button>
          }
        </div>
      </form>
      <dialog ref={dialogRef} className="">
        <div className='space-y-2 mb-5'>
          <p className='text-center bg-yellow-300 p-2 font-semibold '> Your Application has submitted successfully</p>
          <p className='text-center'>Application No.  <span className='font-semibold text-lg'>{userDetails?.applicationNo || "N/A"}</span></p>
          <div className='flex justify-center gap-x-5'>
            <button onClick={() => navigate(`/search-pet-registration`)} className='border border-indigo-600 px-2 py-1 rounded shadow hover:bg-indigo-500 hover:text-white'>Dashboard</button>
            <button onClick={() => navigate(`/pet-payment-offline/${userDetails?.id}`)} className='bg-indigo-500 px-2 py-1 rounded shadow text-white hover:bg-indigo-700'>Make Payment</button>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default PetRenewalFormIndex


