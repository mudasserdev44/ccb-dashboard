import React, { useState } from 'react'
import ComposeNotification from '../NotificationSettings/ComposeNotification'
import NotificationHistory from '../NotificationSettings/NotificationHistory'
import CreateAdminCoupons from './CreateAdminCoupons'
import AdminCouponHistory from './AdminCouponHistory'

const AdminCoupons = () => {
        const [activeTab, setActiveTab] = useState('tab1')

    const tabStyle = (isActive) => ({
        padding: '3px 10px',
        borderRadius: '5px',
        fontWeight: '600',
        marginRight: '20px',
        cursor: 'pointer',
        border: isActive ? '2px solid green' : '',
        outline: 'none',
        backgroundColor: isActive ? 'black' : '',
        color: isActive ? 'white' : '#CFCFCF',
        fontFamily: 'Montserrat, sans-serif'
    })

    const containerStyle = {
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4px',
    }

    const contentStyle = {
        width: '100%',
        borderRadius: '8px',
        marginTop: '20px',
        textAlign: 'center',
    }
  return (
    <>
    <h1 className='flex text-[25px] text-[#FFFF00] items-start justify-start' style={{fontFamily:"montserrat, sans-serif"}}>Admin Coupons</h1>
   <div style={containerStyle}>
            {/* Tabs */}
            <div style={{ display: 'flex',flexWrap:"wrap", marginBottom: '20px',backgroundColor:"#121212",padding:"10px",borderRadius:"7px"}}>
                <button
                    onClick={() => setActiveTab('tab1')}
                    style={tabStyle(activeTab === 'tab1')}
                >
                   Create Admin Coupons
                </button>
                <button
                    onClick={() => setActiveTab('tab2')}
                    style={tabStyle(activeTab === 'tab2')}
                >
                   Admin Coupon History
                </button>
            </div>

            <div style={contentStyle}>
                {activeTab === 'tab1' && (
                    <div>
                       <CreateAdminCoupons/>
                    </div>
                )}

                {activeTab === 'tab2' && (
                    <div>
                       <AdminCouponHistory/>
                    </div>
                )}
            </div>
        </div>
    </>

  )
}

export default AdminCoupons
