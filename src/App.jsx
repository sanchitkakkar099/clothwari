import { useEffect, useState } from 'react'
import HeaderComponent from './layouts/header'
import SidebarComponent from './layouts/sidebar'
import DashboardComponent from './components/dashboard'
import PageContent from './layouts/pageContent'

function App({children}) {
    useEffect(() => {
      document.body.setAttribute('data-sidebar', 'light')
    },[])
  return (
    <div id='layout-wrapper'>
      <HeaderComponent/>
      <SidebarComponent/>
      <PageContent children={children}/>
    </div>
  )
}

export default App
