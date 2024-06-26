// Importing necessary dependencies and components
import React, { useEffect, useState } from 'react'
import { useFormik, } from 'formik'
import * as yup from 'yup'
import { MagnifyingGlass } from 'react-loader-spinner'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import ListTableConnect from '@/Components/Common/ListTableBP/ListTableConnect'
import PetRegAPIList from '@/Components/api/PetRegAPIList'
import useSetTitle from '@/Components/Common/useSetTitle'
import { RiFilter2Line } from "react-icons/ri";

// Component for displaying rejected pet applications
const RejectPetApplication = (props) => {
    // Hook to set the title of the page
    useSetTitle("Rejected Application")

    // State variables for managing search results
    const [searchingData, setSearchingData] = useState(false)
    const [data, setData] = useState(false)

    // API endpoint for fetching rejected pet applications
    const { api_RejectedPetApplication } = PetRegAPIList()

    // Hook for programmatic navigation
    const navigate = useNavigate()

    // States Used for Pagination of Search Pet Applications
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [currentPageIndex, setCurrentPageIndex] = useState(1);
    const [lastPageIndex, setLastPageIndex] = useState(0);
    const [pageLength, setPageLength] = useState(10);
    const [searchValue, setSearchValue] = useState('');
    const [refreshStatus, setRefreshStatus] = useState(false);
    const [requestBody, setRequestBody] = useState(null)
    const [changeData, setChangeData] = useState(0)

    // Form validation schema using Yup
    const validationSchema = yup.object({
        searchBy: yup.string().required('Require'),
        searchText: yup.string().required('Require'),
    })
    // Initial form values
    const initialValues = {
        searchBy: '',
        searchText: '',
    }
    // Formik hook for form management
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        onSubmit: (values, resetForm) => {
            console.log("Value.....", values)
            // searchData(values)
            setRequestBody({
                "filterBy": values.searchBy,
                "parameter": values.searchText,
            })
            setChangeData(prev => prev + 1)
        },
        validationSchema
    })
    console.log(requestBody)
    // Event handler for form input changes
    const handleChange = (event) => {
        let name = event.target.name
        let value = event.target.value
        // { name === 'propertyType' && ((value == '1') ? setpropertyTypeStatusToggle(true) : setpropertyTypeStatusToggle(false)) }
        // { name == 'mobileNo' && formik.setFieldValue("mobileNo", allowNumberInput(value, formik.values.mobileNo, 10)) }
    };

    // Effect hook to set the initial request body
    useEffect(() => {
        setRequestBody({
            "filterBy": values.searchBy,
            "parameter": values.searchText,
        })
    }, [])
    // These variables are used for pagination
    const values = {
        totalDataCount: totalDataCount,
        currentPageIndex: currentPageIndex,
        setCurrentPageIndex: setCurrentPageIndex,
        pageLength: pageLength,
        setPageLength: setPageLength,
        lastPageIndex: lastPageIndex,
        setLastPageIndex: setLastPageIndex,
        searchValue: searchValue,
        setSearchValue: setSearchValue,
        refreshStatus: refreshStatus
    }
    // Event handler for viewing details of a rejected pet application
    const handleViewBtn = (value) => {
        console.log("View button clicked", value)
        navigate(`/ViewRejectApplication/${value}`)
    }
    
    // Definition of table columns for displaying rejected pet applications
    const tableColumns = [
        {
            Header: "#",
            Cell: ({ row }) => <div className="pr-2">{row.index + 1}</div>,
        },
        {
            Header: "Application No.",
            accessor: "application_no",
        },
        {
            Header: "Applicant Name",
            accessor: "applicant_name",
        },
        {
            Header: "Phone No",
            accessor: "mobile_no",
        },
        {
            Header: "Type",
            accessor: "ref_application_type",
        },
        {
            Header: "APPLIED BY",
            accessor: "user_type",
        },
        {
            Header: "Applied Date",
            accessor: "application_apply_date",
            Cell: ({ value }) => { return format(new Date(value), 'dd-MM-yyyy') }
        },
        {
            Header: 'Action',
            accessor: "id",
            Cell: ({ cell }) => (
                <div className='px-1'><p onClick={() => handleViewBtn(cell.row.values.id)} className="text-center bg-indigo-200 mx-3 py-1 hover:drop-shadow-xl hover:bg-indigo-700 
                hover:text-white text-black">View</p></div>
            )
        }
    ]
    console.log("Data", data)
    return (
        <>
            <div className="">
                <div className="border bg-white rounded p-3 pb-8">
                    <h2 className="text-xl md:text-3xl font-bold leading-tight text-gray-700">
                        Reject Application
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-gray-600">
                    You can search approved rig application and perform actions like : renewal, payment, print receipt etc.
                    </p>
                    <form className='mt-8 my-6' onSubmit={formik.handleSubmit} onChange={handleChange}>
                        <div className="flex flex-row flex-wrap gap-x-4 items-center gap-y-2 pb-4 mb-2 border-b">
                            <div className='w-full md:w-[25%]'>
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
                                    Filter By<span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...formik.getFieldProps('searchBy')}
                                    className={`${formik.errors.searchBy ? 'text-red-500 font-semibold border border-solid border-red-600 placeholder-red-300 shadow-red-100 ' : 'text-gray-700 font-normal border border-solid border-gray-400 placeholder-gray-400 '} cursor-pointer w-full px-3 py-1.5 text-base  bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none shadow-md`}
                                >
                                    <option value="">Select</option>
                                    <option value="applicationNo">Application No</option>
                                    <option value="applicantName">Applicant Name</option>
                                    <option value="mobileNo">Mobile No</option>
                                    {/* <option value="safNo">SAF No</option>
                                    <option value="holdingNo">Holding No</option> */}
                                </select>
                            </div>
                            <div className='w-full md:w-[25%]'>
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
                                    Parameter
                                    <span className="text-red-500">*</span>
                                </label>
                                <span
                                    onClick={() => props.setShowScreen("forgot")}
                                    className="text-sm font-medium text-indigo-600 hover:underline hover:text-indigo-700 focus:text-indigo-700"
                                >
                                </span>
                                <div className="">
                                    <input
                                        disabled={searchingData}
                                        placeholder="Enter Search Text"
                                        className=" w-full px-3 py-1.5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-gray-400 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-400 shadow-md"
                                        type="text" {...formik.getFieldProps('searchText')} />
                                </div>
                            </div>
                            <div className='mt-6'>
                                <button
                                    type="submit"
                                    className=" flex items-center border border-gray-800 bg-gray-700 hover:bg-gray-800 text-white shadow-lg rounded-sm  text-base px-5 py-1"
                                >
                                    <span className="text-green-400 mr-2"><RiFilter2Line fontSize={20} /></span>
                                    <span>Search Record</span>
                                </button>
                            </div>
                        </div>
                    </form>
                    <>
                        {searchingData &&
                            <>
                                <div className='flex justify-center mt-2'>
                                    <MagnifyingGlass
                                        visible={true}
                                        height="70"
                                        width="70"
                                        ariaLabel="MagnifyingGlass-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="MagnifyingGlass-wrapper"
                                        glassColor='#c0efff'
                                        color='#6366F1'
                                    />
                                </div>
                                <p className='text-center'>Searching...</p>
                            </>}
                        <div>
                            {requestBody != null && <ListTableConnect
                                api={api_RejectedPetApplication} // sending api
                                columns={tableColumns} // sending column
                                requestBody={requestBody}
                                changeData={changeData} // sending body
                                search={false}
                            />}
                        </div>
                    </>
                </div>
            </div>
        </>
    )
}




export default RejectPetApplication