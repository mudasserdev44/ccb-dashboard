import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { useSelector } from 'react-redux'
import { request } from '../../../services/axios'
import NewUgc from './NewUgc'
import ApprovedUgc from './ApprovedUgc'
import RejectUgc from './RejectUgc'
import DefaultCoupens from './DefaultCoupens'

const DEFAULT_TAB = 'New UGCs'
const TAB_STORAGE_KEY = 'ccb-sharing-overview-active-tab'

const getInitialTab = () => {
    if (typeof window === 'undefined') return DEFAULT_TAB
    return window.localStorage.getItem(TAB_STORAGE_KEY) || DEFAULT_TAB
}

const SharingOverview = () => {
    const [activeTab, setActiveTab] = useState(getInitialTab)
    const token = useSelector((state) => state.admin.token)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(TAB_STORAGE_KEY, activeTab)
        }
    }, [activeTab])

    // SWR fetcher function
    const fetcher = async (url) => {
        const data = await request({
            url,
            method: "get"
        }, false, token)
        return data
    }

    // SWR hooks - all data fetched in background on mount
    const { data: newCoupons, error: newError, isLoading: newLoading } = useSWR(
        token ? 'admin/new' : null,
        fetcher,
        { revalidateOnFocus: false }
    )

    const { data: approvedCoupons, error: approvedError, isLoading: approvedLoading } = useSWR(
        token ? 'admin/approved' : null,
        fetcher,
        { revalidateOnFocus: false }
    )

    const { data: publishedCoupons, error: publishedError, isLoading: publishedLoading } = useSWR(
        token ? 'admin/userpublished' : null,
        fetcher,
        { revalidateOnFocus: false }
    )

    const { data: rejectedCoupons, error: rejectedError, isLoading: rejectedLoading } = useSWR(
        token ? 'admin/rejected' : null,
        fetcher,
        { revalidateOnFocus: false }
    )

    // Get current tab data and loading state
    const getCurrentTabData = () => {
        switch (activeTab) {
            case 'New UGCs':
                return { data: newCoupons, loading: newLoading, error: newError }
            case 'Approved UGCs':
                return { data: approvedCoupons, loading: approvedLoading, error: approvedError }
            case 'Default Coupons':
                return { data: publishedCoupons, loading: publishedLoading, error: publishedError }
            case 'Rejected UGCs':
                return { data: rejectedCoupons, loading: rejectedLoading, error: rejectedError }
            default:
                return { data: null, loading: false, error: null }
        }
    }

    const { data: currentData, loading: currentLoading, error: currentError } = getCurrentTabData()

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

    const handleTabClick = (tabName) => {
    setActiveTab(tabName);

    switch (tabName) {
        case 'New UGCs':
            mutate('admin/new');
            break;
        case 'Approved UGCs':
            mutate('admin/approved');
            break;
        case 'Default Coupons':
            mutate('admin/userpublished');
            break;
        case 'Rejected UGCs':
            mutate('admin/rejected');
            break;
        default:
            break;
    }
};

    return (
        <>
            <div className='flex items-start justify-start'>
                <h1 className='text-[#FFFF00] text-2xl font-semibold' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {activeTab}
                </h1>
            </div>
            <div style={containerStyle}>
                <div style={{ display: 'flex', flexWrap: "wrap", marginBottom: '20px' }}>
                    <button
                        onClick={() => handleTabClick('New UGCs')}
                        style={tabStyle(activeTab === 'New UGCs')}
                    >
                        New UGC
                    </button>
                    <button
                        onClick={() => handleTabClick('Approved UGCs')}
                        style={tabStyle(activeTab === 'Approved UGCs')}
                    >
                        Approved UGCs
                    </button>
                    <button
                        onClick={() => handleTabClick('Default Coupons')}
                        style={tabStyle(activeTab === 'Default Coupons')}
                    >
                        Default Coupons
                    </button>
                    <button
                        onClick={() => handleTabClick('Rejected UGCs')}
                        style={tabStyle(activeTab === 'Rejected UGCs')}
                    >
                        Rejected UGCs
                    </button>
                </div>

                <div style={contentStyle}>
                    {activeTab === 'New UGCs' && (
                        <NewUgc ugc_data={currentData} loading={currentLoading} error={currentError} onRefresh={() => mutate('admin/new')} />
                    )}

                    {activeTab === 'Approved UGCs' && (
                        <ApprovedUgc approved_data={currentData} loading={currentLoading} error={currentError} onRefresh={() => mutate('admin/approved')} />
                    )}

                    {activeTab === 'Default Coupons' && (
                        <DefaultCoupens default_data={currentData} loading={currentLoading} error={currentError} mutate={() => mutate('admin/userpublished')} />
                    )}

                    {activeTab === 'Rejected UGCs' && (
                        <RejectUgc rejected_data={currentData} loading={currentLoading} error={currentError} onRefresh={() => mutate('admin/rejected')} />
                    )}
                </div>
            </div>
        </>
    )
}

export default SharingOverview
