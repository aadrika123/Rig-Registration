import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import moment from "moment";
import Modal from "react-modal";
// import AdvertisementApiList from "../../../Components/ApiList/AdvertisementApiList";
// import useSetTitle from "../../../Components/GlobalData/useSetTitle";
// import ApiHeader from "../../../Components/ApiList/ApiHeader";
// import AxiosInterceptors from "../../../Components/ApiList/AxiosInterceptors";
// import { nullToNA, nullToZero } from "../../../Components/Common/PowerUps/PowerupFunctions";
import { toast, ToastContainer } from "react-toastify";
// import BarLoader from "../../../Components/Common/BarLoader";
// import BottomErrorCard from "../../../Components/Common/BottomErrorCard";
// import ListTable from "../../../Components/Common/ListTable/ListTable";
import PetRegAPIList from "@/Components/api/PetRegAPIList";
import useSetTitle from "@/Components/Common/useSetTitle";
import ApiHeader from "@/Components/api/ApiHeader";
import AxiosInterceptors from "@/Components/Common/AxiosInterceptors";
import BarLoader from "@/Components/Common/Loaders/BarLoader";
import BottomErrorCard from "@/Components/Common/BottomErrorCard";
import { nullToNA, nullToZero } from "@/Components/Common/PowerupFunctions";
import ListTable from "@/Components/Common/ListTable/ListTable";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    border: "none",
  },
};
Modal.setAppElement("#root");

