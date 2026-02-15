import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  styled,
} from '@mui/material';
import { RiDeleteBinLine } from 'react-icons/ri';
import CustomTable from '../../../components/CustomTable/CustomTable';
import { request } from '../../../services/axios';
import { useSelector } from 'react-redux';

const DarkSelect = styled(Select)(() => ({
  fontFamily: 'Montserrat, sans-serif',
  color: 'white',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#333',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#555',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#D4AF37',
  },
  '& .MuiSvgIcon-root': {
    color: '#D4AF37',
  },
}));

const PRIORITY_CONFIG = {
  high: { label: 'High', color: '#D32F2F' },
  medium: { label: 'Medium', color: '#FFA000' },
  low: { label: 'Low', color: '#388E3C' },
};

const PRIORITY_FILTER_ALL = 'All Priority';
const PRIORITY_STORAGE_KEY = 'ccb-help-support-priority-overrides';

const normalizePriorityValue = (value) => {
  const normalized = (value || '').toString().trim().toLowerCase();
  return PRIORITY_CONFIG[normalized] ? normalized : 'medium';
};

const loadPriorityOverrides = () => {
  if (typeof window === 'undefined') return {};

  try {
    const saved = window.localStorage.getItem(PRIORITY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.warn('Failed to load priority overrides', error);
    return {};
  }
};

const persistPriorityOverrides = (overrides) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(PRIORITY_STORAGE_KEY, JSON.stringify(overrides));
  } catch (error) {
    console.warn('Failed to persist priority overrides', error);
  }
};

