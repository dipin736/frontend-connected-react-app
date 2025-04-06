import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import PeopleIcon from "@mui/icons-material/People";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import EventIcon from "@mui/icons-material/Event";
import MemoryIcon from "@mui/icons-material/Memory";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CollectionsIcon from "@mui/icons-material/Collections";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import CommunityChats from "../Chat/CommunityChats";
import Advertisement from "../Feed/Advertisement";
const iconStyle = {
  fontSize: "28px", // Make icons bold and larger
  color: "#000", // Bold black color
};

const Sidebar = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("access_token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwt_decode(token);
      userId = decoded?.user_id;
    } catch (error) {
      console.error("Token decode failed", error);
    }
  }
  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        padding: "15px",
        width: "250px",
        borderRight: "1px solid #ddd",
        minHeight: "100vh",
      }}
    >
      {/* Navigation */}
      <List>
        <ListItem
          button
          component={Link}
          to="/home"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemIcon>
            <HomeIcon sx={iconStyle} />
          </ListItemIcon>
          <ListItemText primary="Home" sx={{ fontWeight: 600 }} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to={`/profile/${userId}`}
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemIcon>
            <CollectionsIcon sx={iconStyle} />
          </ListItemIcon>
          <ListItemText primary="Profile" sx={{ fontWeight: 600 }} />
        </ListItem>
      </List>

      {/* Favorites Section */}
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ marginTop: "15px", marginBottom: "5px", color: "gray" }}
      >
        Favorites
      </Typography>
      <List>
        <ListItem
          button
          component={Link}
          to="/chatsystem"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemIcon>
            <CollectionsIcon sx={iconStyle} />
          </ListItemIcon>
          <ListItemText primary="Messages" sx={{ fontWeight: 600 }} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to={`/profile/${userId}`}
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemIcon>
            <PeopleIcon sx={iconStyle} />
          </ListItemIcon>
          <ListItemText primary="Friends" sx={{ fontWeight: 600 }} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/home"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemIcon>
            <DynamicFeedIcon sx={iconStyle} />
          </ListItemIcon>
          <ListItemText primary="Feed" sx={{ fontWeight: 600 }} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/stories"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemIcon>
            <CollectionsIcon sx={iconStyle} />
          </ListItemIcon>
          <ListItemText primary="Stories" sx={{ fontWeight: 600 }} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <EventIcon sx={iconStyle} />
          </ListItemIcon>
          <ListItemText primary="Events" sx={{ fontWeight: 600 }} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <MemoryIcon sx={iconStyle} />
          </ListItemIcon>
          <ListItemText primary="Memories" sx={{ fontWeight: 600 }} />
        </ListItem>
      </List>
         {/* Help & Support Section */}
         <List>
        <ListItem button>
          <ListItemIcon>
            <HelpOutlineIcon sx={{ fontSize: "24px", color: "gray" }} />
          </ListItemIcon>
          <ListItemText primary="Help & Support" sx={{ fontWeight: 500 }} />
        </ListItem>
      </List>

      {/* Logout */}
      <ListItem button onClick={handleLogout} sx={{ cursor: "pointer" }}>
        <ListItemIcon>
          <ExitToAppIcon sx={{ fontSize: "24px", color: "gray" }} />
        </ListItemIcon>
        <ListItemText primary="Log out" sx={{ fontWeight: 500 }} />
      </ListItem>

      <Divider sx={{ marginY: "10px" }} />

      {/* Groups Section */}
      {/* <Typography variant="body2" fontWeight={600} sx={{ marginBottom: "5px", color: "gray" }}>
        Groups
      </Typography>
      <List>
        <ListItem button>
          <ListItemIcon>
            <Avatar src="/dog-lovers.jpg" sx={{ width: 30, height: 30 }} />
          </ListItemIcon>
          <ListItemText primary="Dog Lovers" sx={{ fontWeight: 500 }} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Avatar src="/gamerzzz.jpg" sx={{ width: 30, height: 30 }} />
          </ListItemIcon>
          <ListItemText primary="GamerZzZ" sx={{ fontWeight: 500 }} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Avatar src="/travel-girls.jpg" sx={{ width: 30, height: 30 }} />
          </ListItemIcon>
          <ListItemText primary="Travel Girls" sx={{ fontWeight: 500 }} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Avatar src="/cat-memez.jpg" sx={{ width: 30, height: 30 }} />
          </ListItemIcon>
          <ListItemText primary="Cat Memez" sx={{ fontWeight: 500 }} />
        </ListItem>
      </List> */}
      <Card sx={{ marginBottom: "15px", borderRadius: "10px" }}>
        <CardContent>
          <img
            src="https://img.freepik.com/free-vector/content-creator-concept-illustration_114360-6592.jpg"
            alt="Go Viral"
            style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
          />
          <Typography variant="body1" fontWeight={600}>
            Your content deserves the spotlight ✨
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Create, share, and grow your audience. Go viral today!
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ marginY: "10px" }} />

   
      <CommunityChats />
      <Advertisement />
    </Box>
  );
};

export default Sidebar;
