// Importing necessary dependencies and components
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import moment from "moment";
import pdfImage from '@/assets/Images/pdf.png'
import petIcon from './pet-house.png'
import PetRegAPIList from '@/Components/api/PetRegAPIList.js';
import ShimmerEffectInline from '@/Components/Common/Loaders/ShimmerEffectInline';
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';
import useSetTitle from '@/Components/Common/useSetTitle';

// Component for viewing details of an approved pet application
const ViewApprovedApplication = () => {

    // Hook to set the title of the page
    useSetTitle(" Approved Application")

    // Hook for programmatic navigation and getting the application ID from the URL parameters
    const navigate = useNavigate()
    const { id } = useParams()

    // State variables for managing application data, loading state, and error state
    const [applicationFullData, setApplicationFullData] = useState()
    const [loader, setLoader] = useState(false)
    const [somethingWentWrong, setSomethingWentWrong] = useState(false)

    // API endpoints for fetching approved pet application details
    const { api_PetApproveViewApplication, header, api_RigUploadedDoc } = PetRegAPIList();


    const [selectedDoc, setSelectedDoc] = useState(null);
    const [docDetails, setDocDetails] = useState()
    // Function to handle opening the modal
    const handleViewClick = (docPath, docName) => {
        setSelectedDoc({ path: docPath, name: docName });
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setSelectedDoc(null);
    };
    // Effect hook to fetch application data when the component mounts
    useEffect(() => {
        setLoader(true)
        AxiosInterceptors.post(api_PetApproveViewApplication, { "registrationId": id }, header)
            .then((res) => {
                setLoader(false)
                if (res.data.status) {
                    setApplicationFullData(res.data.data)
                } else {
                    setApplicationFullData(null)
                    console.log("Failed to fetch application data")
                }
            })
            .catch((err) => {
                setLoader(false)
                console.log("Error while getting application data")
            })
    }, [])


    useEffect(() => {
        setLoader(true)
        AxiosInterceptors.post(api_RigUploadedDoc, { "applicationId": id }, header)
            .then((res) => {
                setLoader(false)
                if (res.data.status) {
                    setDocDetails(res.data.data)
                } else {
                    setDocDetails(null)
                    console.log("Failed to fetch application data")
                }
            })
            .catch((err) => {
                setLoader(false)
                console.log("Error while getting application data")
            })
    }, [])
    console.log("applicationFullData", applicationFullData)
    return (
        <>
            <div className="flex justify-between">
                <p className="text-xl">Application No : <span className="font-semibold">{applicationFullData?.application_no}</span></p>
                {/* {applicationFullData?.viewRenewalButton == true ? <div className='space-x-5'>
                    <button className={`font-semibold md:text-base text-xs bg-indigo-500 text-white border border-indigo-500  px-4 py-1 shadow-lg hover:scale-105 rounded-sm`} onClick={() => navigate(`/rig-renewal/${id}`)}>Renewal</button>
                </div> : ''} */}
            </div>
            {applicationFullData?.payment_status == 1 && applicationFullData?.registrationStatus == 1 &&
                <div className='font-semibold text-lg text-[#37517e]'>
                    <button className="border px-3 py-1 rounded shadow border-orange-500 hover:bg-orange-500 hover:text-white text-orange-500 whitespace-nowrap" onClick={() => navigate(`/rig-license-details/${applicationFullData?.application_id}`)}>Print License</button>
                </div>
            }
            <div className="grid grid-cols-12 mb-20">
                {/* <BreadCrumb title="abc" /> */}
                <div className="rounded-md col-span-12">
                    {applicationFullData?.current_role_name && <p className="text-center text-green-600 font-semibold"> Your Application Submitted. Currently at {applicationFullData?.current_role_name}</p>}
                    {somethingWentWrong == true ? <p className='m-auto mt-10 font-semibold border border-gray-300 text-red-700 bg-red-100 px-5 py-2 rounded shadow w-fit'>Failed to Get Data</p> :
                        <div className="overflow-y-auto">
                            {/* Property  details */}
                            <div className='bg-white shadow-xl p-4 border border-gray-200 my-3'>
                                <h1 className='px-1 font-semibold font-serif text-xs mt-2 text-[#37517e]'><img src='https://cdn-icons-png.flaticon.com/512/609/609803.png' alt="pin" className='w-5 inline text-[#37517e]' /> Property Address & Details</h1>
                                {loader ? <ShimmerEffectInline /> :
                                    <div className='mt-2'>
                                        <div className="flex space-x-10 pl-4 ">
                                            <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>ULB Name</div>
                                                <div className='font-semibold text-sm text-[#37517e]'>{applicationFullData?.ulb_name ? applicationFullData?.ulb_name : "N/A"}</div>
                                            </div>
                                            <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>Ward No</div>
                                                <div className='font-bold text-sm text-[#37517e]'>{applicationFullData?.ward_name ? applicationFullData?.ward_name : "N/A"}</div>
                                            </div>
                                            <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>Application Type</div>
                                                <div className='font-bold text-sm text-[#37517e]'>{applicationFullData?.ref_application_type ? applicationFullData?.ref_application_type : "N/A"}</div>
                                            </div>
                                            {applicationFullData?.holding_no &&
                                                <div className='flex-1 text-xs'>
                                                    <div className='text-[#37517e]'>Holding No</div>
                                                    <div className='font-bold text-sm text-[#37517e]'>{applicationFullData?.holding_no ? applicationFullData?.holding_no : "N/A"}</div>
                                                </div>
                                            }
                                            {applicationFullData?.saf_no &&
                                                < div className='flex-1 text-xs'>
                                                    <div className='text-[#37517e]'>SAF No</div>
                                                    <div className='font-bold text-sm text-[#37517e]'>{applicationFullData?.saf_no ? applicationFullData?.saf_no : "N/A"}</div>
                                                </div>
                                            }
                                        </div>
                                        <div></div>
                                        {/* coressponding address */}
                                        <div className="col-span-4 grid grid-cols-5 justify-center items-center">
                                            <div className="col-span-2 flex justify-center items-center w-full h-[1px] bg-gray-400"></div>
                                            <div className='flex justify-center items-center'><label className="form-check-label text-gray-800"> <small className="block mt-1 text-xs text-gray-400 inline md:px-4 font-mono text-center">Complete Address</small></label></div>
                                            <div className="col-span-2 flex justify-center items-center w-full h-[1px] bg-gray-400"></div>
                                        </div>

                                        <div className="px-4">
                                            <div className='flex text-xs'>
                                                <div className='flex-1 text-xs'>
                                                    <div className='text-[#37517e]'>Address</div>
                                                    <div className='font-bold text-sm text-[#37517e]'>{applicationFullData?.address ? applicationFullData?.address : "N/A"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            {/* Pet  details */}
                            <div className='bg-white shadow-xl p-4 border border-gray-200 my-3'>
                                <h1 className='px-1 font-semibold font-serif text-xs mt-2 text-[#37517e]'><img src={petIcon} alt="Pet Detail" className='w-5 inline text-[#37517e]' /> Vehicle Details</h1>
                                {loader ? <ShimmerEffectInline /> :
                                    <div className='mt-2 space-y-5'>
                                        <div className="flex space-x-10 pl-4 ">
                                            {/* <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>Name of Driver</div>
                                                <div className='font-semibold text-sm text-[#37517e]'>{applicationFullData?.driver_name}</div>
                                            </div>
                                            <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>Gender</div>
                                                <div className='font-bold text-sm text-[#37517e]'>{applicationFullData?.ref_gender}</div>
                                            </div>
                                            <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>Date of Birth</div>
                                                <div className='font-bold text-sm text-[#37517e]'>
                                                    {applicationFullData?.dob}
                                                </div>
                                            </div> */}
                                            <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>VIN Number</div>
                                                <div className='font-bold text-sm text-[#37517e]'>
                                                    <div className='font-bold text-sm text-[#37517e]'>{applicationFullData?.vehicle_name}</div>
                                                </div>
                                            </div>
                                            <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>Registration No.</div>
                                                <div className='font-bold text-sm text-[#37517e]'>{applicationFullData?.vehicle_no}</div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-10 pl-4 ">

                                            {/* <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>Vehicle From</div>
                                                <div className='font-bold text-sm text-[#37517e]'>{applicationFullData?.vehicle_from}</div>
                                            </div> */}

                                            <div className='flex-1 text-xs'>
                                            </div>
                                        </div>

                                    </div>
                                }
                            </div>
                            {/* owner details */}
                            <div className='bg-white shadow-xl p-4 border border-gray-200 my-5'>
                                <h1 className='px-1 font-semibold font-serif text-xs text-[#37517e]'><img src='https://cdn-icons-png.flaticon.com/512/2029/2029957.png' alt="pin" className='w-5 inline text-[#37517e]' /> Owner Details</h1>
                                {loader ? <ShimmerEffectInline /> :
                                    <table className='min-w-full leading-normal mt-2 bg-white'>
                                        <thead className='font-bold text-left text-sm border text-[#37517e] bg-sky-100'>
                                            <tr>
                                                <th className="px-2 py-3 border-b border-gray-200 text-xs uppercase text-left">#</th>
                                                <th className="px-2 py-3 border-b border-gray-200 text-xs uppercase text-left">Owner Name</th>
                                                <th className="px-2 py-3 border-b border-gray-200 text-xs uppercase text-left">Mobile No.</th>
                                                <th className="px-2 py-3 border-b border-gray-200 text-xs uppercase text-left">Email </th>
                                                {/* <th className="px-2 py-3 border-b border-gray-200 text-xs uppercase text-left">PAN No</th> */}
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            <>
                                                {/* {applicationFullData?.ownerDetails?.map((items, i) => ( */}
                                                <tr className="bg-white shadow-lg border-b border-gray-200">
                                                    <td className="px-2 py-2 text-sm text-left text-[#37517e]">1</td>
                                                    <td className="px-2 py-2 text-sm text-left text-[#37517e]">{applicationFullData?.applicant_name ? applicationFullData?.applicant_name : "N/A"}</td>

                                                    <td className="px-2 py-2 text-sm text-left text-[#37517e]">{applicationFullData?.mobile_no ? applicationFullData?.mobile_no : "N/A"}</td>
                                                    <td className="px-2 py-2 text-sm text-left text-[#37517e]">{applicationFullData?.email ? applicationFullData?.email : "N/A"}</td>
                                                    {/* <td className="px-2 py-2 text-sm text-left text-[#37517e]">{applicationFullData?.pan_no ? applicationFullData?.pan_no : "N/A"}</td> */}
                                                </tr>
                                                {/* ))} */}
                                            </>
                                        </tbody>
                                    </table>
                                }
                            </div>

                            {/* Document details */}
                            {loader ? <ShimmerEffectInline /> : applicationFullData?.doc_upload_status &&
                                <div className='bg-white shadow-xl p-4 border border-gray-200 my-5'>
                                    <h1 className='px-1 font-semibold font-serif text-xs text-[#37517e]'><img src='https://cdn-icons-png.flaticon.com/512/2029/2029957.png' alt="pin" className='w-5 inline text-[#37517e]' /> Document Details</h1>

                                    <table className='min-w-full leading-normal mt-2 bg-white'>
                                        <thead className='font-bold text-left text-sm border text-[#37517e] bg-sky-100'>
                                            <tr>
                                                <th className="px-2 py-3 border-b border-gray-200 text-xs uppercase text-left">#</th>
                                                <th className="px-2 py-3 border-b border-gray-200 text-xs uppercase text-left">Document Name</th>
                                                <th className="px-2 py-3 border-b border-gray-200 text-xs uppercase text-left">Status</th>
                                                <th className="px-2 py-3 border-b border-gray-200 text-xs uppercase text-left">Preview</th>
                                                <th className="px-2 py-3 border-b border-gray-200 text-xs uppercase text-left">View </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            <>
                                                {docDetails?.map((items, i) => (
                                                    <tr className="bg-white shadow-lg border-b border-gray-200">
                                                        <td className="px-2 py-2 text-sm text-left text-[#37517e]">{i + 1}</td>
                                                        <td className="px-2 py-2 text-sm text-left text-[#37517e]">{items?.doc_code ? items?.doc_code : "N/A"}</td>
                                                        <td className="px-2 py-2 text-sm text-left text-[#37517e]">{items?.verify_status == 1 ? <p className="text-green-400 font-semibold">Verified</p> : <p className="text-red-400 font-semibold">Pending</p>}</td>
                                                        <td className="px-2 py-2 text-sm text-left text-[#37517e]">

                                                            {items?.doc_path?.split('.').pop() == "pdf" ? <img className="h-10 w-10 border rounded shadow-md" src={pdfImage} /> :
                                                                items?.doc_path ? <img className="h-10 w-10 border rounded shadow-md" src={items?.doc_path} /> : "N/A"}

                                                        </td>
                                                        <td className="px-2 py-2 text-sm text-left text-[#37517e]">
                                                            {items?.doc_path ? (
                                                                <button
                                                                    onClick={() => handleViewClick(items?.doc_path, items?.doc_code)}
                                                                    className="bg-indigo-600 text-white px-2 py-1 rounded"
                                                                >
                                                                    View
                                                                </button>
                                                            ) : (
                                                                <button disabled className="bg-indigo-200 text-white px-2 py-1 rounded">
                                                                    View
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>

                                        </tbody>
                                    </table>
                                    {/*
                                    <div>
                                        <div className="text-center">
                                            <p>Please Upload Document</p>
                                        </div>
                                        <div className="flex justify-center">
                                            <button onClick={() => navigate(`/apply-pet-registration/document-upload/${id}`)} className="px-2 py-1 bg-indigo-600 text-sm text-white">Upload Document</button>
                                        </div>
                                    </div> */}

                                </div>
                            }
                            {/* Payment Details */}
                            <div className='bg-white shadow-xl p-4 border border-gray-200'>
                                <h1 className='px-1 font-semibold font-serif text-xs mt-2 text-[#37517e]'><img src='https://cdn-icons-png.flaticon.com/512/8948/8948774.png' alt="Upload" className='w-5 inline text-[#37517e]' /> Payment Details</h1>
                                {loader ? <ShimmerEffectInline /> : (applicationFullData?.payment_status == 0 && applicationFullData?.registrationStatus == 1) ?
                                    <div className="text-center text-indigo-600">
                                        <div>
                                            <div className="text-center">
                                                <p>Please Make Payment</p>
                                            </div>
                                            <div className="flex justify-center">
                                                <button onClick={() => navigate(`/rig-payment-offline/${id}`)}
                                                    className="px-2 py-1 bg-indigo-600 text-sm text-white">Pay Now</button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className='mt-2'>
                                        <div className="flex space-x-10 pl-4 ">
                                            <div className='text-xs'>
                                                <div className='text-[#37517e]'>Sl.</div>
                                            </div>
                                            <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>Trans No</div>
                                            </div>
                                            <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>Amount</div>
                                            </div>
                                            <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>Payment Mode</div>
                                            </div>
                                            <div className=' text-xs'>
                                                <div className='text-[#37517e]'>Status</div>
                                            </div>
                                            <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>Payment Date</div>
                                            </div>
                                            <div className='flex-1 text-xs'>
                                                <div className='text-[#37517e]'>Action</div>
                                            </div>
                                        </div>
                                        {applicationFullData?.transactionDetails &&
                                            <div className="flex space-x-10 pl-4 my-2 border-y-gray-200">
                                                <div className='text-xs'>
                                                    <div className='font-semibold text-sm text-[#37517e]'>1.</div>
                                                </div>
                                                <div className='flex-1 text-xs'>
                                                    <div className='font-semibold text-sm whitespace-nowrap text-[#37517e]'>{applicationFullData?.transactionDetails?.tran_no || "N/A"}</div>
                                                </div>
                                                <div className='flex-1 text-xs'>
                                                    <div className='font-bold text-sm text-[#37517e]'>{applicationFullData?.transactionDetails?.amount || "N/A"}</div>
                                                </div>
                                                <div className='flex-1 text-xs'>
                                                    <div className='font-semibold text-sm text-[#37517e]'>{applicationFullData?.transactionDetails?.payment_mode || "N/A"}</div>
                                                </div>
                                                <div className='text-xs'>
                                                    <div className='font-semibold text-sm text-[#37517e]'>
                                                        Paid
                                                    </div>
                                                </div>
                                                <div className='flex-1 text-xs'>
                                                    <div className='font-semibold text-sm text-[#37517e]'>{moment(applicationFullData?.transactionDetails?.created_at).format('DD-MM-yy') || "N/A"}</div>
                                                </div>
                                                <div className='flex-1 text-xs'>
                                                    <div className='font-semibold text-sm text-[#37517e]'>
                                                        <button className="border px-3 py-1 rounded shadow border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 whitespace-nowrap" onClick={() => navigate(`/rig-payment-receipt/${applicationFullData?.transactionDetails?.tran_no}`)}>Print Receipt</button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>

                            {/* Modal */}
                            {selectedDoc && (
                                <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-auto">
                                    <div className="bg-white p-6 rounded-lg shadow-lg" style={{ width: '60vw', height: '90vh' }}>
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-lg font-semibold">{selectedDoc.name}</h2>
                                            <button onClick={handleCloseModal} className="text-gray-500">
                                                &times;
                                            </button>
                                        </div>
                                        {/* Render the content based on document type */}
                                        {selectedDoc.path.endsWith(".pdf") ? (
                                            <iframe
                                                src={selectedDoc.path}
                                                className="w-full h-96"
                                                title={selectedDoc.name}
                                                style={{ height: 'calc(100% - 20px)' }}
                                            ></iframe>
                                        ) : (
                                            <img src={selectedDoc.path} alt={selectedDoc.name} className="w-full h-full" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                </div>
            </div >
        </>
    )
}

export default ViewApprovedApplication