const ticketsColumns = (handlePriorityChange, handleStatusChange, handleDelete) => [
  {
    key: "_id",
    label: "Ticket ID",
    render: (row) => `#${row._id.slice(-6).toUpperCase()}`
  },
  {
    key: "createdAt",
    label: "Date Submitted",
    render: (row) => new Date(row.createdAt).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  },
  { key: "email", label: "Email" },
  {
    key: "issueType",
    label: "Type",
    render: (row) => {
      const typeMapping = {
        feedback: { label: 'Feedback', color: '#1976D2' },
        technicalIssue: { label: 'Technical Issue', color: '#D32F2F' },
        bug: { label: 'Bug', color: '#D32F2F' },
        troubleshooting: { label: 'Troubleshooting', color: '#9575CD' },
      };
      const typeInfo = typeMapping[row.issueType] || { label: row.issueType, color: '#666' };

      return (
        <Chip
          label={typeInfo.label}
          sx={{
            backgroundColor: typeInfo.color,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            padding: '4px 8px',
            fontFamily: 'Montserrat, sans-serif',
          }}
        />
      );
    },
  },
  {
    key: "notes",
    label: "Issue Summary",
    render: (row) => (
      <Typography sx={{
        maxWidth: 300,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {row.notes}
      </Typography>
    )
  },
  {
    key: "priority",
    label: "Priority",
    render: (row) => {
      const priorityKey = normalizePriorityValue(row.priority);
      const priorityMeta = PRIORITY_CONFIG[priorityKey];

      return (
        <DarkSelect
          value={priorityKey}
          onChange={(e) => handlePriorityChange(row._id, e.target.value)}
          sx={{
            minWidth: 100,
            backgroundColor: priorityMeta.color,
            color: "white",
            "& .MuiSelect-icon": { color: "white" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
          }}
        >
          {Object.entries(PRIORITY_CONFIG).map(([value, option]) => (
            <MenuItem key={value} value={value}>
              {option.label}
            </MenuItem>
          ))}
        </DarkSelect>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const statusMapping = {
        new: { label: 'Active', color: '#1976D2' },
        resolved: { label: 'Resolved', color: '#388E3C' },
        in_progress: { label: 'In Progress', color: '#FFA000' },
      };
      const statusInfo = statusMapping[row.status] || { label: 'Active', color: '#1976D2' };

      return (
        <DarkSelect
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          sx={{
            minWidth: 100,
            backgroundColor: statusInfo.color,
            color: "white",
            "& .MuiSelect-icon": { color: "white" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
          }}
        >
          <MenuItem value="new">Active</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
        </DarkSelect>
      );
    },
  },
  {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <div className='flex items-center justify-center'>
        <RiDeleteBinLine
          size={24}
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => handleDelete(row._id)}
        />
      </div>
    ),
  },
];

const HelpSupport = () => {
  const token = useSelector((state) => state.admin.token);
  const [activeTab, setActiveTab] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState(PRIORITY_FILTER_ALL);
  const [priorityOverrides, setPriorityOverrides] = useState(() => loadPriorityOverrides());

  // SWR fetcher function
  const fetcher = async (url) => {
    const res = await request({
      method: "get",
      url: url
    }, false, token);
    return res?.data?.feedbacks || [];
  };

  // Fetch ALL tickets to get accurate counts
  const { data: allTickets } = useSWR(
    token ? 'admin/feedback' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Fetch filtered tickets based on active tab
  const getApiEndpoint = () => {
    if (activeTab === 'Resolved') {
      return 'admin/feedback?status=resolved';
    }
    return 'admin/feedback';
  };

  const { data: tickets_data, error, isLoading, mutate } = useSWR(
    token ? getApiEndpoint() : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const applyPriorityOverride = (ticketId, value) => {
    setPriorityOverrides((prev) => {
      const next = { ...prev, [ticketId]: value };
      persistPriorityOverrides(next);
      return next;
    });
  };

  useEffect(() => {
    if (!tickets_data?.length) return;

    setPriorityOverrides((prev) => {
      let hasChanged = false;
      const next = { ...prev };

      tickets_data.forEach((ticket) => {
        const normalizedApiPriority = normalizePriorityValue(ticket.priority);
        if (next[ticket._id] && next[ticket._id] === normalizedApiPriority) {
          delete next[ticket._id];
          hasChanged = true;
        }
      });

      if (hasChanged) {
        persistPriorityOverrides(next);
        return next;
      }

      return prev;
    });
  }, [tickets_data]);

  const handlePriorityChange = async (id, value) => {
  const normalizedValue = normalizePriorityValue(value);
  applyPriorityOverride(id, normalizedValue);

  // Optimistic update
  const updatedTickets = tickets_data.map((row) =>
    row._id === id ? { ...row, priority: normalizedValue } : row
  );
  mutate(updatedTickets, false);

  try {
    await request({
      method: "patch",
      url: `admin/feedback/${id}`,
      data: {
        priority: normalizedValue   // 👈 API expects only priority here
      }
    }, false, token);

    mutate();
  } catch (error) {
    console.error('Failed to update priority:', error);
    mutate();
  }
};


  const handleStatusChange = async (id, value) => {
    // Optimistic update
    const updatedTickets = tickets_data.map((row) =>
      row._id === id ? { ...row, status: value } : row
    );
    mutate(updatedTickets, false);

    try {
      await request({
        method: "patch",
        url: `admin/feedback/${id}`,
        data: { status: value }
      }, false, token);

      mutate();
    } catch (error) {
      console.error('Failed to update status:', error);
      mutate();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;

    const updatedTickets = tickets_data.filter((row) => row._id !== id);
    mutate(updatedTickets, false);

    try {
      await request({
        method: "delete",
        url: `admin/feedback/${id}`
      }, false, token);

      mutate();
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      mutate();
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // Reset filters when changing tabs
    setSearchQuery('');
    setTypeFilter('All Types');
    setStatusFilter('All Status');
    setPriorityFilter(PRIORITY_FILTER_ALL);
  };

  // Filter tickets based on active tab and filters
  const getFilteredTickets = () => {
    if (!tickets_data) return [];

    let filtered = tickets_data.map((ticket) => {
      const normalizedPriority = normalizePriorityValue(ticket.priority);
      const overridePriority = priorityOverrides[ticket._id];

      return {
        ...ticket,
        priority: overridePriority || normalizedPriority,
      };
    });

    // For Active tab, filter client-side if API doesn't filter
    if (activeTab === 'Active') {
      filtered = filtered.filter(ticket => ticket.status === 'new' || ticket.status === 'in_progress');
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'All Types') {
      filtered = filtered.filter(ticket => ticket.issueType === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'All Status') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== PRIORITY_FILTER_ALL) {
      filtered = filtered.filter(
        (ticket) => normalizePriorityValue(ticket.priority) === priorityFilter
      );
    }

    return filtered;
  };

  const filteredTickets = getFilteredTickets();

  // Calculate accurate counts from allTickets
  const getTabCounts = () => {
    if (!allTickets) return { active: 0, resolved: 0 };

    const activeCount = allTickets.filter(t => t.status === 'new' || t.status === 'in_progress').length;
    const resolvedCount = allTickets.filter(t => t.status === 'resolved').length;

    return { active: activeCount, resolved: resolvedCount };
  };

  const { active: activeCount, resolved: resolvedCount } = getTabCounts();

  const tabs = [
    {
      name: 'Active',
      count: activeCount
    },
    {
      name: 'Resolved',
      count: resolvedCount
    },
    { name: 'History', count: null }
  ];

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          backgroundColor: "#171717",
          borderRadius: "8px",
          padding: "24px",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress sx={{ color: '#D4AF37' }} size={60} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: "#171717",
          borderRadius: "8px",
          padding: "24px",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography sx={{ color: '#D32F2F', fontFamily: 'Montserrat, sans-serif' }}>
          Failed to load tickets. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        borderRadius: "8px",
        padding: "24px",
        fontFamily: 'Montserrat, sans-serif',
        color: 'white',
      }}
    >
      {/* Search and Filters Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search ticket by Ticket ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#1E1E1E',
              color: 'white',
              fontFamily: 'Montserrat, sans-serif',
              '& fieldset': { borderColor: '#555' },
              '&:hover fieldset': { borderColor: '#777' },
              '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#999',
              opacity: 1
            },
          }}
        />

        <DarkSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="All Types">All Types</MenuItem>
          <MenuItem value="feedback">Feedback</MenuItem>
          <MenuItem value="technicalIssue">Technical Issue</MenuItem>
          <MenuItem value="bug">Bug</MenuItem>
        </DarkSelect>

        <DarkSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="All Status">All Status</MenuItem>
          <MenuItem value="new">Active</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
        </DarkSelect>

        <DarkSelect
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value={PRIORITY_FILTER_ALL}>All Priority</MenuItem>
          {Object.entries(PRIORITY_CONFIG).map(([value, option]) => (
            <MenuItem key={value} value={value}>
              {option.label}
            </MenuItem>
          ))}
        </DarkSelect>
      </Box>

      {/* Tabs Section */}
      <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        {tabs.map((tab) => (
          <Button
            key={tab.name}
            onClick={() => handleTabChange(tab.name)}
            sx={{
              color: activeTab === tab.name ? '#F0E82E' : '#999',
              borderBottom: `2px solid ${activeTab === tab.name ? '#F0E82E' : 'transparent'}`,
              borderRadius: 0,
              textTransform: 'none',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, sans-serif',
              p: '8px 16px',
              '&:hover': {
                backgroundColor: 'transparent',
                borderBottom: `2px solid #F0E82E`,
                color: '#F0E82E',
              },
            }}
          >
            {tab.name}
            {tab.count !== null && (
              <Typography component="span" sx={{ ml: 1, fontSize: '0.9rem', color: '#999' }}>
                ({tab.count})
              </Typography>
            )}
          </Button>
        ))}
      </Box>

      {/* The Tickets Table */}
      <CustomTable
        columns={ticketsColumns(handlePriorityChange, handleStatusChange, handleDelete)}
        data={filteredTickets}
        rowsPerPage={10}
        onRefresh={() => mutate()}
      />
    </Box>
  );
};

export default HelpSupport;
