import React, { useState, useEffect } from "react";
import {
  Paper,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Avatar,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import axios from "axios";
import { BaseUrlProfile } from "../../endpoint/apiUrl";
const Post = ({ data, isUserPost }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data.likes_count || 0); // Store like count
  const [commentCount, setCommentCount] = useState(data.comments_count || 0); // Store comment count
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]); // Store comments
  const [postData, setPostData] = useState(data); // Use postData to hold current post data
  const token = sessionStorage.getItem("access_token");

  // Fetch the like count, like status, and comment count when the component mounts
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Fetch like status for the current user
        const isLikedResponse = await axios.get(
          `${BaseUrlProfile}/api/posts/${postData.id}/is_liked/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsLiked(isLikedResponse.data.is_liked); // Set the like status

        // Fetch the like count for the post
        const likeCountResponse = await axios.get(
          `${BaseUrlProfile}/api/posts/${postData.id}/like_count/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLikeCount(likeCountResponse.data.likes_count); // Set the like count

        // Fetch the comment count for the post
        const commentCountResponse = await axios.get(
          `${BaseUrlProfile}/api/posts/${postData.id}/comment_count/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCommentCount(commentCountResponse.data.comments_count); // Set the comment count
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
  }, [postData.id, token]); // Depend on postData.id and token to re-run the effect

  // Handle like/unlike a post
  const handleLikeClick = async () => {
    try {
      const response = await axios.post(
        `${BaseUrlProfile}/api/posts/${postData.id}/like/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsLiked(!isLiked); // Toggle like status
      setLikeCount(response.data.likes_count); // Update the like count from response
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  // Add a comment to a post
  const handleCommentSubmit = async () => {
    try {
      await axios.post(
        `${BaseUrlProfile}/api/posts/${postData.id}/comment/`,
        { comment: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentText(""); // Reset comment input
      setOpenCommentModal(false); // Close the modal
      setCommentCount((prevCount) => prevCount + 1); // Increment the comment count locally
      // Refresh the comments list after adding a comment
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Fetch comments for the post
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${BaseUrlProfile}/api/posts/${postData.id}/comments/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(response.data); // Set the fetched comments
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Open and close comment modal
  const handleOpenCommentModal = async () => {
    setOpenCommentModal(true);
    await fetchComments(); // Fetch comments when the modal is opened
  };

  const handleCloseCommentModal = () => {
    setOpenCommentModal(false);
  };

  return (
    <Paper sx={{ marginBottom: "20px", padding: "15px", borderRadius: "10px" }}>
      <Card sx={{ display: "flex", alignItems: "center", padding: "10px" }}>
        {/* Post Image */}
        {postData.image && (
          <CardMedia
            component="img"
            image={postData.image}
            alt="Post Image"
            sx={{
              width: 250,
              height: 150,
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        )}

        {/* Post Content */}
        <CardContent sx={{ flex: 1, marginLeft: "15px" }}>
          <Typography variant="h6" fontWeight={600}>
            {postData.username}
          </Typography>
          <Typography variant="body2" color="gray" sx={{ marginBottom: "10px" }}>
            {postData.content}
          </Typography>

          {/* Post Actions */}
          {!isUserPost && (
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Button
                startIcon={<FavoriteIcon />}
                sx={{ color: isLiked ? "red" : "gray" }}
                onClick={handleLikeClick}
              >
                {likeCount}
              </Button>
              <Button
                startIcon={<ChatBubbleOutlineIcon />}
                sx={{ color: "gray" }}
                onClick={handleOpenCommentModal}
              >
                {commentCount}
              </Button>
            </Box>
          )}

          {/* Show Edit Button for User's Post */}
          {isUserPost && (
            <Button variant="outlined" color="primary" sx={{ marginTop: "10px" }}>
              Edit Post
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Video Display */}
      {postData.video && (
        <CardMedia
          component="video"
          controls
          src={postData.video}
          sx={{
            width: "100%",
            height: "200px", // Adjust height as needed
            objectFit: "cover", // Ensures the video scales properly
            borderRadius: "10px",
            marginBottom: "10px", // Space between video and content
          }}
        />
      )}

      {/* Comment Modal */}
      <Modal open={openCommentModal} onClose={handleCloseCommentModal}>
        <Box
          sx={{
            padding: 2,
            backgroundColor: "white",
            borderRadius: "10px",
            maxWidth: 600,
            margin: "100px auto",
            overflowY: "auto",
            maxHeight: "80vh", // Prevent overflow and make modal scrollable if content is large
          }}
        >
          <Typography variant="h6">Add a Comment</Typography>

          {/* Display Comments */}
          <Box sx={{ marginTop: "20px", maxHeight: "60vh", overflowY: "scroll" }}>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Box
                  key={comment.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: "10px",
                  }}
                >
                  <Avatar sx={{ width: 40, height: 40 }} src={comment.profile_pic} />
                  <Box sx={{ marginLeft: "10px", flex: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {comment.user}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {comment.text}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="gray">
                No comments yet.
              </Typography>
            )}
          </Box>

          {/* Comment Input Box */}
          <TextField
            fullWidth
            multiline
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            sx={{ marginBottom: "10px" }}
            placeholder="Add a comment..."
          />
          <Button variant="contained" onClick={handleCommentSubmit}>
            Submit Comment
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
};

export default Post;
