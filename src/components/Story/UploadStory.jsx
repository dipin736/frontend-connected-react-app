import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  IconButton,
  Stack,
  Avatar
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";
import { BaseUrlProfile } from "../../endpoint/apiUrl";
const UploadStory = ( {fetchStories}) => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = sessionStorage.getItem("access_token");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
    setError("");
    setSuccess("");
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      setError("Please select images to upload.");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));

    setIsUploading(true);

    try {
      const response = await axios.post(`${BaseUrlProfile}/api/create_story/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Story uploaded successfully!");
      fetchStories()
      setImages([]);
      setError("");
    } catch (err) {
      setError("Error uploading the story.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card elevation={2} sx={{ padding: 2, marginY: 2, borderRadius: 3, backgroundColor: "#fafafa" }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Upload Your Story
        </Typography>

        {/* Upload Button */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{ borderRadius: "20px", textTransform: "none" }}
          >
            Choose Images
            <input hidden multiple accept="image/*" type="file" onChange={handleFileChange} />
          </Button>
          {isUploading && <CircularProgress size={24} />}
        </Stack>

        {/* Preview Selected Images */}
        {images.length > 0 && (
          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {images.map((image, index) => (
              <Avatar
                key={index}
                variant="rounded"
                src={URL.createObjectURL(image)}
                alt={image.name}
                sx={{ width: 64, height: 64, border: "1px solid #ccc" }}
              />
            ))}
          </Box>
        )}

        {/* Upload button */}
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpload}
            disabled={isUploading}
            sx={{ borderRadius: "10px", textTransform: "none" }}
          >
            {isUploading ? "Uploading..." : "Upload Story"}
          </Button>
        </Box>

        {/* Success / Error messages */}
        {success && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}
        {error && (
          <Typography color="error.main" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadStory;
