import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  useMediaQuery, 
  Button, 
  Divider, 
  IconButton, 
  Tooltip,
  CircularProgress
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import axios from '../../system/axios';
import userService from '../../system/userService';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PostPhoto from '../main/post/PostPhoto';
import PostHeaderAcc from '../main/post/PostHeadeAcc';
import PostText from '../main/post/PostText';
import '../../fonts/stylesheet.css';

// Функция для форматирования даты в стиле 'Вторник 25 июня 2025'
function formatDateRu(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Галочка для админа/верифицированного
const VerifiedBadgeSVG = ({ size = 22 }) => (
  <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={size} height={size} style={{ display: 'inline' }}>
      <polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/>
      <polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/>
    </svg>
  </span>
);

const AdminBadgeSVG = ({ size = 22 }) => (<>
  <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline' }}>
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
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#f05138" d="M126.33 34.06a39.32 39.32 0 00-.79-7.83 28.78 28.78 0 00-2.65-7.58 28.84 28.84 0 00-4.76-6.32 23.42 23.42 0 00-6.62-4.55 27.27 27.27 0 00-7.68-2.53c-2.65-.51-5.56-.51-8.21-.76H30.25a45.46 45.46 0 00-6.09.51 21.82 21.82 0 00-5.82 1.52c-.53.25-1.32.51-1.85.76a33.82 33.82 0 00-5 3.28c-.53.51-1.06.76-1.59 1.26a22.41 22.41 0 00-4.76 6.32 23.61 23.61 0 00-2.65 7.58 78.5 78.5 0 00-.79 7.83v60.39a39.32 39.32 0 00.79 7.83 28.78 28.78 0 002.65 7.58 28.84 28.84 0 004.76 6.32 23.42 23.42 0 006.62 4.55 27.27 27.27 0 007.68 2.53c2.65.51 5.56.51 8.21.76h63.22a45.08 45.08 0 008.21-.76 27.27 27.27 0 007.68-2.53 30.13 30.13 0 006.62-4.55 22.41 22.41 0 004.76-6.32 23.61 23.61 0 002.65-7.58 78.49 78.49 0 00.79-7.83V34.06z"/><path fill="#fefefe" d="M85 96.5c-11.11 6.13-26.38 6.76-41.75.47A64.53 64.53 0 0113.84 73a50 50 0 0010.85 6.32c15.87 7.1 31.73 6.61 42.9 0-15.9-11.66-29.4-26.82-39.46-39.2a43.47 43.47 0 01-5.29-6.82c12.16 10.61 31.5 24 38.38 27.79a271.77 271.77 0 01-27-32.34 266.8 266.8 0 0044.47 34.87c.71.38 1.26.7 1.7 1a32.7 32.7 0 001.21-3.51c3.71-12.89-.53-27.54-9.79-39.67C93.25 33.81 106 57.05 100.66 76.51c-.14.53-.29 1-.45 1.55l.19.22c10.59 12.63 7.68 26 6.35 23.5C101 91 90.37 94.33 85 96.5z"/></svg>
  </span>
</>);

const StatusBadge = ({ profile, size = 22 }) => {
  if (profile.accountType === 'admin') return <><VerifiedBadgeSVG size={size} /><AdminBadgeSVG size={size} /></>;
  if (profile.accountType === 'verified_user' || profile.verified === 'verified') return <VerifiedBadgeSVG size={size} />;
  return null;
};


const Profile = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    user: null,
    posts: [],
    isSubscribed: false,
    followersCount: 0,
    subscriptionsCount: 0,
    isLoading: true,
    error: null,
    loadingPosts: true
  });
  const [copied, setCopied] = useState({ username: false, regdate: false, id: false, about: false });
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
       const [profileData, postsRes] = await Promise.all([
          userService.getUserById(id),
          axios.get(`/posts/user/${id}`)
        ]);
        
        const userData = profileData;
        const currentUser = await userService.getCurrentUser();
        const currentUserId = currentUser?._id || currentUser?.id;
        const profileUserId = userData._id || userData.id;
        
        console.log('DEBUG:', { currentUserId, profileUserId, isEqual: currentUserId === profileUserId });
        
        const isCurrentUser = currentUserId === profileUserId;
        
       let isSubscribed = false;
        if (!isCurrentUser && currentUserId) {
          isSubscribed = userData.followers?.some(follower => 
            (follower === currentUserId) || (follower._id === currentUserId)
          ) || false;
        }
        
        setState(prev => ({
          ...prev,
          user: userData,
          posts: postsRes.data || [],
          isSubscribed,
          followersCount: Array.isArray(userData.followers) ? userData.followers.length : 0,
          subscriptionsCount: Array.isArray(userData.subscriptions) ? userData.subscriptions.length : 0,
          isLoading: false,
          loadingPosts: false
        }));
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          loadingPosts: false,
          error: err.response?.data?.message || err.message || 'Ошибка загрузки данных'
        }));
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      const token = userService.getToken();
      if (!token) return navigate('/login');
      
      const method = state.isSubscribed ? 'delete' : 'post';
      await axios[method](`/auth/${state.isSubscribed ? 'unsubscribe' : 'subscribe'}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setState(prev => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        followersCount: prev.isSubscribed 
          ? prev.followersCount - 1 
          : prev.followersCount + 1
      }));
    } catch (err) {
      console.error('Ошибка подписки:', err);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 1500);
    });
  };

  if (!id) return <Navigate to="/" replace />;
  
  if (state.isLoading) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
    }}>
      <CircularProgress color="primary" />
    </Box>
  );
  
  if (state.error || !state.user) return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: 2,
      color: 'white'
    }}>
      <Typography variant="h6">Ошибка: {state.error || 'Пользователь не найден'}</Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate(-1)}
        sx={{
          backgroundColor: 'rgba(56, 64, 73, 1)',
          '&:hover': {
            backgroundColor: 'rgba(56, 64, 73, 0.8)',
          }
        }}
      >
        Назад
      </Button>
    </Box>
  );

  const profile = state.user;
  const userId = profile?._id || profile?.id || '';
  const myUser = JSON.parse(localStorage.getItem('user'));
  const myId = myUser?._id || myUser?.id;
  const isCurrentUser = myId === userId;
  
  console.log('RENDER DEBUG:', { myId, userId, isCurrentUser });
  const username = profile.username || profile.login || '';
  const regdate = profile.regdate || profile.createdAt || '';
  const about = profile.about || '';
  const avatarUrl = profile.avatarUrl ? `https://atomglidedev.ru${profile.avatarUrl}` : '';
  const coverUrl = profile.coverUrl ? `https://atomglidedev.ru${profile.coverUrl}` : '';
  const awards = profile.awards || [];
  const postsCount = state.posts.length;
  const followersCount = Array.isArray(profile.followers) ? profile.followers.length : state.followersCount;
  const subscriptionsCount = Array.isArray(profile.subscriptions) ? profile.subscriptions.length : state.subscriptionsCount;
  const socialMedia = profile.socialMedia || {};
  const balance = typeof profile.balance === 'number' ? profile.balance : 0;

  return (
    <Box
      sx={{
        maxWidth: isMobile ? '100vw' : '450px',
        width: isMobile ? '100vw' : '450px',
        minWidth: isMobile ? '0' : '200px',
        height: isMobile ? 'calc(100vh - 60px)' : '100vh',
        flex: 1,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
          width: '0px',
          background: 'transparent',
        },
        paddingBottom: isMobile ? '70px' : 0,
        px: isMobile ? 2 : 0,
        pt: isMobile ? 0 : 0,
        mt: isMobile ? 0 : 0,
      }}
    >
      <Box sx={{ 
        width: '100%', 
        height: '205px', 
        position: 'relative', 
        overflow: 'hidden', 
        marginTop: '5px',
        background: coverUrl ? undefined : 'linear-gradient(120deg, #b2c2e0 0%, #e0e0e0 100%)'
      }}>
        {coverUrl && (
          <img
            src={coverUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            alt="cover"
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0) 100%)',
            transition: 'background 0.5s'
          }}
        />
        <Box
          component="span"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '48%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            boxShadow: 2,
            background: avatarUrl ? 'white' : 'linear-gradient(135deg, #b2c2e0 0%, #e0e0e0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontSize: 38,
            color: '#fff',
            fontWeight: 700,
            fontFamily: 'Inter, Arial, sans-serif',
            userSelect: 'none',
            p: 0
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            <svg width="76" height="76" viewBox="0 0 48 48" fill="none" style={{display:'block'}} xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#b2c2e0" />
              <path d="M24 14c-4.418 0-8 3.134-8 7s3.582 7 8 7 8-3.134 8-7-3.582-7-8-7zm0 2c3.314 0 6 2.239 6 5s-2.686 5-6 5-6-2.239-6-5 2.686-5 6-5zm0 14c-5.33 0-16 2.686-16 8v2a2 2 0 002 2h28a2 2 0 002-2v-2c0-5.314-10.67-8-16-8zm-14 8c0-3.314 8.954-6 14-6s14 2.686 14 6v2H10v-2z" fill="#fff"/>
            </svg>
          )}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: '30%',
            background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.13) 70%, rgba(0, 0, 0, 0) 100%)',
            borderRadius: '10px',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '165px',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.5px',
            fontSize: '25px',
            zIndex: 2
          }}
        >
          <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220, display: 'inline-block'}}>
            {profile.fullName || profile.name || username}
          </span>
          <StatusBadge profile={profile} size={22} />
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: '70px',
          marginTop: isMobile ? '10px' : '10px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: isMobile ? 2 : 0,
        }}
      >
        <Box sx={{ flex: 1, textAlign: 'center', zIndex: 1 }}>
          <Typography variant="caption" color="rgba(255, 255, 255, 1)">Постов</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Inter, sans-serif' ,color:"rgba(200, 200, 200, 1)"}}>{postsCount}</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center', zIndex: 1 }}>
          <Typography variant="caption" color="rgba(255, 255, 255, 1)">Подписчики</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Inter, sans-serif',color:"rgba(200, 200, 200, 1)" }}>{followersCount}</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center', zIndex: 1 }}>
          <Typography variant="caption" color="rgba(255, 255, 255, 1)">Награды</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Inter, sans-serif',color:"rgba(200, 200, 200, 1)" }}>{awards.length}</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center', zIndex: 1 }}>
          <Typography variant="caption" color="rgba(255, 255, 255, 1)">Подписок</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Inter, sans-serif',color:"rgba(200, 200, 200, 1)" }}>{Math.max(0, subscriptionsCount)}</Typography>
        </Box>
      </Box>

      {/* Кнопка подписки */}
      {!isCurrentUser && (
        <Button
          sx={{ 
            width: '100%',
            backgroundColor: state.isSubscribed ? 'rgba(194, 194, 194, 1)' : 'white',
            color: 'black',
            borderRadius: '50px',
            marginTop: '10px',
            fontWeight: 'Bold',
            fontSize: '11px',
            '&:hover': {
              backgroundColor: state.isSubscribed ? 'rgba(0,0,0,0.8)' : 'primary.dark'
            }
          }}
          disabled={isSubscribing}
          onClick={handleSubscribe}
        >
          {state.isSubscribed ? 'Отписаться' : 'Подписаться'}
          {isSubscribing && <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />}
        </Button>
      )}

      <Box sx={{ px: isMobile ? 2 : 0, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0 ,color:'rgba(196, 196, 196, 1)'}}>Юзернейм</Typography>
          <Tooltip title={copied.username ? 'Скопировано!' : 'Скопировать'}>
            <IconButton size="small" onClick={() => handleCopy('username', username)}>
              {copied.username ? <CheckIcon color="success" fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        <Typography sx={{ fontFamily: 'Yandex Sans', paddingTop: '0px', paddingLeft: '20px', color: 'rgba(153, 152, 169, 1)' }}>
          {username}
        </Typography>
        <Divider sx={{ my: 1.5 , bgcolor:'rgba(47, 47, 47, 1)' , pl:1,pr:1,borderRadius:'10px'}} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0 , color:'rgba(196, 196, 196, 1)'}}>Дата регистрации</Typography>
          <Tooltip title={copied.regdate ? 'Скопировано!' : 'Скопировать'}>
            <IconButton size="small" onClick={() => handleCopy('regdate', regdate)}>
              {copied.regdate ? <CheckIcon color="success" fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        <Typography sx={{ fontFamily: 'Yandex Sans', paddingTop: '0px', paddingLeft: '20px', color: 'rgb(96, 93, 125)' }}>
          {formatDateRu(regdate)}
        </Typography>
        <Divider sx={{ my: 1.5 , bgcolor:'rgba(47, 47, 47, 1)' , pl:1,pr:1,borderRadius:'10px'}} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0 , color:'rgba(196, 196, 196, 1)'}}>ID</Typography>
          <Tooltip title={copied.id ? 'Скопировано!' : 'Скопировать'}>
            <IconButton size="small" onClick={() => handleCopy('id', userId)}>
              {copied.id ? <CheckIcon color="success" fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        <Typography sx={{ fontFamily: 'Yandex Sans', paddingTop: '0px', paddingLeft: '20px', color: 'rgb(96, 93, 125)' }}>
          {userId}
        </Typography>
        <Divider sx={{ my: 1.5 , bgcolor:'rgba(47, 47, 47, 1)' , pl:1,pr:1,borderRadius:'10px'}} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0, color:'rgba(196, 196, 196, 1)'}}>О себе</Typography>
          <Tooltip title={copied.about ? 'Скопировано!' : 'Скопировать'}>
            <IconButton size="small" onClick={() => handleCopy('about', about)}>
              {copied.about ? <CheckIcon color="success" fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        <Typography sx={{ 
          fontFamily: 'Yandex Sans', 
          paddingTop: '0px', 
          paddingLeft: '20px', 
          color:'rgba(196, 196, 196, 1)',
          fontWeight:800
        }}>
          {about || 'Нет информации'}
        </Typography>
      
        <Divider sx={{ my: 1.5 , bgcolor:'rgba(47, 47, 47, 1)' , pl:1,pr:1,borderRadius:'10px'}} />

        {isCurrentUser && (
          <>
            <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0  , color:'rgba(196, 196, 196, 1)'}}>
              Баланс
            </Typography>
            <Typography sx={{ fontFamily: 'Yandex Sans', paddingTop: '0px', paddingLeft: '20px', color: 'rgb(96, 93, 125)' }}>
              {balance} AGT
            </Typography>
            <Divider sx={{ my: 1.5 }} />
          </>
        )}

        <Typography sx={{ fontWeight: 'Bold', paddingLeft: '20px', marginBottom: 0, paddingBottom: 0 , color:'rgba(196, 196, 196, 1)'}}>Награды</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
          {awards.length > 0 ? awards.map((award, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', m: 1 }}>
              <img 
                src={award.image || 'https://www.pngarts.com/files/12/Award-PNG-Pic.png'} 
                style={{ width: '60px', height: '60px', marginRight: '10px' }} 
                alt={award.title || 'award'} 
              />
              <Box>
                <Typography sx={{ fontFamily: 'Yandex Sans', fontSize: '16px', color:'rgba(196, 196, 196, 1)',fontWeight:'Bold'}}>{award.title}</Typography>
                <Typography sx={{ fontFamily: 'Yandex Sans', fontWeight: 'Light', color: 'rgb(126, 126, 126)', fontSize: '12px' }}>
                  {award.description}
                </Typography>
              </Box>
            </Box>
          )) : <Typography sx={{ ml: 2 }}>Нет наград</Typography>}
        </Box>
      </Box>

      <Box sx={{ mt: 3, px: isMobile ? 2 : 0 }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 'bold', 
          mb: 2, 
          px: 2,
          display: 'flex',
          alignItems: 'center',
          color:'rgba(255, 255, 255, 1)'
        }}>
          Посты пользователя
          {state.loadingPosts && (
            <CircularProgress size={20} sx={{ ml: 1 }} />
          )}
        </Typography>

        {state.posts.length === 0 && !state.loadingPosts ? (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 3 }}>
            Пользователь еще не создал ни одного поста
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {state.posts.map((post) => (
              <Box 
                key={post._id} 
                sx={{ 
                  backgroundColor: 'rgba(34, 40, 47, 1)',
                  borderRadius: 2,
                  boxShadow: 1,
                  p: 2
                }}
              >
                <PostHeaderAcc post={post} />
                    {post.imageUrl && (
                  <PostPhoto post={post} />
                )}
               <PostText>
            <span style={{ fontSize: '1rem', fontWeight: 200 }}>
              {post.title || 'Этот пост не имеет текст :/'}
            </span>
          </PostText>
                
                
            
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 1, 
                    display: 'block',
                    color: 'gray',
                    paddingLeft: '10px'
                  }}
                >
                  {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Typography
        sx={{
          fontSize: '10px',
          color: 'rgb(120,120,120)',
          marginTop: '10px',
          marginBottom: '30px',
          marginLeft: '1px',
          fontFamily: "'JetBrains Mono', monospace",
          width: '100%',
          textAlign: 'center'
        }}
      >
        Данные от AtomGlide Network
      </Typography>
    </Box>
  );
};

export default Profile;