function BankReconciliation() {

  useSetTitle("Bank Reconciliation")

  const [modalIsOpen, setIsOpen] = useState(false);
  const [actionState, setactionState] = useState("");
  const [transactionNo, setTransactionNo] = useState();
  const [loader, setloader] = useState(false)
  const [filteredData, setFilteredData] = useState(false);
  const [cdata, setcdata] = useState()
  const [cId, setcId] = useState(0)
  const [mdId, setmdId] = useState('')
  const [erroState, seterroState] = useState(false);
  const [erroMessage, seterroMessage] = useState(null);

  const [loaderForClearBtn, setLoaderForClearBtn] = useState(false);

  //   const {api_SearchBankReconcile, apiUpdateReconcillationDetails, getReconcileById} = AdvertisementApiList()
  const { api_collectionReport, api_SearchBankReconcile, apiUpdateReconcillationDetails, getReconcileById } = PetRegAPIList()

  const header = ApiHeader()

  function openModal(transNo) {
    setIsOpen(true);
    setTransactionNo(transNo);
    console.log("====transactionNo in funcion", transNo);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const clearCheque = () => {
    // setclearSubmitButton(false)
    closeModal();
  };

  useEffect(() => {
    fetchFilterData()
  }, [])

  const fetchFilterData = (parameters) => {

    setloader(true)
    // setShowFilterData(true)
    console.log("parameters for filter data is ", parameters);

    const payloadData = {
      fromDate: formik?.values?.fromDate,
      toDate: formik?.values?.toDate,
      workflowID: formik?.values?.moduleId,
      paymentMode: formik?.values?.paymentMode,
      verificationType: formik?.values?.verificationType,
      chequeNo: formik?.values?.cheque_dd_no,
    };

    AxiosInterceptors
      .post(api_SearchBankReconcile, payloadData, header)
      .then(
        (res) => (console.log("Fetched Filter Data", res), setFilteredData(res?.data?.data), setloader(false))
      )
      .catch((err) => {
        console.log("Error while fetching filter Data", err)
        activateBottomErrorCard(true, 'Error occured while fetching bank reconciliation list. Please try again later.')
        setloader(false)
      });
  };

  // const validationSchema2 = yup.object({
  //   fromDate: yup.string().required("Select from date"),
  //   toDate: yup.string().required("Select to date"),
  //   // paymentMode: yup.string().required('Select pyement mode'),
  // });

  const formik = useFormik({
    initialValues: {
      fromDate: moment(new Date()).format("yy-MM-DD"),
      toDate: moment(new Date()).format("yy-MM-DD"),
      moduleId: '200',
      paymentMode: "",
      verificationType: "",
      cheque_dd_no: "",
    },

    enableReinitialize: true,

    onSubmit: (values) => {
      // console.log('--1-all data for filter...', values)
      // setLoaderSpinner(true)
      // setSubmitButtonStatus(false)
      // fetchBankReconcilliation()
      fetchFilterData(values);
      setmdId(values?.moduleId)
    },
    validationSchema: yup.object({
      fromDate: yup.string().required("Select from date"),
      toDate: yup.string().required("Select to date"),
    })
  });

  // Form 2 - In Popup Story Start

  const updateReconcile = (data) => {
    setLoaderForClearBtn(true);
    AxiosInterceptors
      .post(
        getReconcileById,
        {
          chequeId: cId,
          workflowId: "200",
          // moduleId : '1',
          status: data?.clearStatus,
          clearanceDate: data?.clearanceDate,
          remarks: formik2.values.clearStatus == "bounce" ? data?.reason : '',
          cancellationCharge: formik2.values.clearStatus == "bounce" ? data?.charge : '',
        },
        ApiHeader()
      )
      .then(
        (res) => (
          // console.log("Data Update Successfully", res),
          clearCheque(),
          setloader(false),
          fetchFilterData()
          // toast.success('Action Taken Successfully !!!')
        )
      )
      .catch(
        (err) => (
          console.log("Error : Data Not Updated", err),
          setloader(false),
          activateBottomErrorCard(true, 'Error occured while bank reconile. Please try again later.')
        )
      );
  };


  const formik2 = useFormik({
    initialValues: {
      // transactionNo: transactionNo,
      clearanceDate: "",
      clearStatus: "",
      reason: "",
      charge: "",
    },

    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      console.log("--2 Clear VAluee...", values);
      updateReconcile(values);

    },
    validationSchema: yup.object({
      clearanceDate: yup.mixed().required("Select from Date"),
      clearStatus: yup.string().required("Select Status"),

    }),
  });


  //=========get details by id=======
  const getDetailsFun = (id, mId) => {

    setloader(true)

    setcId(id)

    let body = {
      chequeId: id,
      workflowId: "200",

    }

    AxiosInterceptors.post(apiUpdateReconcillationDetails, body, ApiHeader())
      .then((res) => {
        if (res?.data?.status == true) {
          console.log('getting data by id with payload is => ', body, "\n and  response is => ", res)
          setloader(false)
          setcdata(res?.data?.data)
          openModal()
        }

        if (res?.data?.status == false) {
          console.log('error getting data by id with payload is => ', body, "\n and  response is => ", res)
          activateBottomErrorCard(true, 'Error occured while fetching bank reconcile details. Please try again later.')

          setloader(false)
        }

      })
      .catch((err) => {
        console.log('error getting data by id with payload is => ', body, "\n and  response is => ", err)
        activateBottomErrorCard(true, 'Error occured while fetching bank reconcile details. Please try again later.')

        setloader(false)
      })
  }

  const COLUMNS = [
    {
      Header: "S.No.",
      Cell: ({ row }) => <div>{row?.index + 1}</div>,
    },
    {
      Header: "Tran. No.",
      accessor: "tran_no",
      Cell: (props) => { return nullToNA(props?.value) }
    },
    {
      Header: "Tran. Date",
      accessor: "tran_date",
      Cell: (props) => { return nullToNA(props?.value) }
    },
    {
      Header: "Payment Mode",
      accessor: "payment_mode",
      Cell: (props) => { return nullToNA(props?.value) }
    },

    // {
    //   Header: "Tran. Type",
    //   accessor: "tran_type",
    //   Cell: (props) => {return nullToNA(props?.value)}
    // },

    {
      Header: "Cheque Date",
      accessor: "cheque_date",
      Cell: (props) => { return nullToNA(props?.value) }
    },

    {
      Header: "Cheque No.",
      accessor: "cheque_no",
      Cell: (props) => { return nullToNA(props?.value) }
    },
    {
      Header: "Bank Name",
      accessor: "bank_name",
      Cell: (props) => { return nullToNA(props?.value) }
    },
    {
      Header: "Branch Name",
      accessor: "branch_name",
      Cell: (props) => { return nullToNA(props?.value) }
    },

    {
      Header: "Tran. Amount",
      accessor: "amount",
      Cell: (props) => { return <>{nullToZero(parseFloat(props?.value)).toLocaleString("en-IN", { style: "currency", currency: "INR" })}</> }
    },

    {
      Header: "Clearance / Bounce Date",
      accessor: "clear_bounce_date",
      Cell: (props) => { return nullToNA(props?.value) }
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      Cell: (props) => { return nullToNA(props?.value) }
    },

    {
      Header: "TC Name",
      accessor: "user_name",
      Cell: (props) => { return nullToNA(props?.value) }
    },
    {
      Header: 'Status',
      Cell: ({ cell }) => <>
        {cell?.row?.original?.status == '1' && <span className="text-green-500 font-semibold">
          Clear
        </span>}
        {cell?.row?.original?.status == '2' && <span className="text-blue-500 font-semibold">
          Pending
        </span>}
        {cell?.row?.original?.status == '3' && <span className="text-red-500 font-semibold">
          Bounce
        </span>}
      </>
    },
    {
      Header: "_",
      Cell: ({ cell }) =>
        cell.row?.original?.status == "2" && (
          <span
            onClick={() => {
              getDetailsFun(cell.row?.original?.id, cell?.row?.original?.module_id);
            }}
            className={` px-2 py-1 rounded-lg shadow-lg border border-gray-300 bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer`}
          >
            <span className="font-semibold">Action</span>{" "}
          </span>
        ),
    },
  ];

  const activateBottomErrorCard = (state, msg) => {
    seterroMessage(msg)
    seterroState(state)

  }
  return (
    <>
      <ToastContainer autoClose={2000} />

      {loader && <BarLoader />}
      {erroState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={erroMessage} />}

      {/* FORM 1 -> For Search and Filter */}
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-12 space-x-2 bg-indigo-100 p-2 rounded-md">
          <div className="col-span-12">
            <h1 className=" text-xl font-semibold">
              {/* <img src="" className="inline w-10" /> Bank Reconciliation */}
            </h1>
          </div>

          <div className="form-group mb-1 md:mb-2 col-span-4 md:col-span-3 md:px-4">
            <label className="form-label inline-block mb-1  text-sm font-semibold">
              From Date<span className="text-red-500">*</span>
            </label>
            <input
              {...formik.getFieldProps("fromDate")}
              type="date"
              className="form-control block w-full px-1 py-1.5 text-sm md:text-base font-normal  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus: focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer"
            />

            <span className="text-red-600 absolute text-xs">
              {formik.touched.fromDate && formik.errors.fromDate
                ? formik.errors.fromDate
                : null}
            </span>
          </div>
          <div className="form-group mb-1 md:mb-2 col-span-4 md:col-span-3 md:px-4">
            <label className="form-label inline-block mb-1  text-sm font-semibold">
              To Date<span className="text-red-500">*</span>
            </label>
            <input
              {...formik.getFieldProps("toDate")}
              type="date"
              className="form-control block w-full px-1 py-1.5 text-sm md:text-base font-normal  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus: focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer"
            />

            <span className="text-red-600 absolute text-xs">
              {formik.touched.toDate && formik.errors.toDate
                ? formik.errors.toDate
                : null}
            </span>
          </div>


          <div className="form-group mb-1 md:mb-2 col-span-4 md:col-span-3 md:px-4">
            <label className="form-label inline-block mb-1  text-sm font-semibold">
              Payment Mode<span className="text-red-500">*</span>
            </label>
            <select
              {...formik.getFieldProps("paymentMode")}
              className="form-control block w-full px-3 py-1.5 text-base font-normal  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus: focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer"
            >
              <option value="">All</option>
              <option value="CHEQUE">Cheque</option>
              <option value="DD">DD</option>
              <option value="NEFT">NEFT</option>
            </select>
          </div>
          <div className="form-group mb-1 md:mb-2 col-span-4 md:col-span-3 md:px-4">
            <label className="form-label inline-block mb-1  text-sm font-semibold">
              Verfication Type
            </label>
            <select
              {...formik.getFieldProps("verificationType")}
              className="form-control block w-full px-3 py-1.5 text-base font-normal  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus: focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer"
            >
              <option>All</option>
              <option value="clear">Clear</option>
              <option value="bounce">Bounce</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="form-group mb-1 md:mb-2 col-span-4 md:col-span-3 md:px-4">
            <label className="form-label inline-block mb-1  text-sm font-semibold">
              Cheque/DD no.
            </label>
            <input
              {...formik.getFieldProps("cheque_dd_no")}
              type="text"
              className="form-control block w-full px-3 py-1.5 text-base font-normal  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus: focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
            />

            <span className="text-red-600 absolute text-xs">
              {formik.touched.cheque_dd_no && formik.errors.cheque_dd_no
                ? formik.errors.cheque_dd_no
                : null}
            </span>
          </div>

          <div className="form-group mb-1 md:mb-2 col-span-4 md:col-span-3 md:px-4">
            {
              <button
                type="submit"
                className="px-10 text-base py-1.5 mt-7 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 rounded-md hover:shadow-lg"
              >
                Search
              </button>
            }
          </div>
        </div>
      </form>

      <div className="border-b mx-10 my-5"></div>
      <div className="p-5">

        {filteredData?.length > 0 ?
          <div className="bg-white p-4">
            <ListTable columns={COLUMNS} dataList={filteredData} />
          </div>
          :
          <p className="text-center font-semibold text-red-500"> No data Found!</p>
        }
      </div>

      {/* Model Start */}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {/* FORM 2 ->In Popup For Reconcile */}

        <div className="bg-sky-200 rounded-lg shadow-xl border-2 border-gray-50 sm:w-[50vw] w-[100vw] p-4 text-sm">
          <div className="grid grid-cols-12">

            <div className="col-span-12 sm:col-span-6 grid grid-cols-12 items-center mb-1">
              <div className="col-span-6">Cheque No.</div>
              <div className="col-span-6 font-semibold">{nullToNA(cdata?.cheque_no)}</div>
            </div>
            <div className="col-span-12 sm:col-span-6 grid grid-cols-12 items-center mb-1">
              <div className="col-span-6">Cheque Date</div>
              <div className="col-span-6 font-semibold">{nullToNA(cdata?.cheque_date)}</div>
            </div>
            <div className="col-span-12 sm:col-span-6 grid grid-cols-12 items-center mb-1">
              <div className="col-span-6">Bank Name</div>
              <div className="col-span-6 font-semibold">{nullToNA(cdata?.bank_name)}</div>
            </div>
            <div className="col-span-12 sm:col-span-6 grid grid-cols-12 items-center mb-1">
              <div className="col-span-6">Branch Name</div>
              <div className="col-span-6 font-semibold">{nullToNA(cdata?.branch_name)}</div>
            </div>

          </div>

          <form onSubmit={formik2.handleSubmit} onChange={formik2.handleChange} className="grid-cols-12 grid gap-y-2 sm:gap-x-10 mt-4">
            <div className="col-span-12 sm:col-span-6 grid grid-cols-12 items-center">
              <label className="col-span-6 inline-block mb-1  text-sm font-semibold">
                Status
              </label>
              <span className="col-span-6">
                <select
                  name="clearStatus"
                  onChange={formik2.handleChange}
                  value={formik2.values.clearStatus}
                  className="form-control block w-full px-3 py-1.5 text-base font-normal  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus: focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer"
                >
                  <option value="">--select--</option>
                  <option value="bounce">Bounce</option>
                  <option value="clear">Clear</option>
                </select>
                <span className="text-red-600 absolute text-xs">
                  {formik2.touched.clearStatus && formik2.errors.clearStatus
                    ? formik2.errors.clearStatus
                    : null}
                </span>
              </span>
            </div>

            <div className="col-span-12 sm:col-span-6 grid grid-cols-12 items-center">
              <label className="col-span-6 inline-block mb-1  text-sm font-semibold">
                Clearance Date
              </label>
              <span className="col-span-6">
                <input
                  onChange={formik2.handleChange}
                  value={formik2.values.clearanceDate}
                  name="clearanceDate"
                  type="date"
                  className="w-full form-control block w-fullpx-1 py-1.5 px-2 text-sm md:text-base font-normal  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus: focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer"
                />

                <span className="text-red-600 absolute text-xs">
                  {formik2.touched.clearanceDate && formik2.errors.clearanceDate
                    ? formik2.errors.clearanceDate
                    : null}
                </span>
              </span>
            </div>

            {formik2.values.clearStatus == "bounce" && (
              <div className="col-span-12 sm:col-span-6 grid grid-cols-12 items-center">
                <label className="col-span-6 inline-block mb-1  text-sm font-semibold">
                  Reason
                </label>
                <span className="col-span-6">
                  <select
                    onChange={formik2.handleChange}
                    value={formik2.values.reason}
                    name="reason"
                    className="form-control block w-full px-3 py-1.5 text-base font-normal  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus: focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer"
                  >
                    <option value="">--select--</option>
                    <option value="Insufficient funds">Insufficient funds</option>
                    <option value="Irregular signature">
                      Irregular signature
                    </option>
                    <option value="Stale and post dated cheque">
                      Stale and post dated cheque
                    </option>
                    <option value="Alterations">Alterations</option>
                    <option value="Frozen account">Frozen account</option>
                    <option value="other">Other</option>
                  </select>
                  <span className="text-red-600  text-xs">
                    {formik2.touched.reason && formik2.errors.reason
                      ? formik2.errors.reason
                      : null}
                  </span>
                </span>
              </div>
            )}

            {formik2.values.clearStatus == "bounce" && (
              <div className="col-span-12 sm:col-span-6 grid grid-cols-12 items-center">
                <label className="col-span-6 inline-block mb-1  text-sm font-semibold">
                  Cancelation Charge
                </label>
                <span className="col-span-6">
                  <input
                    onChange={formik2.handleChange}
                    value={formik2.values.charge}
                    name="charge"
                    type="text"
                    className="form-control block w-full px-3 py-1.5 text-base font-normal  bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus: focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer"
                  />
                  <span className="text-red-600  text-xs">
                    {formik2.touched.charge && formik2.errors.charge
                      ? formik2.errors.charge
                      : null}
                  </span>
                </span>
              </div>
            )}

            <div className="col-span-12 w-full flex justify-between mt-4">

              <div
                onClick={closeModal}
                className="w-max cursor-pointer text-center bg-red-500 text-white px-4 py-1 rounded-md shadow-lg transition ease-in-out hover:bg-red-700"
              >
                Close
              </div>

              <button
                type="submit"
                className="text-center bg-blue-500 text-white px-4 py-1 rounded-md shadow-lg transition ease-in-out hover:bg-blue-700"
              >
                Submit
              </button>

            </div>
          </form>

        </div>
      </Modal>
      <div className="h-[20vh]"></div>
    </>
  );
}

export default BankReconciliation
