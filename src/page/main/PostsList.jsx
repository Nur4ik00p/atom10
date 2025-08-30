import React, { memo, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import PostWithComments from './post/PostWithComments';
import PostSkeleton from './post/PostSkeleton';

const POSTS_PER_PAGE = 5; 

const PostsList = memo(({ posts, loading, onDelete, onPostUpdate }) => {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  if (loading) {
    return (
      <Box>
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </Box>
    );
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  const visiblePosts = posts.slice(0, visibleCount);

  return (
    <Box>
      {visiblePosts.map((post, index) => (
        <Box
          key={`${post._id}-${index}`}
          sx={{
            opacity: 0,
            transform: 'translateY(30px) scale(0.95)',
            animation: `slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`,
            '@keyframes slideInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(30px) scale(0.95)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
              },
            },
            position: 'relative',
            mb: 2,
          }}
        >
          <PostWithComments
            post={post}
            onDelete={onDelete}
            onPostUpdate={onPostUpdate}
          />

          {post.pending && (
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 20,
                color: 'orange',
                fontSize: 13,
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            >
              Отправляется...
            </Box>
          )}
        </Box>
      ))}

      {visibleCount < posts.length && (
        <Box sx={{ textAlign: 'center', mt: 2 ,mb:5}}>
          <Button variant="outlined" onClick={handleLoadMore}>
            Загрузить ещё
          </Button>
        </Box>
      )}
    </Box>
  );
});

export default PostsList;
