import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  ArrowForwardIos as ArrowForwardIosIcon,
  ArrowBackIos as ArrowBackIosIcon,
  Settings as SettingsIcon,
  Archive as ArchiveIcon,
  Favorite as FavoriteIcon,
  Mood as MoodIcon,
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  ThumbUp as ThumbUpIcon,
} from "@mui/icons-material";
import axios from "axios";
import UploadStory from "./UploadStory";
import Swal from 'sweetalert2';
import jwt_decode from "jwt-decode";  // Import jwt_decode to decode token

const Stories = () => {
  const [storiesData, setStoriesData] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeStory, setActiveStory] = useState(null);
  const token = sessionStorage.getItem("access_token");

  const [userName, setUserName] = useState("");
  const [yourStory, setYourStory] = useState(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");

    if (accessToken) {
      try {
        const decodedToken = jwt_decode(accessToken);
        const usernameFromToken = decodedToken?.username;
        setUserName(usernameFromToken || "");

        // Match story by username from token
        const match = storiesData.find(
          (story) => story.username === usernameFromToken
        );
        setYourStory(match || null);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserName("");
        setYourStory(null);
      }
    } else {
      setUserName("");
      setYourStory(null);
    }
  }, [storiesData]);


  useEffect(() => {
    fetchStories();
  }, [token]);
  
  const fetchStories = async () => {
    try {
      const response = await axios.get(`${BaseUrlProfile}/api/get_stories/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStoriesData(response.data);
      if (response.data.length > 0) {
        setActiveStory(response.data[0]);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          title: 'Unauthorized',
          text: "Session expired. Please log in again.",
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      } else {
        console.error("Error fetching stories", error);
      }
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      handleNextImage();
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentImageIndex, currentStoryIndex]);

  const handleNextImage = () => {
    if (currentImageIndex < activeStory.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (currentStoryIndex < storiesData.length - 1) {
      const nextIndex = currentStoryIndex + 1;
      setCurrentStoryIndex(nextIndex);
      setActiveStory(storiesData[nextIndex]);
      setCurrentImageIndex(0);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (currentStoryIndex > 0) {
      const prevIndex = currentStoryIndex - 1;
      setCurrentStoryIndex(prevIndex);
      setActiveStory(storiesData[prevIndex]);
      setCurrentImageIndex(storiesData[prevIndex].images.length - 1);
    }
  };

  const setActiveStoryHandler = (storyIndex) => {
    setActiveStory(storiesData[storyIndex]);
    setCurrentStoryIndex(storyIndex);
    setCurrentImageIndex(0);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      {/* Left Panel */}
      <Paper
        sx={{
          width: "25%",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Stories
        </Typography>

        <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            sx={{ borderRadius: "20px", fontSize: "12px" }}
          >
            Settings
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArchiveIcon />}
            sx={{ borderRadius: "20px", fontSize: "12px" }}
          >
            Archive
          </Button>
        </Box>

        <UploadStory fetchStories={fetchStories} />

        {/* Your Story (hardcoded first story as your own) */}
        {yourStory && (
          <>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ marginTop: "20px", color: "gray" }}
            >
              Your Story
            </Typography>
            <List>
              <ListItem
                key={yourStory.id}
                onClick={() =>
                  setActiveStoryHandler(
                    storiesData.findIndex((s) => s.id === yourStory.id)
                  )
                }
                selected={yourStory.id === activeStory?.id}
                sx={{ cursor: "pointer" }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={yourStory.profile_pic}
                    sx={{ border: "3px solid #3f51b5" }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={yourStory.username}
                  secondary={yourStory.time_added}
                />
              </ListItem>
            </List>
          </>
        )}
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ marginTop: "10px", color: "gray" }}
        >
          Followed Stories
        </Typography>
        {storiesData.length > 0 ? (
          <List
            sx={{
              maxHeight: "220px",
              overflowY: "auto",
              paddingRight: "5px",
            }}
          >
            {storiesData.map((story, index) => (
              <ListItem
                sx={{ cursor: "pointer" }}
                button
                key={story.id}
                onClick={() => setActiveStoryHandler(index)}
                selected={story.id === activeStory?.id}
              >
                <ListItemAvatar>
                  <Avatar
                    src={story.profile_pic}
                    sx={{ border: "3px solid #3f51b5" }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={story.username}
                  secondary={story.time_added}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            variant="body2"
            sx={{ mt: 2, color: "gray", textAlign: "center" }}
          >
            No stories available
          </Typography>
        )}
      </Paper>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1a1a1a",
          padding: "20px",
          position: "relative",
        }}
      >
        {activeStory && activeStory.images.length > 0 ? (
          <>
            {/* Left Preview */}
            {currentImageIndex > 0 ? (
              <Paper
                sx={{
                  width: "180px",
                  height: "320px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  marginRight: "20px",
                }}
              >
                <img
                  src={`${activeStory.images[currentImageIndex - 1].image}`}
                  alt="Previous"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Paper>
            ) : (
              currentStoryIndex > 0 && (
                <Paper
                  sx={{
                    width: "180px",
                    height: "320px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginRight: "20px",
                  }}
                >
                  <img
                    src={`${
                      storiesData[currentStoryIndex - 1].images.slice(-1)[0]
                        .image
                    }`}
                    alt="Previous story"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Paper>
              )
            )}

            {/* Main Story Viewer */}
            <Paper
              sx={{
                position: "relative",
                width: "50%",
                height: "80%",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              <LinearProgress
                variant="determinate"
                value={
                  ((currentImageIndex + 1) / activeStory.images.length) * 100
                }
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  backgroundColor: "#333",
                  height: "5px",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "5px 10px",
                  borderRadius: "20px",
                }}
              >
                <Avatar
                  src={activeStory.profile_pic}
                  sx={{ width: 32, height: 32, marginRight: "10px" }}
                />
                <Typography variant="body2" color="white">
                  {activeStory.username} - {activeStory.time_added}
                </Typography>
              </Box>
              <img
                src={`${activeStory.images[currentImageIndex].image}`}
                alt="Story"
                style={{ width: "100%", height: "120%", objectFit: "cover" }}
              />
              {(currentImageIndex < activeStory.images.length - 1 ||
                currentStoryIndex < storiesData.length - 1) && (
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    backgroundColor: "#fff",
                  }}
                  onClick={handleNextImage}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              )}
              {(currentImageIndex > 0 || currentStoryIndex > 0) && (
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    backgroundColor: "#fff",
                  }}
                  onClick={handlePrevImage}
                >
                  <ArrowBackIosIcon />
                </IconButton>
              )}

              {/* Reactions */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "15px",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "10px",
                  borderRadius: "20px",
                }}
              >
                <IconButton sx={{ backgroundColor: "#fff" }}>
                  <FavoriteIcon sx={{ color: "red" }} />
                </IconButton>
                <IconButton sx={{ backgroundColor: "#fff" }}>
                  <MoodIcon sx={{ color: "orange" }} />
                </IconButton>
                <IconButton sx={{ backgroundColor: "#fff" }}>
                  <SentimentDissatisfiedIcon sx={{ color: "purple" }} />
                </IconButton>
                <IconButton sx={{ backgroundColor: "#fff" }}>
                  <ThumbUpIcon sx={{ color: "blue" }} />
                </IconButton>
              </Box>
            </Paper>

            {/* Right Preview */}
            {currentImageIndex < activeStory.images.length - 1 ? (
              <Paper
                sx={{
                  width: "180px",
                  height: "320px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  marginLeft: "20px",
                }}
              >
                <img
                  src={`${activeStory.images[currentImageIndex + 1].image}`}
                  alt="Next"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Paper>
            ) : (
              currentStoryIndex < storiesData.length - 1 && (
                <Paper
                  sx={{
                    width: "180px",
                    height: "320px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginLeft: "20px",
                  }}
                >
                  <img
                    src={`${
                      storiesData[currentStoryIndex + 1].images[0].image
                    }`}
                    alt="Next story"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Paper>
              )
            )}
          </>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAwjlYGOwAx7FudOnZaIV5vytsKEoUi66ijw&s" // or an online image like https://cdn-icons-png.flaticon.com/512/4076/4076549.png
              alt="No stories"
              style={{
                width: "220px",
                height: "auto",
                opacity: 0.7,
                marginBottom: "20px",
              }}
            />
            <Typography variant="h6" color="white">
              No stories to show
            </Typography>
            <Typography variant="body2" color="gray">
              Upload your first story or select from the list.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Stories;
