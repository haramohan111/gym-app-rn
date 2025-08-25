import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const Home = () => {
  return (
    <div className="dashboard">
      <Sidebar />
          <main className="main-content container-fluid p-4">
       <Header />
      <Outlet />
      </main>
    </div>
  )
}

export default Home