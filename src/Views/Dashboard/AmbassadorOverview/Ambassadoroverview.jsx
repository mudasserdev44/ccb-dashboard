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
import ToastComp from '../../../components/toast/ToastComp';

// ─── Rewarded Dropdown Cell ───────────────────────────────────────────────────
// This component handles the yes/no dropdown per row.
// It uses local optimistic state so the UI updates instantly,
// but the source-of-truth is always the SWR cache (persists across route changes).
const RewardedDropdown = ({ row, token, onUpdate }) => {
    // Derive current value from row data
    const currentValue =
        row.rewarded === true || row.rewarded === "Yes" || row.rewarded === "yes"
            ? "yes"
            : "no";

    const [value, setValue] = useState(currentValue);
    const [loading, setLoading] = useState(false);

    // Keep local state in sync if parent data changes (e.g. SWR revalidation)
    useEffect(() => {
        setValue(currentValue);
    }, [currentValue]);

    const handleChange = async (e) => {
        const newValue = e.target.value;
        const prevValue = value;

        // Optimistic update
        setValue(newValue);
        setLoading(true);
        
        try {
            
            await request(
                {
                    method: "put",
                    url: `admin/rewardClaims/${row._id || row.id || row.userId}`,
                    data: {
                        action: newValue,
                        reason: "", // required by API when action === "no"
                    },
                },
                false,
                token
            );

            // Tell parent to update its SWR cache so state survives route changes
            if (onUpdate) {
                onUpdate(row._id || row.id || row.userId, newValue);
            }
        } catch (err) {
            ToastComp({
                variant:'info',
                message:err?.response?.data?.message || "Failed To update"
            })
            // console.log("++++++++++++++++++",  err);
            // Revert on failure
            setValue(prevValue);
        } finally {
            setLoading(false);
        }
    };

    return (
        <select
            value={value}
            onChange={handleChange}
            disabled={loading}
            style={{
                backgroundColor: value === "yes" ? "#14532d" : "#450a0a",
                color: value === "yes" ? "#4ade80" : "#f87171",
                border: `1px solid ${value === "yes" ? "#16a34a" : "#dc2626"}`,
                borderRadius: "6px",
                padding: "4px 10px",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "13px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                outline: "none",
                opacity: loading ? 0.6 : 1,
                minWidth: "90px",
            }}
        >
            <option value="yes">Yes</option>
            <option value="no">No</option>
        </select>
    );
};

