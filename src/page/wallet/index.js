import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Divider, IconButton, TextField, Snackbar, Alert, CircularProgress, Modal, useMediaQuery } from '@mui/material';
import { fontFamily } from '../../system/font';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from '../../system/axios';
import { selectPanelCurve } from '../../system/redux/slices/store';
import { useSelector } from 'react-redux';
import '../../fonts/stylesheet.css';
import logo from './ws.png';

const Wallet = ({ onBack }) => {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transferData, setTransferData] = useState({ userId: '', amount: '', description: '' });
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const isMobile = useMediaQuery('(max-width:900px)');
  const panelCurve = useSelector(selectPanelCurve);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const [balanceRes, txRes] = await Promise.all([
        axios.get('/auth/balance'),
        axios.get('/auth/transactions'),
      ]);
      setBalance(balanceRes.data.balance);
      setTransactions(txRes.data);
    } catch (e) {
      setSnackbar({ open: true, message: 'Ошибка загрузки кошелька', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWalletData();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setTransferLoading(true);
    try {
      if (!transferData.userId) {
        setSnackbar({ open: true, message: 'Введите ID получателя', severity: 'error' });
        setTransferLoading(false);
        return;
      }
      // Получаем username по userId
      const userRes = await axios.get(`/users/${transferData.userId}`);
      const username = userRes.data.username;
      if (!username) throw new Error('Пользователь не найден');
      await axios.post('/auth/transfer', {
        username,
        amount: Number(transferData.amount),
        description: transferData.description,
      });
      setSnackbar({ open: true, message: 'Перевод выполнен!', severity: 'success' });
      setTransferData({ userId: '', amount: '', description: '' });
      fetchWalletData();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Ошибка перевода', severity: 'error' });
    }
    setTransferLoading(false);
  };

  return (
    <Box
      sx={{
        width: isMobile ? '100vw' : '450px',
        maxWidth: isMobile ? '100vw' : '450px',
        minWidth: isMobile ? '0' : '200px',
        height: isMobile ? 'calc(100vh - 60px)' : '100vh',
        flex: isMobile ? 1 : 'none',
        overflowY: 'auto',
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none', 
        '&::-webkit-scrollbar': {
          width: '0px', 
          background: 'transparent',
        },
        paddingBottom: isMobile ? '70px' : 0, 
        px: 1.5,
        pt: isMobile ? 0 : 0,
        mt: isMobile ? 0 : 0,
      }}
    >
      {onBack && (
        <IconButton onClick={onBack} sx={{ mb: 2, color: 'white' }}>
          <ArrowBackIcon />
        </IconButton>
      )}
      
      <Box
        sx={{
          width: '100%',
          height: '50px',
          marginTop: isMobile ? '0' : '20px',
          borderRadius: panelCurve === 'rounded' ? '100px' : panelCurve === 'sharp' ? '0px' : panelCurve === 'pill' ? '25px' : '100px',
          backgroundColor: 'rgba(56, 64, 73, 0)',
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
      
      </Box>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 2, 
          borderRadius: 3, 
          textAlign: 'center', 
          mt: 1,
          height: '150px',
          display: 'flex',
          justifyContent: "center",
          alignItems: "center",
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'rgba(34, 40, 47, 1)',
          border: '1px solid rgba(56, 64, 73, 1)'
        }}
      >
        <Box
          component="img"
          src={logo}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            top: 0,
            left: 0,
            opacity: 0.7
          }}
          alt="Фон"
        />
        
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          {loading ? (
            <CircularProgress size={32} />
          ) : (
            <Typography sx={{ 
              fontFamily: 'JetExtra', 
              fontSize: 40, 
              color: '#ffffffff', 
              mb: 1, 
              marginTop:'10px',
              marginRight:'10px'
            }}>
              {balance !== null ? Math.floor(balance) : 0}atm
            </Typography>
          )}
        </Box>
      </Paper>

      <Button 
        variant="contained" 
        sx={{ 
          width:"100%", 
          fontFamily, 
          borderRadius: 100, 
          border:'solid 2px rgba(142, 142, 142, 1)',
          mb:3,
          fontWeight:'Bold',
          color:'white',
          backgroundColor:'rgba(34, 40, 47, 1)',
          '&:hover': {
            backgroundColor: 'rgba(44, 50, 57, 1)',
            borderColor: 'rgba(170, 170, 170, 1)'
          }
        }} 
        onClick={() => setTransferModalOpen(true)}
      >
        Перевести
      </Button>

      <Modal 
        open={transferModalOpen} 
        onClose={() => !transferLoading && setTransferModalOpen(false)}
        sx={{
          backdropFilter: 'blur(4px)'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            bgcolor: 'rgba(34, 40, 47, 1)',
            boxShadow: 24, 
            p: 4, 
            borderRadius: panelCurve === 'rounded' ? '12px' : panelCurve === 'sharp' ? '0px' : panelCurve === 'pill' ? '25px' : '12px',
            minWidth: 320,
            maxWidth: isMobile ? '90vw' : '400px',
            border: '1px solid rgba(56, 64, 73, 1)'
          }}
        >
          <Typography 
            sx={{ 
              fontFamily, 
              fontWeight: 600, 
              fontSize: 18, 
              mb: 3,
              color: 'white',
              textAlign: 'center'
            }}
          >
            Перевести по ID
          </Typography>
          
          <form onSubmit={handleTransfer}>
            <TextField
              label="ID получателя"
              variant="outlined"
              size="small"
              fullWidth
              required
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(142, 142, 142, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(142, 142, 142, 0.8)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(142, 142, 142, 1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(142, 142, 142, 0.7)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'rgba(142, 142, 142, 1)',
                },
              }}
              value={transferData.userId}
              onChange={e => setTransferData({ ...transferData, userId: e.target.value })}
            />
            
            <TextField
              label="Сумма"
              variant="outlined"
              size="small"
              type="number"
              fullWidth
              required
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(142, 142, 142, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(142, 142, 142, 0.8)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(142, 142, 142, 1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(142, 142, 142, 0.7)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'rgba(142, 142, 142, 1)',
                },
              }}
              value={transferData.amount}
              onChange={e => setTransferData({ ...transferData, amount: e.target.value })}
              inputProps={{ min: 1 }}
            />
            
            <TextField
              label="Описание (необязательно)"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(142, 142, 142, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(142, 142, 142, 0.8)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(142, 142, 142, 1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(142, 142, 142, 0.7)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'rgba(142, 142, 142, 1)',
                },
              }}
              value={transferData.description}
              onChange={e => setTransferData({ ...transferData, description: e.target.value })}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={() => setTransferModalOpen(false)}
                variant="outlined"
                fullWidth
                disabled={transferLoading}
                sx={{ 
                  fontFamily, 
                  borderRadius: 100, 
                  fontWeight: 'Bold',
                  color: 'white',
                  borderColor: 'rgba(142, 142, 142, 0.5)',
                  '&:hover': {
                    borderColor: 'rgba(142, 142, 142, 1)',
                    backgroundColor: 'rgba(142, 142, 142, 0.1)'
                  }
                }}
              >
                Отмена
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={transferLoading}
                sx={{ 
                  fontFamily, 
                  borderRadius: 100, 
                  fontWeight: 'Bold',
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                {transferLoading ? <CircularProgress size={20} color="inherit" /> : 'Перевести'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <Typography sx={{ fontFamily, fontWeight: 600, fontSize: 18, mb: 1, color: 'white' }}>
        История операций
      </Typography>
      
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          borderRadius: 2, 
          fontFamily, 
          minHeight: 130,    
          backgroundColor: 'rgba(34, 40, 47, 1)',
          border: '1px solid rgba(56, 64, 73, 1)'
        }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : transactions.length === 0 ? (
          <Typography sx={{ fontFamily, color: 'rgba(142, 142, 142, 1)', fontSize: 15 }}>
            Нет операций
          </Typography>
        ) : (
          transactions.map(tx => (
            <Box key={tx.transactionId} sx={{ mb: 1 }}>
              <Typography sx={{ fontFamily, fontWeight: 500, color: tx.amount > 0 ? '#4caf50' : '#f44336' }}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}atm — {tx.description}
              </Typography>
              <Typography sx={{ fontFamily, fontSize: 12, color: 'rgba(142, 142, 142, 1)' }}>
                {new Date(tx.createdAt).toLocaleString()}
              </Typography>
              <Divider sx={{ my: 1, borderColor: 'rgba(56, 64, 73, 1)' }} />
            </Box>
          ))
        )}
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            backgroundColor: snackbar.severity === 'error' ? '#d32f2f' : '#2e7d32',
            color: 'white'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Wallet;