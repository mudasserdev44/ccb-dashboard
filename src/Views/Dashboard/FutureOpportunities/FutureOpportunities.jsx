import React, { useState } from 'react'
import NewEntrys from './NewEntrys'
import Log from './Log'

const FutureOpportunities = () => {
    const [activeTab, setActiveTab] = useState('tab1')

    const tabStyle = (isActive) => ({
        padding: '3px 10px',
        borderRadius: '5px',
        fontWeight: '600',
        marginRight: '20px',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        backgroundColor: isActive ? '#15803D' : '#333',
        color: isActive ? 'white' : 'gray',
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
            {/* <div style={containerStyle}>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('tab1')}
                    style={tabStyle(activeTab === 'tab1')}
                >
                    Create a new entry
                </button>
                <button
                    onClick={() => setActiveTab('tab2')}
                    style={tabStyle(activeTab === 'tab2')}
                >
                    Log
                </button>
            </div>

            <div style={contentStyle}>
                {activeTab === 'tab1' && (
                    <div>
                        <NewEntrys />
                    </div>
                )}

                {activeTab === 'tab2' && (
                    <div>
                      <Log />
                    </div>
                )}
            </div>
        </div> */}
            <NewEntrys />

        </>

    )
}

export default FutureOpportunities
