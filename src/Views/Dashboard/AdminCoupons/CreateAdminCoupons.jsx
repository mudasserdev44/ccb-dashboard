import React, { useState } from 'react';
import useSWR from 'swr';
import {
  Box,
  Button,
  Typography,
  TextField,
  Chip,
  styled,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { request } from '../../../services/axios';
import { useSelector } from 'react-redux';
import ToastComp from '../../../components/toast/ToastComp';

const DarkTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    fontFamily: 'Montserrat, sans-serif',
    color: 'white',
    '& fieldset': {
      borderColor: '#333',
    },
    '&:hover fieldset': {
      borderColor: '#555',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#D4AF37',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Montserrat, sans-serif',
    color: '#999',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'white',
  },
  '& .MuiInputLabel-root.MuiInputLabel-shrink': {
    color: 'white',
  },
  '& .MuiFormHelperText-root': {
    fontFamily: 'Montserrat, sans-serif',
    color: '#999',
  }
}));

const CategoryChip = styled(Chip)(({ theme, selected }) => ({
  fontFamily: 'Montserrat, sans-serif',
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: selected ? '#D4AF37' : '#121212',
  color: selected ? 'black' : 'white',
  fontWeight: 'bold',
  border: selected ? '2px solid #D4AF37' : '1px solid #555',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: selected ? '#D4AF37' : '#BF9B30',
  },
}));

