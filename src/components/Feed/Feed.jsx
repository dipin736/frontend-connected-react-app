import React, { useEffect, useState } from "react";
import Post from "../Profile/Post";
import PostInput from "../Profile/PostInput";
import { Box, Typography, Paper, Card, CardMedia, CardContent, Button, Avatar, CircularProgress } from "@mui/material";
import axios from "axios";
import jwt_decode from "jwt-decode";  // Import jwt_decode to decode token
import { BaseUrlProfile } from "../../endpoint/apiUrl";
const Feed = () => {
  const [articles, setArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true); // To track loading state for posts
  const [currentPage, setCurrentPage] = useState(1); // Current page of posts
  const [postsPerPage] = useState(3); // Number of posts per page
  const [error, setError] = useState(null);

  const newsData = {
    status: "success",
    totalResults: 1022,
    results: [
      // {
      //   article_id: "8334da98c1cfb471a7e8effe8fdbacbd",
      //   title: "Trump möchte Migranten aus den USA mit einer Deportations-App mitbringen",
      //   link: "https://lomazoma.com/trump-moechte-migranten-aus-den-usa-mit-einer-deportations-app-mitbringen-3/",
      //   description:
      //     "Seit Jahren können Migranten Asylanträge für die USA oder Termine an Grenzübergängen aus Mexiko über die CBP One App stellen...",
      //   pubDate: "2025-03-11 02:57:25",
      //   image_url:
      //     "https://lomazoma.com/wp-content/uploads/2025/03/D2NMVAA6BZE4BFQHKZTXNDUSEQ.jpeg",
      //   source_name: "Loma News",
      //   source_url: "https://www.lomazoma.com",
      //   source_icon: "https://i.bytvi.com/domain_icons/lomazoma.png",
      //   language: "german",
      // },
      {
        article_id: "4edcc62dfb1d896459861b28cebaec20",
        title:
          "Trump revokes security clearances of Blinken, Sullivan, other Biden era officials",
        link: "https://www.deccanchronicle.com/world/americas/trump-revokes-security-clearances-of-blinken-sullivan-other-biden-era-officials-1866163",
        description:
          "Tulsi Gabbard stated that the action has been taken on the directive given by US President Donald Trump...",
        pubDate: "2025-03-11 02:56:50",
        image_url:
          "https://www.deccanchronicle.com/h-upload/2025/03/11/1897783-ani-20250310205019.webp",
        source_name: "Deccan Chronicle",
        source_url: "https://www.deccanchronicle.com",
        source_icon: "https://i.bytvi.com/domain_icons/deccanchronicle.png",
        language: "english",
      },
    ],
  };
  const token = sessionStorage.getItem("access_token");
  const [username, setUserName] = useState("");



  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");

    if (accessToken) {
      try {
        const decodedToken = jwt_decode(accessToken);
        setUserName(decodedToken?.username || "User Name"); 
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserName("");  
      }
    } else {
      setUserName("");  
    }
  }, []);


  useEffect(() => {
    // Simulate API call for articles
    setArticles(newsData.results);

    // Fetch posts from API
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BaseUrlProfile}/api/get_all_posts/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data); // Assuming response.data is the list of posts
        setLoadingPosts(false);
      } catch (err) {
        setError("Failed to load posts");
        setLoadingPosts(false);
      }
    };

    fetchPosts();
    setLoading(false);
  }, []);


  // Calculate the index range for the posts to display
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Handle page change
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < Math.ceil(posts.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <div>
      {/* <PostInput /> */}
      <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" fontWeight={600} sx={{ marginBottom: "20px" }}>
        📰 Latest News
      </Typography>

      {articles.map((article) => (
        <Paper key={article.article_id} sx={{ marginBottom: "20px", padding: "15px", borderRadius: "10px" }}>
          <Card sx={{ display: "flex", alignItems: "center", padding: "10px" }}>
            {/* Article Image */}
            <CardMedia
              component="img"
              image={article.image_url}
              alt={article.title}
              sx={{ width: 150, height: 100, borderRadius: "10px", objectFit: "cover" }}
            />

            {/* Article Content */}
            <CardContent sx={{ flex: 1, marginLeft: "15px" }}>
              <Typography variant="h6" fontWeight={600}>
                {article.title}
              </Typography>
              <Typography variant="body2" color="gray" sx={{ marginBottom: "10px" }}>
                {article.description}
              </Typography>

              {/* Source Info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Avatar src={article.source_icon} sx={{ width: 24, height: 24 }} />
                <Typography variant="body2" color="gray">
                  {article.source_name}
                </Typography>
                <Typography variant="body2" color="gray">
                  📅 {new Date(article.pubDate).toLocaleDateString()}
                </Typography>
              </Box>

              {/* Read More Button */}
              <Button
                variant="contained"
                color="primary"
                href={article.link}
                target="_blank"
                sx={{ marginTop: "10px" }}
              >
                Read More
              </Button>
            </CardContent>
          </Card>
        </Paper>
      ))}
    </Box>
    <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" fontWeight={600} sx={{ marginBottom: "20px" }}>
          📣 User Posts
        </Typography>

        {/* Display Posts */}
        {loadingPosts ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="body2" color="error" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        ) : (
          currentPosts.map((post) => (
            <Post key={post.id} data={post} 
            isUserPost={post.username === username}
            />
          ))
        )}
         <Box sx={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
          <Button
            variant="outlined"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Typography variant="body2">
            {currentPage} / {Math.ceil(posts.length / postsPerPage)}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
          >
            Next
          </Button>
        </Box>
      </Box>
      
    </div>
  );
};

export default Feed;
