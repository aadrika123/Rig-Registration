import React from 'react'
import submit from "../../../assets/submit.png"
import useSetTitle from '@/Components/Common/useSetTitle'
import { useLocation, useNavigate } from 'react-router-dom';

function SuccessfulSubmitModal(props) {
    // useSetTitle = ("Successful")
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/home');
    };
    const location = useLocation();

    // The response data will be available in location.state
    const responseScreenData = location.state;

    // You can now use responseScreenData as needed
    console.log('Received response screen data:', responseScreenData);

    console.log("object", responseScreenData?.data?.applicationNo)
    return (
        <div
            class={`border border-gray-200 shadow-md shadow-gray-300 rounded-lg  bg-white md:w-2/4 mx-auto max-sm:m-2 flex flex-col p-2 `}
        >
            <div class='relative overflow-hidden'>
                <div class='absolute inset-0 hover:bg-white opacity-0 transition duration-700 hover:opacity-10'></div>
                <img
                    className='max-w-full h-auto mx-auto animate-wiggle p-12 '
                    src={submit}
                    alt='alt title'
                />
            </div>
            <div class=' flex-1'>
                <div class='mb-2'>
                    <h3 class='text-2xl  text-center mb-3 text-green-600 font-openSans font-semibold'>
                        Application Submitted Successfully
                    </h3>
                    <h3 class='text-xl  text-center mb-3 text-gray-800 font-openSans font-semibold '>
                        Application no. - {responseScreenData?.data?.applicationNo}
                    </h3>
                </div>
            </div>
            <div class=' flex-1'>
                <div class=' text-center mt-8 mb-16 flex justify-center items-center gap-20'>

                    <button
                        className={`bg-[#1A4D8C] text-sm px-8 py-2 text-white  rounded leading-5 shadow-lg`}
                        onClick={handleClick}
                    >
                        Home
                    </button>
                    {/* <button
                        className={`bg-[#1A4D8C] text-sm px-8 py-2 text-white  rounded leading-5 shadow-lg`}
                    //   onClick={handlePayment}
                    >
                        View 
                    </button> */}

                </div>
            </div>
        </div>
    )
}

export default SuccessfulSubmitModal
