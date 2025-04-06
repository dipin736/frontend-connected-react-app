import React from "react";
import { Card, CardContent, TextField, Avatar, Box, Button, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const PostInput = () => {
  return (
    <Card sx={{ marginBottom: "20px", padding: "10px", borderRadius: "12px", boxShadow: "none", border: "1px solid #ddd" }}>
      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        {/* User Avatar */}
        <Avatar src="/profile.jpg" sx={{ marginRight: "10px" }} />

        {/* Input Field */}
        <TextField
          fullWidth
          placeholder="What's on your mind?"
          variant="outlined"
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "20px",
            "& fieldset": { border: "none" },
            flex: 1,
          }}
        />
      </CardContent>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 10px 16px" }}>
        <Box>
          <IconButton>
            <ImageIcon sx={{ color: "gray" }} />
          </IconButton>
          <IconButton>
            <LinkIcon sx={{ color: "gray" }} />
          </IconButton>
          <IconButton>
            <LocationOnIcon sx={{ color: "gray" }} />
          </IconButton>
          <IconButton>
            <EmojiEmotionsIcon sx={{ color: "gray" }} />
          </IconButton>
        </Box>
        <Button variant="outlined" sx={{ borderRadius: "20px", textTransform: "none" }}>
          Post
        </Button>
      </Box>
    </Card>
  );
};

export default PostInput;
