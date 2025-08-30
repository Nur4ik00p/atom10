import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import { FiImage, FiSmile, FiGitPullRequest, FiCommand } from "react-icons/fi";
import { customIcons } from "../../components/icon";
import axios from "../../system/axios";
import { FiMaximize } from "react-icons/fi";

const PostCreator = ({ onPostCreated }) => {
  const [inputText, setInputText] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFullscreenEditor, setShowFullscreenEditor] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/channels/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          setChannels(res.data);
          if (res.data.length > 0) {
            setSelectedChannel(res.data[0]._id);
          }
        }
      } catch (err) {
        console.error("Ошибка загрузки каналов:", err);
      }
    };

    fetchChannels();
  }, []);

  const handleSendPost = async () => {
    if (!selectedChannel) {
      setError("Выберите канал для публикации");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", inputText.trim());
      formData.append("channelId", selectedChannel);
      if (selectedImage) formData.append("image", selectedImage);

      const res = await axios.post("/posts", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (onPostCreated && res.data) {
        onPostCreated(res.data);
      }

      setInputText("");
      setSelectedImage(null);
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
      setShowImageUpload(false);
    } catch (err) {
      console.error("Ошибка при создании поста:", err);
      setError("Не удалось создать пост");
    }

    setLoading(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, window.innerHeight * 0.7) + "px";
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          minHeight: "100px",
          borderRadius: "10px",
          backgroundColor: "rgba(17, 17, 17, 1)",
          border: "2px solid rgb(34,34,34)",
          p: "15px 20px",
        }}
      >
        <Typography
          sx={{ color: "rgba(129, 129, 129, 1)", fontSize: "15px", mb: "10px" }}
        >
          Мастер создания постов
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(17, 17, 17, 1)",
            border: "1px solid rgb(34,34,34)",
            borderRadius: "8px",
            p: "2px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0, mr: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => setShowImageUpload((prev) => !prev)}
              onTouchEnd={(e) => {
                e.preventDefault();
                setShowImageUpload((prev) => !prev);
              }}
              sx={{
                color: showImageUpload
                  ? "rgba(126,126,126,1)"
                  : "rgba(154,153,153,1)",
              }}
            >
              <FiImage size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setShowEmojiPicker(true)}
              sx={{ color: "rgba(154,153,153,1)" }}
            >
              <FiSmile size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setShowFullscreenEditor(true)}
              onTouchEnd={(e) => {
                e.preventDefault();
                setShowFullscreenEditor(true);
              }}
              sx={{ color: "rgba(154,153,153,1)" }}
              title="Открыть редактор"
            >
              <FiMaximize size={16} />
            </IconButton>
          </Box>

          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              autoGrow(e.target);
            }}
            placeholder="Что у тебя нового?"
            rows={1}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
              color: "rgba(255,255,255,0.8)",
              backgroundColor: "transparent",
              padding: "4px 10px",
              resize: "none",
              overflow: "hidden", 
              minHeight: "20px",
              maxHeight: "70vh",
            }}
            onInput={(e) => autoGrow(e.target)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                requestAnimationFrame(() => autoGrow(e.target));
              }
            }}
          />

          <IconButton
            size="small"
            onClick={handleSendPost}
            disabled={loading || channels.length === 0}
            sx={{
              color:
                channels.length === 0
                  ? "rgba(100,100,100,0.6)"
                  : "rgba(154,153,153,1)",
            }}
          >
            {loading ? "..." : <FiGitPullRequest size={18} />}
          </IconButton>
        </Box>

        {showImageUpload && (
          <Box
            sx={{
              mt: 1,
              p: 2,
              border: "2px dashed #555",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => fileInputRef.current?.click()}
            onTouchEnd={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
          >
            <input
              ref={fileInputRef}
              id="image-upload-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            {selectedImage ? (
              <Box>
                <img
                  src={imagePreviewUrl}
                  alt="preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "120px",
                    borderRadius: "8px",
                  }}
                />
                <Typography
                  sx={{ fontSize: "13px", color: "#1976d2", mt: 1 }}
                >
                  {selectedImage.name}
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ color: "#888", fontSize: "15px" }}>
                Перетащите фото или выберите его
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Typography
            sx={{
              color: "rgba(186, 186, 186, 1)",
              fontSize: "12px",
              mr: 1,
            }}
          >
            Создать пост для канала:
          </Typography>
          <Select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            size="small"
            sx={{
              fontSize: "12px",
              color: "white",
              backgroundColor: "rgba(34,34,34,1)",
              borderRadius: "6px",
              height: "26px",
              "& .MuiSelect-icon": { color: "gray" },
            }}
          >
            {channels.length === 0 ? (
              <MenuItem disabled>Нет каналов</MenuItem>
            ) : (
              channels.map((ch) => (
                <MenuItem key={ch._id} value={ch._id}>
                  {ch.nick || ch.name}
                </MenuItem>
              ))
            )}
          </Select>
        </Box>

        {channels.length === 0 && (
          <Typography sx={{ color: "orange", fontSize: 12, mt: 1 }}>
            У вас нет каналов, создайте канал чтобы публиковать посты
          </Typography>
        )}

        {error && (
          <Typography sx={{ color: "red", fontSize: 13, mt: 1 }}>
            {error}
          </Typography>
        )}

        <Typography
          sx={{
            color: "rgb(147, 146, 146)",
            fontSize: "10px",
            mt: "2px",
          }}
        >
          Создавая посты вы соглашаетесь с правилами публикации постов
        </Typography>
      </Box>
      <Box sx={{ mt:1,width:'100%',mb:1}} >
