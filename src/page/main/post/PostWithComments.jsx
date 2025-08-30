import React, { useState, useEffect } from 'react';
import {
  Box,
  Divider,
  Typography,
  IconButton
} from '@mui/material';
import PostHeader from './PostHeader';
import PostText from './PostText';
import PostPhoto from './PostPhoto';
import CommentSection from '../../../components/CommentSection';
import { getDateString } from '../../../system/data';
import { FiMessageSquare, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import axios from '../../../system/axios';

const PostWithComments = ({ post, onDelete, onPostUpdate }) => {
  const safePost = {
    ...post,
    user: post?.user || {},
    likes: {
      count: post.likes?.count || 0,
      users: post.likes?.users || []
    },
    dislikes: {
      count: post.dislikes?.count || 0,
      users: post.dislikes?.users || []
    },
    commentsCount: post?.commentsCount || 0
  };

  const [localLikes, setLocalLikes] = useState(safePost.likes.count);
  const [localDislikes, setLocalDislikes] = useState(safePost.dislikes.count);
  const [localCommentsCount, setLocalCommentsCount] = useState(safePost.commentsCount);
  const userId = localStorage.getItem('userId');

  const [userReaction, setUserReaction] = useState(() => {
    if (!userId) return null;
    if (safePost.likes.users.includes(userId)) return 'like';
    if (safePost.dislikes.users.includes(userId)) return 'dislike';
    return null;
  });

  const [showComments, setShowComments] = useState(false);

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

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleCommentCountUpdate = (newCount) => {
    if (onPostUpdate) {
      onPostUpdate({
        ...post,
        commentsCount: newCount
      });
    }
    setLocalCommentsCount(newCount);
  };

  function getCommentsText(count) {
    if (!count || count === 0) return 'Нет комментариев';
    if (count % 10 === 1 && count % 100 !== 11) return `${count} комментарий`;
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return `${count} комментария`;
    return `${count} комментариев`;
  }

  return (
    <Box sx={{
      backgroundColor: 'rgba(17, 17, 17, 1)',
      border: "solid rgb(34,34,34) 2px",
      borderRadius: 2,
      mb: 0,
      mt: 1,
      position: 'relative',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      p: 2,
      pb: 1.5,
      '&:hover': {
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
      },
    }}>
      <PostHeader
        post={post}
        onDelete={onDelete}
        onPostUpdate={onPostUpdate}
        onCommentClick={handleCommentClick}
      />

      {post.imageUrl && (
        <PostPhoto post={post} sx={{ mb: 1 }} />
      )}
      <PostText postId={post._id} sx={{ mt: 1.4 }}>
        {post.title || 'Этот пост не имеет текст :/'}
      </PostText>
      <Divider sx={{ mt: 0, mb: 1.5 }}></Divider>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
       <Box sx={{justifyContent:'flex-end', display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={handleCommentClick}>
          <FiMessageSquare 
            style={{ 
              fontSize: 22, 
              color: showComments ? '#42a5f5' : 'rgba(84, 163, 247, 1)', 
              marginRight: 8, 
              width: 20, 
              height: 20 
            }} 
          />
          <Typography 
            sx={{ 
              fontSize: '13px', 
              mt: 0, 
              ml: 0.1, 
              color: showComments ? '#42a5f5' : 'rgba(84, 163, 247, 1)', 
              mr: 2,
              '&:hover': {
                color: '#42a5f5'
              }
            }}
          >
            {getCommentsText(localCommentsCount)}
          </Typography>
       </Box>

        {/* Блок реакций */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          '& .MuiIconButton-root': { padding: '4px' }
        }}>
          <IconButton
            size="small"
            onClick={() => handleReaction('like')}
            sx={{ 
              color: userReaction === 'like' ? '#42a5f5' : 'rgba(209, 209, 209, 1)',
              '&:hover': { backgroundColor: 'rgba(66, 165, 245, 0.1)' }
            }}
          >
            <FiThumbsUp size={14} />
          </IconButton>
          <Typography variant="caption" sx={{ mr: 1, minWidth: '10px', fontWeight: 'Bold', color: 'white', ml: 0.5 }}>
            {localLikes}
          </Typography>

          <IconButton
            size="small"
            onClick={() => handleReaction('dislike')}
            sx={{ 
              color: userReaction === 'dislike' ? '#f44336' : 'rgba(209, 209, 209, 1)',
              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
            }}
          >
            <FiThumbsDown size={14} />
          </IconButton>
          <Typography variant="caption" sx={{ mr: 1, minWidth: '10px', fontWeight: 'Bold', color: 'white', ml: 0.5 }}>
            {localDislikes}
          </Typography>
        </Box>
      </Box>

      {showComments && (
        <CommentSection
          postId={post._id}
          postAuthorId={post.user._id}
          onCommentCountUpdate={handleCommentCountUpdate}
        />
      )}
    </Box>
  );
};

export default PostWithComments;
