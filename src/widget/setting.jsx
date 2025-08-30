import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Avatar,
  Button,
  Divider,
  TextField,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery
} from '@mui/material';
import { ArrowLeft, Camera } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import axios from '../system/axios';

import EditIcon from '../image/edit-profile.png';
import PasswordIcon from '../image/password.png';
import InterfaceIcon from '../image/word.png';
import ServerIcon from '../image/api.png';
import SwitchIcon from '../image/windows.png';
import InfoIcon from '../image/info.png';
import WalletIcon from '../image/Group2.png';

const MobileSettings = ({ onClose }) => {
  const [currentView, setCurrentView] = useState('main');
  const [profile, setProfile] = useState({
    avatar: '',
    fullName: '',
    username: '',
    about: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  useEffect(() => {
    if (currentView === 'profile') {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const res = await axios.get('/auth/me');
          setProfile({
            avatar: res.data.avatarUrl || '',
            fullName: res.data.fullName || '',
            username: res.data.username || '',
            about: res.data.about || ''
          });
        } catch (err) {
          setSnackbar({
            open: true,
            message: 'Ошибка загрузки профиля',
            severity: 'error'
          });
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [currentView]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      
      const res = await axios.patch('/auth/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setProfile(prev => ({ ...prev, avatar: res.data.user.avatarUrl }));
      setSnackbar({
        open: true,
        message: 'Аватар обновлен',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Ошибка загрузки аватара',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await axios.patch('/auth/me', {
        fullName: profile.fullName,
        about: profile.about
      });
      
      setSnackbar({
        open: true,
        message: 'Профиль сохранен',
        severity: 'success'
      });
      setTimeout(() => setCurrentView('main'), 1000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Ошибка сохранения',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const renderMainMenu = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
     
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Настройки
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        {[
          { id: 'profile', icon: EditIcon, title: 'Профиль' },
          { id: 'password', icon: PasswordIcon, title: 'Пароль' },
          { id: 'interface', icon: InterfaceIcon, title: 'Интерфейс' },
          { id: 'server', icon: ServerIcon, title: 'Сервер' },
          { id: 'wallet', icon: WalletIcon, title: 'Кошелек' },
          { id: 'switch', icon: SwitchIcon, title: 'Аккаунт' },
          { id: 'info', icon: InfoIcon, title: 'Инфоцентр' },
        ].map((item) => (
          <Button
            key={item.id}
            onClick={() => {
              if (item.id === 'wallet') navigate('/wallet');
              else if (item.id === 'info') window.location.href = '/atomwiki.html';
              else setCurrentView(item.id);
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px',
              borderRadius: '12px',
              backgroundColor: 'rgba(34, 40, 47, 0.7)',
              color: 'white',
              p: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(44, 50, 57, 0.9)'
              }
            }}
          >
            <Avatar 
              src={item.icon} 
              sx={{ 
                width: 36, 
                height: 36, 
                mb: 1,
                backgroundColor: 'transparent'
              }} 
            />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
              {item.title}
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );

  const renderProfileEditor = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => setCurrentView('main')} sx={{ color: 'white', mr: 1 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Редактор профиля
        </Typography>
      </Box>

      {loading && !profile.avatar ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <input
              accept="image/*"
              id="avatar-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <label htmlFor="avatar-upload">
              <Avatar
                src={profile.avatar}
                sx={{
                  width: 100,
                  height: 100,
                  cursor: 'pointer',
                  backgroundColor: 'rgba(34, 40, 47, 0.7)'
                }}
              >
                {!profile.avatar && <Camera size={32} />}
              </Avatar>
            </label>
          </Box>

          <TextField
            label="Имя"
            value={profile.fullName}
            onChange={(e) => setProfile({...profile, fullName: e.target.value})}
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              sx: { color: 'white' }
            }}
            InputLabelProps={{
              sx: { color: 'rgba(255,255,255,0.7)' }
            }}
          />

          <TextField
            label="Никнейм"
            value={profile.username}
            disabled
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              sx: { color: 'rgba(255,255,255,0.5)' }
            }}
            InputLabelProps={{
              sx: { color: 'rgba(255,255,255,0.7)' }
            }}
            helperText="Никнейм нельзя изменить"
          />

          <TextField
            label="О себе"
            value={profile.about}
            onChange={(e) => setProfile({...profile, about: e.target.value})}
            multiline
            rows={3}
            fullWidth
            sx={{ mb: 3 }}
            InputProps={{
              sx: { color: 'white' }
            }}
            InputLabelProps={{
              sx: { color: 'rgba(255,255,255,0.7)' }
            }}
          />

          <Button
            onClick={handleSaveProfile}
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Сохранить'}
          </Button>
        </>
      )}
    </Box>
  );

  const renderPasswordSettings = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => setCurrentView('main')} sx={{ color: 'white', mr: 1 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Смена пароля
        </Typography>
      </Box>

      <TextField
        label="Текущий пароль"
        type="password"
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          sx: { color: 'white' }
        }}
        InputLabelProps={{
          sx: { color: 'rgba(255,255,255,0.7)' }
        }}
      />

      <TextField
        label="Новый пароль"
        type="password"
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          sx: { color: 'white' }
        }}
        InputLabelProps={{
          sx: { color: 'rgba(255,255,255,0.7)' }
        }}
      />

      <TextField
        label="Повторите пароль"
        type="password"
        fullWidth
        sx={{ mb: 3 }}
        InputProps={{
          sx: { color: 'white' }
        }}
        InputLabelProps={{
          sx: { color: 'rgba(255,255,255,0.7)' }
        }}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: '12px',
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0'
          }
        }}
      >
        Сохранить пароль
      </Button>
    </Box>
  );

  const renderInterfaceSettings = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => setCurrentView('main')} sx={{ color: 'white', mr: 1 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Настройки интерфейса
        </Typography>
      </Box>

      <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
        Выберите тему приложения:
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {['Темная', 'Светлая', 'Системная'].map((theme) => (
          <Button
            key={theme}
            variant="outlined"
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: '12px',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.2)'
            }}
          >
            {theme}
          </Button>
        ))}
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: '12px',
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0'
          }
        }}
      >
        Применить настройки
      </Button>
    </Box>
  );

  const renderServerSettings = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => setCurrentView('main')} sx={{ color: 'white', mr: 1 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Настройки сервера
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(34, 40, 47, 0.7)' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
          Статус подключения:
        </Typography>
        <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>
          Онлайн
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3, backgroundColor: 'rgba(34, 40, 47, 0.7)' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
          Версия API:
        </Typography>
        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
          v2.4.1
        </Typography>
      </Paper>

      <Button
        variant="contained"
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: '12px',
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0'
          }
        }}
      >
        Проверить обновления
      </Button>
    </Box>
  );

  const renderAccountSettings = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => setCurrentView('main')} sx={{ color: 'white', mr: 1 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Управление аккаунтом
        </Typography>
      </Box>

      <Button
        onClick={handleLogout}
        variant="contained"
        fullWidth
        sx={{
          py: 1.5,
          mb: 2,
          borderRadius: '12px',
          backgroundColor: '#d32f2f',
          '&:hover': {
            backgroundColor: '#b71c1c'
          }
        }}
      >
        Выйти из аккаунта
      </Button>

      <Button
        variant="outlined"
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: '12px',
          color: 'white',
          borderColor: 'rgba(255,255,255,0.2)'
        }}
      >
        Сменить аккаунт
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        zIndex: 1300,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      {currentView === 'main' && renderMainMenu()}
      {currentView === 'profile' && renderProfileEditor()}
      {currentView === 'password' && renderPasswordSettings()}
      {currentView === 'interface' && renderInterfaceSettings()}
      {currentView === 'server' && renderServerSettings()}
      {currentView === 'switch' && renderAccountSettings()}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MobileSettings;