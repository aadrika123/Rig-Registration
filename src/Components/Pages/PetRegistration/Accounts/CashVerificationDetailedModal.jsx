import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { CgClose } from 'react-icons/cg';
import axios from 'axios';
import { useState } from 'react';
// import ApiHeader from "../../ApiList/ApiHeader";
// import WaterTankerApiList from 'src/Pages/WaterTankerApiList';
import Popup from 'reactjs-popup';
import { toast, ToastContainer } from 'react-toastify';
// import useSetTitle from "../../GlobalData/useSetTitle";
// import BarLoader from '../../Common/BarLoader';
// import BottomErrorCard from '../../Common/BottomErrorCard';
// import { indianAmount, nullToNA, nullToZero } from '../../PowerUps/PowerupFunctions';
import { useNavigate } from 'react-router-dom';
import ApiHeader2 from '@/Components/api/ApiHeader2';
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';
import useSetTitle from '@/Components/Common/useSetTitle';
import BarLoader from '@/Components/Common/Loaders/BarLoader';
import BottomErrorCard from '@/Components/Common/BottomErrorCard';
import { indianAmount, nullToNA, nullToZero } from '@/Components/Common/PowerupFunctions';
import PetRegAPIList from '@/Components/api/PetRegAPIList';
import ApiHeader from '@/Components/api/ApiHeader';


const customStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflowY: "scroll"
    },
    content: {
        top: '60%',
        left: '55%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'transparent',
        border: 'none',
        height: "maxHeight"
    },
};

