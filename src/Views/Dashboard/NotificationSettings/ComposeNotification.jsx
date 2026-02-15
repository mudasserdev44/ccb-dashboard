import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  styled,
  CircularProgress,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { request } from '../../../services/axios';
import { useSelector } from 'react-redux';
import ToastComp from '../../../components/toast/ToastComp';

// Styled components for consistent dark theme
const DarkTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: '#555',
    },
    '&:hover fieldset': {
      borderColor: '#777',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2E7D32',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#999',
  },
}));

const GreenRadio = styled(Radio)(() => ({
  color: '#666',
  '&.Mui-checked': {
    color: '#2E7D32',
  },
}));

const ComposeNotification = () => {
  const token = useSelector((state) => state.admin.token);
  const [notificationType, setNotificationType] = useState('email');
  const [audience, setAudience] = useState('subscribers');
  const [schedule, setSchedule] = useState('for-now');
  const [selectedDate, setSelectedDate] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleNotificationTypeChange = (event) => {
    setNotificationType(event.target.value);
  };

  const handleAudienceChange = (event) => {
    setAudience(event.target.value);
  };

  const handleScheduleChange = (event) => {
    setSchedule(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      ToastComp({ variant: 'error', message: 'Title and message are required' });
      return;
    }

    // Map audience to recipients:
    // subscribers -> "user"
    // ambassadors -> "ambassador"  
    // everyone -> "all" (user + ambassador)
    const recipients =
      audience === 'everyone'
        ? 'all'
        : audience === 'ambassadors'
        ? 'ambassador'
        : 'user';

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('message', message.trim());
    formData.append('type', notificationType === 'email' ? 'email' : 'push');
    formData.append('recipients', recipients); // FIXED: Remove JSON.stringify
    
    if (schedule === 'for-later' && selectedDate) {
      const iso = new Date(selectedDate).toISOString();
      formData.append('sendAt', iso);
    } else {
      formData.append('sendAt', new Date().toISOString());
    }
    
    // FIXED: File append - don't pass filename as third parameter
    // if (file) {
    //   formData.append('attachments', file);
    // }

    try {
      setIsSubmitting(true);
      await request(
        {
          method: 'post',
          url: 'adminnotifications/send',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        },
        false,
        token
      );
      
      // Success feedback
      ToastComp({ variant: 'success', message: 'Notification sent successfully!' });
      
      // Reset form
      setTitle('');
      setMessage('');
      setFile(null);
      setSchedule('for-now');
      setSelectedDate('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error sending notification:', err);
      ToastComp({ 
        variant: 'error', 
        message: err?.response?.data?.message || 'Failed to send notification' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#171717',
        borderRadius: '8px',
        padding: '24px',
        margin: 'auto', 
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#F0E82E', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif' }}>
          Compose Notification
        </Typography>
      </Box>

      {/* Notification Type */}
      <FormControl component="fieldset" variant="standard" sx={{ mb: 3, width: '100%', textAlign: "start" }}>
        <FormLabel component="legend" color='white' sx={{ color: 'white', mb: 1, fontFamily: 'Montserrat, sans-serif' }}>
          Notification Type
        </FormLabel>
        <RadioGroup
          row
          value={notificationType}
          onChange={handleNotificationTypeChange}
          name="notification-type-group"
        >
          <FormControlLabel
            value="email"
            control={<GreenRadio />}
            label={<Typography sx={{ color: 'white', fontFamily: 'Montserrat, sans-serif' }}>Email Notification</Typography>}
          />
          <FormControlLabel
            value="in-app"
            control={<GreenRadio />}
            label={<Typography sx={{ color: 'white', fontFamily: 'Montserrat, sans-serif' }}>In-App Notification</Typography>}
          />
        </RadioGroup>
      </FormControl>

      {/* Notification Title */}
      <DarkTextField
        fullWidth
        label="Notification Title"
        variant="outlined"
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        helperText={
          <Typography sx={{ color: '#999', fontSize: '0.75rem', fontFamily: 'Montserrat, sans-serif' }}>
            {title.length}/50 characters
          </Typography>
        }
        inputProps={{ maxLength: 50 }}
        InputProps={{ style: { color: 'white' } }}
        InputLabelProps={{ style: { color: '#999', fontFamily: 'Montserrat, sans-serif' } }}
        sx={{ mb: 3 }}
      />

      {/* Message */}
      <DarkTextField
        fullWidth
        label="Message"
        variant="outlined"
        margin="normal"
        multiline
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        helperText={
          <Typography sx={{ color: '#999', fontSize: '0.75rem', fontFamily: 'Montserrat, sans-serif' }}>
            {message.length}/300 characters
          </Typography>
        }
        inputProps={{ maxLength: 300 }}
        InputProps={{ style: { color: 'white' } }}
        InputLabelProps={{ style: { color: '#999', fontFamily: 'Montserrat, sans-serif' } }}
        sx={{ mb: 3 }}
      />

      {/* Audience */}
      <FormControl component="fieldset" variant="standard" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend" sx={{ color: 'white', mb: 1, fontFamily: 'Montserrat, sans-serif', textAlign: "start" }}>
          Audience
        </FormLabel>
        <RadioGroup
          row
          value={audience}
          onChange={handleAudienceChange}
          name="audience-group"
        >
          <FormControlLabel
            value="subscribers"
            control={<GreenRadio />}
            label={<Typography sx={{ color: 'white', fontFamily: 'Montserrat, sans-serif' }}>For CCB Subscribers</Typography>}
          />
          <FormControlLabel
            value="ambassadors"
            control={<GreenRadio />}
            label={<Typography sx={{ color: 'white', fontFamily: 'Montserrat, sans-serif' }}>For Ambassadors</Typography>}
          />
          <FormControlLabel
            value="everyone"
            control={<GreenRadio />}
            label={<Typography sx={{ color: 'white', fontFamily: 'Montserrat, sans-serif' }}>For Everyone</Typography>}
          />
        </RadioGroup>
      </FormControl>

      {/* File Upload Area */}
      {/* <Box
        sx={{
          border: '1px dashed #555',
          borderRadius: '8px',
          padding: '40px 20px',
          textAlign: 'center',
          mb: 3,
          color: '#999',
          cursor: 'pointer',
          '&:hover': { borderColor: '#777' },
        }}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
          }
        }}
      >
        <Typography variant="h6" sx={{ color: '#FFF', mb: 1, fontFamily: 'Montserrat, sans-serif' }}>+</Typography>
        <Typography variant="body2" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
          Choose a file or drag and drop here
        </Typography>
        <Typography variant="caption" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
          Size limit: 5 MB
        </Typography>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => {
            const f = e.target.files && e.target.files[0];
            if (f) setFile(f);
          }}
        />
        {file && (
          <Typography sx={{ mt: 1, color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
            {file.name}
          </Typography>
        )}
      </Box> */}

      {/* Schedule */}
      <FormControl component="fieldset" variant="standard" sx={{ mb: 4, width: '100%' }}>
        <FormLabel component="legend" sx={{ color: 'white', mb: 1, fontFamily: 'Montserrat, sans-serif', textAlign: "start" }}>
          Schedule
        </FormLabel>
        <RadioGroup
          row
          value={schedule}
          onChange={handleScheduleChange}
          name="schedule-group"
        >
          <FormControlLabel
            value="for-now"
            control={<GreenRadio />}
            label={<Typography sx={{ color: 'white', fontFamily: 'Montserrat, sans-serif' }}>For Now</Typography>}
          />
          <FormControlLabel
            value="for-later"
            control={<GreenRadio />}
            label={<Typography sx={{ color: 'white', fontFamily: 'Montserrat, sans-serif' }}>For later</Typography>}
          />
          {schedule === 'for-later' && (
          <DarkTextField
            type="datetime-local"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            inputProps={{
              min: new Date().toISOString().slice(0, 16),
            }}
            sx={{ mt: 2, width: 220 }}
          />
        )}
        </RadioGroup>
      </FormControl>

      {/* Send Button */}
      <Button
        variant="contained"
        onClick={handleSend}
        sx={{
          backgroundColor: '#2E7D32',
          '&:hover': { backgroundColor: '#1B5E20' },
          color: 'white',
          fontWeight: 'bold',
          textTransform: 'none',
          borderRadius: '8px',
          padding: '10px 24px',
          width: '100%',
          fontSize: "17px",
          fontFamily: 'Montserrat, sans-serif'
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send'}
      </Button>
    </Box>
  );
};

export default ComposeNotification;