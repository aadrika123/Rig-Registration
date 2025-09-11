import React, { useContext, useEffect, useState } from "react";
import { useFormik, Formik, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import PetRegAPIList from "@/Components/api/PetRegAPIList";
import AxiosInterceptors from "@/Components/Common/AxiosInterceptors";
import BarLoader from "@/Components/Common/Loaders/BarLoader";
import { allowCharacterInput } from "@/Components/Common/PowerupFunctions";
// import { toast } from "react-toastify";
import ApiHeader from "@/Components/api/ApiHeader";
import { toast } from "react-hot-toast";
import ApiHeader2 from "@/Components/api/ApiHeader2";
import useSetTitle from "@/Components/Common/useSetTitle";
import { useNavigate } from "react-router-dom";
// import SuccessfulSubmitModal from "./SuccessfulSubmitModal";
// import WaterApiList from "../../../Components/ApiList/WaterApiList";
// import AxiosInterceptors from "../../../Components/GlobalData/AxiosInterceptors";
// import PetRegAPIList from "../../../Components/ApiList/PetRegAPIList";
// import { contextVar } from "../../../Components/ContextVar";
// import BrandLoader from "src/Components/Common/BrandLoader";
// import { allowCharacterInput } from "src/Components/Common/PowerUps/PowerupFunctions";

const style = {
    required: "text-red-700 font-semibold",
    label: "text-sm",
    textFiled:
        "block w-full h-9 border px-2 border-gray-300 rounded shadow text-gray-700",
    textArea: "block w-full border px-2 border-gray-300 rounded shadow",
};
// Component for Pet Edit Form
const EditPetDetailsForm = (props) => {
    const [ulbList, setUlbList] = useState();
    const [wardList, setWardList] = useState();
    const [masterData, setMasterData] = useState();
    const [isChecked, setIsChecked] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    // const { notify } = useContext(contextVar);
    const [listOfHoldingSaf, setListOfHoldingSaf] = useState();
    const [userDetails, setUserDetails] = useState();
    const [loader, setLoader] = useState(false);
    const [fitnessImage, setFitnessImage] = useState();
    const [taxCopyImage, setTaxCopyImage] = useState();
    const [licenseImage, setLicenseImage] = useState();
    const [responseScreen, setresponseScreen] = useState();



    console.log("editPetData", props?.editPetData)
    console.log("applicationFullData", props?.applicationFullData)

    const applicationFullData = props?.applicationFullData;
    const getdocDetails = props?.docDetails;
    console.log("applicationFullData", applicationFullData)

    // const { api_ulbList, header, api_wardList } = WaterApiList();
    useSetTitle("Search Application")
    const {
        api_RigRegistrationApplyForm,
        api_PetRegistrationMaster,
        api_ListOfSafHolding,
        api_peteditdetails,
        api_getUserDetailsByHoldingSaf,
        header1, api_ulbList, header, api_wardList
    } = PetRegAPIList();
    const navigate = useNavigate();
    // ==== Formik Start
    const validationSchema = yup.object({
        // ulb: yup.string().required("Kindly enter a value."),
        address: yup.string().required("Kindly enter a value."),

        applicantName: yup
            .string()
            .matches(/^[a-zA-Z0-9\s,.:-]+$/, "Only text is allowed")
            .required("Kindly enter a value."),
        // ownerCategory: yup.string().required("Kindly enter a value."),
        // ward: yup.string().required("Kindly enter a value."),
        email: yup.string().email().required("Kindly enter a value."),
        vehicleComapny: yup.string().required("Kindly enter a value."),
        // fitness: yup.string().required("Kindly enter a value."),
        // taxCopy: yup.string().required("Kindly enter a value."),
        // license: yup.string().required("Kindly enter a value."),
        registrationNumber: yup.string().required("Kindly enter a value."),
    });

    const initialValues = {
        // ulbId: applicationFullData?.ulb_id,
        // ulb: "",
        applicantName: applicationFullData?.applicant_name,
        ownerCategory: 1,
        ward: applicationFullData?.ward_id,
        mobileNo: applicationFullData?.mobile_no,
        email: applicationFullData?.email,
        address: applicationFullData?.address,
        vehicleComapny: applicationFullData?.vehicle_name,
        registrationNumber: applicationFullData?.vehicle_no,
        id: applicationFullData?.application_id,
        fitness: "",
        taxCopy: "",
        license: "",
        registrationNumber: "",

    };
    // console.log("docDetailsdocDetailsdocDetails", props?.docDetails[0]?.doc_code)

    let payloadFormData = new FormData();

    const formik = useFormik({
        initialValues: initialValues,

        enableReinitialize: true,
        onSubmit: (values, resetForm) => {
            console.log("clicked");
            console.log(values, "formSubmitValues==>");
            submitForm(values);

        },
        validationSchema,
    });
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
    // ==== Formik End

    const submitForm = (data) => {
        console.log(data, "payload====>>");
        setLoader(true);
        const payload = {
            // ulbId: data?.ulbId,
            applicantName: data?.applicantName,
            ownerCategory: 1,
            // ward: data?.ward,
            mobileNo: data?.mobileNo,
            email: data?.email,
            address: data?.address,
            vehicleComapny: data?.vehicleComapny,
            registrationNumber: data?.registrationNumber,
            id: data?.id,

        };

        console.log(payload, "payload====>>");

        for (let key in payload) {
            payloadFormData.append(key, payload[key]);
        }

        // payloadFormData.append("documents[0][image]", fitnessImage);
        // payloadFormData.append("documents[0][docCode]", "FITNESS");
        // payloadFormData.append("documents[0][ownerDtlId]", "");

        // payloadFormData.append("documents[1][image]", taxCopyImage);
        // payloadFormData.append("documents[1][docCode]", "TAX");
        // payloadFormData.append("documents[1][ownerDtlId]", "");

        // payloadFormData.append("documents[2][image]", licenseImage);
        // payloadFormData.append("documents[2][docCode]", "LICENSE");
        // payloadFormData.append("documents[2][ownerDtlId]", "");

        AxiosInterceptors.post(api_peteditdetails, payloadFormData, ApiHeader2())
            .then((res) => {
                setLoader(false);
                // setresponseScreen(response?.data);
                if (res.data.status) {
                    toast.success(res?.data?.message, "success");
                    // window.location.reload(); 
                    // setresponseScreen(response?.data);
                    // navigate('/successfull-submit', (response?.data));
                    navigate('/successfull-edit', {
                        state: res?.data
                    });
                } else {
                    toast.error(res?.data?.message, "error");
                    // toast.error("Something went wrong", "error");
                    setErrorMessage(res?.data?.message);
                    console.log("Failed to apply pet registration");
                }
            })
            .catch((err) => {
                setErrorMessage(err?.response?.data?.error);
                // toast.error("Something Went wrong", "error");
                setLoader(false);
                console.log(
                    "Error while applying for pet registration..",
                    err?.response?.data?.error
                );
            });
    };

    //Pet Registration Master Data
    useEffect(() => {
        AxiosInterceptors.post(api_PetRegistrationMaster, {}, header1)
            .then((res) => {
                if (res.data.status) {
                    setMasterData(res.data.data);
                    console.log("vehicle master data", res.data);
                } else {
                    console.log("Error fetching vehicle master list");
                }
            })
            .catch((err) => {
                console.log("Error while getting vehicle master list");
            });
    }, []);

    //Get all ulb list
    useEffect(() => {
        AxiosInterceptors.get(api_ulbList, header)
            .then((res) => {
                if (res.data.status) {
                    setUlbList(res.data.data);
                    console.log("ULB List", res.data);
                } else {
                    console.log("Error fetching ulb list");
                }
            })
            .catch((err) => {
                console.log("Error while getting ulb list");
            });
    }, []);

    //Get Ward list by ulb selection
    useEffect(() => {
        setLoader(true);
        AxiosInterceptors.post(api_wardList, { ulbId: formik.values.ulb }, header)
            .then((res) => {
                setLoader(false);
                if (res.data.status) {
                    setWardList(res.data.data);
                    console.log("Ward List", res.data);
                } else {
                    console.log("Error fetching Ward list");
                }
            })
            .catch((err) => {
                setLoader(false);
                console.log("Error while getting Ward list");
            });
    }, [formik.values.ulb]);


    // if (responseScreen?.status == true) {
    //   return (
    //     <>
    // <SuccessfulSubmitModal responseScreenData={responseScreen} />
    //     </>
    //   );
    // }

    return (
        <>
            {loader && <BarLoader />}

            <form
                onSubmit={formik.handleSubmit}
                onChange={handleChange}
                className='mb-20 px-20  py-8 rounded-md'
            >
                <div className="text-center font-semibold text-2xl ">
                    <h1 className="bg-indigo-600 px-auto text-white ">
                        Rig (HYDT) Registration Application
                    </h1>
                </div>
                <div className='overflow-y-auto '>
                    {/* <div className='col-span-12 ml-2 my-2'>
                        <div className='text-lg text-left text-gray-600 font-semibold'>
                            # Property Details
                        </div>
                    </div> */}
                    <div className='grid grid-cols-1 md:grid-cols-3 bg-white shadow-md rounded-md py-2'>
                        {/* <div className='m-2'>
                            <label className={style?.label} htmlFor='ulb'>
                                Select ULB <span className={style?.required}>*</span>
                            </label>
                            <select
                                {...formik.getFieldProps("ulb")}
                                name='ulb'
                                className={style?.textFiled}
                            >
                                <option value=''>Select</option>
                                {ulbList?.map((item, index) => (
                                    <option key={index} value={item.id}>
                                        {item.ulb_name}
                                    </option>
                                ))}
                            </select>
                            <p className='text-red-500 text-xs'>
                                {formik.touched.ulb && formik.errors.ulb
                                    ? formik.errors.ulb
                                    : null}
                            </p>
                        </div> */}

                        {/* <div className='m-2'>
                            <label className={style?.label} htmlFor='ownerCategory'>
                                Category of Application
                                <span className={style?.required}>*</span>
                            </label>
                            <select
                                {...formik.getFieldProps("ownerCategory")}
                                name='ownerCategory'
                                className={style?.textFiled}
                            >
                                <option value=''>Select</option>
                                <option value='1'>Owner</option>
                                <option value='2'>Tenant</option>

                            </select>
                            <p className='text-red-500 text-xs'>
                                {formik.touched.ownerCategory && formik.errors.ownerCategory
                                    ? formik.errors.ownerCategory
                                    : null}
                            </p>
                        </div> */}

                        {/* <div className='m-2'>
                            <label className={style?.label} htmlFor='ward'>
                                Ward Number<span className={style?.required}>*</span>
                            </label>

                            <select
                                {...formik.getFieldProps("ward")}
                                name='ward'
                                className={style?.textFiled}
                            >
                                <option value=''>Select</option>
                                {wardList?.length > 0 &&
                                    wardList?.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.ward_name}
                                        </option>
                                    ))}
                            </select>
                            <p className='text-red-500 text-xs'>
                                {formik.touched.ward && formik.errors.ward
                                    ? formik.errors.ward
                                    : null}
                            </p>
                        </div> */}
                    </div>

                    <div className='col-span-12 ml-2 my-2'>
                        <div className='text-lg text-left text-gray-600 font-semibold'>
                            # Applicant Details
                        </div>
                    </div>

                    <div className='bg-white shadow-md rounded-md py-2'>
                        <div className='grid grid-cols-1 md:grid-cols-3 '>
                            <div className='m-2'>
                                <label className={style?.label} htmlFor='applicantName'>
                                    Name of Applicant<span className={style?.required}>*</span>
                                </label>
                                <input
                                    value={applicationFullData?.applicant_name}
                                    {...formik.getFieldProps("applicantName")}

                                    maxLength='70'
                                    type='text'
                                    name='applicantName'
                                    className={style?.textFiled}
                                />
                                <p className='text-red-500 text-xs'>
                                    {formik.touched.applicantName && formik.errors.applicantName
                                        ? formik.errors.applicantName
                                        : null}
                                </p>
                            </div>
                            <div className='m-3'>
                                <label className={style?.label} htmlFor='mobileNo'>
                                    Mobile No<span className={style?.required}>*</span>
                                </label>
                                <input
                                    value={applicationFullData?.mobile_no}
                                    {...formik.getFieldProps("mobileNo")}

                                    type='text'
                                    maxLength={10}
                                    name='mobileNo'
                                    id='mobileNo'
                                    className={style?.textFiled}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    onKeyPress={(e) => {
                                        if (!(e.key >= "0" && e.key <= "9")) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <p className='text-red-500 text-xs'>
                                    {formik.touched.mobileNo && formik.errors.mobileNo
                                        ? formik.errors.mobileNo
                                        : null}
                                </p>
                            </div>
                            <div className='m-2'>
                                <label className={style?.label} htmlFor='email'>
                                    Email
                                </label>
                                <input
                                    // value={applicationFullData.email}
                                    {...formik.getFieldProps("email")}
                                    type='email'
                                    maxLength='70'
                                    name='email'
                                    className={style?.textFiled}
                                />
                                <p className='text-red-500 text-xs'>
                                    {formik.touched.email && formik.errors.email
                                        ? formik.errors.email
                                        : null}
                                </p>
                            </div>
                        </div>

                        <div className='m-3'>
                            <label className={style?.label} htmlFor='address'>
                                Address<span className={style?.required}>*</span>
                            </label>
                            <textarea
                                // disabled={formik.values.ownerCategory != 2}
                                {...formik.getFieldProps("address")}
                                name='address'
                                maxLength='500'
                                rows='3'
                                className={style?.textArea}
                            ></textarea>
                            <p className='text-red-500 text-xs'>
                                {formik.touched.address && formik.errors.address
                                    ? formik.errors.address
                                    : null}
                            </p>
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
                                // value={applicationFullData?.vehicle_no}
                                {...formik.getFieldProps("registrationNumber")}
                                maxLength='10'
                                type='text'
                                name='registrationNumber'
                                className={style?.textFiled}
                                onChange={(e) => {
                                    const upperCaseValue = e.target.value.toUpperCase();
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
                                VIN Number / CH No.<span className={style?.required}>*</span>
                            </label>
                            <input
                                {...formik.getFieldProps("vehicleComapny")}
                                maxLength='17'

                                type='text'
                                name='vehicleComapny'
                                className={style?.textFiled}
                                onChange={(e) => {
                                    const upperCaseValue = e.target.value.toUpperCase();
                                    formik.setFieldValue("vehicleComapny", upperCaseValue);
                                }}
                            />
                            <p className='text-red-500 text-xs'>
                                {formik.touched.vehicleComapny && formik.errors.vehicleComapny
                                    ? formik.errors.vehicleComapny
                                    : null}
                            </p>
                        </div>
                        {/* <div className='m-3'>
                            <label className={style?.label} htmlFor='fitness'>
                                Pollution Certificate<span className={style?.required}>*</span>
                            </label>
                            <input
                                {...formik.getFieldProps("fitness")}
                                maxLength='50'
                                type='file'
                                name='fitness'
                                className={style?.textFiled}
                            />
                            <p className='text-red-500 text-xs'>
                                {formik.touched.fitness && formik.errors.fitness
                                    ? formik.errors.fitness
                                    : null}
                            </p>
                        </div>
                        <div className='m-3'>
                            <label className={style?.label} htmlFor='taxCopy'>
                                Tax Copy<span className={style?.required}>*</span>
                            </label>
                            <input
                                {...formik.getFieldProps("taxCopy")}
                                maxLength='50'
                                type='file'
                                name='taxCopy'
                                className={style?.textFiled}
                            />
                            <p className='text-red-500 text-xs'>
                                {formik.touched.taxCopy && formik.errors.taxCopy
                                    ? formik.errors.taxCopy
                                    : null}
                            </p>
                        </div>
                        <div className='m-3'>
                            <label className={style?.label} htmlFor='license'>
                                Registration Of Certificate<span className={style?.required}>*</span>
                            </label>
                            <input
                                {...formik.getFieldProps("license")}
                                maxLength='50'
                                type='file'
                                name='license'
                                className={style?.textFiled}
                            />
                            <p className='text-red-500 text-xs'>
                                {formik.touched.license && formik.errors.license
                                    ? formik.errors.license
                                    : null}
                            </p>
                        </div> */}
                    </div>
                </div>
                <p
                    className='flex mt-3 gap-x-3'
                    onClick={() => setIsChecked(!isChecked)}
                >
                    <input
                        type='checkbox'
                        checked={isChecked}
                        name=''
                        id=''
                        onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    <p className=' select-none'>
                        I have entered the correct information and agree to the terms and
                        conditions.
                    </p>
                </p>
                <p className='text-red-500 font-semibold text-center mt-3'>
                    {errorMessage && errorMessage}
                </p>
                <div className='flex justify-center my-5 '>
                    {formSubmitting ? (
                        <p>Form Submitting..</p>
                    ) : (
                        <button
                            type='submit'
                            disabled={!isChecked}
                            className='disabled:opacity-40 bg-indigo-600 hover:bg-indigo-700 px-8 py-2 text-white rounded shadow '
                        >
                            Submit Application
                        </button>
                    )}
                </div>
            </form>
        </>
    );
};

export default EditPetDetailsForm