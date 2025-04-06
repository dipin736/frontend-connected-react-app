import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Paper,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardContent,Modal,
  Menu,
  MenuItem,
  CircularProgress
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PeopleIcon from "@mui/icons-material/People";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from "axios";
import { BaseUrl, BaseUrlProfile } from "../../endpoint/apiUrl";
import { Link, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';
import toastr from 'toastr'; // Import toastr for toast notifications
import 'toastr/build/toastr.min.css'; // Import toastr styles


const Profile = () => {
  const [tabValue, setTabValue] = useState(0);


  // Mock user data for friends
  const users = {
    friendsList: [
      {
        name: "Tony Spark",
        profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
        mutualFriends: 13,
        added: "2023-01-01",
        following: true,
      },
      {
        name: "Caleb Reed",
        profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
        mutualFriends: 3,
        added: "2023-03-15",
        following: false,
      },
      {
        name: "Lily Evans",
        profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
        mutualFriends: 63,
        added: "2022-12-10",
        following: true,
      },
      {
        name: "Mia Parker",
        profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
        mutualFriends: 84,
        added: "2023-02-05",
        following: false,
      },
      {
        name: "Noah Ramirez",
        profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
        mutualFriends: 5,
        added: "2023-01-20",
        following: true,
      },
      {
        name: "Isabel Cardon",
        profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
        mutualFriends: 23,
        added: "2023-03-10",
        following: true,
      },
    ],
  };




  // 🔍 Filter logic
  const getFilteredFriends = () => {
    let filtered = [...friends];

    if (tabValue1 === 1) {
      // Recently added (sort if `addedAt` field exists)
      filtered.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    } else if (tabValue1 === 2) {
      // Following (only show if `isFollowing` is true)
      filtered = filtered.filter((f) => f.isFollowing);
    }

    if (searchTerm) {
      filtered = filtered.filter((friend) =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };
  const [open, setOpen] = useState(false); // Modal state

  const [userProfile, setUserProfile] = useState(null); // Store user profile
  const [bio, setBio] = useState(""); // Bio input state
  const [hobbies, setHobbies] = useState(""); // Hobbies input state
  const [profilePic, setProfilePic] = useState(null); // Profile picture state
  const [coverPic, setCoverPic] = useState(null); // Cover picture state
  const [isEditing, setIsEditing] = useState(false); // Track if editing or adding profile

  const { userId } = useParams(); // 👈 get it from URL

  const token = sessionStorage.getItem("access_token");
let currentUserId = null;

if (token) {
  try {
    const decoded = jwt_decode(token);
    currentUserId = decoded?.user_id;
  } catch (error) {
    console.error("JWT decode failed:", error);
  }
}

const [isFollowing, setIsFollowing] = useState(false);
const [friendsCount, setFriendsCount] = useState(0);

const handleFollowToggle = () => {
  axios.post(`${BaseUrl}/follow/${userId}/`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => {
    setIsFollowing(res.data.status === "followed");
    setFriendsCount(res.data.friends_count);
  })
  .catch(err => console.error("Follow toggle failed", err));
};



useEffect(() => {
  if (!userId) return;

  // Fetch user profile when the component mounts
  axios
    .get(`${BaseUrlProfile}/api/profile/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      setUserProfile(response.data);
      setBio(response.data.bio);
      setHobbies(response.data.hobbies);
      setIsFollowing(response.data.is_following); // Optional if added in serializer
      setFriendsCount(response.data.friends_count || 0);
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        // Handle Unauthorized Error (401) using Swal and Toastr
        Swal.fire({
          title: 'Unauthorized',
          text: "Session expired. Please log in again.",
          icon: 'warning',
          confirmButtonText: 'OK',
        });

        // Show a toast notification using Toastr
      } else {
        console.error("Error fetching user profile", error);
      }
    });
}, [userId]);
  const handleOpen = () =>{ setOpen(true); setIsEditing(false) }// Open modal
  const handleClose = () => setOpen(false); // Close modal

  // Handle bio input change
  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  // Handle hobbies input change
  const handleHobbiesChange = (event) => {
    setHobbies(event.target.value);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("hobbies", hobbies);
    if (profilePic) formData.append("profile_pic", profilePic);
    if (coverPic) formData.append("cover_photo", coverPic);

    axios
      .post(`${BaseUrlProfile}/api/profile/`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
      .then((response) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Profile updated successfully',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        
        setOpen(false)
        setUserProfile(response.data); // Update the profile after success
        setIsEditing(false); // Exit editing mode
      })
      .catch((error) => {
        console.error("Error updating profile", error);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOpen(true); // Open modal
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
  
      const token = sessionStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("profile_pic", file);
  
      axios
        .post(`${BaseUrlProfile}/api/profile/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Profile picture updated',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          
          setUserProfile(response.data);
        })
        .catch((error) => {
          console.error("Error uploading profile pic", error);
        });
    }
  };
  
  
  const handleCoverPicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPic(file);
  
      const token = sessionStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("cover_photo", file);
  
      axios
        .post(`${BaseUrlProfile}/api/profile/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Cover photo updated',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          
          setUserProfile(response.data);
        })
        .catch((error) => {
          console.error("Error uploading cover photo", error);
        });
    }
  };

  const [friends, setFriends] = useState([]);
  const [tabValue1, setTabValue1] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔁 Fetch friends of the profile you're viewing
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${BaseUrlProfile}/api/profile/${userId}/friends/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFriends(res.data);
      })
      .catch((err) => console.error("Failed to load friends", err));
  }, [userId]);

  const handleTabChange = (event, newValue) => {
    setTabValue1(newValue);
  };


  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [user, setUser] = useState({ posts: [] });
  const [loading, setLoading] = useState(false); // Track loading state

  // Handle the post submission
  const handlePostSubmit = () => {
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    // Show the loading spinner while submitting the post
    setLoading(true);

    axios
      .post(`${BaseUrlProfile}/api/posts/create/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        // Reset the form fields
        setContent("");
        setImage(null);
        setVideo(null);

        // Optimistically add the new post to the state
        setUser((prev) => ({
          ...prev,
          posts: [res.data, ...prev.posts], // Add the new post to the top
        }));

        // Trigger a GET request to fetch the updated list of posts
        fetchPosts();
      })
      .catch((err) => {
        console.error("Post upload failed", err);
        setLoading(false); // Stop loading spinner in case of error
      });
  };

  // Fetch user posts
  const fetchPosts = () => {
    axios
      .get(`${BaseUrlProfile}/api/posts/user/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const formattedPosts = res.data.map((post) => ({
          id: post.id,
          text: post.content,
          images: post.image ? [post.image] : [], // Wrap image in array
          time: post.created_at,
          video: post.video || null,
        }));
        setUser((prevUser) => ({
          ...prevUser,
          posts: formattedPosts,
        }));
        setLoading(false); // Stop loading spinner after fetching posts
      })
      .catch((err) => {
        console.error("Failed to fetch posts", err);
        setLoading(false); // Stop loading spinner in case of error
      });
  };

  // Fetch posts when component is mounted
  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleClick = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId); // Store the post id that was clicked for delete
  };

  const handleCloseE1 = () => {
    setAnchorEl(null);
  };

  const handleDeletePost = () => {
    // Call the API to delete the post
    axios
      .delete(`${BaseUrlProfile}/api/posts/${selectedPostId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Remove the post from the UI
        setUser((prev) => ({
          ...prev,
          posts: prev.posts.filter((post) => post.id !== selectedPostId),
        }));
        handleCloseE1(); // Close the menu after delete
      })
      .catch((err) => console.error("Failed to delete post", err));
  };

    // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 1;  // Number of posts to show per page

  // Safely check if user.posts exists and is an array
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = Array.isArray(user.posts) ? user.posts.slice(indexOfFirstPost, indexOfLastPost) : [];

  // Calculate the total number of pages
  const totalPages = Array.isArray(user.posts) ? Math.ceil(user.posts.length / postsPerPage) : 0;

  // Handle Page Change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [currentPostPage, setCurrentPostPage] = useState(1); // Track current page for posts
  const [currentImagePage, setCurrentImagePage] = useState(1); // Track current page for images
  
  const imagesPerPage =1; // Number of images per page
  
  // Calculate the total number of pages for posts
  const totalPostPages = Array.isArray(user.posts) ? Math.ceil(user.posts.length / imagesPerPage) : 0;
  
  // Get current post (assuming `user.posts` contains an array of posts)
  const currentPost = Array.isArray(user.posts) ? user.posts[currentPostPage - 1] : null;
  
  // Calculate the total number of pages for images in the current post
  const totalImagePages = currentPost && Array.isArray(currentPost.images)
    ? Math.ceil(currentPost.images.length / imagesPerPage)
    : 0;
  
  // Handle page change for posts
  const handlePostPageChange = (page) => {
    setCurrentPostPage(page);
    setCurrentImagePage(1); // Reset image pagination to first page when changing posts
  };
  
  // Handle page change for images
  const handleImagePageChange = (page) => {
    setCurrentImagePage(page);
  };
  
  // Calculate the index range for images to display
  const indexOfLastImage = currentImagePage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = Array.isArray(currentPost?.images)
    ? currentPost.images.slice(indexOfFirstImage, indexOfLastImage)
    : [];
  
  const isMyProfile = currentUserId === parseInt(userId); // userId from URL

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      {/* Profile Header */}
      <Paper sx={{ borderRadius: "10px", overflow: "hidden" }}>
        {/* Cover Photo */}
        <Box sx={{ position: "relative", width: "100%", height: "250px" }}>
          {/* Cover photo as Avatar */}
          <Avatar
            src={
              userProfile?.cover_photo ? `${userProfile?.cover_photo}/` : null
            }
            sx={{
              width: "100%",
              height: "110%",
              position: "absolute",
              top: "0",
              left: "0",
              borderRadius: "0", // Removes the round shape to make it a rectangle
              objectFit: "cover", // Ensures it behaves like a cover photo
            }}
          />

          {/* Profile picture */}
          <Avatar
            src={
              userProfile?.profile_pic ? `${userProfile?.profile_pic}/` : null
            }
            sx={{
              width: "140px",
              height: "140px",
              position: "absolute",
              bottom: "-50px", // Adjust position of the profile avatar
              left: "10px",
              border: "4px solid white",
            }}
          />
          {isMyProfile ? (
            <>
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.6)", // Light background to make the icon stand out
                  borderRadius: "50%",
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleCoverPicChange}
                />
                <CameraAltIcon />
              </IconButton>

              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: "-50px", // Adjust position of profile image icon
                  left: "60px", // Adjust for the profile picture position
                  backgroundColor: "rgba(255, 255, 255, 0.6)", // Light background for the icon
                  borderRadius: "50%",
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleProfilePicChange}
                />
                <CameraAltIcon />
              </IconButton>
            </>
          ) : (
            <Box></Box>
          )}
          {/* Upload icons */}
        </Box>

        {/* User Info */}
        <Box
          sx={{
            padding: "50px 30px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              padding: "10px",
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              {userProfile?.username}
            </Typography>
            <Typography variant="body2" color="gray">
              {userProfile?.friends_count ?? 0} friends
            </Typography>
          </Box>

          {isMyProfile ? (
            <></>
          ) : (
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "#3f51b5",
                  color: "white",
                }}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Following" : "Follow"}
                <PeopleIcon sx={{ marginLeft: "5px" }} />
              </Button>
              <Button 
                 button
                 component={Link}
                 to="/chatsystem"
        
              variant="outlined" sx={{ borderRadius: "20px" , textDecoration: "none", color: "inherit"}}>
                Message
              </Button>
            </Box>
          )}
        </Box>

        {/* Navigation Tabs */}
        <Tabs
          value={tabValue}
          sx={{ borderBottom: "1px solid #ddd" }}
          onChange={(event, newValue) => setTabValue(newValue)}
        >
          <Tab label="Posts" />
          <Tab label="About" />
          <Tab label="Photos" />
          <Tab label="Videos" />
          <Tab label="Friends" />
        </Tabs>
      </Paper>

      <Grid container spacing={2} sx={{ marginTop: "20px" }}>
        {/* Left Sidebar - Basic Info & Photos */}
        <Grid item xs={12} md={4}>
          {/* Basic Info */}
          <Paper
            sx={{ padding: "15px", borderRadius: "10px", marginBottom: "20px" }}
          >
            <Typography variant="h6" fontWeight={600}>
              Basic Info
            </Typography>

            {userProfile ? (
              <Box
                sx={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {isMyProfile ? (
                  !bio && !hobbies ? (
                    // 👇 Show only the Add Details button if both are missing
                    <Button
                      fullWidth
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={handleOpen}
                      sx={{ marginTop: "10px", textAlign: "left" }}
                    >
                      Add details
                    </Button>
                  ) : (
                    // 👇 Show details layout if either bio or hobbies exist
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {/* Bio Row */}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          color="primary"
                          sx={{ minWidth: "80px" }}
                        >
                          Bio:
                        </Typography>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                          }}
                        >
                          {bio || "No bio available"}
                        </Typography>
                      </Box>

                      {/* Hobbies Row */}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          color="primary"
                          sx={{ minWidth: "80px" }}
                        >
                          Hobbies:
                        </Typography>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                          }}
                        >
                          {hobbies || "No hobbies listed"}
                        </Typography>
                      </Box>
                    </Box>
                  )
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {/* Bio Row */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        color="primary"
                        sx={{ minWidth: "80px" }}
                      >
                        Bio:
                      </Typography>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {bio || "No bio available"}
                      </Typography>
                    </Box>

                    {/* Hobbies Row */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        color="primary"
                        sx={{ minWidth: "80px" }}
                      >
                        Hobbies:
                      </Typography>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {hobbies || "No hobbies listed"}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Button
                fullWidth
                startIcon={<AddCircleOutlineIcon />}
                sx={{ marginTop: "10px", textAlign: "left" }}
                onClick={handleOpen} // Open modal when clicked
              >
                Add details
              </Button>
            )}

            <Button
              fullWidth
              startIcon={<EditIcon />}
              sx={{ textAlign: "left" }}
              onClick={handleEdit} // Open modal to edit details
            >
              Edit details
            </Button>
          </Paper>

          {/* Modal for Add Bio */}
          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                backgroundColor: "white",
                padding: 3,
                borderRadius: "10px",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {isEditing ? "Edit Bio and Hobbies" : "Add Bio and Hobbies"}
              </Typography>

              <TextField
                label="Bio"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={bio}
                onChange={handleBioChange}
                sx={{ marginBottom: "20px" }}
              />
              <TextField
                label="Hobbies"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={hobbies}
                onChange={handleHobbiesChange}
                sx={{ marginBottom: "20px" }}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
              >
                {isEditing ? "Save Changes" : "Save"}
              </Button>
            </Box>
          </Modal>

          {/* Photos */}
          {totalPostPages > 0 ? (
            user.posts.map((post, postIndex) => {
              if (postIndex + 1 !== currentPostPage) return null; // Show only the current post on this page

              const currentImages = Array.isArray(post.images)
                ? post.images.slice(
                    (currentImagePage - 1) * imagesPerPage,
                    currentImagePage * imagesPerPage
                  )
                : [];

              return (
                <Box
                  key={post.id}
                  sx={{
                    borderRadius: "20px",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                    minHeight: "350px", // Fixed minimum height to ensure consistency
                  }}
                >
                  {/* Title for the images */}
                  {currentImages.length > 0 && (
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{ textAlign: "center", marginBottom: "10px" }}
                    >
                      Photos
                    </Typography>
                  )}

                  {/* Display the current image only */}
                  {currentImages.length > 0 ? (
                    <Grid
                      container
                      spacing={1}
                      sx={{ marginTop: "10px", justifyContent: "center" }}
                    >
                      <Grid item xs={12} md={10} key={postIndex}>
                        <img
                          src={currentImages[0]} // Show only the image for the current page
                          alt={`Post Image ${currentImagePage}`}
                          style={{ width: "100%", borderRadius: "5px" }}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ textAlign: "center", color: "gray" }}
                    >
                      No images available.
                    </Typography>
                  )}

                  {/* Pagination for images */}
                  {currentImages.length > 0 && totalImagePages > 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginTop: "20px",
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() =>
                          handleImagePageChange(currentImagePage - 1)
                        }
                        disabled={currentImagePage === 1}
                      >
                        Previous
                      </Button>
                      <Typography variant="body2">
                        {currentImagePage} / {totalImagePages}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          handleImagePageChange(currentImagePage + 1)
                        }
                        disabled={currentImagePage === totalImagePages}
                      >
                        Next
                      </Button>
                    </Box>
                  )}
                </Box>
              );
            })
          ) : (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "gray" }}
            >
              No posts yet.
            </Typography>
          )}

          {/* Pagination for posts */}
          {totalPostPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => handlePostPageChange(currentPostPage - 1)}
                disabled={currentPostPage === 1}
              >
                Previous
              </Button>
              <Typography variant="body2">
                {currentPostPage} / {totalPostPages}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handlePostPageChange(currentPostPage + 1)}
                disabled={currentPostPage === totalPostPages}
              >
                Next
              </Button>
            </Box>
          )}
        </Grid>

        {/* Right Sidebar - Posts */}
        <Grid item xs={12} md={8}>
          {/* Post Input */}
          {tabValue === 0 && (
            <Paper
              sx={{
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)} // Capture the content text
                sx={{ borderRadius: "20px" }}
                disabled={!isMyProfile}
              />
              <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <IconButton component="label">
                  <ImageIcon />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])} // Capture the image file
                    disabled={!isMyProfile}
                  />
                </IconButton>
                <IconButton component="label">
                  <VideoCallIcon />
                  <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files[0])} // Capture the video file
                    disabled={!isMyProfile}
                  />
                </IconButton>
                <Button
                  variant="contained"
                  sx={{ borderRadius: "20px" }}
                  onClick={handlePostSubmit} // Submit the post
                  disabled={!content.trim() || !(image || video) || loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" /> // Show spinner when loading
                  ) : (
                    "Post"
                  )}
                </Button>
              </Box>
            </Paper>
          )}

          {/* Displaying Posts */}
          {tabValue === 0 && user.posts && user.posts.length > 0
            ? currentPosts.map((post) => (
                <Paper
                  key={post.id}
                  sx={{
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    minHeight: "300px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <Avatar src={user.profilePic} />
                    <Box sx={{ marginLeft: "10px" }}>
                      <Typography variant="body1" fontWeight={600}>
                        {user.username}
                      </Typography>
                      <Typography variant="body2" color="gray">
                        {new Date(post.time).toLocaleString()}
                      </Typography>
                    </Box>
                    <IconButton sx={{ marginLeft: "auto" }}>
                      {isMyProfile ? (
                        <IconButton
                          sx={{ marginLeft: "auto" }}
                          onClick={(e) => handleClick(e, post.id)}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      ) : (
                        <Box></Box>
                      )}
                    </IconButton>
                  </Box>

                  {post.text && (
                    <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                      {post.text}
                    </Typography>
                  )}

                  {/* Display images and video on the same line */}
                  {(post.images &&
                    Array.isArray(post.images) &&
                    post.images.length > 0) ||
                  post.video ? (
                    <Grid container spacing={2}>
                      {/* Display images if available */}
                      {post.images &&
                        Array.isArray(post.images) &&
                        post.images.length > 0 && (
                          <Grid item xs={12} md={6}>
                            <Grid container spacing={1}>
                              {post.images.map((image, index) => (
                                <Grid item xs={12} key={index}>
                                  <Card>
                                    <CardMedia
                                      sx={{ minHeight: "300px" }}
                                      component="img"
                                      image={image}
                                    />
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                        )}

                      {/* Display video if available */}
                      {post.video && (
                        <Grid item xs={12} md={6}>
                          <Card>
                            <CardMedia
                              component="video"
                              controls
                              src={post.video}
                            />
                          </Card>
                        </Grid>
                      )}
                    </Grid>
                  ) : null}
                </Paper>
              ))
            : tabValue === 0 && (
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", color: "gray" }}
                >
                  No posts yet.
                </Typography>
              )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem sx={{ fontSize: "15px" }} onClick={handleDeletePost}>
              Delete Post
            </MenuItem>
          </Menu>
          {/* Pagination Controls */}

          {tabValue === 0 && totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Typography variant="body2">
                {currentPage} / {totalPages}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </Box>
          )}

          {tabValue === 1 && (
            <Paper
              sx={{
                padding: "20px", // Added padding for better spacing
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start", // Vertically start from the top
                alignItems: "center", // Horizontally center the content
                minHeight: "350px", // Adjusted minimum height for better spacing
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                About
              </Typography>
              <Typography
                variant="body2"
                color="gray"
                sx={{ marginTop: "10px" }}
              >
                This section contains details about {user.name}.
              </Typography>

              {/* Check if bio or hobbies are available */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  width: "100%",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                {/* Bio Row */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "flex-start",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary"
                    sx={{ minWidth: "80px", textAlign: "left" }} // Align to left for better readability
                  >
                    Bio:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      textAlign: "left", // Align text to left for readability
                      whiteSpace: "normal", // Allow text to wrap
                      wordWrap: "break-word", // Ensure long words wrap
                    }}
                  >
                    {bio || "No bio available"}
                  </Typography>
                </Box>

                {/* Hobbies Row */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "flex-start",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="primary"
                    sx={{ minWidth: "80px", textAlign: "left" }} // Align to left for better readability
                  >
                    Hobbies:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      textAlign: "left", // Align text to left for readability
                      whiteSpace: "normal", // Allow text to wrap
                      wordWrap: "break-word", // Ensure long words wrap
                    }}
                  >
                    {hobbies || "No hobbies listed"}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {tabValue === 2 && (
            <Paper
              sx={{
                padding: "15px",
                borderRadius: "10px",
                minHeight: "320px", // Set the minimum height
                display: "flex", // Use flexbox to center content
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Photos
              </Typography>
              <Grid container spacing={1} sx={{ marginTop: "10px" }}>
                {user?.posts?.some((post) => post.images.length > 0) ? ( // Check if any post has images
                  user?.posts.map((post, postIndex) =>
                    post.images.length > 0 // Only display posts with images
                      ? post.images.map((image, index) => (
                          <Grid item xs={4} key={`${postIndex}-${index}`}>
                            {" "}
                            {/* 4 columns for each image (3 per row) */}
                            <img
                              src={image}
                              alt={`Post Image ${index}`}
                              style={{ width: "100%", borderRadius: "5px" }}
                            />
                          </Grid>
                        ))
                      : null
                  )
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      color: "gray",
                      marginTop: "20px",
                    }}
                  >
                    No images available.
                  </Typography>
                )}
              </Grid>
            </Paper>
          )}

          {tabValue === 3 && (
            <Paper
              sx={{
                padding: "15px",
                borderRadius: "10px",
                minHeight: "320px", // Set the minimum height
                display: "flex", // Use flexbox to center content
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Videos
              </Typography>

              {/* If there are videos, display them */}
              {user?.posts?.some((post) => post.video) ? (
                <Grid container spacing={1} sx={{ marginTop: "10px" }}>
                  {user?.posts.map((post, postIndex) =>
                    post.video ? ( // Only display posts with video
                      <Grid item xs={12} key={postIndex}>
                        <video width="100%" controls>
                          <source src={post.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </Grid>
                    ) : null
                  )}
                </Grid>
              ) : (
                // Show this message if no videos are available
                <Typography
                  variant="body2"
                  color="gray"
                  sx={{ textAlign: "center", marginTop: "20px" }}
                >
                  No videos available yet.
                </Typography>
              )}
            </Paper>
          )}

          {tabValue === 4 && (
            <Paper sx={{ padding: "15px", borderRadius: "10px", minHeight:"500px"}}>
              <Typography variant="h6" fontWeight={600}>
                Friends
              </Typography>

              {/* Tabs */}
              <Tabs
                value={tabValue1}
                onChange={handleTabChange}
                sx={{ marginTop: "10px", borderBottom: "1px solid #ddd" }}
              >
                <Tab label="All friends" />
                <Tab label="Recently added" />
                <Tab label="Following" />
              </Tabs>

              {/* Search */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "15px",
                }}
              >
                <TextField
                  variant="outlined"
                  placeholder="Search"
                  sx={{ width: "80%" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button sx={{ color: "#3f51b5" }}>Friend requests</Button>
              </Box>

              {/* List */}
              <Box sx={{ marginTop: "20px" }}>
                {getFilteredFriends().length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    mt={2}
                  >
                    No friends yet.
                  </Typography>
                ) : (
                  getFilteredFriends().map((friend, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "15px",
                      }}
                    >
                      <Avatar
                        src={friend.profilePic}
                        sx={{ width: "40px", height: "40px" }}
                      />
                      <Box sx={{ marginLeft: "10px" }}>
                        <Typography variant="body1">{friend.name}</Typography>
                        {friend.mutualFriends > 0 && (
                          <Typography variant="body2" color="gray">
                            {friend.mutualFriends} mutual friend
                            {friend.mutualFriends > 1 ? "s" : ""}
                          </Typography>
                        )}
                      </Box>
                      <IconButton sx={{ marginLeft: "auto" }}>
                        <MoreHorizIcon />
                      </IconButton>
                    </Box>
                  ))
                )}
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
