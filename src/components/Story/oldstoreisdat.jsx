import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography, List, ListItem, ListItemAvatar, ListItemText, Button, Paper, IconButton, LinearProgress } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SettingsIcon from "@mui/icons-material/Settings";
import ArchiveIcon from "@mui/icons-material/Archive";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoodIcon from "@mui/icons-material/Mood";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const storiesData = [
  {
    id: 1,
    name: "Ben Goro",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    time: "Added 20 h ago",
    images: [
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800",
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800",
    ],
  },
  {
    id: 2,
    name: "Mark Larsen",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    time: "5 minutes ago",
    images: [
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1X_-z0aYJIKz8-n8RTro1Iiz_NuRu9DLvjA&s",
    ],
  },
  {
    id: 3,
    name: "Ava Thompson",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    time: "20 minutes ago",
    images: [
      "https://media.licdn.com/dms/image/v2/D4E03AQFu7TJ8TRbKRA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1683905634082?e=2147483647&v=beta&t=bQz-QXsVBNEouUuGyF0kTu-bxeWJks0YKDe7XALjcF4",
      "https://media.licdn.com/dms/image/v2/D4E03AQFu7TJ8TRbKRA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1683905634082?e=2147483647&v=beta&t=bQz-QXsVBNEouUuGyF0kTu-bxeWJks0YKDe7XALjcF4",
    ],
  },
  {
    id: 4,
    name: "Peter Pot",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    time: "2 hours ago",
    images: [
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800",
    ],
  
  },
  {
    id: 5,
    name: "Amelie Shiba",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    time: "2 hours ago",
    images: [
      "https://images.unsplash.com/photo-1550418290-a8d86ad674a6?w=800",
      "https://images.unsplash.com/photo-1550418290-a8d86ad674a6?w=800",
    ],
 
  },
  {
    id: 6,
    name: "Ethan Reynolds",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    time: "5 hours ago",
    images: [
      "https://images.unsplash.com/photo-1593642702909-dec73df255d7?w=800",
      "https://images.unsplash.com/photo-1593642702909-dec73df255d7?w=800",
    ],

  },
];


