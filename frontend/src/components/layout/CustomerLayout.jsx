import React from 'react'
import { Outlet } from 'react-router-dom'
import CustomerNavbar from './CustomerNavbar'
import CustomerFooter from './CustomerFooter'
import PageTransition from '../common/PageTransition'

export function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F3EE] text-[#282426]">
      <CustomerNavbar />
      <main className="flex-1 w-full flex flex-col">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <CustomerFooter />
    </div>
  )
}

export default CustomerLayout
