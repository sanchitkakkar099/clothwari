import { Fragment, useEffect, useState } from 'react'
import HeaderComponent from './layouts/header'
import SidebarComponent from './layouts/sidebar'
import DashboardComponent from './components/dashboard'
import PageContent from './layouts/pageContent'
import { useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import { useSelector } from 'react-redux'


function App({children}) {
  const navigate = useNavigate()
  const location = useLocation()

  const userToken = useSelector((state) => state?.authState.userToken)

  useEffect(() => {
    if(!userToken){
      navigate('/login')
    }
  },[userToken])

  useEffect(() => {
    document.body.setAttribute('data-sidebar', 'light')
  },[])

  useEffect(() => {
    const now = new Date()
    console.log("time is",now.getSeconds());
  },[])

  console.log("Hi Im APP")
  return (
    <Fragment>
    <div id='layout-wrapper'>
      <HeaderComponent/>
      <SidebarComponent/>
      <PageContent children={children}/>
    </div>
    <Toaster />
    </Fragment>
  )
}

export default App
