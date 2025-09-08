import React, { useState, useEffect } from 'react';
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
  FiTrash2,
  FiMessageCircle
} from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import axios from '../../../system/axios';
const PostHeaderAcc = ({ 
  post = {
    _id: null,
    user: {},
    likes: { count: 0, users: [] },
    dislikes: { count: 0, users: [] },
    commentsCount: 0,
    createdAt: new Date().toISOString()
  }, 
  onDelete = () => {},
  onPostUpdate = () => {},
  onCommentClick = () => {}
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
  const [localCommentsCount, setLocalCommentsCount] = useState(safePost.commentsCount || 0);
  useEffect(() => {
    setLocalCommentsCount(safePost.commentsCount || 0);
  }, [safePost.commentsCount]);
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
    if (user.avatarUrl.startsWith('/')) return `https://z5zk8q777zbt.soon-night.xyz${user.avatarUrl}`;
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

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); 

  if (diff < 60) return "только что";
  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins} ${mins === 1 ? "минуту" : mins < 5 ? "минуты" : "минут"} назад`;
  }
  if (diff < 86400) {
    const hrs = Math.floor(diff / 3600);
    return `${hrs} ${hrs === 1 ? "час" : hrs < 5 ? "часа" : "часов"} назад`;
  }
  if (diff < 2592000) {
    const days = Math.floor(diff / 86400);
    return `${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"} назад`;
  }
  if (diff < 31536000) {
    const months = Math.floor(diff / 2592000);
    return `${months} ${months === 1 ? "месяц" : months < 5 ? "месяца" : "месяцев"} назад`;
  }
  const years = Math.floor(diff / 31536000);
  return `${years} ${years === 1 ? "год" : years < 5 ? "года" : "лет"} назад`;
};

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
      <span  style={{ 
    display: 'inline-flex',   
    alignItems: 'center',     
    verticalAlign: 'middle',
    marginLeft: 2,
    height: '12px'            
  }}
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size+10} 
    height={size+10} 
    viewBox="0 0 48 48" 
    style={{ display: "block" }} 
  >
<path fill="#F44336" d="M23.65,24.898c-0.998-1.609-1.722-2.943-2.725-5.455C19.229,15.2,31.24,11.366,26.37,3.999c2.111,5.089-7.577,8.235-8.477,12.473C17.07,20.37,23.645,24.898,23.65,24.898z"></path><path fill="#F44336" d="M23.878,17.27c-0.192,2.516,2.229,3.857,2.299,5.695c0.056,1.496-1.447,2.743-1.447,2.743s2.728-0.536,3.579-2.818c0.945-2.534-1.834-4.269-1.548-6.298c0.267-1.938,6.031-5.543,6.031-5.543S24.311,11.611,23.878,17.27z"></path><g><path fill="#1565C0" d="M32.084 25.055c1.754-.394 3.233.723 3.233 2.01 0 2.901-4.021 5.643-4.021 5.643s6.225-.742 6.225-5.505C37.521 24.053 34.464 23.266 32.084 25.055zM29.129 27.395c0 0 1.941-1.383 2.458-1.902-4.763 1.011-15.638 1.147-15.638.269 0-.809 3.507-1.638 3.507-1.638s-7.773-.112-7.773 2.181C11.683 28.695 21.858 28.866 29.129 27.395z"></path><path fill="#1565C0" d="M27.935,29.571c-4.509,1.499-12.814,1.02-10.354-0.993c-1.198,0-2.974,0.963-2.974,1.889c0,1.857,8.982,3.291,15.63,0.572L27.935,29.571z"></path><path fill="#1565C0" d="M18.686,32.739c-1.636,0-2.695,1.054-2.695,1.822c0,2.391,9.76,2.632,13.627,0.205l-2.458-1.632C24.271,34.404,17.014,34.579,18.686,32.739z"></path><path fill="#1565C0" d="M36.281,36.632c0-0.936-1.055-1.377-1.433-1.588c2.228,5.373-22.317,4.956-22.317,1.784c0-0.721,1.807-1.427,3.477-1.093l-1.42-0.839C11.26,34.374,9,35.837,9,37.017C9,42.52,36.281,42.255,36.281,36.632z"></path><path fill="#1565C0" d="M39,38.604c-4.146,4.095-14.659,5.587-25.231,3.057C24.341,46.164,38.95,43.628,39,38.604z"></path></g>
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
      mb: 1.5
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
              cursor: 'pointer'
            }}
            onClick={() => user._id && navigate(`/account/${user._id}`)}
          >
            {user.fullName || 'Аноним'}
            <StatusBadge user={user} />
          </Typography>
          <Typography sx={{ fontSize: '10px', color: 'rgba(155, 155, 155, 1)', lineHeight: '1.2' }}>
            {user.username || 'У него нет ника вроде'}
          </Typography>
        </Box>
      </Box>

   
<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
  <span
    style={{
      fontWeight: 500,
      fontSize: '10px',
      color: 'rgb(150,150,150)',
    }}
  >

  </span>
  <span
    style={{
      fontSize: '12px',
      color: 'rgb(120,120,120)',
      marginTop: 1,
    }}
  >
  {formatTimeAgo(safePost.createdAt)}

  </span>
</Box></Box>

  );
};

export default PostHeaderAcc;
