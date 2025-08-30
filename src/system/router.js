import React, { Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Box, useMediaQuery, Typography, CircularProgress } from '@mui/material';
import Sitebar from '../sitebar';
import Apps from '../page/apps';
import MobileSettings from '../widget/setting.jsx';
import Widget from '../widget/index.jsx';
import WidgetMain from '../widget/widget';
import { useSelector } from 'react-redux';
import { selectUser } from '../system/redux/slices/getme';
import { useUser } from '../components/UserProvider';
import Main from '../page/main/main';
import Reting from '../page/reting/index.jsx';
import ChannelsList from "../page/channel/ChannelsList";
import ChannelPage from "../page/channel/ChannelPage";
import Wallet from '../page/wallet';
import Profile from '../page/profile/Profile';
import { Settings } from '@mui/icons-material';
import Fullpost from '../page/fullPost/fullpost.jsx';

import ChannelCreatePage from "../page/channel/CreateChannelPage";

const Channel = React.lazy(() => import('../page/channel/channel.jsx'));
const LoginPage = React.lazy(() => import('../page/login'));
const RegistrationPage = React.lazy(() => import('../page/registration'));
const NotFound = React.lazy(() => import('../page/profile/NotFound'));
const CommentsStreamPage = React.lazy(() => import('../page/comments-stream'));

const LoadingFallback = () => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: 'white'
  }}>
    <CircularProgress color="primary" />
  </Box>
);

const AppRouter = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const location = useLocation();
  const user = useSelector(selectUser);
  const { isLoading } = useUser();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/registration';

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: isMobile ? 'stretch' : 'flex-start',
        alignContent: 'flex-start',
        width: '100%',
        minHeight: isMobile ? '100dvh' : '100vh',
        overflow: 'auto',
        flexDirection: isMobile ? 'column' : 'row',
        position: 'relative',
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route
            path="/login"
            element={
              <Box
                sx={{
                  width: '100%',
                  height: '100vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(14, 17, 22, 1)',
                }}
              >
                <LoginPage />
              </Box>
            }
          />
          <Route
            path="/registration"
            element={
              <Box
                sx={{
                  width: '100%',
                  height: '100vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(14, 17, 22, 1)',
                }}
              >
                <RegistrationPage />
              </Box>
            }
          />
        </Routes>

        {!isAuthPage && (
          <>
            <Box sx={{ mr: 0 }}>
              <Sitebar />
            </Box>
            <Routes>
              <Route path="/" element={<div style={{ display: 'flex' }}><Main />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/post/:id" element={<div style={{ display: 'flex' }}><Fullpost />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/setting" element={<div style={{ display: 'flex' }}><MobileSettings />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/channel" element={<div style={{ display: 'flex' }}><Channel />{!isMobile && <WidgetMain />}</div>} />
                            <Route path="/forbes" element={<div style={{ display: 'flex' }}><Reting />{!isMobile && <WidgetMain />}</div>} />

      <Route path="/create-channel" element={<div style={{ display: 'flex' }}><ChannelCreatePage />{!isMobile && <WidgetMain />}</div>} />

      <Route path="/channels" element={<div style={{ display: 'flex' }}><ChannelsList />{!isMobile && <WidgetMain />}</div>} />

  
      <Route path="/channel/:id" element={<div style={{ display: 'flex' }}><ChannelPage />{!isMobile && <WidgetMain />}</div>} />

              <Route path="/miniApps" element={<div style={{ display: 'flex' }}><Apps />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/comments" element={<div style={{ display: 'flex' }}><CommentsStreamPage />{!isMobile && <WidgetMain />}</div>} />
              <Route path="/wallet" element={<div style={{ display: 'flex' }}><Wallet />{!isMobile && <WidgetMain />}</div>} />
           
              <Route path="/account/:id" element={<div style={{ display: 'flex' }}><Profile />{!isMobile && <Widget />}</div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        )}
      </Suspense>
    </Box>
  );
};

export default AppRouter;