import React from "react";
import { Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";

const groupChats = [
  { id: 1, name: "Grill Party Org", avatar: "/grill-party.jpg" },
  { id: 2, name: "Sneaker Freaks", avatar: "/sneakers.jpg" },
  { id: 3, name: "Music in the City", avatar: "/music-city.jpg" },
  { id: 4, name: "School Org", avatar: "/school-org.jpg" },
];

const GroupChats = () => {
  return (
    <>
      <Typography variant="h6" fontWeight={600} sx={{ marginBottom: "5px" }}>
        Group chats
      </Typography>
      <List>
        {groupChats.map((group) => (
          <ListItem key={group.id}>
            <ListItemAvatar>
              <Avatar src={group.avatar} />
            </ListItemAvatar>
            <ListItemText primary={group.name} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default GroupChats;
