///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : Akshay
// 👉 Component   : App.js
// 👉 Status      : Open
// 👉 Description : This screen is designed for waive off demand.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import 'animate.css'
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { contextVar } from '@/Components/context/contextVar';
import { getLocalStorageItemJsonParsed } from '@/Components/Common/localstorage';
import Login from '@/Components/Pages/Others/Login';
import ProtectedRoutes from '@/Components/Pages/Others/ProtectedRoutes';
import ErrorPage from '@/Components/Pages/Others/404/ErrorPage';
import TransferPage from '@/Components/Pages/Others/TransferPage';
import ChangePassword from '@/Components/Pages/Others/ChangePassword';
import PetRegWorkflowEntry from './Components/Pages/PetRegistration/PetRegWorkflowEntry';
import SearchPetApplicationForm from './Components/Pages/PetRegistration/SearchPetApplication/SearchPetApplicationForm';
import PetRegistrationIndex from './Components/Pages/PetRegistration/PetRegistrationIndex';
import ViewPetApplication from './Components/Pages/PetRegistration/ViewEditApplication/ViewPetApplication';
import PetOfflinePayment from './Components/Pages/PetRegistration/PatPayment/PetOfflinePayment';
import PetPaymentReceiptIndex from './Components/Pages/PetRegistration/PetPaymentReceipt/PetPaymentReceiptIndex';
// import PetDashboard from './Components/Pages/PetRegistration/PetDashboard/PetDashboard';
import SearchApprovedPetApplication from './Components/Pages/PetRegistration/SearchApprovedPetApplication/SearchApprovedPetApplication';
import ViewApprovedApplication from './Components/Pages/PetRegistration/ViewEditApplication/ViewApprovedApplication';
import PetRenewalFormIndex from './Components/Pages/PetRegistration/Form/PetRenewalFormIndex';
import ApprovedPetApplication from './Components/Pages/PetRegistration/SearchApprovedPetApplication/ApprovedPetApplication';
import RejectPetApplication from './Components/Pages/PetRegistration/SearchApprovedPetApplication/RejectPetApplication';
import PetRegDashboard from './Components/Pages/PetRegistration/PetRegDashboard/PetRegDashboard';
import SearchRejectPetApplication from './Components/Pages/PetRegistration/SearchApprovedPetApplication/SearchRejectPetApplication';
import ViewRejectApplication from './Components/Pages/PetRegistration/ViewEditApplication/ViewRejectApplication';
import PetRegistrationPreviewList from './Components/Pages/PetRegistration/SearchApprovedPetApplication/PetRegistrationPreviewList';
import ViewApprovedPreviewApplication from './Components/Pages/PetRegistration/ViewEditApplication/ViewApprovedPreviewApplication';
import PetRegistrationFormIndex from './Components/Pages/PetRegistration/Form/RigRegistrationFormIndex';
import RigRegistrationFormIndex from './Components/Pages/PetRegistration/Form/RigRegistrationFormIndex';
import SuccessfulSubmitModal from './Components/Pages/PetRegistration/Form/SuccessfulSubmitModal';
import RigLIcenseReceipt from './Components/Pages/PetRegistration/PetPaymentReceipt/RigLIcenseReceiptEntry';
import RigLIcenseReceiptEntry from './Components/Pages/PetRegistration/PetPaymentReceipt/RigLIcenseReceiptEntry';
import CollectionReport from './Components/Pages/PetRegistration/Report/CollectionReport';
import SuccessfulSubmitModal2 from './Components/Pages/PetRegistration/Form/SuccessfulSubmitModal2';
import CashVerification from './Components/Pages/PetRegistration/Accounts/CashVerification';
import BankReconciliation from './Components/Pages/PetRegistration/Accounts/BankReconciliation';
import useModulePermission from "../src/Components/Common/Hooks/useModulePermission";

