// Importing necessary dependencies and components
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { MagnifyingGlass } from 'react-loader-spinner'
import { format } from 'date-fns'
import useSetTitle from '@/Components/Common/useSetTitle'
import { useNavigate } from 'react-router-dom'
import ListTableConnect from '@/Components/Common/ListTableBP/ListTableConnect'
import PetRegAPIList from '@/Components/api/PetRegAPIList'
import { RiFilter2Line } from "react-icons/ri";

// Component for searching pet application forms
const SearchPetApplicationForm = (props) => {
    // Hook to set the title of the page
    useSetTitle("Search Application")

    // Component for searching pet application forms
    const [searchingData, setSearchingData] = useState(false)
    const [data, setData] = useState(false)

    // API endpoint for searching pet applications
    const { api_searchPetApplication } = PetRegAPIList()

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
        searchBy: 'applicationNo',
        searchText: '',
    }
    // Formik hook for form management
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        onSubmit: (values, resetForm) => {
            console.log("Value.....", values)
            setRequestBody({
                "filterBy": values.searchBy || 'applicationNo',
                "parameter": values.searchText || '1',
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

    };

    useEffect(() => {
        setRequestBody({
            "filterBy": values.searchBy || 'applicationNo',
            "parameter": values.searchText || '1',
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
    // Event handler for viewing details of a pet application
    const handleViewBtn = (value) => {
        console.log("View button clicked", value)
        navigate(`/viewRigApplication/${value}`)
    }
    // Definition of table columns for displaying search results
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
            accessor: "application_type",
            Cell: ({ value }) => {
                if (value == "New_Apply") {
                    return <span className="text-green-600">New Apply</span>;
                } else if (value == "Renewal") {

                    return <span className="text-orange-600">Renewal</span>;
                } else {
                    return <span>Unknown</span>;
                }
            },
        },

        {
            Header: "Applied Date",
            accessor: "application_apply_date",
            Cell: ({ value }) => { return format(new Date(value), 'dd-MM-yyyy') }
        },
        {
            Header: "Applied By",
            accessor: "user_type",
            // Cell: ({ value }) => { return format(new Date(value), 'dd-MM-yyyy') }
        },
        {
            Header: "Payment Status",
            accessor: "payment_status",
            // Define a custom cell renderer for the Payment Status column
            Cell: ({ value }) => {
                if (value === 0) {
                    // Return "Unpaid" in red-600 color
                    return <span className="text-red-600">Unpaid</span>;
                } else if (value === 1) {
                    // Return "Paid" in green-600 color
                    return <span className="text-green-600">Paid</span>;
                } else {
                    // Handle any unexpected status
                    return <span>Unknown</span>;
                }
            },
        },
        {
            Header: "Application Status",
            accessor: "application_status",
            // Define a custom cell renderer for the Payment Status column
            Cell: ({ value }) => {
                if (value == "Approve") {

                    return <span className="text-green-600">Approved</span>;
                } else if (value == "Pending") {

                    return <span className="text-orange-600">Pending</span>;
                } else {

                    return <span className="text-red-600">Rejected</span>;
                }
            },
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
                        Search Pending Application
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-gray-600">
                        You can search rig application and perform actions like : renewal, payment, print receipt etc.
                    </p>
                    <form className='mt-8 my-6' onSubmit={formik.handleSubmit} onChange={handleChange}>
                        <div className="flex flex-row flex-wrap gap-x-4 items-center gap-y-2 pb-4 mb-2 border-b">
                            <div className='w-full md:w-[25%]'>
                                <label htmlFor="" className="text-base font-medium text-gray-900"> Search By <span className='text-red-500'>*</span> </label>

                                <select
                                    disabled={searchingData}
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

                                <div className=" ">
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
                                api={api_searchPetApplication} // sending api
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




export default SearchPetApplicationForm