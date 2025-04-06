import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Badge,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  Search as SearchIcon,
  VideoCall as VideoCallIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon,
  InsertEmoticon as InsertEmoticonIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  Image as ImageIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Link as LinkIcon,
  NotificationsOff as NotificationsOffIcon,
} from "@mui/icons-material";
import jwt_decode from "jwt-decode"; // Import jwt_decode to decode token
import Swal from "sweetalert2";
import toastr from "toastr"; // Import toastr for toast notifications
import "toastr/build/toastr.min.css"; // Import toastr styles
import EmojiPicker from "emoji-picker-react";
import { BaseUrlProfile } from "../../endpoint/apiUrl";
const ChatSystem = () => {
  const [myUserId, setMyUserId] = useState(null); // ❗ Was string before
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const chatEndRef = useRef(null);

  // ✅ 1. Decode token and get user ID

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");

    if (accessToken) {
      try {
        const decodedToken = jwt_decode(accessToken);
        setMyUserId(decodedToken?.user_id || null); // must be numeric
      } catch (error) {
        console.error("Error decoding token:", error);
        setMyUserId(null);
      }
    } else {
      setMyUserId(null);
    }
  }, []);

  const token = sessionStorage.getItem("access_token");

  // ✅ 2. Fetch all users
  useEffect(() => {
    if (!token) return;

    fetch(`${BaseUrlProfile}/api/get_all_users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Show a toast notification using Toastr
          Swal.fire({
            title: "Unauthorized",
            text: "Session expired. Please log in again",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          console.error("Error fetching user profile", error);
        }
      });
  }, [token]);

  // ✅ 3. Load chat history + setup WebSocket for messages
  useEffect(() => {
    if (!selectedUser || !myUserId || !token) return;

    fetch(`${BaseUrlProfile}/api/history/${myUserId}/${selectedUser.id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setMessages)
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Show a toast notification using Toastr
          Swal.fire({
            title: "Unauthorized",
            text: "Session expired. Please log in again",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          console.error("Error fetching user profile", error);
        }
      });

    const ws = new WebSocket(
      `wss://connected-0ggq.onrender.com/ws/chat/${myUserId}/${selectedUser.id}/?token=${token}`
    );

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.onerror = (e) => console.error("Chat WebSocket error:", e);
    ws.onclose = () => console.log("Chat WebSocket closed");

    setSocket(ws);
    return () => ws.close();
  }, [selectedUser, token, myUserId]);

  // ✅ 4. Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ 5. WebSocket connection for tracking online status
  useEffect(() => {
    if (!myUserId || !token) return;

    const socketUrl = `wss://connected-0ggq.onrender.com/ws/online/${myUserId}/?token=${token}`;


    const onlineSocket = new WebSocket(socketUrl);

    onlineSocket.onopen = () => {
      console.log("[WS] ✅ Connected to online tracking socket");
    };

    onlineSocket.onerror = (e) => {

    };

    onlineSocket.onclose = (e) => {
      console.log(`[WS] 🔌 Disconnected (code ${e.code})`);
    };

    return () => {
      console.log("[WS] 💥 Closing online socket");
      onlineSocket.close();
    };
  }, [myUserId, token]);

  // ✅ 6. Poll online users API every 5s
  useEffect(() => {
    if (!token || !myUserId) return;

    const fetchOnlineUsers = async () => {
      try {
        const response = await fetch(
          `${BaseUrlProfile}/api/online-users/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            Swal.fire({
              title: "Unauthorized",
              text: "Session expired. Please log in again.",
              icon: "warning",
              confirmButtonText: "OK",
            });
          } else {
            throw new Error("Failed to fetch online users");
          }
          return;
        }

        const data = await response.json();

        setOnlineUserIds(data);
      } catch (error) {
        console.error("[FETCH] ❌ Error fetching online users:", error);
      }
    };

    fetchOnlineUsers(); // run once initially

    const interval = setInterval(fetchOnlineUsers, 5000); // poll every 5s
    return () => {

      clearInterval(interval);
    };
  }, [token, myUserId]);

  // ...the rest of your component UI goes here

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const msgData = {
      sender: myUserId,
      receiver: selectedUser.id,
      message: newMessage,
    };

    // ✅ Send to WebSocket only
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msgData));
    }

    setNewMessage(""); // Clear input
  };
  const isMobile = useMediaQuery("(max-width:768px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const renderSidebarContent = () => (
    <>
      <Typography variant="h5" fontWeight={600} color="primary">
        Connected
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Chats
        </Typography>
        <ChatBubbleOutlineIcon color="primary" />
      </Box>

      <TextField
        fullWidth
        size="small"
        placeholder="Search chats"
        sx={{ mt: 2, mb: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <List dense>
        {(Array.isArray(users) ? users : [])
          .filter((user) => user.id !== myUserId && user.id !== 1)
          .map((user) => {
            const chatHistory = messages.filter(
              (msg) =>
                (msg.sender === myUserId && msg.receiver === user.id) ||
                (msg.sender === user.id && msg.receiver === myUserId)
            );

            const latestMsg =
              chatHistory[chatHistory.length - 1]?.message || "No messages yet";
            const isOnline = onlineUserIds.some((u) => u.id === user.id);

            return (
              <ListItem
                button
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  if (isMobile) setDrawerOpen(false); // close drawer on select
                }}
                selected={selectedUser?.id === user.id}
                sx={{
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    cursor:"pointer"
                  },
                  mb: 1,
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    color={isOnline ? "success" : "default"}
                  >
                    <Avatar src={`${BaseUrlProfile}${user.profile_pic}`} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">
                      {user.username} {isOnline ? "🟢" : "❌"}
                    </Typography>
                  }
                  secondary={latestMsg}
                  secondaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>
            );
          })}
      </List>
    </>
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  
  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false); // ✅ hide emoji picker after click
  };

  
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ sx: { width: 280, padding: 2 } }}
        >
          {renderSidebarContent()}
        </Drawer>
      ) : (
        <Paper
          sx={{
            width: 300,
            padding: 2,
            borderRadius: 2,
            backgroundColor: "white",
            overflowY: "auto",
            boxShadow: 2,
            height: "100%",
          }}
        >
          {renderSidebarContent()}
        </Paper>
      )}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: 2,
          ml: 2,
          boxShadow: 2,
        }}
      >
        {selectedUser ? (
          <>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                px: 2,
                py: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar src={selectedUser.avatar} sx={{ mr: 2 }} />
                <Typography variant="h6">{selectedUser.username}</Typography>
              </Box>
              <Box>
                <IconButton>
                  <VideoCallIcon />
                </IconButton>
                <IconButton>
                  <PhoneIcon />
                </IconButton>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      Number(msg.sender) === Number(myUserId)
                        ? "flex-end"
                        : "flex-start",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor:
                        Number(msg.sender) === Number(myUserId)
                          ? "#3f51b5"
                          : "#e0e0e0",
                      color:
                        Number(msg.sender) === Number(myUserId)
                          ? "white"
                          : "black",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      maxWidth: "60%",
                    }}
                  >
                    {msg.message}
                  </Box>
                </Box>
              ))}
              <div ref={chatEndRef} />
            </Box>

            {/* Input */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderTop: "1px solid #ddd",
                px: 2,
                py: 1,
              }}
            >
<IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
  <InsertEmoticonIcon />
</IconButton>

{showEmojiPicker && (
  <Box sx={{ position: "absolute", bottom: 60, left: 20, zIndex: 10 }}>
    <EmojiPicker onEmojiClick={handleEmojiClick} />
  </Box>
)}

              <IconButton>
                <AttachFileIcon />
              </IconButton>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                sx={{ mx: 2 }}
              />
              <IconButton onClick={handleSendMessage}>
                <SendIcon sx={{ color: "#3f51b5" }} />
              </IconButton>
            </Box>
          </>
        ) : (
          // 👇 Shown when no chat is selected
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#aaa",
              textAlign: "center",
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6">No conversation selected</Typography>
            <Typography variant="body2">
              Select a user on the left to start chatting!
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatSystem;
