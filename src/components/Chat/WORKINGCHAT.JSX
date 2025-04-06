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
} from "@mui/material";
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

const ChatSystem = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const chatEndRef = useRef(null);

  const [myUserId, setUserName] = useState("");

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");

    if (accessToken) {
      try {
        const decodedToken = jwt_decode(accessToken);
        setUserName(decodedToken?.user_id || "User Name");
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserName("");
      }
    } else {
      setUserName("");
    }
  }, []);
  const token = sessionStorage.getItem("access_token");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_all_users/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Error fetching users:", err));
  }, [token]);

  // ✅ 2. Load chat history + setup WebSocket
  useEffect(() => {
    if (!selectedUser || !myUserId) return;

    // Fetch message history
    fetch(`http://127.0.0.1:8000/api/history/${myUserId}/${selectedUser.id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setMessages)
      .catch((err) => console.error("Error fetching messages:", err));

    // Setup WebSocket
    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${myUserId}/${selectedUser.id}/`
    );

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]); // only append once
    };

    ws.onerror = (e) => console.error("WebSocket error:", e);
    ws.onclose = () => console.log("WebSocket closed");

    setSocket(ws);

    // Cleanup on unmount or when selected user changes
    return () => ws.close();
  }, [selectedUser, token, myUserId]);

  // ✅ 3. Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <Paper
        sx={{
          width: "25%",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "white",
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" fontWeight={600} sx={{ color: "#3f51b5" }}>
          Connected
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Chats
          </Typography>
          <ChatBubbleOutlineIcon sx={{ fontSize: "24px", color: "#3f51b5" }} />
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search in chats"
          sx={{ marginTop: "10px", marginBottom: "10px", borderRadius: "20px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List>
          {users.map((user) => (
            <ListItem
              button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              selected={selectedUser?.id === user.id}
            >
              <ListItemAvatar>
                <Avatar src={user.avatar} />
              </ListItemAvatar>
              <ListItemText primary={user.username} secondary="Click to chat" />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        {selectedUser && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={selectedUser.avatar}
                  sx={{ marginRight: "10px" }}
                />
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

            <Box sx={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      Number(msg.sender) === Number(myUserId)
                        ? "flex-end"
                        : "flex-start",
                    marginBottom: "10px",
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
                      padding: "10px",
                      borderRadius: "10px",
                      maxWidth: "60%",
                    }}
                  >
                    {msg.message}
                  </Box>
                </Box>
              ))}
              <div ref={chatEndRef} />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderTop: "1px solid #ddd",
              }}
            >
              <IconButton>
                <InsertEmoticonIcon />
              </IconButton>
              <IconButton>
                <AttachFileIcon />
              </IconButton>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                sx={{ borderRadius: "20px" }}
              />
              <IconButton onClick={handleSendMessage}>
                <SendIcon sx={{ color: "#3f51b5" }} />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ChatSystem;
