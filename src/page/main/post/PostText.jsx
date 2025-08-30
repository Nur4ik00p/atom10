import React, { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { customIcons } from '../../../components/icon';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PostText = ({ children, postId }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const renderMarkdown = (content, key) => (
    <ReactMarkdown
      key={key}
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => (
          <p style={{ margin: "6px 0", maxWidth: "480px", overflowWrap: "break-word" }} {...props} />
        ),
        h1: ({ node, ...props }) => <h1 style={{ fontSize: "1.6em", margin: "10px 0", maxWidth: "480px" }} {...props} />,
        h2: ({ node, ...props }) => <h2 style={{ fontSize: "1.3em", margin: "8px 0", maxWidth: "480px" }} {...props} />,
        h3: ({ node, ...props }) => <h3 style={{ fontSize: "1.1em", margin: "6px 0", maxWidth: "480px" }} {...props} />,
        li: ({ node, ...props }) => <li style={{ marginLeft: "18px", maxWidth: "480px" }} {...props} />,
        code: ({ inline, children, ...props }) => (
          <code
            style={{
              backgroundColor: "rgba(34,34,34,0.85)",
              padding: inline ? "2px 6px" : "10px",
              borderRadius: "6px",
              fontSize: "0.9em",
              display: inline ? "inline" : "block",
              overflowX: "auto",
              whiteSpace: inline ? "normal" : "pre-wrap",
              maxWidth: "480px",
            }}
            {...props}
          >
            {children}
          </code>
        ),
        img: ({ node, ...props }) => (
          <img
            {...props}
            style={{
              maxWidth: "480px",
              borderRadius: "8px",
              display: "block",
              margin: "10px 0"
            }}
          />
        )
      }}
    >
      {content}
    </ReactMarkdown>
  );
  const handleClick = () => postId && navigate(`/post/${postId}`);
  const renderContent = (child, i) => {
    if (typeof child === "string") {
      return child.split(/(\[[^\]]+\])/).map((part, idx) => {
        if (part.startsWith("[") && part.endsWith("]")) {
          const keyword = part.slice(1, -1).toLowerCase();
          const IconComponent = customIcons[keyword]?.component;
          return IconComponent ? (
            <IconComponent
              key={`icon-${i}-${idx}`}
              style={{ display: "inline", verticalAlign: "middle", margin: "0 2px" }}
            />
          ) : part;
        }
        return renderMarkdown(part, `${i}-${idx}`);
      });
    }
    return child;
  };

const fullText = React.Children.toArray(children).join(" ");
  const isLong = fullText.length > 300;

  return (
    <Box sx={{ position: "relative", maxWidth: "480px" }}>
      <Typography
        sx={{
          fontFamily: "Arial",
          marginTop: "10px",
          color: "white",
          cursor: postId ? "pointer" : "default",
          "&:hover": {
            textDecoration: postId ? "underline" : "none",
          },
          maxHeight: !expanded && isLong ? "150px" : "none",
          overflow: !expanded && isLong ? "hidden" : "visible",
          position: "relative",
        }}
        onClick={handleClick}
      >
        {React.Children.map(children, renderContent)}
      </Typography>

      {!expanded && isLong && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50px",
            background: "linear-gradient(to top, rgba(17,17,17,1), rgba(17,17,17,0))",
          }}
        />
      )}

      {isLong && (
        <Button
          onClick={() => setExpanded((prev) => !prev)}
          sx={{
            mt: 1,
            fontSize: "12px",
            color: "#4ea1ff",
            textTransform: "none",
            mr:2
          }}
        >
          {expanded ? "Скрыть" : "Показать ещё"}
        </Button>
      )}
    </Box>
  );
};

export default PostText;
