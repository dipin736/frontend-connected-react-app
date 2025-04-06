import React, { useState, useEffect, useRef } from "react";
import { Box, Avatar, Typography, IconButton, TextField, InputAdornment, Paper, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PhoneIcon from "@mui/icons-material/Phone";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LinkIcon from "@mui/icons-material/Link";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
// Dummy Data (You can replace this with Firebase or API data)
const users = [
{ id: 1, name: "Ethan Reynolds", lastMessage: "R u here?", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Ava Thompson", lastMessage: "LOL", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: 3, name: "Pablo Morandi", lastMessage: "This is the...", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 4, name: "Olivia Hayes", lastMessage: "Got the thing you...", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
  { id: 1, name: "Ethan Reynolds", lastMessage: "R u here?", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Ava Thompson", lastMessage: "LOL", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: 3, name: "Pablo Morandi", lastMessage: "This is the...", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 4, name: "Olivia Hayes", lastMessage: "Got the thing you...", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
];

const messagesData = [
  { sender: "me", text: "I'm on my way but there is a crying baby in the bus...", time: "9:11 PM" },
  { sender: "other", text: "Oh boy! You will manage. Just don't be late.", time: "10:00 PM" },
  { sender: "me", text: "I'm here. Where are you?", time: "10:05 PM" },
  { sender: "other", text: "On my way.", time: "10:06 PM" },
  { sender: "me", text: "You are ridiculous!!!", time: "10:07 PM" },
];

const sharedMedia = [
    "https://plus.unsplash.com/premium_photo-1681422570054-9ae5b8b03e46?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dW5zcGxhc2glMjBhcHB8ZW58MHx8MHx8fDA%3D",
    "https://plus.unsplash.com/premium_photo-1673697239909-e11521d1ba94?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXZlbmluZ3xlbnwwfHwwfHx8MA%3D%3D",
    "https://petapixel.com/assets/uploads/2022/12/what-is-unsplash-550x288.jpg",
    "https://st3.depositphotos.com/1177973/14747/i/450/depositphotos_147475719-stock-photo-man-taking-photo-on-smartphone.jpg",
    "https://st3.depositphotos.com/4732855/13000/i/450/depositphotos_130001514-stock-photo-silhouette-of-man-photographer-with.jpg",
    "https://st3.depositphotos.com/4732855/13000/i/450/depositphotos_130001514-stock-photo-silhouette-of-man-photographer-with.jpg",
  ];
  
  const sharedFiles = [
    { name: "Document.pdf", size: "1 MB" },
    { name: "Doctor Appointment", size: "10 KB" },
    { name: "Essay - Biology", size: "200 KB" },
    { name: "Document.pdf", size: "1 MB" },
  ];
  
  const sharedLinks = [
    { name: "LinkedIn profile", url: "https://media.sproutsocial.com/uploads/2023/09/My-pages-section-LinkedIn-.png" },
    { name: "Online game", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXrmaR1SSqdcSByp-ag8aidEzRD9RAhbI2hA&s" },
    { name: "Video", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXrmaR1SSqdcSByp-ag8aidEzRD9RAhbI2hA&s" },
  ];
  

  const ChatSystem = () => {
    const [selectedUser, setSelectedUser] = useState(users[1]); // Default user
    const [messages, setMessages] = useState(messagesData);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);
  
    // Auto-scroll to latest message
    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    const handleSendMessage = () => {
      if (newMessage.trim() !== "") {
        setMessages([...messages, { sender: "me", text: newMessage, time: "Now" }]);
        setNewMessage("");
      }
    };
  
    return (
      <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
  
        {/* Left Sidebar - Chat List */}
        <Paper sx={{ width: "25%", padding: "20px", borderRadius: "10px", backgroundColor: "white", overflowY: "auto" }}>
          <Typography variant="h5" fontWeight={600} sx={{ color: "#3f51b5" }}>Connected</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
            <Typography variant="h6" fontWeight={600}>Chats</Typography>
            <ChatBubbleOutlineIcon sx={{ fontSize: "24px", color: "#3f51b5" }} />
        </Box>
        
          {/* Search Bar */}
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
  
          {/* Chat List */}
          <List>
            {users.map((user) => (
              <ListItem button key={user.id} onClick={() => setSelectedUser(user)} selected={user.id === selectedUser.id}>
                <ListItemAvatar>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.lastMessage} />
              </ListItem>
            ))}
          </List>
        </Paper>

      {/* Middle Section - Chat Messages */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "white", borderRadius: "10px", padding: "20px" }}>

        {/* Chat Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid #ddd" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={selectedUser.avatar} sx={{ marginRight: "10px" }} />
            <Typography variant="h6">{selectedUser.name}</Typography>
          </Box>
          <Box>
            <IconButton><VideoCallIcon /></IconButton>
            <IconButton><PhoneIcon /></IconButton>
            <IconButton><MoreVertIcon /></IconButton>
          </Box>
        </Box>

        {/* Messages Area */}
        <Box sx={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{
              display: "flex",
              justifyContent: msg.sender === "me" ? "flex-end" : "flex-start",
              marginBottom: "10px"
            }}>
              <Box sx={{
                backgroundColor: msg.sender === "me" ? "#3f51b5" : "#e0e0e0",
                color: msg.sender === "me" ? "white" : "black",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "60%",
              }}>
                {msg.text}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Message Input Box */}
        <Box sx={{ display: "flex", alignItems: "center", padding: "10px", borderTop: "1px solid #ddd" }}>
          <IconButton><InsertEmoticonIcon /></IconButton>
          <IconButton><AttachFileIcon /></IconButton>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            sx={{ borderRadius: "20px" }}
          />
          <IconButton onClick={handleSendMessage}><SendIcon sx={{ color: "#3f51b5" }} /></IconButton>
        </Box>
      </Box>

      {/* Right Sidebar - Shared Media */}
      <Paper sx={{ width: "25%", height: "100vh", padding: "20px", borderRadius: "10px", backgroundColor: "white", boxShadow: "-2px 0 10px rgba(0,0,0,0.1)", overflowY: "auto" }}>
      
      {/* Chat Details Header */}
      <Typography variant="h6" fontWeight={600}>Chat Details</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}>
        <IconButton><ImageIcon /></IconButton>
        <IconButton><InsertDriveFileIcon /></IconButton>
        <IconButton><LinkIcon /></IconButton>
        <IconButton><NotificationsOffIcon /></IconButton>
      </Box>

      {/* Shared Media Section */}
      <Typography variant="body2" fontWeight={600} sx={{ marginTop: "20px", color: "gray" }}>Shared media ({sharedMedia.length})</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "10px" }}>
        {sharedMedia.map((media, index) => (
          <img key={index} src={media} alt="shared" style={{ borderRadius: "10px", width: "100%", height: "70px", objectFit: "cover" }} />
        ))}
      </Box>

      {/* Shared Files Section */}
      <Typography variant="body2" fontWeight={600} sx={{ marginTop: "20px", color: "gray" }}>Shared files ({sharedFiles.length})</Typography>
      <List>
        {sharedFiles.map((file, index) => (
          <ListItem key={index} button>
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: "#f5f5f5" }}>
                <InsertDriveFileIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={file.name} secondary={file.size} />
          </ListItem>
        ))}
      </List>

      {/* Shared Links Section */}
      <Typography variant="body2" fontWeight={600} sx={{ marginTop: "20px", color: "gray" }}>Shared links ({sharedLinks.length})</Typography>
      <List>
        {sharedLinks.map((link, index) => (
          <ListItem key={index} button component="a" href={link.url} target="_blank">
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: "#e3f2fd" }}>
                <LinkIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={link.name} secondary={link.url} />
          </ListItem>
        ))}
      </List>

    </Paper>

    </Box>
  );
};

export default ChatSystem;
