import React, { useRef } from 'react'
// import ReactToPrint from 'react-to-print-advanced'
// import ComponentToPrint from './SelfApprovalForm';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ApiHeader from '@/Components/api/ApiHeader';
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';
import useSetTitle from '@/Components/Common/useSetTitle';
import RigLIcenseReceipt from './RigLicenseReceipt';
import ReactToPrint from 'react-to-print';
import PetRegAPIList from '@/Components/api/PetRegAPIList';

function RigLIcenseReceiptEntry() {

    const { id, workflowId } = useParams()
    console.log("param transcation id ..", id)
    console.log("param wrkflow id ..", workflowId)
    const { api_PetApproveViewApplication, header, api_RigUploadedDoc } = PetRegAPIList();
    const componentRef = useRef();
    const [paymentData, setpaymentData] = useState();
    const [show, setshow] = useState(false)

    useSetTitle('Payment Receipt')
    useEffect(() => {
        fetchPaymentData();
    }, [])

    const fetchPaymentData = () => {
        const requestBody = {
            registrationId: id, 
            // workflowId: workflowId,
        }

        console.log('before fetch payment receipt....', requestBody)
        AxiosInterceptors.post(`${api_PetApproveViewApplication}`, requestBody, ApiHeader())
            .then((response) => {
                console.log("Approval letter details", response);
                if (response.data.status) {
                    setpaymentData(response.data.data); 
                } else {
                    ;
                }
            })
            .catch((error) => {

                console.log(error);
            })
    }

    console.log("payment data", paymentData)

    return (
        <>
            <div className='px:0 md:px-[10rem] text-left '>
                <ReactToPrint
                    trigger={() => <button className="mt-4 ml-8  px-6 py-1 text-center bg-sky-400 text-white font-medium text-sm ">print</button>}
                    content={() => componentRef.current}
                />
                <RigLIcenseReceipt ref={componentRef} licenceData={paymentData} />
            </div>
        </>
    )
}


export default RigLIcenseReceiptEntry
