import { Fragment, useEffect, useState } from 'react'
import HeaderComponent from './layouts/header'
import SidebarComponent from './layouts/sidebar'
import DashboardComponent from './components/dashboard'
import PageContent from './layouts/pageContent'
import { useNavigate } from 'react-router-dom'
import { Toaster } from "react-hot-toast";


function App({children}) {
  const navigate = useNavigate()
  const auth = localStorage.getItem('auth')
  const user = JSON.parse(auth)

  useEffect(() => {
    if(!user?.token){
      navigate('/login')
    }
  },[user?.token])

    useEffect(() => {
      document.body.setAttribute('data-sidebar', 'light')
    },[])
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
