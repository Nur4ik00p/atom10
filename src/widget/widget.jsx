import React, { useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, IconButton, Badge, CircularProgress,Avatar } from '@mui/material';
import axios from '../system/axios';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSelector } from 'react-redux';
import { selectUser } from '../system/redux/slices/getme';
import { customIcons } from '../components/icon';
import { getRandomWord } from '../system/randomword';
import { useMediaQuery } from '@mui/material';

const fadeInStyle = {
  opacity: 1,
  transform: 'translateY(0)',
  transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)',
};
const fadeOutStyle = {
  opacity: 0,
  transform: 'translateY(40px)',
};

const DateTimeNow = () => {
  const [now, setNow] = useState(new Date());
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = [
    'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
    'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
  ];

  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  

  const avatarUrl = user?.avatarUrl ? `https://z5zk8q777zbt.soon-night.xyz${user.avatarUrl}` : '';
  const userName = user?.fullName || user?.name || user?.username || '';

  const handleAvatarClick = () => {
    if (user?.id || user?._id) {
      navigate(`/account/${user.id || user._id}`);
    }
  };

  return (
    <Box sx={{ 
      fontFamily: "'Yandex Sans'",
      marginRight:"30px",
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      <Typography sx={{
        fontSize: '14px',
        color: 'rgba(226, 226, 226, 0.8)',
        fontFamily: "'Yandex Sans'",
        marginRight:'5px',
      }}>
      {userName}
      </Typography>
      <Avatar 
        src={avatarUrl} 
        onClick={handleAvatarClick}
        sx={{
          height: '45px',
          width: '45px',
          bgcolor: avatarUrl ? 'transparent' : 'rgba(226, 226, 226, 0.2)',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          }
        }}
      >
        {!avatarUrl && userName ? userName.charAt(0).toUpperCase() : 'U'}
      </Avatar>
    </Box>
  );
};


function ThrowErrorButton() {
  const [error, setError] = useState(false);
  if (error) {
    throw new Error('Это кастомная ошибка!');
  }
  return (
    <button
      onClick={() => setError(true)}
      style={{
        margin: 20,
        padding: 10,
        background: '#b71c1c',
        color: 'white',
        border: 'none',
        borderRadius: 5,
        fontWeight: 'bold',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 16,
        cursor: 'pointer',
      }}
    >
      Вызвать ошибку
    </button>
  );
}

const WidgetMain = React.memo(() => {
  const [count, setCount] = useState(null);
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [noth, setnoth] = useState(null);
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [randomWord, setRandomWord] = useState(getRandomWord());
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
const [usersCount, setUsersCount] = useState(null);

useEffect(() => {
  axios.get('/usersCount')   
    .then(res => {
      setUsersCount(res.data.count);
    })
    .catch(err => {
      console.error("Ошибка при получении количества пользователей:", err);
    });
}, []);

  useEffect(() => {
    setLoading(true);
    axios.get('/postNumbers')
      .then(res => {
        setCount(res.data.posts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка при получении данных:', err);
        setLoading(false);
      });
    
    mountedRef.current = true;
    setTimeout(() => setMounted(true), 50);
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const fetchNotifications = () => {
      axios.get('/notifications')
        .then(res => {
          const sortedNotifications = res.data.sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt || 0);
            const dateB = new Date(b.date || b.createdAt || 0);
            return dateB - dateA;
          });
          setnoth(sortedNotifications);
        })
        .catch(err => console.error('Ошибка при получении уведомлений:', err));
    };
    fetchNotifications();
    const handler = () => fetchNotifications();
    window.addEventListener('refresh-notifications', handler);
    return () => window.removeEventListener('refresh-notifications', handler);
  }, []);

  useEffect(() => {
    const fetchBalance = () => {
      axios.get('/auth/balance')
        .then(res => setBalance(res.data.balance))
        .catch(() => setBalance('...'));
    };
    fetchBalance();
    const handler = () => fetchBalance();
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setRandomWord(getRandomWord());
        setFade(true);
      }, 400);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClearNotifications = async () => {
    try {
      await axios.post('/auth/clear-notifications');
      setnoth([]);
    } catch (err) {
      alert('Ошибка при очистке уведомлений');
    }
  };

  const cards = [
    {
      label: 'Постов',
      value: count,
      bg: 'linear-gradient(135deg, rgb(255, 255, 255), rgb(255, 255, 255))',
      ml: '15px',
      mr: undefined,
      color: 'rgba(138, 135, 219, 1)',
    },
    {
    label: 'Юзеров',  
    value: usersCount ?? 'Хз',
    color: 'rgba(255, 200, 100, 1)',
    mr: '15px',
  },
    {
      label: 'Версия',
      value: 10,
      bg: 'linear-gradient(135deg, rgb(255, 255, 255), rgb(255, 255, 255))',
      ml: '15px',
      mr: undefined,
      color: 'rgba(219, 153, 135, 1)',
    },
    {
      label: 'Баланс',
      value: balance === null ? 'Нема' : Math.floor(balance),
      bg: 'linear-gradient(135deg, rgb(255, 255, 255), rgb(255, 255, 255))',
      ml: undefined,
      mr: '15px',
      color: 'rgba(219, 153, 135, 1)',
    },
    {
      label: 'Онлайн',
      value: 127,
      bg: 'linear-gradient(135deg, rgb(255, 255, 255), rgb(255, 255, 255))',
      ml: '15px',
      mr: undefined,
      color: 'rgba(135, 219, 153, 1)',
    },
    {
      label: 'Активность',
      value: 89,
      bg: 'linear-gradient(135deg, rgb(255, 255, 255), rgb(255, 255, 255))',
      ml: undefined,
      mr: '15px',
      color: 'rgba(219, 135, 219, 1)',
    },
  ];


  const renderWidgets = () => (
    <>


      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mt: 1.3,
          mb: 2,
          width: '100%',
        }}
      >
       
        <Box
          sx={{
            width: '130px',
            height: '120px',
             backgroundColor: 'rgba(17, 17, 17, 1)',
                        border: "solid rgb(34,34,34) 2px",
            borderRadius: 2,
            marginLeft: cards[0].ml,
            marginRight: cards[0].mr,
            position: 'relative',
            overflow: 'hidden',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: mounted ? 'cardBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
            '@keyframes cardBounceIn': {
              '0%': {
                opacity: 0,
                transform: 'scale(0.3)',
              },
              '50%': {
                opacity: 1,
                transform: 'scale(1.05)',
              },
              '70%': {
                transform: 'scale(0.9)',
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1)',
              },
            },
            '&:hover': {
              transform: 'scale(1.05) translateY(-5px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            },
          }}
        >
          <Typography
            sx={{
              position: 'absolute',
              top: 14,
              left: 15,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '20px',
              zIndex: 1,
              animation: 'fadeInLeft 0.6s ease-out 0.2s both',
              '@keyframes fadeInLeft': {
                '0%': {
                  opacity: 0,
                  transform: 'translateX(-20px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            {cards[0].label}
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: 5,
              right: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            {loading ? (
              <CircularProgress 
                size={30} 
                sx={{ 
                  color: cards[0].color,
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }} 
              />
            ) : (
              <Typography
                sx={{
                  fontWeight: 'Bold',
                  color: cards[0].color,
                  fontSize: '40px',
                  animation: 'numberCountUp 1s ease-out 0.5s both',
                  '@keyframes numberCountUp': {
                    '0%': {
                      opacity: 0,
                      transform: 'scale(0.5) translateY(20px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'scale(1) translateY(0)',
                    },
                  },
                }}
              >
                {cards[0].value}
              </Typography>
            )}
          </Box>
        </Box>

        {cards.slice(1, 2).map((card, idx) => (
          <Box
            key={card.label}
            sx={{
              width: '130px',
              height: '120px',
               backgroundColor: 'rgba(17, 17, 17, 1)',
                        border: "solid rgb(34,34,34) 2px",
              borderRadius: 2,
              marginLeft: card.ml,
              marginRight: card.mr,
              position: 'relative',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
              transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 * (idx + 1)}s`,
              animation: mounted ? `cardBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${0.1 * (idx + 1)}s` : 'none',
              '&:hover': {
                transform: 'scale(1.05) translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              },
            }}
          >
            <Typography
              sx={{
                position: 'absolute',
                top: 14,
                left: 15,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px',
                animation: `fadeInLeft 0.6s ease-out ${0.2 + 0.1 * (idx + 1)}s both`,
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                position: 'absolute',
                bottom: 5,
                right: 13,
                fontWeight: 'Bold',
                color: card.color,
                fontSize: '40px',
                animation: `numberCountUp 1s ease-out ${0.5 + 0.1 * (idx + 1)}s both`,
              }}
            >
              {card.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mt: 1.4,
          mb: 2,
          width: '100%',
        }}
      >
        {cards.slice(2, 4).map((card, idx) => (
          <Box
            key={card.label}
            onClick={card.label === 'Баланс' ? () => window.location.href = '/wallet' : undefined}
            sx={{
              width: '130px',
              height: '120px',
 backgroundColor: 'rgba(17, 17, 17, 1)',
                        border: "solid rgb(34,34,34) 2px",              borderRadius: 2,
              marginLeft: card.ml,
              marginRight: card.mr,
              position: 'relative',
              opacity: mounted ? 1 : 0,
              cursor: card.label === 'Баланс' ? 'pointer' : undefined,
              transform: mounted ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
              transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 * (idx + 3)}s`,
              animation: mounted ? `cardBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${0.1 * (idx + 3)}s` : 'none',
              '&:hover': {
                transform: 'scale(1.05) translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              },
            }}
          >
            <Typography
              sx={{
                position: 'absolute',
                top: 14,
                left: 15,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px',
                animation: `fadeInLeft 0.6s ease-out ${0.2 + 0.1 * (idx + 3)}s both`,
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                position: 'absolute',
                bottom: 5,
                right: 13,
                fontWeight: 'Bold',
                color: card.color,
                fontSize: '40px',
                animation: `numberCountUp 1s ease-out ${0.5 + 0.1 * (idx + 3)}s both`,
              }}
            >
              {card.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          width: '90%',
          height: '78px',
          marginTop: '10px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(28, 27, 27, 1), rgba(6, 62, 152, 1))',
          color: 'white',
          textAlign: 'left',
          padding: '5px',
          ml:2,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            marginTop: '10px',
            marginLeft: '10px',
            fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
            fontWeight: 700,
            opacity: fade ? 1 : 0,
            transition: 'opacity 0.4s',
            fontSize: '14px',
          }}
        >
          {randomWord}
        </Typography>
      </Box>
    
    </>
  );

  const renderFullNotifications = () => (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(14, 17, 22, 1)',
        position: 'relative',
        overflowY: 'auto',
        padding: '20px',
        '&::-webkit-scrollbar': {
          width: '0px',
          height: '0px',
        },
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography 
          sx={{ 
            color: 'white', 
            fontWeight: 700, 
            fontSize: 24,
            animation: 'fadeInLeft 0.6s ease-out both',
          }}
        >
          Уведомления
        </Typography>
        <IconButton
          onClick={() => setShowNotifications(false)}
          sx={{
            color: 'rgba(84, 163, 247, 1)',
            backgroundColor: 'rgba(34, 40, 47, 1)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(56, 64, 73, 1)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <ExpandLessIcon />
        </IconButton>
      </Box>

      {noth === null ? (
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 3,
          px: 2
        }}>
          <CircularProgress 
            size={24} 
            sx={{ 
              color: 'rgba(226, 226, 226, 0.9)',
              animation: 'spin 1s linear infinite',
            }} 
          />
          <Typography sx={{ 
            color: 'rgb(225,225,225)',
            fontWeight: 'bold', 
            fontSize: '14px',
            ml: 2
          }}>
            Загрузка...
          </Typography>
        </Box>
      ) : Array.isArray(noth) && noth.length === 0 ? (
        <Typography sx={{ 
          color: 'rgb(225,225,225)',
          fontWeight: 'bold', 
          fontSize: '16px',
          textAlign: 'center',
          py: 3,
          px: 2,
          animation: 'fadeIn 0.6s ease-out both',
        }}>
          Нет уведомлений
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {noth.map((n, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                background: 'rgba(34, 40, 47, 1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `slideInRight 0.5s ease-out ${idx * 0.1}s both`,
                '&:hover': {
                  backgroundColor: 'rgba(56, 64, 73, 1)',
                  transform: 'translateX(5px)',
                },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'rgb(225,225,225)', mb: 1 }}>
                {n.title}
              </Typography>
              <Typography sx={{ color: 'rgba(203, 203, 203, 0.8)', fontSize: 14, mb: 1 }}>
                {n.description}
              </Typography>
              <Typography sx={{ color: 'rgba(146, 146, 146, 0.5)', fontSize: 12 }}>
                {n.date ? new Date(n.date).toLocaleString('ru-RU', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {noth && Array.isArray(noth) && noth.length > 0 && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteSweepIcon sx={{ fontSize: 18 }} />}
          onClick={handleClearNotifications}
          sx={{
            marginTop: "20px",
            borderRadius: 2,
            fontWeight: 500,
            textTransform: 'none',
            fontSize: 14,
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.08)',
            borderColor: 'rgba(255,0,0,0.25)',
            boxShadow: 'none',
            opacity: 0.7,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'rgba(255,0,0,0.08)',
              opacity: 1,
              transform: 'scale(1.05)',
            }
          }}
        >
          Очистить все уведомления
        </Button>
      )}
    </Box>
  );
  const isMobile = useMediaQuery('(max-width:900px)');

  return (
    <Box
      sx={{
        width: '280px',
        minWidth: '280px',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'auto',
        position: 'relative',
        ...(!mounted ? fadeOutStyle : fadeInStyle),
        '&::-webkit-scrollbar': {
          width: '0px',
          height: '0px',
        },
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none',
      }}
    >
       <Box
                    sx={{
                      width: '100%',
                      height: '50px',
                      marginTop: isMobile ? '0' : '13px',
                            
                                                     borderRadius:' 0  100px 100px  0',
                  

                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: isMobile ? 2 : 0,
                      position: 'relative',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 1,
                      }}
                    />
                    <Typography sx={{
                      position: 'relative',
                      zIndex: 2,
                            fontFamily: "'Arial'",
                      fontWeight: "Bold", marginLeft:"20px", color:"rgba(226, 226, 226, 1)"
                    }}>
                      
                    </Typography>
                    <DateTimeNow/>
                  </Box>
      {/* Верхняя кнопка */}
   

      {showNotifications ? renderFullNotifications() : renderWidgets()}
    </Box>
  );
});

export default WidgetMain; 
