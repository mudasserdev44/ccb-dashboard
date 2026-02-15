import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import CustomTable from '../../../components/CustomTable/CustomTable'
import USMap, { DashboardCard, PieChartBase } from '../components/DashboardComponents';
import { socialMediaData } from '../Hotspots/hotspotsData';
import { scaleQuantize } from 'd3-scale';
import CustomCardRevenue from '../../../components/CustomCardRevenue/CustomCardRevenue';
import { request } from '../../../services/axios';
import { useSelector } from 'react-redux';
import SocialMediaStats from '../../../components/SocialMediaStats';

const columns = [
    { key: "name", label: "Name" },
    { key: "sdate", label: "Date level reached" },
    { key: "location", label: "Location" },
    { key: "email", label: "Email" },
    { key: "completed", label: "Total subs/Level Completed" },
    { key: "giftCard", label: "Gift card value", align: "center" },
    { key: "rewarded", label: "Rewarded", align: "right" },
];


const Ambassadoroverview = () => {
    const token = useSelector((state) => state.admin.token);
    const [selectedCountry, setSelectedCountry] = useState("usa");
    const [rewardFilter, setRewardFilter] = useState("all"); // all | yes | no
    
    // 1. Added timeFilter state - set to "alltime" as per your request
    const [timeFilter, setTimeFilter] = useState("alltime");

    // Fetcher function for SWR
    const fetcher = async (url) => {
        const res = await request({
            method: "get",
            url: url,
        }, false, token);
        return res?.data;
    };

    // 2. Updated Heatmap Fetching to use the dynamic timeFilter
    const { data: heatMapResponse, error: heatMapError, isLoading: isHeatMapLoading } = useSWR(
        token ? `user/generateGeoData?filter=${timeFilter}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const { data: statsResponse, error: statsError, isLoading: isStatsLoading } = useSWR(
        token ? 'admin/stats' : null, 
        fetcher
    );

    // Fetch reward data with SWR
    const { data: rewardResponse, error: rewardError, isLoading: isRewardLoading, mutate: mutateRewards } = useSWR(
        token ? 'admin/rewardClaims' : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const stats = statsResponse?.data || {};
    // Extract data from responses
    const heatMapData = heatMapResponse?.geoData || {};
    const rewardData = rewardResponse?.data || [];
    const filteredRewardData = rewardData.filter((item) => {
        if (rewardFilter === "all") return true;
        if (rewardFilter === "yes") return item.rewarded === true || item.rewarded === "Yes";
        if (rewardFilter === "no") return item.rewarded === false || item.rewarded === "No";
        return true;
    });
    
    // Color scale configuration
    const colorScale = scaleQuantize()
        .domain([0, 10]) 
        .range(['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']);

    const handleCountryChange = (country) => {
        setSelectedCountry(country);
    };

    // Loading component
    const LoadingSpinner = () => (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
    );

    // Error component
    const ErrorMessage = ({ message }) => (
        <div className="flex items-center justify-center h-64">
            <div className="text-red-500 text-center">
                <p className="text-xl font-semibold">Error loading data</p>
                <p className="text-sm mt-2">{message}</p>
            </div>
        </div>
    );

    return (
        <>
            <div className='flex flex-col gap-4' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {isRewardLoading ? (
                    <LoadingSpinner />
                ) : rewardError ? (
                    <ErrorMessage message="Failed to load reward data" />
                ) : (
                    <>
                    <div className="flex justify-between items-center">
                        <h1 className='text-[#FFFF00] text-[25px]'>Ambassador Level Reward</h1>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setRewardFilter("all")}
                                className={`px-4 py-1 rounded ${
                                    rewardFilter === "all" ? "bg-yellow-400 text-black" : "bg-gray-700 text-white"
                                }`}
                            >
                                All
                            </button>

                            <button
                                onClick={() => setRewardFilter("yes")}
                                className={`px-4 py-1 rounded ${
                                    rewardFilter === "yes" ? "bg-green-500 text-black" : "bg-gray-700 text-white"
                                }`}
                            >
                                Rewarded
                            </button>

                            <button
                                onClick={() => setRewardFilter("no")}
                                className={`px-4 py-1 rounded ${
                                    rewardFilter === "no" ? "bg-red-500 text-white" : "bg-gray-700 text-white"
                                }`}
                            >
                                Not Rewarded
                            </button>
                        </div>
                    </div>

                    <CustomTable
                        columns={columns}
                        data={filteredRewardData}
                        rowsPerPage={5}
                        onRefresh={() => mutateRewards()}
                        />
                    </>
                )}
            </div>

            <div style={{ paddingTop: "20px", fontFamily: 'Montserrat, sans-serif' }}>
                <div className='flex justify-between items-center mb-4'>
                    <h1 className='text-[#FFFF00] text-[25px]'>Ambassador Engagement</h1>
                    {/* 3. Updated Tabs with onClick handlers and active state styling */}
                    <div className="tabs text-white text-xl">
                        <span 
                            className={timeFilter === "weekly" ? "active-tab cursor-pointer" : "cursor-pointer"}
                            onClick={() => setTimeFilter("weekly")}
                        >
                            Weekly
                        </span>
                        <span 
                            className={timeFilter === "monthly" ? "active-tab cursor-pointer" : "cursor-pointer"}
                            onClick={() => setTimeFilter("monthly")}
                        >
                            Monthly
                        </span>
                        <span 
                            className={timeFilter === "yearly" ? "active-tab cursor-pointer" : "cursor-pointer"}
                            onClick={() => setTimeFilter("yearly")}
                        >
                            Yearly
                        </span>
                        <span 
                            className={timeFilter === "alltime" ? "active-tab cursor-pointer" : "cursor-pointer"}
                            onClick={() => setTimeFilter("alltime")}
                        >
                            All Time
                        </span>
                    </div>
                </div>
                <div className='bg-black' style={{ padding: "10px" }}>
                    {isHeatMapLoading ? (
                        <LoadingSpinner />
                    ) : heatMapError ? (
                        <ErrorMessage message="Failed to load heatmap data" />
                    ) : (
                        <USMap
                            geoUrl={heatMapData?.usa?.url}
                            stateData={heatMapData?.usa?.stateData || {}}
                            colorScale={colorScale}
                            total={heatMapData?.usa?.total || 0}
                            canadaGeoUrl={heatMapData?.canada?.url}
                            canadaData={heatMapData?.canada?.stateData || {}}
                            canadaTotal={heatMapData?.canada?.total || 0}
                            europeGeoUrl={heatMapData?.europe?.url}
                            europeData={heatMapData?.europe?.stateData || {}}
                            europeTotal={heatMapData?.europe?.total || 0}
                            onCountryChange={handleCountryChange}
                        />
                    )}
                </div>
            </div>

            <div className='grid grid-cols-12 gap-4 mt-4'>
                <div className="col-span-12 lg:col-span-5 max-h-[55vh] w-full">
                    <SocialMediaStats title="Most popular social media for ambassadors" />
                </div>

                <div className='col-span-12 lg:col-span-7 w-full'>
                    {isStatsLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
                            <CustomCardRevenue
                                classname="rounded-xl h-full min-h-[220px] flex flex-col justify-between"
                                title="Total subs from referrals"
                                titleclassname="text-sm"
                                totalRevenue={stats.totalReferralSubs || 0}
                                previousRevenue={stats.prevReferralSubs || 0}
                                percentageChange={stats.subsGrowth || 0}
                            />
                            <CustomCardRevenue
                                classname="rounded-xl h-full min-h-[220px] flex flex-col justify-between"
                                title="Avg subs/amb"
                                totalRevenue={stats.avgSubsPerAmb || 0}
                                previousRevenue={stats.prevAvgSubs || 0}
                                percentageChange={stats.avgGrowth || 0}
                            />
                            <CustomCardRevenue
                                classname="rounded-xl h-full min-h-[220px] flex flex-col justify-between"
                                title="Ambassador payouts"
                                totalRevenue={stats.totalPayouts || 0}
                                showCurrency={true}
                                previousRevenue={stats.prevPayouts || 0}
                                percentageChange={stats.payoutsGrowth || 0}
                            />
                            <CustomCardRevenue
                                classname="rounded-xl h-full min-h-[220px] flex flex-col justify-between"
                                title="Total Ambassadors"
                                totalRevenue={stats.totalAmbassadors || 0}
                                previousRevenue={stats.prevTotalAmbassadors || 0}
                                percentageChange={stats.ambassadorGrowth || 0}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Ambassadoroverview;