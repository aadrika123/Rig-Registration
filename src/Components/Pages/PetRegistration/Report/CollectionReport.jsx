import PetRegAPIList from '@/Components/api/PetRegAPIList'
import ListTable from '@/Components/Common/ListTable/ListTable'
import ListTableConnect from '@/Components/Common/ListTableBP/ListTableConnect'
import { indianAmount, indianDate, nullToNA } from '@/Components/Common/PowerupFunctions'
import useSetTitle from '@/Components/Common/useSetTitle'
import { useFormik } from 'formik'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { RiFilter2Line } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

const CollectionReport = () => {
    const { api_collectionReport, } = PetRegAPIList()
    let testDate = new Date().toLocaleDateString('in-IN');
    let todayDate = moment(testDate).format('DD-MM-YYYY');

    const navigate = useNavigate()

    const [modalIsOpen, setIsOpen] = useState(false);
    const [wardList, setwardList] = useState()
    const [collectorList, setcollectorList] = useState()
    const [collectionData, setcollectionData] = useState([])
    const [dataList, setdataList] = useState(null)
    const [totalAmount, settotalAmount] = useState(0)
    const [loader, setloader] = useState(false)
    const [collection, setcollection] = useState('')
    const [index, setindex] = useState(null)
    const [requestBody, setrequestBody] = useState(null)// create this for list table connect
    const [changeData, setchangeData] = useState(0)// create this for list table connect

    const commonInputStyle = `form-control block w-full px-2 py-1 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none shadow-md`

    useSetTitle('Collection Report')

    const validationSchema = yup.object({
        fromDate: yup.string().required('Field Required'),
        toDate: yup.string().required('Field Required'),

    })

    const formik = useFormik({
        initialValues: {
            fromDate: moment(new Date()).format("yy-MM-DD"),
            toDate: moment(new Date()).format("yy-MM-DD"),

        },
        onSubmit: (values) => {
            console.log('values =>  ', values)
            setindex(null)
            setcollectionData(values?.collType)
            setrequestBody({
                fromDate: formik.values.fromDate,
                toDate: formik.values.toDate,
            })
            setchangeData(prev => prev + 1)
        }
        , validationSchema
    })

    useEffect(() => {
        settotalAmount(dataList?.collectAmount)
    }, [dataList, changeData])

    console.log("object", dataList?.collectAmount)
    const column = [
        {
            Header: "S.No.",
            Cell: ({ row }) => <div>{row?.index + 1}</div>,
            className: 'w-[5%]'
        },
        {
            Header: "Ward No.",
            accessor: "ward_name",
            Cell: (props) => { return nullToNA(props?.value) },
            className: 'w-[5%]'
        },
        {
            Header: 'Application Type',
            accessor: 'application_type',
            Cell: (props) => {
                const applicationType = props?.value;
                if (applicationType == "New_Apply") {
                    return "New Apply";
                } else {
                    return applicationType;
                }
            }
        },
        {
            Header: 'Application No.',
            accessor: 'application_no',
            Cell: (props) => { return nullToNA(props?.value) }
        },
        {
            Header: "Owner Name",
            accessor: "ownerName",
            Cell: (props) => { return nullToNA(props?.value) },
            className: ''
        },
        {
            Header: "Tran. Date",
            accessor: "tran_date",
            Cell: (props) => { return indianDate(props?.value) }
        },
        {
            Header: "Amount",
            accessor: "amount",
            Cell: (props) => { return <>{indianAmount(props?.value)}</> }
        },
        {
            Header: 'Action',
            accessor: "id",
            Cell: ({ cell }) => (
                <>
                    <div className='flex items-center justify-center gap-2 w-full'>
                        <button onClick={() => navigate(`/viewRigApplication/${cell?.row?.original?.id}`)} className='px-2 py-1 rounded-md bg-indigo-500 text-white text-sm hover:bg-indigo-600'>View</button>
                    </div>
                </>
            )
        }
    ]

    return (
        <div>
            <>
                <form onChange={formik.handleChange} onSubmit={formik.handleSubmit} className="mb-4 bg-white shadow-lg rounded-md ">
                    <h1 className='text-xl w-full font-bold px-8 pt-4 text-gray-700'>Search Collection Report</h1>

                    <div className="flex flex-wrap flex-row justify-start w-full gap-x-6 gap-y-2 text-sm 3xl:text-base p-4 px-8">
                        <div className="flex flex-col w-full md:w-[20%]">
                            <div className="col-span-6 font-semibold">
                                From Date :
                            </div>
                            <div className="col-span-6">
                                <input type="date" name="fromDate" value={formik.values.fromDate} id="" className={commonInputStyle} defaultValue={todayDate} />
                            </div>
                            <div className="col-span-12 text-end">
                                {formik.touched.fromDate && formik.errors.fromDate && <><span className="text-red-600 text-xs">{formik.errors.fromDate}</span></>}
                            </div>
                        </div>
                        <div className="flex flex-col w-full md:w-[20%]">
                            <div className="col-span-6 font-semibold">
                                Upto Date :
                            </div>
                            <div className="col-span-6">
                                <input type="date" name="toDate" value={formik.values.toDate} id="" className={commonInputStyle} defaultValue={todayDate} />
                            </div>
                            <div className="col-span-12 text-end">
                                {formik.touched.toDate && formik.errors.toDate && <><span className="text-red-600 text-xs">{formik.errors.toDate}</span></>}
                            </div>
                        </div>

                        <div className="w-full md:w-[20%] flex justify-start items-center">
                            <button type="submit" className="flex flex-row items-center border border-green-600 bg-green-600 hover:bg-green-400 text-white hover:text-black shadow-lg rounded-sm text-sm font-semibold px-5 py-1 w-max"> <span className='mr-2'><RiFilter2Line /></span>Search</button>
                        </div>

                    </div>

                </form>
            </>
            {
                (requestBody != null) &&
                <div className='relative'>
                    {dataList?.collectAmount > 0 &&
                        <div className='absolute top-11 right-0'>
                            Total Amount : <span className="font-semibold">{indianAmount(totalAmount)}</span>
                        </div>
                    }

                    <ListTableConnect
                        getData={true}
                        allData={(data) => setdataList(data)}
                        api={api_collectionReport} // sending api
                        columns={column} // sending column
                        requestBody={requestBody} // sending body
                        changeData={changeData} // send action for new payload
                    />
                </div>
            }
        </div>
    )
}

export default CollectionReport
