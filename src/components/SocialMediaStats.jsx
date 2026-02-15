import React from 'react'
import useSWR from 'swr'
import { request } from '../services/axios'
import { DashboardCard, PieChartBase } from '../Views/Dashboard/components/DashboardComponents'
import { useSelector } from 'react-redux'

const SocialMediaStats = ({ title }) => {
    const token = useSelector((state) => state.admin.token)

    const fetcher = async () => {
        const res = await request({
            method: "get",
            url: "admin/socialMediaStats",
        }, false, token)
        return res?.data?.data || []
    }

    const { data: sociaMediaStats, error, isLoading } = useSWR(
        token ? 'socialMediaStats' : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    )

    const chartColors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
    ]

    const pieData = sociaMediaStats?.map((item, index) => ({
        name: item.label,
        label: item.label,
        value: item.value,
        color: chartColors[index % chartColors.length],
    })) || []

    return (
        <div>
            <h2 className="text-[#FFFF00] text-[20px] font-semibold mb-4 px-1">
                {title}
            </h2>

            <DashboardCard sx={{ padding: "10px", mt: 1 }} className="text-white w-full">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-gray-700 border-t-[#FFFF00] rounded-full animate-spin"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-[200px] text-red-400">
                        <p>Error loading stats</p>
                    </div>
                ) : (
                    <PieChartBase
                        data={pieData}
                        chartHeight={200}
                        chartWidth={200}
                        legendRightSpace={100}
                        showInternalLabels={true}
                    />
                )}
            </DashboardCard>
        </div>
    )
}

export default SocialMediaStats