const Oldpage = () => {
  const [ActiveStory, setActiveStory] = useState(0);

  const handleNextStory = () => {
    const currentIndex = storiesData.findIndex((story) => story.id === activeStory.id);
    if (currentIndex < storiesData.length - 1) {
      setActiveStory(storiesData[currentIndex + 1]);
      setCurrentImageIndex(0); // Reset to first image of new story
    }
  };

  const handlePrevStory = () => {
    const currentIndex = storiesData.findIndex((story) => story.id === activeStory.id);
    if (currentIndex > 0) {
      setActiveStory(storiesData[currentIndex - 1]);
      setCurrentImageIndex(0); // Reset to first image of previous story
    }
  };

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const activeStory = storiesData[currentStoryIndex];

  // Auto-progress to next image every 5 seconds
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
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentImageIndex(0);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setCurrentImageIndex(storiesData[currentStoryIndex - 1].images.length - 1);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "10px" }}>
      
      {/* Left Panel: Stories List */}
      <Paper sx={{ width: "25%", padding: "20px", borderRadius: "10px", backgroundColor: "white" }}>
        <Typography variant="h5" fontWeight={600}>Stories</Typography>
        <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Button variant="outlined" startIcon={<SettingsIcon />} sx={{ borderRadius: "20px", fontSize: "12px" }}>
            Settings
          </Button>
          <Button variant="outlined" startIcon={<ArchiveIcon />} sx={{ borderRadius: "20px", fontSize: "12px" }}>
            Archive
          </Button>
        </Box>

             {/* Your Story */}
            <Typography variant="body2" fontWeight={600} sx={{ marginTop: "20px", color: "gray" }}>Your Story</Typography>
              <List>
                <ListItem button selected>
                  <ListItemAvatar>
                    <Avatar src={storiesData[0].avatar} sx={{ border: "3px solid #3f51b5" }} />
                  </ListItemAvatar>
                  <ListItemText primary={storiesData[0].name} secondary={storiesData[0].time} />
                </ListItem>
              </List>


        {/* Followed Stories */}
        <Typography variant="body2" fontWeight={600} sx={{ marginTop: "10px", color: "gray" }}>Followed Stories</Typography>
        <List>
          {storiesData.map((story) => (
            <ListItem button key={story.id} onClick={() => setActiveStory(story)} selected={story.id === activeStory.id}>
              <ListItemAvatar>
                <Avatar src={story.avatar} sx={{ border: "3px solid #3f51b5" }} />
              </ListItemAvatar>
              <ListItemText primary={story.name} secondary={story.time} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Right Panel: Story Viewer */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#1a1a1a", padding: "20px", position: "relative" }}>

{/* Left Preview Image (Previous Image or Story) */}
{currentImageIndex > 0 ? (
  <Paper sx={{ width: "180px", height: "320px", borderRadius: "10px", overflow: "hidden", marginRight: "20px" }}>
    <img src={activeStory.images[currentImageIndex - 1]} alt="Previous image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </Paper>
) : (
  currentStoryIndex > 0 && (
    <Paper sx={{ width: "180px", height: "320px", borderRadius: "10px", overflow: "hidden", marginRight: "20px" }}>
      <img src={storiesData[currentStoryIndex - 1].images[storiesData[currentStoryIndex - 1].images.length - 1]} alt="Previous story last image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Paper>
  )
)}

{/* Story Viewer */}
<Paper sx={{ position: "relative", width: "50%", height: "80%", borderRadius: "20px", overflow: "hidden", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)" }}>
  
  {/* Progress Bar */}
  <LinearProgress
    variant="determinate"
    value={(currentImageIndex + 1) / activeStory.images.length * 100}
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#333",
      height: "5px",
    }}
  />

  {/* Avatar & Time */}
  <Box sx={{ position: "absolute", top: "10px", left: "10px", display: "flex", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", padding: "5px 10px", borderRadius: "20px" }}>
    <Avatar src={activeStory.avatar} sx={{ width: 32, height: 32, marginRight: "10px" }} />
    <Typography variant="body2" color="white">
      {activeStory.name} - {activeStory.time}
    </Typography>
  </Box>

  {/* Story Image */}
  <img src={activeStory.images[currentImageIndex]} alt="Story" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

  {/* Next Image Button */}
  {(currentImageIndex < activeStory.images.length - 1 || currentStoryIndex < storiesData.length - 1) && (
    <IconButton sx={{ position: "absolute", top: "50%", right: "10px", backgroundColor: "#fff" }} onClick={handleNextImage}>
      <ArrowForwardIosIcon />
    </IconButton>
  )}

  {/* Previous Image Button */}
  {(currentImageIndex > 0 || currentStoryIndex > 0) && (
    <IconButton sx={{ position: "absolute", top: "50%", left: "10px", backgroundColor: "#fff" }} onClick={handlePrevImage}>
      <ArrowBackIosIcon />
    </IconButton>
  )}

  {/* Reaction Buttons */}
  <Box sx={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "15px", backgroundColor: "rgba(0,0,0,0.5)", padding: "10px", borderRadius: "20px" }}>
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

{/* Right Preview Image (Next Image or Story) */}
{currentImageIndex < activeStory.images.length - 1 ? (
  <Paper sx={{ width: "180px", height: "320px", borderRadius: "10px", overflow: "hidden", marginLeft: "20px" }}>
    <img src={activeStory.images[currentImageIndex + 1]} alt="Next image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </Paper>
) : (
  currentStoryIndex < storiesData.length - 1 && (
    <Paper sx={{ width: "180px", height: "320px", borderRadius: "10px", overflow: "hidden", marginLeft: "20px" }}>
      <img src={storiesData[currentStoryIndex + 1].images[0]} alt="Next story first image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Paper>
  )
)}

</Box>

    </Box>

  );
};

export default Oldpage;
