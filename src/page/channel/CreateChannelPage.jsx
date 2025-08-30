import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../../system/axios';

const ChannelCreatePage = () => {
  const [name, setName] = useState('');
  const [nick, setNick] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!nick.startsWith('$')) {
      setError('Ник должен начинаться с $');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/channels',
        { name, nick, description, avatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/channel/${res.data._id}`);
    } catch (err) {
      console.error('Ошибка создания канала:', err);
      setError(err.response?.data?.error || 'Не удалось создать канал');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500, mx: 'auto' , px:1,
}}>
      <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 2 }}>
        Создать канал
      </Typography>

      <TextField
        label="Название канала"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Ник (начинается с $)"
        fullWidth
        value={nick}
        onChange={(e) => setNick(e.target.value.replace(/\s+/g, ''))}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Описание"
        fullWidth
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="URL аватара"
        fullWidth
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
        sx={{ mb: 2 }}
      />

      {avatarUrl && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar src={avatarUrl} sx={{ width: 80, height: 80 }} />
        </Box>
      )}

      {error && (
        <Typography sx={{ color: 'red', fontSize: 14, mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{ borderRadius: '8px', textTransform: 'none' }}
        onClick={handleCreate}
      >
        Создать
      </Button>
    </Box>
  );
};

export default ChannelCreatePage;