// ─── Column definitions ───────────────────────────────────────────────────────
// "rewarded" column uses a custom render — injected below after token is available
const baseColumns = [
    { key: "name",      label: "Name" },
    { key: "sdate",     label: "Date level reached" },
    { key: "location",  label: "Location" },
    { key: "email",     label: "Email" },
    { key: "giftCard",  label: "Gift card value", align: "center" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const Ambassadoroverview = () => {
    const token = useSelector((state) => state.admin.token);
    const [selectedCountry, setSelectedCountry] = useState("usa");
    const [rewardFilter, setRewardFilter] = useState("all"); // all | yes | no
    const [timeFilter, setTimeFilter] = useState("alltime");

    // ── Fetcher ──────────────────────────────────────────────────────────────
    const fetcher = async (url) => {
        const res = await request({ method: "get", url }, false, token);
        return res?.data;
    };

    // ── SWR: Heatmap ─────────────────────────────────────────────────────────
    const {
        data: heatMapResponse,
        error: heatMapError,
        isLoading: isHeatMapLoading,
    } = useSWR(
        token ? `user/generateGeoData?filter=${timeFilter}` : null,
        fetcher,
        { revalidateOnFocus: false, revalidateOnReconnect: false }
    );

    // ── SWR: Stats ───────────────────────────────────────────────────────────
    const {
        data: statsResponse,
        error: statsError,
        isLoading: isStatsLoading,
    } = useSWR(token ? 'admin/stats' : null, fetcher);

    // ── SWR: Reward Claims ───────────────────────────────────────────────────
    const {
        data: rewardResponse,
        error: rewardError,
        isLoading: isRewardLoading,
        mutate: mutateRewards,
    } = useSWR(
        token ? 'admin/rewardClaims' : null,
        fetcher,
        { revalidateOnFocus: false, revalidateOnReconnect: false }
    );

    // ── Derived data ─────────────────────────────────────────────────────────
    const stats      = statsResponse?.data || {};
    const heatMapData = heatMapResponse?.geoData || {};
    const rewardData  = rewardResponse?.data || [];

    // ── Optimistic cache update ──────────────────────────────────────────────
    // This mutates the SWR cache in-place so the new value persists
    // even when the user navigates away and comes back.
    const handleRewardUpdate = (rowId, newValue) => {
        mutateRewards(
            (current) => {
                if (!current?.data) return current;
                const updatedData = current.data.map((item) => {
                    const itemId = item._id || item.id || item.userId;
                    if (itemId === rowId) {
                        return {
                            ...item,
                            rewarded:
                                newValue === "yes" ? true : false,
                        };
                    }
                    return item;
                });
                return { ...current, data: updatedData };
            },
            false // false = do NOT revalidate from server after mutation
        );
    };

    // ── Filtered rows ────────────────────────────────────────────────────────
    const filteredRewardData = rewardData.filter((item) => {
        if (rewardFilter === "all") return true;
        if (rewardFilter === "yes")
            return item.rewarded === true || item.rewarded === "Yes" || item.rewarded === "yes";
        if (rewardFilter === "no")
            return item.rewarded === false || item.rewarded === "No" || item.rewarded === "no";
        return true;
    });

    // ── Columns with injected dropdown ───────────────────────────────────────
    const columns = [
        ...baseColumns,
        {
            key: "rewarded",
            label: "Rewarded",
            align: "right",
            render: (row) => (
                <RewardedDropdown
                    row={row}
                    token={token}
                    onUpdate={handleRewardUpdate}
                />
            ),
        },
    ];

    // ── Color scale ──────────────────────────────────────────────────────────
    const colorScale = scaleQuantize()
        .domain([0, 10])
        .range([
            '#ffffcc', '#ffeda0', '#fed976', '#feb24c',
            '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026',
        ]);

    const handleCountryChange = (country) => setSelectedCountry(country);

    // ── Sub-components ───────────────────────────────────────────────────────
    const LoadingSpinner = () => (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
    );

    const ErrorMessage = ({ message }) => (
        <div className="flex items-center justify-center h-64">
            <div className="text-red-500 text-center">
                <p className="text-xl font-semibold">Error loading data</p>
                <p className="text-sm mt-2">{message}</p>
            </div>
        </div>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            {/* ── Ambassador Level Reward Table ── */}
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
                                        rewardFilter === "all"
                                            ? "bg-yellow-400 text-black"
                                            : "bg-gray-700 text-white"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setRewardFilter("yes")}
                                    className={`px-4 py-1 rounded ${
                                        rewardFilter === "yes"
                                            ? "bg-green-500 text-black"
                                            : "bg-gray-700 text-white"
                                    }`}
                                >
                                    Rewarded
                                </button>
                                <button
                                    onClick={() => setRewardFilter("no")}
                                    className={`px-4 py-1 rounded ${
                                        rewardFilter === "no"
                                            ? "bg-red-500 text-white"
                                            : "bg-gray-700 text-white"
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

            {/* ── Ambassador Engagement / Heatmap ── */}
            <div style={{ paddingTop: "20px", fontFamily: 'Montserrat, sans-serif' }}>
                <div className='flex justify-between items-center mb-4'>
                    <h1 className='text-[#FFFF00] text-[25px]'>Ambassador Engagement</h1>
                    <div className="tabs text-white text-xl">
                        <span
                            className={timeFilter === "weekly" ? "active-tab cursor-pointer" : "cursor-pointer"}
                            onClick={() => setTimeFilter("weekly")}
                        >
                            Monthly
                        </span>
                        <span
                            className={timeFilter === "monthly" ? "active-tab cursor-pointer" : "cursor-pointer"}
                            onClick={() => setTimeFilter("monthly")}
                        >
                            Quarterly
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

            {/* ── Stats Cards + Social Media ── */}
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
    );
};

export default Ambassadoroverview;