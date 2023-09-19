import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';

export default function ProtectedRoute({children}) {
    const isAuthenticated = localStorage.getItem('token');
    console.log(isAuthenticated)
    if(isAuthenticated){
        
        return (
          <>
      
      
          {children} 
      
          </>
        )
    }else{
       return <Navigate to='/login'/>
    }
}
