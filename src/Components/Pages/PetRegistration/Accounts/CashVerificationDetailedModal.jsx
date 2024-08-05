import React, { useEffect } from 'react';
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
        height: "maxHeight" //or maxHeight  / 600px 
    },
};

function CashVerificationDetailedModal(props) {

    useSetTitle('Cash Verification')

    const navigate = useNavigate()
    // const { api_verifiedTcCollection, api_cashVerificationDtls, api_verifyCashVerificationDtls } = WaterTankerApiList()
    const { api_collectionReport, } = PetRegAPIList()
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

    const userId = props?.data?.id;
    const date = props?.data?.date;

    console.log('cash verification data => ', props?.data)

    //Fetch data
    useEffect(() => {
        if (!props || !props.data) return;

        setisLoading2(true)

        const payload = {
            "date": props?.data?.date,
            "userId": props?.data?.id
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

    //     console.log("fetchedData in modal", fetchedData)

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

        if (name == 'wtankAll') {
            setPropAllCheck(checked)

            if (checked) {
                const idArray = fetchedData?.wtank?.map((elem) => elem?.id);
                setPropValue(idArray);
            } else {
                setPropValue([])
            }
        }

        if (name == 'wtank') {
            if (checked) {
                setPropValue(prev => [...prev, value])
            } else if (!checked && propAllCheck != true) {
                let data = propValue?.filter(item => item != value)
                setPropValue(data)
            }
        }

        if (name == 'stankAll') {
            setWaterAllCheck(checked)

            if (checked) {
                const idArray = fetchedData?.stank?.map((elem) => elem?.id);
                setWaterValue(idArray);
            } else {
                setWaterValue([])
            }
        }

        if (name == 'stank') {
            if (checked) {
                setWaterValue(prev => [...prev, value])
            } else if (!checked && waterAllCheck != true) {
                let data = waterValue?.filter(item => item != value)
                setWaterValue(data)
            }
        }



    }



    const handleVerifyBtn = () => {
        // console.log("Verify Button Clicked", allTest)
        const payload = {
            // stank: fetchedData.stank,
            wtank: fetchedData.wtank,
            // trade: fetchedData.trade,
        }

        AxiosInterceptors.post(api_verifyCashVerificationDtls, payload, ApiHeader2())
            .then((res) => {
                console.log("Data After Verification", res)
                toast.success('Verified Successfully !!!')
                closeModal()
                props?.searchData()
            })
            .catch((err) => {
                console.log("Exception While Verifying Data", err)
                activateBottomErrorCard(true, 'Some error occured. Please try again later.')
            })

        console.log("Verify Data", payload)
    }

    const tradeMainOnchage = (e) => {
        console.log(e.target.checked)
        setTradeSeleteAll(e.target.checked)
    }

    const activateBottomErrorCard = (state, msg) => {
        seterroMessage(msg)
        seterroState(state)

    }
    const getModeArray = (data) => {
        const paymentModeList = data?.map((elem) => elem?.payment_mode);
        return paymentModeList
    }

    return (
        <>
            {isLoading2 && <BarLoader />}
            {erroState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={erroMessage} />}
            <ToastContainer autoClose={2000} />
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className=' '>
                    <div className=" bg-white rounded-lg shadow-xl border-2 border-gray-50 p-2">
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
                                        <p className='uppercase'>: {nullToNA(fetchedData?.collectorName)}</p>
                                        <p>: {nullToNA(fetchedData?.date)}</p>
                                        <p>: {indianAmount(fetchedData?.WtotalAmount)}</p>
                                        <p>: {nullToZero(fetchedData?.numberOfTransaction)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='col-span-8'>

                                <div className='flex flex-wrap-reverse m-0 gap-2'>
                                    <div className='bg-gray-50 shadow-md  p-6 m-2 rounded'>
                                        <p className="font-semibold text-3xl">{indianAmount(fetchedData?.WCash)}</p>
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







                        {fetchedData?.wtank?.length > 0 && <div className=' overflow-auto'>
                            <p className='uppercase font-bold'> {props?.reportType == '1' && <input type="checkbox" name="wtankAll" id="" onChange={handleSelect} />} Water Tank Payment</p>
                            <table className="table-auto w-full">
                                <thead className="bg-gray-100 border-t border-l border-r text-left">
                                    <tr>
                                        {props?.reportType == '1' && <th className="px-2 py-2 border-r"></th>}
                                        <th className="px-2 py-2 border-r">#</th>
                                        <th className="px-2 py-2 border-r">Transaction No</th>
                                        <th className="px-2 py-2 border-r">Payment Mode</th>
                                        <th className="px-2 py-2 border-r">Application No</th>
                                        <th className="px-2 py-2 border-r">Check/DD No</th>
                                        <th className="px-2 py-2 border-r">Bank Name</th>
                                        <th className="px-2 py-2 border-r">Paid Amount</th>
                                        <th className="px-2 py-2 border-r">Payment Date</th>
                                        {props?.reportType == '1' && <th className="px-2 py-2 border-r">Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        fetchedData?.wtank?.filter(item => getModeArray(fetchedData?.wtank).some((pm) => mode.includes(pm.toLowerCase())))?.map((item, i) => (
                                            <tr key={i}>
                                                {props?.reportType == '1' && <td className="border border-gray-200 px-2 py-2 font-medium"><input type="checkbox" name="wtank" id="" checked={propAllCheck ? true : null} value={item?.id} onChange={handleSelect} /></td>}
                                                <td className="border border-gray-200 px-2 py-2 font-medium">{i + 1}</td>
                                                <td className="border border-gray-200 px-2 py-2 font-medium">{nullToNA(item?.tran_no)}</td>
                                                <td className="border border-gray-200 px-2 py-2 font-medium">{nullToNA(item?.payment_mode)}</td>
                                                <td className="border border-gray-200 px-2 py-2 font-medium">{nullToNA(item?.application_no)}</td>
                                                <td className="border border-gray-200 px-2 py-2 font-medium">{nullToNA(item?.cheque_dd_no)}</td>
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

                       


                        {/*========= Water END =============*/}

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
                </div>

            </Modal>
        </>
    );
}

export default CashVerificationDetailedModal
