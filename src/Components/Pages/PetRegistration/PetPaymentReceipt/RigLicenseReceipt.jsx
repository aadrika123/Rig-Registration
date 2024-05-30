import React, { useState, useEffect } from 'react'
//  import QRCode from "react-qr-code";
//  import CitizenApplyApiList from '../../../../Components/CitizenApplyApiList';
import axios from 'axios'
import { AiFillPrinter } from 'react-icons/ai'
import { Link, useNavigate, useParams } from 'react-router-dom';
//  import NonBlockingLoader from '../NonBlockingLoader';
// import { useRef } from 'react';
// import { QrCode } from '@mui/icons-material';
// import BackButton from '../BackButton';
import { nullToNA } from '@/Components/Common/PowerupFunctions';
// import { nullToNA } from '../../../../Components/Common/PowerUps/PowerupFunctions';
import jharkhand from "../../../assets/logo1.png";
import { date } from 'yup';
import moment from 'moment';

class RigLIcenseReceipt extends React.Component {


    render() {

        console.log("paymentData...1", this.props?.paymentData)

        return (

            <>
                {/* <div className='relative transform rotate-[-40deg] top-[90%] left-[10%] max-w-fit'>
                    <p className='text-[6rem] text-gray-400 opacity-40 '>
                        {this.props.type}
                        
                    </p>
                </div> */}
                <div
                    className='border-2 font-Lato w-[40rem] p-3 mx-auto ml-20 mt-10 border-gray-700 ' id='printableArea'

                >
                    <div className='mx-auto border-2 border-dashed text-[12px]  border-red-700 bg-white text-red-700 overflow-auto' >
                        <div className=' text-justify font-poppins px-2'>
                            <div
                                className='  py-2 px-2 text-red-700 '
                            // styles={{
                            //     backgroundImage: `url(${this.props?.licenceData?.application?.ulb_logo
                            //         })`,
                            // }}

                            >

                                {/* <img src={logo} alt="" className='h-16 w-16 mx-auto' /> */}

                                <h1 className='font-bold text-center capitalize text-lg mt-8'>
                                    {this.props?.licenceData?.ulb_name} {" "}
                                </h1>
                                <h1 className='font-bold text-center capitalize text-lg'>
                                Rig Machine License {" "}
                                </h1>
                                {this.props?.licenceData?.application?.ulb_logo != "" ? (
                                    <img
                                        src={jharkhand}
                                        alt=''
                                        className=' w-72 h-72 absolute z-10 bg-transparent opacity-20 mt-[10rem] ml-40 rounded-full'
                                    />
                                ) : (
                                    <div className='w-72 h-72 absolute z-10 bg-transparent opacity-20 mt-[10rem] ml-40 rounded-full'>
                                        <svg
                                            id='logo-89'
                                            viewBox='0 0 40 40'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                class='ccustom'
                                                d='M39.9449 21.4998H32.8003C26.5594 21.4998 21.5003 26.559 21.5003 32.7998V39.9444C31.3502 39.214 39.2145 31.3497 39.9449 21.4998Z'
                                                fill='#775732'
                                            ></path>
                                            <path
                                                class='ccustom'
                                                d='M18.5003 39.9444V32.7998C18.5003 26.559 13.4411 21.4998 7.20026 21.4998H0.0556641C0.785998 31.3497 8.65036 39.214 18.5003 39.9444Z'
                                                fill='#775732'
                                            ></path>
                                            <path
                                                class='ccustom'
                                                d='M39.9449 18.4998C39.2145 8.64987 31.3502 0.78551 21.5003 0.0551758V7.19977C21.5003 13.4406 26.5594 18.4998 32.8003 18.4998H39.9449Z'
                                                fill='#775732'
                                            ></path>
                                            <path
                                                class='ccustom'
                                                d='M18.5003 0.0551758C8.65036 0.78551 0.785998 8.64987 0.0556641 18.4998H7.20026C13.4411 18.4998 18.5003 13.4406 18.5003 7.19977V0.0551758Z'
                                                fill='#775732'
                                            ></path>
                                            <path
                                                class='ccustom'
                                                d='M13.583 19.9998C16.3555 18.6145 18.615 16.355 20.0002 13.5825C21.3855 16.355 23.6449 18.6145 26.4175 19.9998C23.6449 21.385 21.3855 23.6445 20.0002 26.417C18.615 23.6445 16.3555 21.385 13.583 19.9998Z'
                                                fill='#CA9352'
                                            ></path>
                                        </svg>
                                        {/* <svg id="logo-15" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M24.5 12.75C24.5 18.9632 19.4632 24 13.25 24H2V12.75C2 6.53679 7.03679 1.5 13.25 1.5C19.4632 1.5 24.5 6.53679 24.5 12.75Z" class="ccustom" fill="#17CF97"></path> <path d="M24.5 35.25C24.5 29.0368 29.5368 24 35.75 24H47V35.25C47 41.4632 41.9632 46.5 35.75 46.5C29.5368 46.5 24.5 41.4632 24.5 35.25Z" class="ccustom" fill="#17CF97"></path> <path d="M2 35.25C2 41.4632 7.03679 46.5 13.25 46.5H24.5V35.25C24.5 29.0368 19.4632 24 13.25 24C7.03679 24 2 29.0368 2 35.25Z" class="ccustom" fill="#17CF97"></path> <path d="M47 12.75C47 6.53679 41.9632 1.5 35.75 1.5H24.5V12.75C24.5 18.9632 29.5368 24 35.75 24C41.9632 24 47 18.9632 47 12.75Z" class="ccustom" fill="#17CF97"></path> </svg> */}
                                    </div>
                                )}

                                <h1 className='font-bold text-center uppercase'>
                                    {this.props?.licenceData?.application?.ulb_name}{" "}
                                </h1>
                                {/* <h1 className='font-bold text-center'>
                                    {" "}
                                    Municipal Rig Machine License{" "}
                                </h1> */}
                                <div className='mx-auto text-center'>
                                    <p className=' py-1 my-1'>
                                        {" "}
                                        (This Certificate relates to Under Jharkhand
                                        Municipal Act of 2011){" "}
                                    </p>
                                </div>
                                <div className='w-full px-1.5 mt-4 '>
                                    {/* license details */}
                                    <div className='grid grid-cols-3 h-auto capitalize'>
                                        <div className='col-span-2 '>
                                            <p className=' font-semibold whitespace-nowrap'>
                                                Municipal Rig Machine Registration :{" "}
                                                <span className='font-normal leading-6'>
                                                    {this.props?.licenceData?.registration_id}{" "}
                                                </span>
                                               
                                            </p>
                                            

                                           
                                            <p className=' font-semibold'>
                                            Date of approval :{" "}
                                                <span className='font-normal leading-6'>
                                                    {/* {this.props?.licenceData?.approve_date}{" "} */}
                                                    {moment(this.props?.licenceData?.approve_date, 'YYYY-MM-DD').format('DD-MM-YYYY')}
                                                </span>{" "}
                                            </p>
                                            <p className=' font-semibold'>
                                                Validity of Municipal Rig License :{" "}
                                                <span className='font-normal  leading-6'>
                                                    {moment(this.props?.licenceData?.approve_date, 'YYYY-MM-DD').format('DD-MM-YYYY')} to{" "}
                                                    {moment(this.props?.licenceData?.approve_end_date, 'YYYY-MM-DD').format('DD-MM-YYYY')}{" "}
                                                </span>{" "}
                                            </p>

                                           
                                            <p className=' font-semibold'>
                                                Licence Owner Name :{" "}
                                                <span className='font-normal  leading-6'>
                                                    {" "}
                                                    {this.props?.licenceData?.applicant_name}
                                                </span>
                                            </p>
                                        </div>
                                        <div className=' mx-auto mt-1'>
                                          
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-3 w-full capitalize'>
                                        <div className='col-span-2'>

                                            <p className=' font-semibold'>
                                                Vehicle Registration No. :{" "}
                                                <span className='font-normal '>
                                                    {" "}
                                                    {
                                                        this.props?.licenceData?.vehicle_no
                                                    }{" "}

                                                </span>
                                            </p>

                                        </div>
                                        <div className='col-span-1 pb-2 -ml-6 mt-2'>

                                            <p className=' font-semibold whitespace-nowrap'>
                                                Application No :{" "}
                                                <span className='font-normal text-[12px] whitespace-nowrap'>
                                                    {" "}
                                                    {this.props?.licenceData?.application_no}
                                                </span>
                                            </p>

                                            <p className=' font-semibold'>
                                                Date of Application:
                                                <span className='font-normal '>
                                                    {moment(this.props?.licenceData?.application_apply_date, 'YYYY-MM-DD').format('DD-MM-YYYY')}{" "}
                                                </span>
                                            </p>

                                            <p className=' font-semibold'>
                                                Mobile No :{" "}
                                                <span className='font-normal '>
                                                    {" "}
                                                    {this.props?.licenceData?.mobile_no}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Owner Details */}
                                <div className='grid grid-cols-1 w-full mt-4 text-[12px]'>
                                    <div>   
                                        This is to declare that
                                        <span className='font-semibold capitalize'>
                                            {" "}
                                            "RIG MACHINE"
                                        </span>
                                        &nbsp;having registration licence number{" "}
                                        <span className='font-semibold capitalize'>
                                            {" "}
                                            {
                                                this.props?.licenceData?.registration_id
                                            }{" "}
                                        </span>{" "}
                                       
                                        for <b>4 Inches </b> drilling  has been allocated to{" "}
                                        <span className='font-semibold capitalize'>
                                            {this.props?.licenceData?.applicant_name}{" "}
                                        </span>
                                        as mentioned in Jharkhand Municipal Act
                                        2011 in the regime of {this.props?.licenceData?.ulb_name}. The validity of this
                                        licence is for TWO YEARS along with following terms and
                                        conditions:-
                                    </div>
                                </div>

                                {/* reciept footer */}
                                <div className=' mt-4 px-1  text-justify text-sm'>
                                    <p className='py-0.5'>
                                        1. Business will run according to license issued.{" "}
                                    </p>
                                   
                                    <p className='py-0.5'>
                                        2. Prior information to local body regarding winding
                                        up/closer of business is necessary.{" "}
                                    </p>
                                    <p className='py-0.5'>
                                        3. Application for renewal of license is necessary one month
                                        before expiry of license.
                                    </p>
                                    <p className='py-0.5'>
                                        4. In the case of delay, penalty will be levied according to
                                        section 459 of Jharkhand Municipal Act 2011.
                                    </p>
                                    
                                </div>
                                <div className='mt-44'> 

                                </div>
                                <div className=' mt-4 mb-4 px-2  text-justify text-red-700'>
                                    <p>
                                        For More Details Please Visit : For Details Please Visit :{" "}
                                        <span className='lowercase'>
                                            {this.props?.licenceData?.application?.ulb_parent_website}
                                        </span>
                                    </p>
                                    <p>
                                        OR Call us at{" "}
                                        <span className='lowercase'>
                                            {this.props?.licenceData?.application?.ulb_mobile_no} OR{" "}
                                            {this.props?.licenceData?.application?.ulb_toll_free_no}
                                        </span>
                                    </p>

                                    <p>
                                        Note : This is a computer generated License. This License
                                        does not require a physical signature.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>

        )
    }
}

export default RigLIcenseReceipt
