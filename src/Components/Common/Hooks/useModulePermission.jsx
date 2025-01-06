import ProjectApiList from '@/Components/api/ProjectApiList'
import axios from 'axios'
// import ApiHeader from 'Components/ApiList/ApiHeader'
import { setLocalStorageItem } from '../../Common/localstorage'
import  { useEffect } from 'react'
import {  useNavigate } from 'react-router-dom'

const useModulePermission = () => {
    const {  api_getFreeMenuList } = ProjectApiList()
    const navigate =useNavigate()
    const token = window.localStorage.getItem('token')
    const fetchMenuList = (token2) => {
       
        let requestBody = {
            moduleId: 15
        }

        axios.post(api_getFreeMenuList, requestBody, {
        
                headers: {
                  Authorization: `Bearer ${token2}`,
                  Accept: "application/json",
                },
              
        })
            .then(function (response) {
                console.log('fetched menu list.....', response)
                // return
                console?.log(response?.data?.data?.permission?.length)
                if (response.data.status == true) {
                    if (response?.data?.data?.permission?.length == 0) {
                        console.log('You are not authorized')
                        window.localStorage.clear() 
                        window.location.href = '/rig?msg=You are not authorized to access this page. Please contact your administrator for more information.'
                    }
                }
                else {
                    console.log('false...')
                }
            })
            .catch(function (error) {
                console.log('--2--login error...', error)
            })
    }

    useEffect(() => {
        if(token){
         fetchMenuList(token)
        }
    }, [token])
  return null
}

export default useModulePermission