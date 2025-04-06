import React from "react";
import { Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";
// import { Card, CardContent, Typography } from "@mui/material";
const communityChats = [
  { id: 1, name: "Dog Lovers", avatar: "/dog-lovers.jpg" },
  { id: 2, name: "Copenhagen friends", avatar: "/copenhagen.jpg" },
  { id: 3, name: "Y2K Car Owners", avatar: "/y2k-cars.jpg" },
];

const CommunityChats = () => {
  return (
    <>
      <Typography variant="h6" fontWeight={600} sx={{ marginBottom: "5px" }}>
        Community chats
      </Typography>
      <List>
        {communityChats.map((chat) => (
          <ListItem key={chat.id}>
            <ListItemAvatar>
              <Avatar src={chat.avatar} />
            </ListItemAvatar>
            <ListItemText primary={chat.name} />
          </ListItem>
        ))}
      </List>
    </>


  );
};

export default CommunityChats;

// { <Card sx={{ marginBottom: "15px", borderRadius: "10px" }}>
// <CardContent>
//   <img
//     src="https://img.freepik.com/free-vector/social-media-concept-illustration_114360-4041.jpg"
//     alt="Stay Connected"
//     style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
//   />
//   <Typography variant="body1" fontWeight={600}>
//     Stay connected. Stay updated.
//   </Typography>
//   <Typography variant="body2" color="textSecondary">
//     Follow friends, share moments, and never miss a story again!
//   </Typography>
// </CardContent>
// </Card> }