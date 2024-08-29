import ApiHeader from "./ApiHeader";
import BackendUrl from "./BackendUrl"
// const BackendUrl = 'http://192.168.0.240:83'
// const BackendUrl = "http://192.168.0.202:2000";
// const BackendUrl = 'http://192.168.0.207:8000'
export const QrUrl = window.location.host;
// export const QrUrl = ' https://www.jharkhandegovernance.com/auth';
console.log("QrUrl", QrUrl)
export default function PetRegAPIList() {

    let baseUrl = BackendUrl;

    const header = ApiHeader()

    // let token = window.localStorage.getItem('citizen_token')
    // const header = {
    //     headers:
    //     {
    //         Authorization: `Bearer ${token}`,
    //         Accept: 'application/json',
    //     }
    // }

    // window.sessionStorage.setItem("name", "Raja Ram Mohan Malvia")

    let apiList = {
        header1: header,
        header: header,

        api_ulbList: `${baseUrl}/api/get-all-ulb`, //GET
        api_wardList: `${baseUrl}/api/workflow/getWardByUlb`, // post,

        api_PetRegistrationMaster: `${baseUrl}/api/rig/get-master-data`,
        api_PetRegistrationApplyForm: `${baseUrl}/api/rig/application/apply-rig-registration`,
        api_RigApplyRenewalForm: `${baseUrl}/api/rig/registration/apply-renewal`,
        api_PetRegistrationDocUploadList: `${baseUrl}/api/rig/application/get-doc-to-upload`,
        api_PetRegistrationList: `${baseUrl}/api/rig/application/get-registration-list`,

        api_PetRegDeleteApplication: `${baseUrl}/api/rig/application/delete`,
        api_PetRegViewApplication: `${baseUrl}/api/rig/application/get-details`,

        api_PetApproveViewApplication: `${baseUrl}/api/rig/get-approve-registration-list-V1`,
        api_PetPreviewViewApplication: `${baseUrl}/api/rig/get-renewal-registration-details`,
        api_PetRegUploadDocument: `${baseUrl}/api/rig/application/upload-docs`,
        api_ListOfSafHolding: `${baseUrl}/api/rig/citizen-holding-saf`,
        api_getUserDetailsByHoldingSaf: `${baseUrl}/api/rig/application/get-prop-details`,
        api_searchPetApplication: `${baseUrl}/api/rig/application/searh-application`,


        api_petRegistrationsPreviewList: `${baseUrl}/api/rig/get-renewal-history`,
        api_petOfflinePayment: `${baseUrl}/api/rig/application/offline-payment`,
        api_peteditdetails: `${baseUrl}/api/rig/application/edit-rig-details`,

        api_PetRejectedViewApplication: `${baseUrl}/api/rig/get-rejected-registration-list`,
        api_searchApprovedPetApplication: `${baseUrl}/api/rig/search-approved-applications`,
        api_searchRejectedPetApplication: `${baseUrl}/api/rig/search-rejected-applications`,
        api_RejectedPetApplication: `${baseUrl}/api/rig/list-rejected-application`,
        api_petPaymentReceipt: `${baseUrl}/api/rig/application/payment-receipt`,

        api_ApprovedPetApplication: `${baseUrl}/api/rig/list-approved-application`,
        api_RigRegistrationApplyForm: `${baseUrl}/api/rig/application/apply-rig-registration`,
        api_RigUploadedDoc: `${baseUrl}/api/rig/application/get-uploaded-docs`,

        // api_petDashboardDetails: `${baseUrl}/api/rig/dashboard_details`,
        api_petDashboardDetails: `${baseUrl}/api/rig/application/dashboard-details`,
        docReUpload: `${baseUrl}/api/rig/application/reupload-document`,
        api_sendToJSK: `${baseUrl}/api/rig/back-to-citizen`,
        api_collectionReport: `${baseUrl}/api/rig/application/collection-report`,
        api_cashVerification: `${baseUrl}/api/rig/cash-verification-list`,
        api_cashVerificationDtls: `${baseUrl}/api/rig/cash-verification-dtl`,
        api_cashVerificationFinal: `${baseUrl}/api/rig/verify-cash`,
        api_SearchBankReconcile: `${baseUrl}/api/rig/search/transaction-cheque`,
        apiUpdateReconcillationDetails: `${baseUrl}/api/rig/search/transaction-cheque-dtl`,
        getReconcileById: `${baseUrl}/api/rig/transaction/cheque-clear-bounce`,


    }

    return apiList
}