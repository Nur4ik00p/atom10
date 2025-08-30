import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Fade, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import logo from '../../image/1.webp';
import '../../fonts/stylesheet.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, selectAuthStatus, selectAuthError } from '../../system/auth';
import axios from '../../system/axios';

const STEPS = [
  'welcome',
  'fullName',
  'username',
  'password',
  'repeat',
  'rules',
  'done',
];

const RegistrationPage = () => {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('@');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const [show, setShow] = useState(true);

  const nextStep = async () => {
    setError('');
    if (STEPS[step] === 'fullName') {
      if (!fullName.trim() || fullName.length < 2) {
        setError('Введите имя полностью');
        return;
      }
    }
    if (STEPS[step] === 'username') {
      if (username.trim() === '@' || username.length < 2) {
        setError('Введите username');
        return;
      }
    }
    if (STEPS[step] === 'password') {
      if (password.length < 6) {
        setError('Пароль минимум 6 символов');
        return;
      }
    }
    if (STEPS[step] === 'repeat') {
      if (repeat !== password) {
        setError('Пароли не совпадают');
        return;
      }
    }
    if (STEPS[step] === 'rules') {
      if (!agree) {
        setError('Необходимо согласиться с правилами');
        return;
      }
      
      setShow(false);
      setLoading(true);
      try {
        await dispatch(fetchRegister({ username, password, fullName })).unwrap();
        setTimeout(() => {
          setLoading(false);
          setShow(true);
          setStep((s) => s + 1);
        }, 900);
      } catch (e) {
        setLoading(false);
        setShow(true);
        setError(authError || 'Ошибка регистрации');
        return;
      }
      return;
    }
    
    setShow(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShow(true);
      setStep((s) => s + 1);
    }, 900);
  };

  const prevStep = () => {
    setError('');
    setShow(false);
    setTimeout(() => {
      setShow(true);
      setStep((s) => s - 1);
    }, 300);
  };

  const renderStep = () => {
    switch (STEPS[step]) {
      case 'welcome':
        return (
          <Fade in={show} timeout={400}>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '28px',
                color: 'rgba(230, 237, 243, 0.9)',
                fontWeight: 700,
                letterSpacing: '0.5px',
                mb: 1,
              }}>
                AtomGlide
              </Typography>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '16px',
                color: 'rgba(230, 237, 243, 0.6)',
                mb: 3,
              }}>
                Добро пожаловать! Зарегистрируйтесь, чтобы начать пользоваться AtomGlide.
              </Typography>
            </Box>
          </Fade>
        );
      case 'fullName':
        return (
          <Fade in={show} timeout={400}>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '28px',
                color: 'rgba(230, 237, 243, 0.9)',
                fontWeight: 700,
                letterSpacing: '0.5px',
                mb: 1,
              }}>
                AtomGlide
              </Typography>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '16px',
                color: 'rgba(230, 237, 243, 0.6)',
                mb: 3,
              }}>
                Введите ваше полное имя
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                inputProps={{ 
                  style: { 
                    fontSize: 22,
                    color: 'rgba(230, 237, 243, 0.9)',
                  } 
                }}
                sx={{
                  fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                  background: 'rgba(33, 38, 45, 0.7)',
                  borderRadius: '50px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '50px',
                    background: 'rgba(33, 38, 45, 0.7)',
                    fontSize: '22px',
                    '& fieldset': {
                      borderColor: 'rgba(48, 54, 61, 0.7)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(88, 166, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#58a6ff',
                      boxShadow: '0 0 0 2px rgba(88, 166, 255, 0.3)',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(230, 237, 243, 0.4)',
                    opacity: 1,
                  },
                }}
              />
              {error && <Typography color="error" sx={{ mb: 1, textAlign: 'center', color: '#f85149' }}>{error}</Typography>}
            </Box>
          </Fade>
        );
      case 'username':
        return (
          <Fade in={show} timeout={400}>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '28px',
                color: 'rgba(230, 237, 243, 0.9)',
                fontWeight: 700,
                letterSpacing: '0.5px',
                mb: 1,
              }}>
                AtomGlide
              </Typography>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '16px',
                color: 'rgba(230, 237, 243, 0.6)',
                mb: 3,
              }}>
                Придумайте уникальный username
              </Typography>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={username.startsWith('@') ? username : '@' + username}
                  onChange={e => {
                    let val = e.target.value;
                    if (!val.startsWith('@')) val = '@' + val.replace(/@+/g, '');
                    if (val === '' || val[0] !== '@') val = '@';
                    setUsername(val);
                  }}
                  onSelect={e => {
                    const input = e.target;
                    if (input.selectionStart < 1) {
                      input.setSelectionRange(1, 1);
                    }
                  }}
                  inputProps={{
                    style: { 
                      paddingLeft: 18, 
                      fontWeight: 500, 
                      fontSize: 22,
                      color: 'rgba(230, 237, 243, 0.9)',
                    },
                  }}
                  sx={{
                    fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                    background: 'rgba(33, 38, 45, 0.7)',
                    borderRadius: '50px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                      background: 'rgba(33, 38, 45, 0.7)',
                      fontSize: '22px',
                      '& fieldset': {
                        borderColor: 'rgba(48, 54, 61, 0.7)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(88, 166, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#58a6ff',
                        boxShadow: '0 0 0 2px rgba(88, 166, 255, 0.3)',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(230, 237, 243, 0.4)',
                      opacity: 1,
                    },
                  }}
                />
                {username === '@' && (
                  <span style={{
                    position: 'absolute',
                    left: 42,
                    top: '49%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(230, 237, 243, 0.4)',
                    fontSize: 20,
                    pointerEvents: 'none',
                    fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                    userSelect: 'none',
                  }}>
                    Dmitry
                  </span>
                )}
              </Box>
              {error && <Typography color="error" sx={{ mb: 1, textAlign: 'center', color: '#f85149' }}>{error}</Typography>}
            </Box>
          </Fade>
        );
      case 'password':
        return (
          <Fade in={show} timeout={400}>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '28px',
                color: 'rgba(230, 237, 243, 0.9)',
                fontWeight: 700,
                letterSpacing: '0.5px',
                mb: 1,
              }}>
                AtomGlide
              </Typography>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '16px',
                color: 'rgba(230, 237, 243, 0.6)',
                mb: 3,
              }}>
                Придумайте пароль (минимум 6 символов)
              </Typography>
              <TextField
                placeholder="Пароль"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={e => setPassword(e.target.value)}
                inputProps={{ 
                  style: { 
                    fontSize: 22,
                    color: 'rgba(230, 237, 243, 0.9)',
                  } 
                }}
                sx={{
                  fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                  background: 'rgba(33, 38, 45, 0.7)',
                  borderRadius: '50px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '50px',
                    background: 'rgba(33, 38, 45, 0.7)',
                    fontSize: '22px',
                    '& fieldset': {
                      borderColor: 'rgba(48, 54, 61, 0.7)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(88, 166, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#58a6ff',
                      boxShadow: '0 0 0 2px rgba(88, 166, 255, 0.3)',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(230, 237, 243, 0.4)',
                    opacity: 1,
                  },
                }}
              />
              {error && <Typography color="error" sx={{ mb: 1, textAlign: 'center', color: '#f85149' }}>{error}</Typography>}
            </Box>
          </Fade>
        );
      case 'repeat':
        return (
          <Fade in={show} timeout={400}>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '28px',
                color: 'rgba(230, 237, 243, 0.9)',
                fontWeight: 700,
                letterSpacing: '0.5px',
                mb: 1,
              }}>
                AtomGlide
              </Typography>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '16px',
                color: 'rgba(230, 237, 243, 0.6)',
                mb: 3,
              }}>
                Повторите пароль
              </Typography>
              <TextField
                placeholder="Повторите пароль"
                type="password"
                variant="outlined"
                fullWidth
                value={repeat}
                onChange={e => setRepeat(e.target.value)}
                inputProps={{ 
                  style: { 
                    fontSize: 22,
                    color: 'rgba(230, 237, 243, 0.9)',
                  } 
                }}
                sx={{
                  fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                  background: 'rgba(33, 38, 45, 0.7)',
                  borderRadius: '50px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '50px',
                    background: 'rgba(33, 38, 45, 0.7)',
                    fontSize: '22px',
                    '& fieldset': {
                      borderColor: 'rgba(48, 54, 61, 0.7)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(88, 166, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#58a6ff',
                      boxShadow: '0 0 0 2px rgba(88, 166, 255, 0.3)',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(230, 237, 243, 0.4)',
                    opacity: 1,
                  },
                }}
              />
              {error && <Typography color="error" sx={{ mb: 1, textAlign: 'center', color: '#f85149' }}>{error}</Typography>}
            </Box>
          </Fade>
        );
      case 'rules':
        return (
          <Fade in={show} timeout={400}>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '28px',
                color: 'rgba(230, 237, 243, 0.9)',
                fontWeight: 700,
                letterSpacing: '0.5px',
                mb: 1,
              }}>
                AtomGlide
              </Typography>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '16px',
                color: 'rgba(230, 237, 243, 0.6)',
                mb: 3,
              }}>
                Для продолжения регистрации необходимо согласиться с правилами использования.
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agree}
                    onChange={e => setAgree(e.target.checked)}
                    sx={{ 
                      color: '#58a6ff', 
                      '&.Mui-checked': { 
                        color: '#58a6ff' 
                      } 
                    }}
                  />
                }
                label={
                  <span style={{ 
                    fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif", 
                    fontSize: 15,
                    color: 'rgba(230, 237, 243, 0.8)',
                  }}>
                    Я соглашаюсь с{' '}
                    <span
                      style={{ 
                        color: '#58a6ff', 
                        cursor: 'pointer', 
                        textDecoration: 'underline',
                        transition: 'color 0.2s',
                      }}
                      onClick={() => window.open('/atomwiki.html', '_blank')}
                      onMouseOver={e => e.target.style.color = '#79c0ff'}
                      onMouseOut={e => e.target.style.color = '#58a6ff'}
                    >
                      правилами использования
                    </span>
                  </span>
                }
                sx={{ 
                  mt: 1, 
                  mb: 1, 
                  alignItems: 'flex-start',
                  '& .MuiTypography-root': {
                    color: 'rgba(230, 237, 243, 0.8)',
                  },
                }}
              />
              {error && <Typography color="error" sx={{ mb: 1, textAlign: 'center', color: '#f85149' }}>{error}</Typography>}
            </Box>
          </Fade>
        );
      case 'done':
        return (
          <Fade in={show} timeout={400}>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '28px',
                color: 'rgba(230, 237, 243, 0.9)',
                fontWeight: 700,
                letterSpacing: '0.5px',
                mb: 1,
              }}>
                AtomGlide
              </Typography>
              <Typography sx={{
                fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                textAlign: 'center',
                fontSize: '16px',
                color: 'rgba(230, 237, 243, 0.6)',
                mb: 3,
              }}>
                Регистрация успешно завершена!
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: '50px',
                  fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
                  fontWeight: 600,
                  fontSize: '18px',
                  py: 1.2,
                  background: '#866023ff',
                  color: 'white',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.20)',
                  textTransform: 'none',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  mt: 2,
                  '&:hover': {
                    background: '#866023ff',
                    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.25)',
                  },
                }}
                onClick={() => navigate('/login')}
              >
                Начать общение
              </Button>
            </Box>
          </Fade>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(14, 17, 22, 1)',
    }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(22, 27, 34, 0.9)',
          borderRadius: '24px',
          boxShadow: '0 4px 32px 0 rgba(0, 0, 0, 0.30)',
          p: { xs: 3, sm: 5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <img src={logo} alt="Logo" style={{ width: '72px', height: '72px', objectFit: 'contain', marginBottom: 16, marginTop: 8 }} />
        {loading ? (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 180 }}>
            <CircularProgress size={48} thickness={4} sx={{ color: '#58a6ff' }} />
          </Box>
        ) : (
          renderStep()
        )}
        <Box sx={{ display: 'flex', width: '100%', mt: 2, gap: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: '50px',
              fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
              fontWeight: 600,
              fontSize: '16px',
              py: 1.1,
              color: '#58a6ff',
              borderColor: '#58a6ff',
              textTransform: 'none',
              display: step === 0 || step === STEPS.length - 1 ? 'none' : 'inline-flex',
              '&:hover': {
                borderColor: '#79c0ff',
                color: '#79c0ff',
                backgroundColor: 'rgba(88, 166, 255, 0.1)',
              },
            }}
            onClick={prevStep}
            disabled={step === 0}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{
              borderRadius: '50px',
              fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
              fontWeight: 600,
              fontSize: '18px',
              py: 1.2,
              background: '#866023ff',
              color: 'white',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.20)',
              textTransform: 'none',
              transition: 'background 0.2s, box-shadow 0.2s',
              display: step === STEPS.length - 1 ? 'none' : 'inline-flex',
              '&:hover': {
                background: '#866023ff',
                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.25)',
              },
            }}
            onClick={nextStep}
            disabled={loading || (STEPS[step] === 'rules' && !agree)}
          >
            Далее
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
          {STEPS.map((_, idx) => (
            <Box
              key={idx}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: idx === step ? '#58a6ff' : 'rgba(48, 54, 61, 0.7)',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </Box>
      </Box>
      <Typography
        variant="body2"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 25,
          zIndex: 1000,
          color: 'rgba(230, 237, 243, 0.6)',
          fontFamily: "'Yandex Sans', Arial, Helvetica, sans-serif",
          fontSize: '14px',
          userSelect: 'none',
        }}
      >
       RU{' '}
       <span
         style={{
           color: '#58a6ff',
           cursor: 'pointer',
           textDecoration: 'underline',
           transition: 'color 0.2s',
           margin: '0 3px',
         }}
         onClick={() => window.open('/infocenter.html', '_blank')}
         onMouseOver={e => e.target.style.color = '#79c0ff'}
         onMouseOut={e => e.target.style.color = '#58a6ff'}
       >
         Информациный центр
       </span>{' '}
       © 2025, DK Studio
      </Typography>
    </Box>
  );
};

export default RegistrationPage;