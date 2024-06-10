import React, { useContext, useEffect, useState } from 'react'
import { authContext } from '../context/AuthContext'
import {toast} from 'react-toastify'
const useFetchData = (url) => {

    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)

    const {token} = useContext(authContext)
    
    useEffect( ()=>{
        const fetchData = async()=>{
            try {
                setLoading(true)
                const res = await fetch(url,{
                    method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
                })
    
                const result = await res.json();
    
                if(!res.ok){
                    throw new Error(result.message+'🤢')
                }
                
                console.log("res",result)
                setData(result.data)
                

            } catch (error) {
                setError(error.message)
            }finally{
                setLoading(false)
            }

        }
        fetchData();
    },[url])

  return {
    data,loading,error
  }
}

export default useFetchData