<Button
  sx={{
    backgroundColor: 'rgba(184, 183, 183, 1)',
    color: 'black',
    width: '100%',
    textTransform: 'none'
  }}
  onClick={() => window.open('https://t.me/atomglide', '_blank')}
>
  Telegram канал проекта (click)
</Button>
      </Box>

      {showEmojiPicker && (
        <Box
          sx={{
            position: "fixed",
            right: 20,
            top: 20,
            backgroundColor: "rgba(56, 65, 74, 1)",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            border: "1px solid rgba(63, 72, 82, 1)",
            width: "300px",
            height: "320px",
            p: 2,
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 1,
              borderBottom: "1px solid rgba(63,72,82,1)",
            }}
          >
            <Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
              Стикеры AtomGlide
            </Typography>
            <Box
              onClick={() => setShowEmojiPicker(false)}
              sx={{
                width: "13px",
                height: "13px",
                borderRadius: "100px",
                backgroundColor: "rgba(255,57,57,1)",
                cursor: "pointer",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              mt: 2,
              justifyContent: "center",
            }}
          >
            {Object.entries(customIcons).map(
              ([key, { component: Icon, keyword }]) => (
                <IconButton
                  key={key}
                  onClick={() => {
                    setInputText((prev) => prev + keyword);
                    setShowEmojiPicker(false);
                  }}
                  sx={{
                    width: "40px",
                    height: "40px",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <Icon />
                </IconButton>
              )
            )}
          </Box>
        </Box>
      )}

      {showFullscreenEditor && (
        <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(14,14,14,0.96)",
        backdropFilter: "blur(6px)",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          borderBottom: "1px solid rgb(34,34,34)",
          background: "rgba(20,20,20,0.9)",
        }}
      >
        <Typography sx={{ color: "white", fontSize: 15 }}>
          Полноэкранный редактор
        </Typography>

        {/* macOS style buttons */}
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Box
            onClick={() => setShowFullscreenEditor(false)}
            sx={{
              width: 14,
              height: 14,
              bgcolor: "red",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          />
          <Box
            sx={{
              width: 14,
              height: 14,
              bgcolor: "yellow",
              borderRadius: "50%",
            }}
          />
          <Box
            sx={{
              width: 14,
              height: 14,
              bgcolor: "green",
              borderRadius: "50%",
            }}
          />
        </Box>
      </div>

      {/* Textarea */}
      <textarea
        style={{
          flex: 1,
          width: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          color: "rgba(255,255,255,0.9)",
          fontSize: "16px",
          lineHeight: 1.5,
          padding: "20px",
          resize: "none",
        }}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Пиши здесь. Поддерживается Markdown и стикеры [python] [go] [java] и др."
      />

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          p: "12px 16px",
          borderTop: "1px solid rgb(34,34,34)",
          background: "rgba(20,20,20,0.9)",
        }}
      >
        <IconButton onClick={() => setShowFullscreenEditor(false)}>
          ✕
        </IconButton>
        <IconButton
          onClick={() => {
            handleSendPost();
            setShowFullscreenEditor(false);
          }}
        >
          <FiGitPullRequest size={18} />
        </IconButton>
      </Box>
    </div>
      )}
    </>
  );
};

export default PostCreator;
