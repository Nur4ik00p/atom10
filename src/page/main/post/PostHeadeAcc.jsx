import React, { useState } from 'react';
import { 
  Box, 
  Avatar, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText
} from '@mui/material';
import { 
  FiThumbsUp, 
  FiThumbsDown, 
  FiMoreHorizontal, 
  FiTrash2
} from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import axios from '../../../system/axios';

const PostHeaderAcc = ({ 
  post = {
    _id: null,
    user: {},
    likes: { count: 0, users: [] },
    dislikes: { count: 0, users: [] },
    createdAt: new Date().toISOString()
  }, 
  onDelete = () => {},
  onPostUpdate = () => {}
}) => {
  const safePost = {
    ...post,
    user: post.user || {},
    likes: {
      count: post.likes?.count || 0,
      users: post.likes?.users || []
    },
    dislikes: {
      count: post.dislikes?.count || 0,
      users: post.dislikes?.users || []
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [localLikes, setLocalLikes] = useState(safePost.likes.count);
  const [localDislikes, setLocalDislikes] = useState(safePost.dislikes.count);
  const [userReaction, setUserReaction] = useState(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;
    if (safePost.likes.users.includes(userId)) return 'like';
    if (safePost.dislikes.users.includes(userId)) return 'dislike';
    return null;
  });
  
  const open = Boolean(anchorEl);
  const user = safePost.user;
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const isAuthor = user._id === userId;

  const handleMenuClose = () => setAnchorEl(null);

  const getAvatarUrl = () => {
    if (!user?.avatarUrl) return undefined;
    if (user.avatarUrl.startsWith('http')) return user.avatarUrl;
    if (user.avatarUrl.startsWith('/')) return `https://atomglidedev.ru${user.avatarUrl}`;
    return undefined;
  };

  const VerifiedBadgeSVG = ({ size = 16 }) => (
    <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 3 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={size} height={size}>
        <polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/>
        <polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/>
      </svg>
    </span>
  );

  const AdminBadgeSVG = ({ size = 16 }) => (
    <>
      <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 3 }}>
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_25_31)"/>
          <line x1="18" y1="7" x2="18" y2="19" stroke="#FFCC00" strokeWidth="2"/>
          <line x1="23" y1="21" x2="23" y2="33" stroke="#FFE100" strokeWidth="2"/>
          <line x1="34" y1="18" x2="22" y2="18" stroke="#FFCC00" strokeWidth="2"/>
          <line x1="19" y1="22" x2="7" y2="22" stroke="#FFCC00" strokeWidth="2"/>
          <defs>
            <linearGradient id="paint0_linear_25_31" x1="26" y1="1.5" x2="10" y2="37.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F6A800"/>
              <stop offset="1" stopColor="#CC9910"/>
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>
        <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
          <path fill="#f05138" d="M126.33 34.06a39.32 39.32 0 00-.79-7.83 28.78 28.78 0 00-2.65-7.58 28.84 28.84 0 00-4.76-6.32 23.42 23.42 0 00-6.62-4.55 27.27 27.27 0 00-7.68-2.53c-2.65-.51-5.56-.51-8.21-.76H30.25a45.46 45.46 0 00-6.09.51 21.82 21.82 0 00-5.82 1.52c-.53.25-1.32.51-1.85.76a33.82 33.82 0 00-5 3.28c-.53.51-1.06.76-1.59 1.26a22.41 22.41 0 00-4.76 6.32 23.61 23.61 0 00-2.65 7.58 78.5 78.5 0 00-.79 7.83v60.39a39.32 39.32 0 00.79 7.83 28.78 28.78 0 002.65 7.58 28.84 28.84 0 004.76 6.32 23.42 23.42 0 006.62 4.55 27.27 27.27 0 007.68 2.53c2.65.51 5.56.51 8.21.76h63.22a45.08 45.08 0 008.21-.76 27.27 27.27 0 007.68-2.53 30.13 30.13 0 006.62-4.55 22.41 22.41 0 004.76-6.32 23.61 23.61 0 002.65-7.58 78.49 78.49 0 00.79-7.83V34.06z"/>
          <path fill="#fefefe" d="M85 96.5c-11.11 6.13-26.38 6.76-41.75.47A64.53 64.53 0 0113.84 73a50 50 0 0010.85 6.32c15.87 7.1 31.73 6.61 42.9 0-15.9-11.66-29.4-26.82-39.46-39.2a43.47 43.47 0 01-5.29-6.82c12.16 10.61 31.5 24 38.38 27.79a271.77 271.77 0 01-27-32.34 266.8 266.8 0 0044.47 34.87c.71.38 1.26.7 1.7 1a32.7 32.7 0 001.21-3.51c3.71-12.89-.53-27.54-9.79-39.67C93.25 33.81 106 57.05 100.66 76.51c-.14.53-.29 1-.45 1.55l.19.22c10.59 12.63 7.68 26 6.35 23.5C101 91 90.37 94.33 85 96.5z"/>
        </svg>
      </span>
    </>
  );

  const StatusBadge = ({ user }) => {
    if (!user) return null;
    if (user.accountType === 'admin') return <><VerifiedBadgeSVG /><AdminBadgeSVG /></>;
    if (user.accountType === 'verified_user' || user.verified === 'verified') return <VerifiedBadgeSVG />;
    return null;
  };

  const handleReaction = async (type) => {
    if (type === 'like') {
      setLocalLikes(prev => userReaction === 'like' ? prev - 1 : prev + 1);
      if (userReaction === 'dislike') setLocalDislikes(prev => prev - 1);
      setUserReaction(userReaction === 'like' ? null : 'like');
    } else {
      setLocalDislikes(prev => userReaction === 'dislike' ? prev - 1 : prev + 1);
      if (userReaction === 'like') setLocalLikes(prev => prev - 1);
      setUserReaction(userReaction === 'dislike' ? null : 'dislike');
    }

    try {
      const token = localStorage.getItem('token');
      if (!token || !safePost._id) return;

      const endpoint = `posts/${safePost._id}/${type}`;
      const response = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.post) {
        onPostUpdate(response.data.post);
      }
    } catch (error) {
      console.error(`Ошибка ${type}:`, error);
      if (type === 'like') {
        setLocalLikes(prev => userReaction === 'like' ? prev + 1 : prev - 1);
        if (userReaction === 'dislike') setLocalDislikes(prev => prev + 1);
      } else {
        setLocalDislikes(prev => userReaction === 'dislike' ? prev + 1 : prev - 1);
        if (userReaction === 'like') setLocalLikes(prev => prev + 1);
      }
      setUserReaction(userReaction);
    }
  };

  const handleDelete = async () => {
    handleMenuClose();
    try {
      const token = localStorage.getItem('token');
      if (!token || !safePost._id) return;
      
      await axios.delete(`posts/${safePost._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDelete(safePost._id);
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      mb: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={getAvatarUrl()}
          sx={{ 
            width: 32, 
            height: 32, 
            mr: 1, 
            cursor: 'pointer',
            backgroundColor: 'rgb(78, 78, 78)',
            fontSize: '14px',
            fontWeight: 'bold',
            border: 'solid rgba(86, 86, 86, 1) 1px'
          }}
          onClick={() => user._id && navigate(`/account/${user._id}`)}
        >
          {!getAvatarUrl() && (user.fullName?.[0]?.toUpperCase() || '?')}
        </Avatar>
        
        <Box sx={{ ml: 0.5 }}>
          <Typography
            variant="subtitle2"
            sx={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              color: 'rgba(209, 209, 209, 1)', 
              lineHeight: '1.2',
              cursor: 'pointer'
            }}
            onClick={() => user._id && navigate(`/account/${user._id}`)}
          >
            {user.fullName || 'Аноним'}
            <StatusBadge user={user} />
          </Typography>
          <Typography sx={{ fontSize: '10px', color: 'rgba(155, 155, 155, 1)', lineHeight: '1.2' }}>
            {user.username || 'user'}
          </Typography>
        </Box>
      </Box>

      
    </Box>
  );
};

export default PostHeaderAcc;