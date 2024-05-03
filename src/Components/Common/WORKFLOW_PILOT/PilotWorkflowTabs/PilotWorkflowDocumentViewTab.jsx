//////////////////////////////////////////////////////////////////////////////////////
//    Author - R U Bharti
//    Version - 1.0
//    Date - 26th Nov, 2022
//    Revision - 1
//    Project - JUIDCO
/////////////////////////////////////////////////////////////////////////////////////////////

import { useState, useEffect } from 'react'
import PilotWorkflowDocumentRow from "./PilotWorkflowDocumentRow"
import Modal from 'react-modal';
import ApiHeader from '@/Components/api/ApiHeader'
import axios from 'axios';
import { ImCross } from 'react-icons/im';
import BarLoader from '@/Components/Common/Loaders/BarLoader';
import { RxCross2 } from 'react-icons/rx'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: 'none'
    },
};
Modal.setAppElement('#root');
function PropertySafDocumentView(props) {


    const [docList, setDocList] = useState()
    const [loader, setloader] = useState(false);
    const [docType, setdocType] = useState('')

    useEffect(() => {
        setloader(true)
        console.log("before document fetch ", props?.id)
        let requestBody = {
            applicationId: props?.id
        }
        axios[props?.api?.api_documentList?.method](props?.api?.api_documentList?.url, requestBody, ApiHeader())
            .then((res) => {
                console.log("document list at pilotworkflowdocumentview ", res)
                if (res?.data?.status) {
                    setDocList(res?.data?.data)
                } else {
                    props?.activateBottomErrorCard(true, res?.data?.message)
                }
                setloader(false)
            })
            .catch((err) => {
                console.log("error at pilotworkflowdocumentview ", err)
                props?.activateBottomErrorCard(true, 'Some error occured while fetching document list. Please try again later')
                setloader(false)
            })

    }, [])


    const [modalIsOpen, setIsOpen] = useState(false);
    const [docUrl, setDocUrl] = useState('')
    const [errorImage, seterrorImage] = useState(false)

    let subtitle;

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)
    const afterOpenModal = () => { }

    const modalAction = (incomingDocUrl, type, isErr) => {
        console.log('incoming doc url modal => ', incomingDocUrl, type, isErr)
        setDocUrl(incomingDocUrl)
        setdocType(type)
        seterrorImage(isErr)
        openModal()
    }

    console.log('doucment api at document view mr', props?.api)

    return (
        <>
            {loader && <BarLoader />}

          {!loader &&  <div className=" mx-auto ml-0">
                <div className="py-0">
                    <div className=" px-4 sm:px-8 py-0 overflow-x-auto">
                        <div className="inline-block min-w-full overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead className='bg-indigo-200'>
                                    <tr className='font-semibold'>
                                        <th scope="col" className="px-5 py-2 border-b border-gray-200 text-gray-800  text-left text-sm capitalize">
                                            #
                                        </th>
                                        <th scope="col" className="px-5 py-2 border-b border-gray-200 text-gray-800  text-left text-sm capitalize">
                                            Document Name
                                        </th>
                                        <th scope="col" className="px-5 py-2 border-b border-gray-200 text-gray-800  text-left text-sm capitalize">
                                            View
                                        </th>
                                        <th scope="col" className="px-5 py-2 border-b border-gray-200 text-gray-800  text-left text-sm capitalize">
                                            Status
                                        </th>
                                        <th scope="col" className="px-5 py-2 border-b border-gray-200 text-gray-800  text-left text-sm capitalize">
                                            Remarks
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(docList?.length == 0 && !loader) && <tr className='mt-5'><td colSpan={5} className="text-center bg-red-50 drop-shadow-lg text-sm text-red-400 my-4 px-4 py-2 font-semibold">Oops! No Document Found !!</td></tr>}
                                    {
                                        docList?.map((data, index) => (
                                            <PilotWorkflowDocumentRow api={props?.api} openModal={modalAction} docList={data} index={index} />
                                        ))
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>}
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                // style={customStyles}
                className='w-screen h-screen flex justify-center items-center backdrop-brightness-50'
                contentLabel="Example Modal"
            >

                <div class=" rounded-lg shadow-xl border-2 border-gray-200 bg-white md:ml-32 p-4 animate__animated animate__zoomIn animate__faster w-full md:w-[60vw] h-[80vh]" >
                    <div className="absolute top-2 font-normal bg-red-200 hover:bg-red-300 right-2 rounded-full p-2 cursor-pointer" onClick={closeModal}>
                        <RxCross2 />
                    </div>

                    {
                        (errorImage == true || errorImage == 'true') ? <>
                            <div className='w-full h-full bg-gray-700 flex items-center justify-center text-gray-200'>
                                <div className='border-r-2 border-gray-200 pr-4'>Error</div>
                                <div className='pl-4'>Document not visible</div>
                            </div>
                        </>
                            :
                            <>
                                {
                                    docType == 'pdf' && <>
                                        <iframe className='w-full h-full' src={docUrl} frameborder="0"></iframe>
                                    </>
                                }
                                {
                                    docType != 'pdf' && <>
                                        <div className='w-full h-[77vh] overflow-auto flex flex-wrap items-center justify-center'>
                                            <img src={docUrl} alt="" srcset="" className=' ' />
                                        </div>
                                    </>
                                }
                            </>
                    }

                </div>

            </Modal>

            <div className='w-full mt-20'></div>
        </>
    )
}

export default PropertySafDocumentView
