// import ListTableParent from '@/Components/Common/ListTable/ListTableParent'
import React, { useState } from 'react'
import CashVerificationDetailedModal from './CashVerificationDetailedModal'
import BottomErrorCard from '@/Components/Common/BottomErrorCard'
import BarLoader from '@/Components/Common/Loaders/BarLoader'
import { useNavigate, useParams } from 'react-router-dom'
import ListTableConnect from '@/Components/Common/ListTableBP/ListTableConnect'
import moment from 'moment'
import * as yup from 'yup'
import PetRegAPIList from '@/Components/api/PetRegAPIList'
import { useFormik } from 'formik'
import ApiHeader from '@/Components/api/ApiHeader'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'
import ListTableParent from '@/Components/Common/ListTable/ListTableParent'
import ListTableConnect2 from '@/Components/Common/ListTableBP/ListTableConnect2'
const CashVerification = (props) => {
    const [openVewMOdel, setOpenVewMOdel] = useState(0)
    const [employeeList, setEmployeeList] = useState()
    const [fetchedData, setFetchedData] = useState()
    const [sendDataInModal, setSendDataInModal] = useState()
    const [reportType, setReportType] = useState(1)
    // const [url, setUrl] = useState()
    const [loader, setLoader] = useState(false)
    const [erroState, seterroState] = useState(false);
    const [erroMessage, seterroMessage] = useState(null);
    const [requestBody, setRequestBody] = useState({});
    const [changeData, setChangeData] = useState();
    const [dataList, setdataList] = useState(null)


    const navigate = useNavigate()

    let testDate = new Date().toLocaleDateString('in-IN');
    let todayDate = moment(testDate).format('YYYY-DD-MM');
    const { api_collectionReport, api_cashVerification } = PetRegAPIList()
    const { module } = useParams()


    const handleViewBtn = (id) => {
        console.log("View Clicked", id)

        setSendDataInModal(id)
        setOpenVewMOdel(prev => prev + 1)
    }

    // ===========> Formik Start

    const validationSchema = yup.object({
        collectionDate: yup.string().required('Select Date'),
    })
    const formik = useFormik({
        initialValues: {
            empName: '',
            collectionDate: moment(new Date()).format("yy-MM-DD"),
            reportType: '1'
        },

        enableReinitialize: true,

        onSubmit: (values) => {
            console.log('report type ', values)
            searchData(values)
            setRequestBody({
                date: formik.values.collectionDate,
            })
            setChangeData(prev => prev + 1)
        },
        validationSchema,
    });

    const COLUMNS = [

        {
            Header: 'Sl.',
            Cell: ({ row }) => (
                <div className='px-2 font-semibold'>{row.index + 1}.</div>
            )
        },
        {
            Header: "Employee Name",
            accessor: "officer_name",

        },
        {
            Header: "Total Amount",
            accessor: "amount",

        },
        {
            Header: "Paid Date",
            accessor: "date",
        },

        {
            Header: "Action",
            Cell: ({ cell }) => (
                <div className='flex gap-2 w-full flex-wrap'>
                    <button
                        onClick={() =>
                            handleViewBtn(cell.row.original)
                        }
                        className="bg-blue-600 hover:bg-blue-400 py-1 px-3 text-white rounded-sm"
                    >
                        View
                    </button>
                </div>
            ),
        },
    ]



    // ===========> Formik End

    const searchData = () => {

        let payload = {
            date: formik.values.collectionDate,
            userId: "",
        }

        AxiosInterceptors.post(api_cashVerification, payload, ApiHeader())
            .then((res) => {
                console.log("response list cash", res?.data?.data)
                if (res?.data?.status) {
                    setFetchedData(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, res?.data?.message)
                }
            })
            .catch((err) => {
                setLoader(false)
                activateBottomErrorCard(true, 'Error occured while fetching cash verification list. Please try again later.')
                console.log("Error while list cash verification", err)
            })
    }

    console.log(fetchedData, "================>>")

    const activateBottomErrorCard = (state, msg) => {
        seterroMessage(msg)
        seterroState(state)

    }


    return (
        <>
            {loader && <BarLoader />}
            {erroState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={erroMessage} />}

            <CashVerificationDetailedModal openAddPopUP={openVewMOdel} data={sendDataInModal} refresh={() => searchData()} activateBottomErrorCard={activateBottomErrorCard} reportType={"1"} searchData={searchData} />
            <div className='m-2'>

                <div className='shadow-md  rounded bg-indigo-100 px-4'>

                    <form onSubmit={formik.handleSubmit} onChange={formik.handleChange}>

                        <div className='px-3 py-3'>
                            <div className='text-left'>
                                <h1 className='mb-3 text-2xl font-semibold'>Cash Verification</h1>
                            </div>

                            <div className='grid grid-cols-12 gap-4 items-end'>
                                <div className='col-span-10 md:col-span-2'>
                                    <p className='py-1 text-base font-semibold'>Select Date <span className='text-red-400'>*</span></p>
                                    <input
                                        onChange={formik.handleChange}
                                        name="collectionDate"
                                        className="w-full rounded border-gray-500 p-1.5 text-base border shadow-sm outline-blue-300 outline-1"
                                        type="date"
                                        // defaultValue="2023-10-01"
                                        defaultValue={todayDate}
                                    />
                                    <p className='text-red-500 text-xs font-semibold absolute'> {formik.touched.collectionDate && formik.errors.collectionDate ? formik.errors.collectionDate : null}</p>
                                </div>
                                <div className='col-span-10 md:col-span-2 flex items-end justify-end md:mt-0 mt-6'>
                                    <button type="submit" class="w-full py-2 px-4 inline-block text-center rounded leading-5 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0">Search</button>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>

                <p className=' mx-10 py-5'></p>
                <div className='my-4'>

                    {console.log(requestBody)}
                    {console.log(dataList)}
                    {(fetchedData?.length == 0 ? <p className='text-center font-semibold text-xl -mt-8 text-red-500'>No Data Found !</p> :
                        <>
                            {fetchedData ?
                                <div className='bg-white p-4'>
                                    <ListTableConnect2
                                        getData={true}
                                        allData={(data) => setdataList(data)}
                                        api={api_cashVerification}
                                        columns={COLUMNS}
                                        dataList={fetchedData}
                                        requestBody={requestBody}
                                        changeData={changeData} />
                                </div> :
                                <p className='text-center font-semibold -mt-8'>Please Choose Date </p>
                            }
                        </>
                    )}
                </div>
            </div>

        </>
    )
}

export default CashVerification
