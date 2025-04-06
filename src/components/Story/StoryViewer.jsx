import React, { useState } from "react";
import { Box, Avatar, Typography, Paper, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoodIcon from "@mui/icons-material/Mood";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const stories = [
  {
    id: 1,
    user: "Mark Larsen",
    avatar: "https://connexure.co/wp-content/uploads/2024/03/Mark-Larsen-BW.jpg",
    time: "5 minutes ago",
    image: "https://connexure.co/wp-content/uploads/2024/03/Mark-Larsen-BW.jpg",
  },
  {
    id: 2,
    user: "Ava Thompson",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    time: "20 minutes ago",
    image: "https://source.unsplash.com/featured/?coffee",
  },
  {
    id: 3,
    user: "Peter Pot",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    time: "2 hours ago",
    image: "https://source.unsplash.com/featured/?dog",
  },
];

const StoryViewer = () => {
  const [currentStory, setCurrentStory] = useState(1);

  const handleNextStory = () => {
    if (currentStory < stories.length) {
      setCurrentStory(currentStory + 1);
    }
  };

  const handlePrevStory = () => {
    if (currentStory > 1) {
      setCurrentStory(currentStory - 1);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#888", padding: "20px", alignItems: "center", justifyContent: "center" }}>
      

      {/* Main Story View */}
      <Paper sx={{ position: "relative", width: "50%", height: "80%", borderRadius: "15px", overflow: "hidden", backgroundColor: "black" }}>
        <img src={stories[currentStory - 1]?.image} alt="Story" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* User Info */}
        <Box sx={{ position: "absolute", top: "10px", left: "10px", display: "flex", alignItems: "center" }}>
          <Avatar src={stories[currentStory - 1]?.avatar} sx={{ width: 32, height: 32, marginRight: "10px" }} />
          <Typography color="white" fontWeight={600}>
            {stories[currentStory - 1]?.user} • {stories[currentStory - 1]?.time}
          </Typography>
        </Box>
        {/* Write a Reply */}
        <Box sx={{ position: "absolute", bottom: "10px", left: "10px", width: "90%", backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "20px", padding: "5px 10px" }}>
          <Typography color="white" variant="body2">Write a reply</Typography>
        </Box>
      </Paper>

      {/* Right Side Story */}
      {currentStory < stories.length && (
        <Paper sx={{ position: "relative", width: "180px", height: "320px", borderRadius: "10px", overflow: "hidden", marginLeft: "20px" }}>
          <img src={stories[currentStory]?.image} alt="Next story" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <IconButton sx={{ position: "absolute", top: "50%", right: "-15px", backgroundColor: "#fff", boxShadow: "2px 2px 10px rgba(0,0,0,0.2)" }} onClick={handleNextStory}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Paper>
      )}

      {/* Reaction Buttons */}
      <Box sx={{ position: "absolute", bottom: "30px", display: "flex", gap: "15px" }}>
        <IconButton sx={{ backgroundColor: "#fff", boxShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}>
          <FavoriteIcon sx={{ color: "red" }} />
        </IconButton>
        <IconButton sx={{ backgroundColor: "#fff", boxShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}>
          <MoodIcon sx={{ color: "orange" }} />
        </IconButton>
        <IconButton sx={{ backgroundColor: "#fff", boxShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}>
          <SentimentDissatisfiedIcon sx={{ color: "purple" }} />
        </IconButton>
        <IconButton sx={{ backgroundColor: "#fff", boxShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}>
          <ThumbUpIcon sx={{ color: "blue" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default StoryViewer;
