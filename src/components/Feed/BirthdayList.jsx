import React from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";

const birthdays = [
  { id: 1, name: "Bob Hammond", age: 28, avatar: "/avatar1.jpg", date: "20 August" },
  { id: 2, name: "Harper Mitchell", age: 21, avatar: "/avatar2.jpg", date: "20 August" },
  { id: 3, name: "Mason Cooper", age: 30, avatar: "/avatar3.jpg", date: "22 August" },
  { id: 4, name: "Isabel Hughes", age: 18, avatar: "/avatar4.jpg", date: "1 September" },
];

const BirthdayList = () => {
  return (
    <Card sx={{ marginBottom: "15px", borderRadius: "10px" }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} sx={{ marginBottom: "10px" }}>
          Birthdays
        </Typography>
        <List>
          {birthdays.map((bday) => (
            <ListItem key={bday.id}>
              <ListItemAvatar>
                <Avatar src={bday.avatar} />
              </ListItemAvatar>
              <ListItemText primary={bday.name} secondary={`Turning ${bday.age} years old`} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default BirthdayList;
