import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Avatar,
  Box,
  IconButton,
  Paper,
  Menu,
  MenuItem,
  Divider,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import jwt_decode from "jwt-decode";
import { BaseUrlProfile } from "../../endpoint/apiUrl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import toastr from "toastr"; // Import toastr for toast notifications
import "toastr/build/toastr.min.css"; // Import toastr styles

const Navbar = () => {
  const [searchAnchor, setSearchAnchor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [username, setUserName] = useState("");
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    axios
      .get(`${BaseUrlProfile}/api/get_all_users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setAllUsers(res.data))
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Show a toast notification using Toastr
          Swal.fire({
            title: "Unauthorized",
            text: "Session expired. Please log in again.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          console.error("Error fetching user profile", error);
        }
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = allUsers.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
  }, [searchQuery, allUsers]);

  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");

    if (accessToken) {
      try {
        const decodedToken = jwt_decode(accessToken);
        setUserId(decodedToken?.user_id); // ✅ set userId
        setUserName(decodedToken?.username || "User Name");
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserId(null);
        setUserName("");
      }
    } else {
      setUserId(null);
      setUserName("");
    }
  }, []);

  const loggedInUser = allUsers.find((user) => user.id === userId);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screens

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSearchClick = (event) => {
    setSearchAnchor(event.currentTarget);
  };

  const handleCloseSearch = () => {
    setSearchAnchor(null);
    setSearchQuery("");
  };

  // const recentSearches = [
  //   { name: "Garden BBQ", type: "Event", icon: "📅" },
  //   { name: "Meggie Luck", type: "Mutual friends: 20", avatar: "/avatar2.jpg" },
  //   { name: "Burger Place No. 10", type: "Restaurant", icon: "🍔" },
  // ];

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        color: "black",
        boxShadow: "none",
        borderBottom: "1px solid #ddd",
        paddingY: "5px",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingX: "20px",
        }}
      >
        {/* Left: Brand Name & Menu Icon on Mobile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isMobile && <Box></Box>}

          <Typography
            variant="h6"
            fontWeight={600}
            color="#3f51b5"
            sx={{ fontSize: "20px", ml: 5 }}
          >
            Connected
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {/* Center: Search Bar */}
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f1f1f1",
              padding: {
                xs: "10px 15px",
                sm: "5px 5px",
                md: "5px 5px",
                lg: "10px 15px",
              },
              borderRadius: "30px",
              width: { xs: "100%", sm: "70%", md: "70%", lg: "70%" },
              cursor: "pointer",
            }}
            onClick={handleSearchClick}
          >
            <SearchIcon
              sx={{ color: "gray", marginRight: "8px", fontSize: "20px" }}
            />
            <InputBase
              placeholder="Type in search"
              sx={{ flex: 1, fontSize: "15px" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Paper>
        </Box>

        {/* Right: Icons + User Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {isMobile ? (
            // Mobile: Show 3-dot menu instead of icons
            <>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleCloseMenu}>
                  <ChatBubbleOutlineIcon sx={{ marginRight: "10px" }} />{" "}
                  Messages
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                  <NotificationsNoneIcon sx={{ marginRight: "10px" }} />{" "}
                  Notifications
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                  <AccountCircleIcon sx={{ marginRight: "10px" }} /> Profile
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <IconButton
                sx={{
                  backgroundColor: "#f1f1f1",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                }}
              >
                <ChatBubbleOutlineIcon
                  sx={{ color: "black", fontSize: "20px" }}
                />
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: "#f1f1f1",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                }}
              >
                <NotificationsNoneIcon
                  sx={{ color: "black", fontSize: "20px" }}
                />
              </IconButton>
              <Typography
                variant="body1"
                fontWeight={500}
                sx={{ fontSize: "14px" }}
              >
                {username}
              </Typography>
              <Avatar
                src={
                  loggedInUser
                    ? `${BaseUrlProfile}${loggedInUser.profile_pic}`
                    : "/fallback.jpg"
                }
                sx={{ width: 36, height: 36 }}
              />
            </>
          )}
        </Box>
      </Toolbar>
      {/* Search Dropdown */}
      <Menu
        anchorEl={searchAnchor}
        open={Boolean(searchAnchor)}
        onClose={handleCloseSearch}
        sx={{ marginTop: "5px" }}
        PaperProps={{
          sx: { width: "600px", borderRadius: "10px", padding: "10px" },
        }}
      >
        {/* Search Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 15px",
          }}
        >
          <InputBase
            placeholder="Type in search"
            sx={{ flex: 1, fontSize: "15px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton onClick={handleCloseSearch}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Filter Buttons */}
        <Box sx={{ display: "flex", gap: "10px", padding: "10px 15px" }}>
          {["All", "People", "Messages", "Events"].map((filter) => (
            <Button
              key={filter}
              variant="outlined"
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontSize: "12px",
              }}
            >
              {filter}
            </Button>
          ))}
        </Box>

        {/* Search Results */}
        {searchResults.length > 0 &&
          searchResults.map((user) => (
            <ListItem
              key={user.id}
              button
              onClick={() => handleUserClick(user.id)}
              sx={{
                borderRadius: "5px",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <ListItemAvatar>
                <Avatar src={`${BaseUrlProfile}${user.profile_pic}`} />
              </ListItemAvatar>
              <ListItemText primary={user.username} secondary={user.email} />
              <ArrowForwardIosIcon sx={{ fontSize: "14px", color: "gray" }} />
            </ListItem>
          ))}

        {/* Recent Searches */}
        {/* <Typography sx={{ padding: "10px 15px", fontSize: "14px", fontWeight: 600, color: "gray" }}>
          Recent searches
        </Typography>
        {recentSearches.map((item, index) => (
          <ListItem key={index} button sx={{ borderRadius: "5px", "&:hover": { backgroundColor: "#f5f5f5" } }}>
            <ListItemAvatar>
              {item.avatar ? <Avatar src={item.avatar} /> : <Typography>{item.icon}</Typography>}
            </ListItemAvatar>
            <ListItemText primary={item.name} secondary={item.type} />
            <ArrowForwardIosIcon sx={{ fontSize: "14px", color: "gray" }} />
          </ListItem>
        ))} */}
      </Menu>
    </AppBar>
  );
};

export default Navbar;