const CreateAdminCoupons = () => {
  const token = useSelector((state) => state.admin.token);
  const [couponTitle, setCouponTitle] = useState('');
  const [couponDescription, setCouponDescription] = useState('');
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Validation errors state
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    image: '',
    category: ''
  });

  // SWR fetcher function
  const fetcher = async (url) => {
    const res = await request({
      method: "get",
      url,
    }, false, token);
    return res.data;
  };

  // Fetch background images with SWR
  const { data: bgImages = [], error: imagesError, isLoading: imagesLoading } = useSWR(
    'files?type=couponBackground',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  // Fetch categories with SWR
  const { data: categoriesAll = [], error: categoriesError, isLoading: categoriesLoading } = useSWR(
    'categories/all',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    // Clear category error when user selects a category
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
      image: '',
      category: ''
    };
    let isValid = true;

    // Title validation
    if (!couponTitle.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (couponTitle.trim().length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
      isValid = false;
    } else if (couponTitle.trim().length > 60) {
      newErrors.title = 'Title cannot exceed 60 characters';
      isValid = false;
    }

    // Description validation
    if (!couponDescription.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else if (couponDescription.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
      isValid = false;
    } else if (couponDescription.trim().length > 160) {
      newErrors.description = 'Description cannot exceed 160 characters';
      isValid = false;
    }

    // Image validation
    if (!selectedBackgroundImage) {
      newErrors.image = 'Please select a background image';
      isValid = false;
    }

    // Category validation
    if (!selectedCategory) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddCoupon = async () => {
    if (validateForm()) {
      const selectedImage = bgImages.find(img => img._id === selectedBackgroundImage);
      const imageUrl = selectedImage ? getImageUrl(selectedImage.path) : '';

      const couponData = {
        title: couponTitle.trim(),
        description: couponDescription.trim(),
        image: imageUrl,
        category: selectedCategory
      };

      try {
        setIsSubmitting(true); // 👈 start loader
        const res = await request({
          method: "post",
          url: "coupons/admin/create",
          data: couponData
        }, false, token);

        ToastComp({
          variant: "success",
          message: "Coupon created successfully"
        });

        // reset form (optional)
        setCouponTitle('');
        setCouponDescription('');
        setSelectedBackgroundImage('');
        setSelectedCategory('');
      } catch (err) {
        console.error(err);
        ToastComp({
          variant: "error",
          message: "Failed to create coupon"
        });
      } finally {
        setIsSubmitting(false); // 👈 stop loader
      }
    }
  };

  // Helper function to construct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';

    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }

    const baseUrl = import.meta.env.VITE_BASE || '';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${cleanBase}${cleanPath}`;
  };

  // Loading skeleton for images
  const ImagesSkeleton = () => (
    <Box sx={{ display: 'flex', gap: '10px' }}>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width={70}
          height={70}
          sx={{ borderRadius: '8px', bgcolor: '#333' }}
        />
      ))}
    </Box>
  );

  // Loading skeleton for categories
  const CategoriesSkeleton = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton
          key={i}
          variant="rounded"
          width={100}
          height={32}
          sx={{ borderRadius: '16px', bgcolor: '#333' }}
        />
      ))}
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: '#171717',
        borderRadius: '8px',
        padding: '30px',
        margin: '20px auto',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {/* Preview Box */}
      <Box
        sx={{
          width: '100%',
          margin: 'auto',
          backgroundColor: '#241c0c',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.5)',
          border: '1px dotted #D4AF37',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          fontFamily: 'Montserrat, sans-serif',
          backgroundImage: selectedBackgroundImage && bgImages.length > 0
            ? `url(${getImageUrl(bgImages.find(img => img._id === selectedBackgroundImage)?.path || '')})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(to right, #D4AF37, #A88F3A)',
            borderRadius: '8px 8px 0px 0px',
            padding: '20px',
            textAlign: 'center',
            mb: 4,
            width: 'calc(100% - -20px)',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            top: '-20px',
            left: '0',
            right: '0',
            margin: "10px"
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              color: 'white',
              fontWeight: 'bold',
              mb: 1,
              fontSize: '2rem',
            }}
          >
            Today or Tonight
          </Typography>
        </Box>

        <Box
          sx={{
            textAlign: 'center',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: -2,
            backgroundColor: selectedBackgroundImage ? 'rgba(36, 28, 12, 0.8)' : '#241c0c',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              color: 'white',
              fontWeight: 'bold',
              mb: 1,
              fontSize: '2rem',
            }}
          >
            {couponTitle || 'Add coupon title here'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              color: 'white',
              fontSize: '0.9rem',
            }}
          >
            {couponDescription || 'Be specific ;)'}
          </Typography>
        </Box>
      </Box>

      {/* Title Input */}
      <DarkTextField
        fullWidth
        label="Add coupon title here"
        variant="outlined"
        value={couponTitle}
        onChange={(e) => {
          setCouponTitle(e.target.value);
          if (errors.title) {
            setErrors(prev => ({ ...prev, title: '' }));
          }
        }}
        inputProps={{ maxLength: 60 }}
        helperText={errors.title || `${couponTitle.length}/60 characters`}
        error={!!errors.title}
        sx={{ mb: 3, mt: 2 }}
      />

      {/* Description Input */}
      <DarkTextField
        fullWidth
        label="Add description: Be specific"
        variant="outlined"
        multiline
        rows={2}
        value={couponDescription}
        onChange={(e) => {
          setCouponDescription(e.target.value);
          if (errors.description) {
            setErrors(prev => ({ ...prev, description: '' }));
          }
        }}
        inputProps={{ maxLength: 160 }}
        helperText={errors.description || `${couponDescription.length}/160 characters`}
        error={!!errors.description}
        sx={{ mb: 3 }}
      />

      {/* Choose a background image */}
      <Typography variant="body1" sx={{ fontFamily: 'Montserrat, sans-serif', color: 'white', mb: 2, textAlign: "start" }}>
        Choose a background image
      </Typography>
      {errors.image && (
        <Typography variant="body2" sx={{ color: '#ff6b6b', mb: 1, fontSize: '0.85rem' }}>
          {errors.image}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: '10px', mb: 4, overflowX: 'auto', pb: 1 }}>
        {imagesLoading ? (
          <ImagesSkeleton />
        ) : imagesError ? (
          <Typography sx={{ color: '#ff6b6b' }}>Failed to load images. Please try again.</Typography>
        ) : bgImages.length > 0 ? (
          bgImages.map((image) => {
            const imageUrl = getImageUrl(image.path);
            return (
              <Box
                key={image._id}
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '8px',
                  border: `3px solid ${selectedBackgroundImage === image._id ? '#D4AF37' : (errors.image ? '#ff6b6b' : '#555')}`,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#D4AF37',
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={() => {
                  setSelectedBackgroundImage(image._id);
                  if (errors.image) {
                    setErrors(prev => ({ ...prev, image: '' }));
                  }
                }}
              >
                <img
                  src={imageUrl}
                  alt="Background"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    console.error('Image failed to load:', imageUrl);
                    e.target.style.display = 'none';
                    e.target.parentElement.style.backgroundColor = '#333';
                    e.target.parentElement.innerHTML = '<span style="color: white; font-size: 10px;">Error</span>';
                  }}
                />
              </Box>
            );
          })
        ) : (
          <Typography sx={{ color: '#999' }}>No images available</Typography>
        )}
      </Box>

      {/* Choose category */}
      <Typography variant="body1" sx={{ fontFamily: 'Montserrat, sans-serif', color: 'white', mb: 2, textAlign: "start" }}>
        Choose a category for your coupon
      </Typography>
      {errors.category && (
        <Typography variant="body2" sx={{ color: '#ff6b6b', mb: 1, fontSize: '0.85rem' }}>
          {errors.category}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', mb: 5 }}>
        {categoriesLoading ? (
          <CategoriesSkeleton />
        ) : categoriesError ? (
          <Typography sx={{ color: '#ff6b6b' }}>Failed to load categories. Please try again.</Typography>
        ) : categoriesAll.length > 0 ? (
          categoriesAll.map((category) => (
            <CategoryChip
              key={category._id}
              selected={selectedCategory === category._id}
              onClick={() => handleCategoryClick(category._id)}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>{category.name}</span>
                  {category.emoji}
                </Box>
              }
              sx={{
                border: errors.category && selectedCategory !== category._id
                  ? '1px solid #ff6b6b'
                  : selectedCategory === category._id
                    ? '2px solid #D4AF37'
                    : '1px solid #555'
              }}
            />
          ))
        ) : (
          <Typography sx={{ color: '#999' }}>No categories available</Typography>
        )}
      </Box>

      {/* Add Coupon Button */}
      <Button
        variant="contained"
        onClick={handleAddCoupon}
        disabled={isSubmitting || imagesLoading || categoriesLoading}
        sx={{
          background: isSubmitting
            ? '#555'
            : 'linear-gradient(to right, #D4AF37, #A88F3A)',
          color: 'black',
          fontWeight: 'bold',
          fontFamily: 'Montserrat, sans-serif',
          textTransform: 'none',
          borderRadius: '8px',
          padding: '12px 30px',
          width: '100%',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            background: isSubmitting
              ? '#555'
              : 'linear-gradient(to right, #BF9B30, #927C2B)',
          },
          '&:disabled': {
            color: '#999',
          }
        }}
      >
        {isSubmitting ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} sx={{ color: '#999' }} />
            <span>Creating...</span>
          </Box>
        ) : (
          'Add Coupon'
        )}
      </Button>

    </Box>
  );
};

export default CreateAdminCoupons;