function CashVerificationDetailedModal(props) {

    useSetTitle('Cash Verification')

    const navigate = useNavigate()
    const { api_collectionReport, api_cashVerificationDtls, api_cashVerificationFinal, editChequeDtls } = PetRegAPIList()
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [fetchedData, setFetchedData] = useState()
    const [tradeSeleteAll, setTradeSeleteAll] = useState(false)
    const [isLoading2, setisLoading2] = useState(false);
    const [erroState, seterroState] = useState(false);
    const [erroMessage, seterroMessage] = useState(null);
    const [mode, setmode] = useState(['cash', 'cheque', 'dd'])
    const [propAllCheck, setPropAllCheck] = useState(false)
    const [allTest, setAllTest] = useState([])
    const [propValue, setPropValue] = useState([])
    const [waterAllCheck, setWaterAllCheck] = useState(false)
    const [waterValue, setWaterValue] = useState([])
    const [modalType, setmodalType] = useState('')
    const [updationData, setUpdationData] = useState(null)
    const [action, setAction] = useState(false)
    const cNo = useRef()
    const bName = useRef()
    const userId = props?.data?.id;
    const date = props?.data?.date;

    console.log('cash verification data => ', props?.data)
    console.log('cash updationData data => ', updationData)

    //Fetch data
    useEffect(() => {
        if (!props || !props.data) return;

        setisLoading2(true)

        const payload = {
            "date": props?.data?.date,
            "userId": props?.data?.user_id
        };

        let url;

        url = api_cashVerificationDtls


        AxiosInterceptors.post(url, payload, ApiHeader())
            .then((res) => {
                console.log("response of te data in modal", res)
                setFetchedData(res?.data?.data)
            })
            .catch((err) => {
                console.log("Error while tc list data in modal", err)
                activateBottomErrorCard(true, 'Some error occured. Please try again later.')

            })
            .finally(() => setisLoading2(false));
    }, [props?.data]);

    console.log('getting data in cash verification modal => ', props?.data)

    function openModal() {
        setIsOpen(true);
    }

    useEffect(() => {
        if (props.openAddPopUP > 0)
            setIsOpen(true);
    }, [props?.openAddPopUP])


    function afterOpenModal() {
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
        // props.refetchList();
        setAllTest([])
    }
    useEffect(() => {
        if (mode?.length == 0) {
            setmode(['cash', 'cheque', 'dd', 'neft'])
        }
    }, [mode])

    const handleCheckBox = (e, module) => {
        if (e.target.checked == true) {
            setAllTest([...allTest, { "id": e.target.value, "module": module }])
        }
        if (e.target.checked == false) {
            for (var i = 0; i < allTest.length; i++) {
                if (allTest[i] === e.target.value) {
                    allTest.splice(i, 1);
                }
            }
        }
    }

    const handleSelect = (e) => {
        const name = e.target.name
        const checked = e.target.checked
        const value = e.target.value

        if (name == 'rigAll') {
            setPropAllCheck(checked)

            if (checked) {
                const idArray = fetchedData?.tranDtl?.map((elem) => elem?.id);
                setPropValue(idArray);

            } else {
                setPropValue([])
            }
        }

        if (name == 'rig') {
            if (checked) {
                setPropValue(prev => [...prev, value])
            } else if (!checked && propAllCheck != true) {
                let data = propValue?.filter(item => item != value)
                setPropValue(data)
            }
        }

    }

    console.log("object", fetchedData)

    const handleVerifyBtn = () => {
        // const payload = {
        const formData = new FormData();
        formData.append('date', fetchedData?.date);
        formData.append('tcId', fetchedData?.tcId);

        // Append each id individually
        // propValue.forEach(id => formData.append('id', id));

        for (let i = 0; i < propValue.length; i++) {
            formData.append(`id[${i}]`, propValue[i])
            // formData.append(id[${i}], id[i]);
        }

        // }

        AxiosInterceptors.post(api_cashVerificationFinal, formData, ApiHeader2())
            .then((res) => {
                console.log("Data After Verification", res)
                // toast.success('Verified Successfully !!!')
                closeModal()
                props?.searchData()
            })
            .catch((err) => {
                console.log("Exception While Verifying Data", err)
                activateBottomErrorCard(true, 'Some error occured. Please try again later.')
            })

        console.log("Verify Data", formData)
    }

    const tradeMainOnchage = (e) => {
        console.log(e.target.checked)
        setTradeSeleteAll(e.target.checked)
    }
    const handleEdit = (item) => {
        setmodalType('edit')
        setUpdationData(item)
        setAction(true)
    }

    const activateBottomErrorCard = (state, msg) => {
        seterroMessage(msg)
        seterroState(state)

    }
    const getModeArray = (data) => {
        const paymentModeList = data?.map((elem) => elem?.payment_mode);
        return paymentModeList
    }

    console.log("object", updationData?.cheque_no)
    console.log("object", updationData?.bank_name)
    console.log("object", updationData?.id)
    const handlUpdateBtn = () => {

        setisLoading2(true)

        const payload = {
            "chequeNo": updationData?.cheque_no,
            "bankName": updationData?.bank_name,
            "id": updationData?.id,
            "moduleId": updationData?.module_id
        }

        AxiosInterceptors.post(editChequeDtls, payload, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    console.log("Data After updation", res)
                    toast.success('Updated Successfully !!!')
                    getAllData()
                } else {
                    activateBottomErrorCard(true, res?.data?.message)
                }
            })
            .catch((err) => {
                console.log("Exception While Verifying Data", err)
                activateBottomErrorCard(true, 'Some error occured. Please try again later.')
            })
            .finally(() => {
                setisLoading2(false)
                setAction(false)
            })

        console.log("Verify Data", payload)
    }
    const getAllData = () => {
        const payload = {
            "date": props?.data?.date,
            "userId": props?.data?.user_id
        };

        AxiosInterceptors.post(api_cashVerificationDtls, payload, ApiHeader())
            .then((res) => {
                setFetchedData(res?.data?.data);
            })
            .catch((err) => {
                activateBottomErrorCard(true, 'Some error occurred. Please try again later.');
            });
    };
    return (
        <>
            {isLoading2 && <BarLoader />}
            {erroState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={erroMessage} />}
            {/* <ToastContainer autoClose={2000} /> */}
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                className="absolute left-1/4 h-screen w-2/3 flex justify-center items-center"
            >
                <div className=' w-[90vw] md:w-[80vw]'>
                    {!action && <div className=" bg-white rounded-lg shadow-xl border-2 border-gray-50 p-2">
                        <div className=''>

                            <div className='float-right'>
                                <div onClick={closeModal} className='hover:bg-gray-100 rounded-full w-5 cursor-pointer mr-3'>  <CgClose size={20} /></div>
                            </div>
                            <div className='float-left'>
                                <h1 className='mb-3 text-2xl ml-5 font-semibold'>Collection Details</h1>
                            </div>
                        </div>

                        <p className='border-b mt-10 mb-6 mx-5 border-gray-100'></p>

                        <div className='grid grid-cols-12 gap-2'>
                            <div className='col-span-4'>
                                <div className='grid grid-cols-2 bg-gray-50 shadow-md rounded  p-4'>
                                    <div className='col-span-1'>
                                        <p> Collector Name</p>
                                        <p> Transaction Date</p>
                                        <p> Total Amount</p>
                                        <p> Number of Transaction</p>
                                    </div>
                                    <div className='col-span-1 font-semibold'>
                                        <p className='uppercase'>: {nullToNA(fetchedData?.tcName)}</p>
                                        <p>: {nullToNA(fetchedData?.date)}</p>
                                        <p>: {indianAmount(fetchedData?.totalAmount)}</p>
                                        <p>: {nullToZero(fetchedData?.numberOfTransaction)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='col-span-8'>

                                <div className='flex flex-wrap-reverse m-0 gap-2'>
                                    <div className='bg-gray-50 shadow-md  p-6 m-2 rounded'>
                                        <p className="font-semibold text-3xl">{indianAmount(fetchedData?.Cash)}</p>
                                        <p className='text-lg font-semibold'>Cash</p>
                                    </div>
                                    <div className='bg-gray-50 shadow-md  p-6 m-2 rounded'>
                                        <p className="font-semibold text-3xl">{indianAmount(fetchedData?.Cheque)}</p>
                                        <p className='text-lg font-semibold'>Cheque</p>
                                    </div>
                                    <div className='bg-gray-50 shadow-md  p-6 m-2 rounded'>
                                        <p className="font-semibold text-3xl">{indianAmount(fetchedData?.DD)}</p>
                                        <p className='text-lg font-semibold'>DD</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <p className='border-b mt-5 mb-6 mx-5 border-gray-100'></p>




                        {console.log(fetchedData)}
                        {console.log(props?.reportType)}


                        {fetchedData?.tranDtl?.length > 0 && <div className=' overflow-auto'>
                            <p className='uppercase font-bold'> {props?.reportType == '1' && <input type="checkbox" name="rigAll" id="" onChange={handleSelect} />} Rig Payment</p>
                            <table className="table-auto w-full">
                                <thead className="bg-gray-100 border-t border-l border-r text-left">
                                    <tr>
                                        {props?.reportType == '1' && <th className="px-2 py-2 border-r"></th>}
                                        <th className="px-2 py-2 border-r">#</th>
                                        <th className="px-2 py-2 border-r">Transaction No</th>
                                        <th className="px-2 py-2 border-r">Payment Mode</th>
                                        {/* <th className="px-2 py-2 border-r">Application No</th> */}
                                        <th className="px-2 py-2 border-r">Check/DD No</th>
                                        <th className="px-2 py-2 border-r">Bank Name</th>
                                        <th className="px-2 py-2 border-r">Paid Amount</th>
                                        <th className="px-2 py-2 border-r">Payment Date</th>
                                        {props?.reportType == '1' && <th className="px-2 py-2 border-r">Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        fetchedData?.tranDtl?.filter(item => getModeArray(fetchedData?.tranDtl).some((pm) => mode.includes(pm.toLowerCase())))?.map((item, i) => (
                                            <tr key={i}>
                                                {props?.reportType == '1' && <td className="border border-gray-200 px-2 py-2 font-medium"><input type="checkbox" name="rig" id="" checked={propAllCheck ? true : null} value={item?.id} onChange={handleSelect} /></td>}
                                                <td className="border border-gray-200 px-2 py-2 font-medium">{i + 1}</td>
                                                <td className="border border-gray-200 px-2 py-2 font-medium">{nullToNA(item?.tran_no)}</td>
                                                <td className="border border-gray-200 px-2 py-2 font-medium">{nullToNA(item?.payment_mode)}</td>
                                                {/* <td className="border border-gray-200 px-2 py-2 font-medium">{nullToNA(item?.application_no)}</td> */}
                                                <td className="border border-gray-200 px-2 py-2 font-medium">{nullToNA(item?.cheque_no)}</td>
                                                <td className="border border-gray-200 px-2 py-2 font-medium">{nullToNA(item?.bank_name)}</td>
                                                <td className="border border-gray-200 px-2 py-2 font-medium">{indianAmount(item?.amount)}</td>
                                                <td className="border border-gray-200 px-2 py-2 font-medium">{nullToNA(item?.tran_date)}</td>
                                                {props?.reportType == '1' && <td className="border border-gray-200 px-2 py-2 font-medium">{item?.payment_mode != 'CASH' ? <button className='px-4 py-1 border-indigo-500 text-indigo-500 border hover:bg-indigo-500 hover:text-white' onClick={() => handleEdit(item)}>Edit</button> : 'No Action'}</td>}
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>}
                        <p className='py-2'></p>




                        {/*========= rig END =============*/}

                        <div className='my-5'>
                            <div className="flex justify-center pt-3 space-x-3">
                                {props?.reportType == '1' &&
                                    <Popup
                                        trigger={
                                            <button className="w-full px-10 rounded bg-indigo-600 py-2 text-white sm:w-auto"> Verify </button>
                                        }
                                        modal
                                        nested
                                    >
                                        {(close) => (
                                            <div className="h-screen w-screen flex-row justify-center items-center backdrop-blur-sm">
                                                <div className="flex flex-col justify-center h-max w-max absolute top-[40%] right-[40%] bg-indigo-50 px-4 py-2 rounde-md shadow-lg animate__animated animate__fadeInDown animate__faster">
                                                    <button className="close text-end text-lg" onClick={close}>
                                                        &times;
                                                    </button>
                                                    <div className="text-md">
                                                        Are you sure ?
                                                    </div>
                                                    <div className="flex justify-center items-center">
                                                        <button
                                                            className="bg-green-500 hover:bg-green-600 text-white shadow-md text-xs px-4 py-1 m-4 rounded-md"
                                                            onClick={() => {
                                                                close()
                                                                handleVerifyBtn()
                                                            }}
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            className="bg-red-500 hover:bg-red-600 text-white px-4 shadow-md text-xs py-1 m-4 rounded-md"
                                                            onClick={close}
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Popup>
                                }
                                <button onClick={closeModal} className="w-full px-10 rounded bg-red-600 py-2 text-white sm:w-auto"> Close </button>
                                {(!isLoading2 && fetchedData?.verifyStatus == true) && <button onClick={() => navigate(`/cashVerificationReceipt/${encodeURIComponent(fetchedData?.tranNo)}`)} className="w-full px-10 rounded bg-sky-600 py-2 text-white sm:w-auto"> Print </button>}
                            </div>

                        </div>


                    </div>
                    }
                    {action &&

                        <div className='my-5'>
                            <div className="flex justify-center pt-3 space-x-3">
                                {props?.reportType == '1' &&
                                    <div style={{ 'zIndex': 999 }} class="h-screen w-screen flex justify-center items-center backdrop-blur-sm">

                                        {modalType == 'verify' && <div className='bg-white w-max h-max rounded-md shadow-lg relative'>
                                            <button type="button" onClick={() => setAction(false)} class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center darks:hover:bg-gray-800 darks:hover:text-white" >
                                                <svg class="w-5 h-5" fill="currentColor" ><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                            </button>
                                            <div class="p-6 text-center">
                                                <div className='w-full flex h-10'> <span className='mx-auto'><FiAlertCircle size={30} /></span></div>
                                                <h3 class="mb-5 text-lg font-normal text-gray-500 darks:text-gray-400">Are you sure you ?</h3>
                                                <button type="button" className="cypress_button_logout text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 darks:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2" onClick={() => (handleVerifyBtn(), closeModal())}>
                                                    Yes, I'm sure
                                                </button>

                                            </div>
                                        </div>}

                                        {modalType == 'edit' &&
                                            <div className='bg-white w-max h-max rounded-md shadow-lg relative'>
                                                <button type="button" onClick={() => setAction(false)} class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center darks:hover:bg-gray-800 darks:hover:text-white" >
                                                    <svg class="w-5 h-5" fill="currentColor" ><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                                </button>
                                                <div class="p-6 text-center flex flex-col gap-y-2 flex-wrap">
                                                    <h1 className='w-full text-lg text-indigo-400 font-semibold border-b pb-1 mb-2'>Update Data</h1>
                                                    <div className='grid grid-cols-12 items-center'>
                                                        <label className='col-span-6 text-start' htmlFor="checkNo">Cheque/DD No.: </label>
                                                        <input ref={cNo} className='col-span-6 border focus:outline-none focus:shadow-lg shadow-md px-2 py-1' value={updationData?.cheque_no} onChange={(e) => setUpdationData({ ...updationData, cheque_no: e.target.value })} type="text" name="chequeNo" id="" />
                                                    </div>
                                                    <div className='grid grid-cols-12 items-center'>
                                                        <label className='col-span-6 text-start' htmlFor="checkNo">Bank Name: </label>
                                                        <input ref={bName} className='col-span-6 border focus:outline-none focus:shadow-lg shadow-md px-2 py-1' value={updationData?.bank_name} onChange={(e) => setUpdationData({ ...updationData, bank_name: e.target.value })} type="text" name="bankName" id="" />
                                                    </div>
                                                    <div className='w-full flex justify-center gap-2 mt-2'>
                                                        <button className=" px-4 text-sm rounded bg-green-500 hover:bg-green-600 py-1 text-white " onClick={() => handlUpdateBtn()}> Update </button>
                                                        <button onClick={() => setAction(false)} className=" px-4 text-sm rounded bg-indigo-400 hover:bg-indigo-500 py-1 text-white "> Close </button>
                                                    </div>
                                                </div>
                                            </div>}

                                    </div>

                                }
                            </div>

                        </div>}
                </div>

            </Modal>

        </>
    );
}

export default CashVerificationDetailedModal
