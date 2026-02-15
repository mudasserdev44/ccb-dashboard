import React, { useState } from 'react'
import ComposeNotification from './ComposeNotification'
import NotificationHistory from './NotificationHistory'

const NotificationSettings = () => {
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
        <div style={containerStyle}>
            {/* Tabs */}
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('tab1')}
                    style={tabStyle(activeTab === 'tab1')}
                >
                   Compose Notification
                </button>
                <button
                    onClick={() => setActiveTab('tab2')}
                    style={tabStyle(activeTab === 'tab2')}
                >
                    Notification History
                </button>
            </div>
            <div style={contentStyle}>
                {activeTab === 'tab1' && (
                    <div>
                       <ComposeNotification/>
                    </div>
                )}

                {activeTab === 'tab2' && (
                    <div>
                       <NotificationHistory/>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationSettings
