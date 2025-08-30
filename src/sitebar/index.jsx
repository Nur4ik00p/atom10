import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import logo from '../image/1.webp';
import '../fonts/stylesheet.css';
import { FiHome } from "react-icons/fi";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { FiUser } from "react-icons/fi";
import { FiActivity } from "react-icons/fi";
import { FiServer } from "react-icons/fi";
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from '../system/redux/slices/getme';
import { FiCommand } from "react-icons/fi";
import { FiRadio } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { FiHardDrive } from "react-icons/fi";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { FiVideo } from "react-icons/fi";
import { FiCoffee } from "react-icons/fi";
import { FiImage } from "react-icons/fi";
import {  Avatar } from '@mui/material';
import { FiZap } from "react-icons/fi";
import { FiTrendingUp } from "react-icons/fi";

const menuItems = [
  { label: 'Главная', icon: <FiHome /> },
  { label: 'Каналы', icon: <FiHardDrive /> },
  { label: 'Поток', icon: <FiZap /> },
  { label: 'Рейтинг', icon: <FiTrendingUp /> },
  { label: 'Приложения', icon: <FiCommand /> },
    { label: 'Инфо.центр', icon: <FiCoffee /> },
    { label: 'Параметры', icon: <FiSettings /> },

  { label: 'Профиль', icon: <FiUser /> },
];

const MobileMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const menu = [
  { label: 'Главная', icon: <FiHome size={25} />, path: '/' },
  { label: 'Каналы', icon: <FiHardDrive size={25} />, path: '/channel' },
  { label: 'Поток', icon: <FiZap  size={25}/>, path: '/comments' },
  { label: 'Рейтинг', icon: <FiTrendingUp  size={25}/>, path: '/forbes' },
  { label: 'Приложения', icon: <FiCommand size={25} />, path: '/miniApps' },
  
  { 
    label: 'Профиль', 
    icon: <FiUser size={25} />, 
    path: user ? `/account/${user.id || user._id}` : '/' 
  },
  ];

  return (
     <Box
     
  sx={{
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90vw',
    height: '62px',
    backgroundColor: 'rgba(49, 56, 64, 0.81)',
    boxShadow: '0 -4px 24px 0 rgba(31,38,135,0.10)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 2000,
    marginBottom: '20px',
    px: 1,
    borderRadius: '20px',
  }}
      
    >
      {menu.map((item, idx) => {
        const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/');
        return (
          <Button
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={{
              minWidth: 0,
              flex: 1,
              height: '100%',
              background: isActive ? 'rgba(49, 56, 64, 0)' : 'transparent',
              color: isActive ? '#ffffffff' : 'rgba(143, 142, 142, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: isActive ? 700 : 500,
              transition: 'background 0.2s, color 0.2s',
              boxShadow: 'none',
              mx: idx !== 0 ? 0.5 : 0,
              '&:hover': {
                color: '#1976d2',
              },
            }}
            disableRipple
          >
            {item.icon}
          </Button>
        );
      })}
    </Box>
  );
};

const Sitebar = () => {
  const navigate = useNavigate();
  const boopRef = useRef(null);
  const user = useSelector(selectUser);
  const isMobile = useMediaQuery('(max-width:900px)');

  if (isMobile) {
    return <MobileMenu />;
  }

  return (
    <Box
      sx={{
        width: '250px',
        minWidth: '250px',
        height: '600px',
      }}
    >
      <Box
              sx={{
                width: '100%',
                height: '50px',
                marginTop: isMobile ? '0' : '10px',
            display: 'flex',
                alignItems: 'center',
                px: isMobile ? 2 : 0,
                position: 'relative',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                mr:1
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  zIndex: 1,
                }}
              />
        
                     <Box
          component="img"
          src={logo}
          sx={{
            height: '45px',
            width: '45px',
          
          }}
        />
              <Typography sx={{
                position: 'relative',
                zIndex: 2,
                      fontFamily: "'Arial'",
                fontWeight: "Bold", marginLeft:"10px", color:"rgba(226, 226, 226, 1)"
              }}>
                AtomGlide 
              </Typography>
            </Box>
<Box sx={{mr:1}}>

      
      <Box
     sx={{marginTop:'8px'}}
      >
        {menuItems.map((item, index) => (
          <Button
            key={index}
            startIcon={item.icon}
            sx={{
              width: '100%',
              height: '35px',
              marginTop: '5px',
              borderRadius: '5px',
             
 backgroundColor: 'rgba(17, 17, 17, 1)',
                        border: "solid rgb(34,34,34) 2px",
              color: 'rgba(202, 202, 202, 1)',
              textAlign: 'left',
              fontWeight: 'bold',
              textTransform: 'none',
              justifyContent: 'flex-start',
              pl: 2,
              transition: 'box-shadow 0.3s, transform 0.3s',
              '& .MuiButton-startIcon': {
                color: 'rgb(150, 149, 154)',
              },
              '&:hover': {
                backgroundColor: '#828181ff',
              },
            }}
            onClick={() => {
              if (item.label === 'Музыка') {
                navigate('/music');
              }
              if (item.label === 'Главная') {
                navigate('/');
              }
              if (item.label === 'Репосты') {
                alert('Скоро будет');
              }
              if (item.label === 'Профиль') {
                if (user && (user.id || user._id)) {
                  navigate(`/account/${user.id || user._id}`);
                } else {
                  alert('Перезагрузи сайт два раза сначала')
                }
              }
              if (item.label === 'Группы') {
                navigate('/group');
              }
                 if (item.label === 'Приложения') {
                navigate('/miniApps');
              }
                if (item.label === 'Каналы') {
                navigate('/channel');
              }
              if (item.label === 'Поток') {
                navigate('/comments');
              }
                if (item.label === 'Параметры') {
                navigate('/setting');
              }
                if (item.label === 'Рейтинг') {
                navigate('/forbes');
              }
                 if (item.label === 'Инфо.центр') {
                navigate('atomwiki.html');
              }
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
      </Box></Box>

)}

export default Sitebar;
