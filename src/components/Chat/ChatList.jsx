import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from "@mui/material";
import jwt_decode from "jwt-decode"; // Import jwt_decode to decode token
import { Link, useNavigate } from "react-router-dom";
import { BaseUrlProfile } from "../../endpoint/apiUrl";
const ChatList = () => {
  const [myUserId, setMyUserId] = useState(null); // ❗ Was string before
  const [onlineUsers, setOnlineUsers] = useState([]);
  const token = sessionStorage.getItem("access_token");

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
        const data = await response.json();

        setOnlineUsers(data.filter((u) => u.id !== myUserId)); // exclude self
      } catch (error) {
        console.error("[FETCH] ❌ Error fetching online users:", error);
      }
    };

    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 5000);
    return () => {

      clearInterval(interval);
    };
  }, [token, myUserId]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" fontWeight={600} sx={{ marginBottom: 1 }}>
        Online Contacts
      </Typography>

      <List>
        {onlineUsers.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No one is online 😴
          </Typography>
        )}

        {onlineUsers.map((user) => (
          <React.Fragment key={user.id}>
            <ListItem
              button
              onClick={() => console.log("Start chat with", user.id)}
              component={Link}
              to="/chatsystem"
  
              sx={{cursor:"pointer", textDecoration: "none", color: "inherit"}}
            >
              <ListItemAvatar>
                <Avatar src={user.profile_pic || ""}>
                  {user.username?.[0]?.toUpperCase()}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={user.username}
                secondary={<span style={{ color: "green" }}>🟢 Online</span>}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ChatList;
