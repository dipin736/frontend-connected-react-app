import React from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";

const events = [
  { id: 1, name: "Garden BBQ", date: "Sat 16 June, Tom's Garden", icon: "🌳" },
  { id: 2, name: "City Council Vote", date: "Sat 16 June, Town Hall", icon: "🏛️" },
  { id: 3, name: "Post-punk Festival", date: "Sat 16 June, Tom's Garden", icon: "🎶" },
  { id: 4, name: "Maybe Boring Stand-up", date: "Sat 16 June, Tom's Garden", icon: "🎤" },
  { id: 5, name: "Yeboncé Tour 2023", date: "Sat 16 June, Tom's Garden", icon: "🎤" },
];

const EventList = () => {
  return (
    // <Card sx={{ marginBottom: "15px", borderRadius: "10px" }}>
    //   <CardContent>
    //     <Typography variant="h6" fontWeight={600} sx={{ marginBottom: "10px" }}>
    //       Your upcoming events
    //     </Typography>
    //     <List>
    //       {events.map((event) => (
    //         <ListItem key={event.id}>
    //           <ListItemAvatar>
    //             <Avatar sx={{ backgroundColor: "#f1f1f1" }}>{event.icon}</Avatar>
    //           </ListItemAvatar>
    //           <ListItemText primary={event.name} secondary={event.date} />
    //         </ListItem>
    //       ))}
    //     </List>
    //   </CardContent>
    // </Card>
    

    <Card sx={{ marginBottom: "15px", borderRadius: "10px" }}>
<CardContent>
  <img
    src="https://img.freepik.com/free-vector/social-media-concept-illustration_114360-4041.jpg"
    alt="Stay Connected"
    style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
  />
  <Typography variant="body1" fontWeight={600}>
    Stay connected. Stay updated.
  </Typography>
  <Typography variant="body2" color="textSecondary">
    Follow friends, share moments, and never miss a story again!
  </Typography>
</CardContent>
</Card> 
  );
};

export default EventList;