function App() {
  useModulePermission()
  // 👉 State constants 👈
  const [menuList, setmenuList] = useState(getLocalStorageItemJsonParsed('menuList')); // to store menu list
  const [userDetails, setuserDetails] = useState(getLocalStorageItemJsonParsed('userDetails')); // to store user details
  const [titleText, settitleText] = useState('');
  const [refresh, setrefresh] = useState(0)
  const [titleBarVisibility, settitleBarVisibility] = useState(true);
  const [heartBeatCounter, setheartBeatCounter] = useState(1) // to check authentication
  const [toggleBar, settoggleBar] = useState(window.innerWidth <= 763 ? false : true) // toggle state for Side Bar

  // 👉 Manage sidebar to hide and show for responsiveness 👈
  window.addEventListener('resize', function () {
    window.innerWidth <= 763 && settoggleBar(false)
    window.innerWidth >= 1280 && settoggleBar(true)
  });

  // 👉 Context data used globally 👈
  const contextData = {
    notify: (toastData, toastType) => toast[toastType](toastData),
    menuList, setmenuList,
    userDetails, setuserDetails,
    titleText, settitleText,
    titleBarVisibility, settitleBarVisibility,
    heartBeatCounter, setheartBeatCounter,
    toggleBar, settoggleBar,
    refresh, setrefresh
  }

  // 👉 Routes Json 👈
  const allRoutes = [

    { path: '/transfer', element: <TransferPage /> },
    { path: '/change-password', element: <ChangePassword /> },
    // { path: '/home', element: <PetDashboard /> },
    { path: '/home', element: <PetRegDashboard /> },
    // { path: '/rig-registration-form', element: <RegRegisterForm /> },
    { path: '/rig-workflow', element: <PetRegWorkflowEntry /> },

    { path: '/search-approved-pet-registration', element: <SearchApprovedPetApplication /> },
    { path: '/PetRegistrationPreviewList/:registration_id', element: <PetRegistrationPreviewList /> },
    { path: '/viewPreviewApplication/:id', element: <ViewApprovedPreviewApplication /> },
    { path: '/search-rejected-pet-registration', element: <SearchRejectPetApplication /> },



    // { path: '/pet-registration', element: <PetRegistrationIndex /> },
    { path: '/rig-renewal/:id', element: <PetRenewalFormIndex /> },
    { path: '/viewRigApplication/:id', element: <ViewPetApplication /> },
    { path: '/successfull-submit', element: <SuccessfulSubmitModal /> },
    { path: '/successfull-edit', element: <SuccessfulSubmitModal2 /> },



    { path: '/rig-payment-offline/:id', element: <PetOfflinePayment /> },


    { path: '/rig-registration-form', element: <RigRegistrationFormIndex /> },
    { path: '/search-rig-registration', element: <SearchPetApplicationForm /> },
    { path: '/viewRejectApplication/:id', element: <ViewRejectApplication /> },
    { path: '/viewApprovedApplication/:id', element: <ViewApprovedApplication /> },
    { path: '/reject-rig-application', element: <RejectPetApplication /> },
    { path: '/approved-rig-application', element: <ApprovedPetApplication /> },
    { path: '/collection-report', element: <CollectionReport /> },
    { path: '/cash-verification', element: <CashVerification /> },
    { path: '/bank-reconciliation', element: <BankReconciliation /> },
  ]


  // { path: '/rig-payment-receipt/:transNo', element: <PetPaymentReceiptIndex /> },
  // { path: '/rig-license-details/:id', element: <RigLIcenseReceiptEntry /> },
  return (
    <>

      <Toaster />

      <contextVar.Provider value={contextData}>

        <Routes>
          <Route
            path='/rig-payment-receipt/:transNo'
            element={<PetPaymentReceiptIndex />}
          />
          <Route
            path='/rig-license-details/:id'
            element={<RigLIcenseReceiptEntry />}
          />
          <Route index element={<Login />} />

          <Route element={<ProtectedRoutes />}>

            {
              allRoutes?.map((elem) =>
                <Route path={elem?.path} element={elem?.element} />
              )
            }

          </Route>

          <Route path='*' element={<ErrorPage />} />

        </Routes>

      </contextVar.Provider>

    </>
  )
}

export default App
