//////////////////////////////////////////////////////////////////////////////////////
//    Author - Talib Hussain
//    Version - 1.0
//    Date - 24 june 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - Header
//    DESCRIPTION - Header Component
//////////////////////////////////////////////////////////////////////////////////////
import React, { useContext, useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { FiAlertCircle } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { contextVar } from "@/Components/context/contextVar";
import PermittedModuleCard from "./PermittedModuleCard";
import NotificationComponent from "./NotificationComponent";
import axios from "axios";
import ProjectApiList from "@/Components/api/ProjectApiList";
import { MdDashboard } from "react-icons/md";
import { localstorageRemoveEntire } from "@/Components/Common/localstorage";

// Icons

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
    borderRadius: "12px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    padding: 0,
    maxWidth: "400px",
    width: "90%",
  },
};

Modal.setAppElement("#root");

function NewHeader(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notificationState, setNotificationState] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpen2, setIsOpen2] = useState(false);
  const [permittedModuleList, setPermittedModuleList] = useState([]);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [ulbName, setUlbName] = useState("");

  const userDropdownRef = useRef(null);
  const { api_moduleList } = ProjectApiList();
  const { userUlbName, toggleBar, settoggleBar } = useContext(contextVar);

  // const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userDetails"));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch user data from localStorage
  // useEffect(() => {
  //   const userData = JSON.parse(localStorage.getItem("userDetails"));

  //   if (userData) {
  //     setUlbName(userData.ulb || "No Ulb Specified");
  //     setUserName(userData.userName || "User");
  //     try {
  //       const roles = JSON.parse(userData.roles);
  //       setUserRole(roles[0]?.name || "User");
  //     } catch (e) {
  //       setUserRole("User");
  //     }
  //   }
  // }, [token]);

  const navToggle = () => {
    settoggleBar(!toggleBar);
  };

  const logOutUser = () => {
    localstorageRemoveEntire();
    navigate("/");
    closeModal();
  };

  const fetchModuleList = () => {
    axios.post(api_moduleList, {}).then((res) => {
      setPermittedModuleList(res?.data?.data || []);
    });
  };

  useEffect(() => {
    fetchModuleList();
    setIsOpen(false);
  }, []);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal2() {
    setIsOpen2(true);
  }

  function closeModal2() {
    setIsOpen2(false);
  }

  // User initials for avatar
  const getUserInitials = () => {
    if (!userName) return "U";
    const names = userName.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName[0].toUpperCase();
  };

  return (
    <>
      {location.pathname !== "/landing" &&
        location.pathname !== "/" &&
        location.pathname !== "/login" &&
        location.pathname !== "/mobile-login" &&
        location.pathname !== "/error" && (
          <div className="flex flex-col transition-all duration-300 ease-in-out mb-16">
            {/* Navbar */}
            <nav className="w-full bg-gradient-to-r from-white to-gray-50  z-[999] fixed flex flex-row flex-nowrap items-center justify-between py-1 px-6 shadow-lg border-b border-gray-100">
              {/* Left Section */}
              <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="flex items-center">
                  <div className="text-center">
                    <div className="flex items-center space-x-2">
                      <div className="bg-[#1a4d8c] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">UD</span>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          UD&HD
                        </h1>
                        <p className="text-xs text-gray-500 font-medium">
                          Urban Development
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Toggle Button */}
                <button
                  onClick={navToggle}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content="Toggle Sidebar"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {/* Modules Button */}
                <button
                  onClick={openModal2}
                  className="ml-4 px-4 py-2 bg-[#1a4d8c] text-white rounded-lg font-medium hover:bg-[#07075b] transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 mr-4"
                >
                  <MdDashboard className="w-4 h-4" />
                  <span>Modules</span>
                </button>
                <h2 className="ml-4 flex items-center gap-2 text-xl font-bold text-gray-800">
                  <svg
                    className="w-5 h-5 text-[#1a4d8c]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>

                  <span className="relative">
                    {userData?.ulb}
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#1a4d8c] rounded"></span>
                  </span>
                </h2>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4">
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-[#1a4d8c] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {getUserInitials()}
                      </div>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-semibold text-gray-800">
                        {userData?.userName || "User"}
                      </div>
                      {/* <div className="text-xs text-gray-500">{userRole}</div> */}
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-600 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                      <div className="py-2">
                        {/* My Profile */}
                        <button
                          onClick={() =>
                            window.location?.replace("/settings/dashboard/home")
                          }
                          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50 transition-colors duration-150 text-left"
                        >
                          <svg
                            className="w-5 h-5 text-blue-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-800">
                              My Profile
                            </p>
                            <p className="text-sm text-gray-500">
                              View your profile
                            </p>
                          </div>
                        </button>

                        {/* Change Password */}
                        <button
                          onClick={() =>
                            window.location?.replace(
                              "/settings/dashboard/change-password"
                            )
                          }
                          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50 transition-colors duration-150 text-left border-t border-gray-100"
                        >
                          <svg
                            className="w-5 h-5 text-green-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 016 0v3H9z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-800">
                              Change Password
                            </p>
                            <p className="text-sm text-gray-500">
                              Update your password
                            </p>
                          </div>
                        </button>

                        {/* Notifications */}
                        <button
                          onClick={() =>
                            window.location?.replace(
                              "/settings/dashboard/notification"
                            )
                          }
                          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50 transition-colors duration-150 text-left border-t border-gray-100"
                        >
                          <svg
                            className="w-5 h-5 text-orange-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 22a2 2 0 002-2h-4a2 2 0 002 2zm6-6V11c0-3.1-1.6-5.6-4.5-6.3V4a1.5 1.5 0 00-3 0v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-800">
                              Notifications
                            </p>
                            <p className="text-sm text-gray-500">
                              Read notifications
                            </p>
                          </div>
                        </button>

                        {/* Logout */}
                        <button
                          onClick={openModal}
                          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors duration-150 text-left border-t border-gray-100"
                        >
                          <svg
                            className="w-5 h-5 text-red-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm4-10H10a2 2 0 00-2 2v4h2V5h10v14H10v-4H8v4a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-800">Logout</p>
                            <p className="text-sm text-gray-500">
                              Sign out from system
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        )}

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Logout Confirmation"
      >
        <div className="relative bg-white rounded-lg shadow-xl">
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg className="w-5 h-5" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="p-6 text-center">
            <div className="w-full flex h-10">
              <span className="mx-auto">
                <FiAlertCircle size={30} className="text-yellow-500" />
              </span>
            </div>
            <h3 className="mb-5 text-lg font-normal text-gray-500 mt-4">
              Are you sure you want to logout?
            </h3>
            <button
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
              onClick={logOutUser}
            >
              Yes, I'm sure
            </button>
            <button
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Modules Modal */}
      <Modal
        isOpen={modalIsOpen2}
        onRequestClose={closeModal2}
        className="z-40 h-screen w-screen backdrop-blur-sm flex flex-row justify-center items-center overflow-auto"
        contentLabel="Modules"
      >
        <PermittedModuleCard
          closeModuleModal={closeModal2}
          permittedModuleList={permittedModuleList}
        />
      </Modal>

      {/* Notification Component */}
      {notificationState && (
        <NotificationComponent setnotificationState={setNotificationState} />
      )}
    </>
  );
}

//for redux
const mapStateToProps = (state) => {
  return {
    navCloseStatus: state.navCloseStatus,
    isLoggedIn: state.isLoggedIn,
    device: state.device,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    NAV_OPEN: () => dispatch({ type: "NAV_OPEN" }),
    NAV_CLOSE: () => dispatch({ type: "NAV_CLOSE" }),
    NAV_OPEN_ORIGINAL_STATUS: () =>
      dispatch({ type: "NAV_OPEN_ORIGINAL_STATUS" }),
    NAV_CLOSE_ORIGINAL_STATUS: () =>
      dispatch({ type: "NAV_CLOSE_ORIGINAL_STATUS" }),
    LOGOUT: () => dispatch({ type: "LOGOUT" }),
  };
};
export default NewHeader;
