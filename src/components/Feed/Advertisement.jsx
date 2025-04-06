import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const Advertisement = () => {
  return (
    <Card sx={{ marginBottom: "15px", borderRadius: "10px" }}>
      <CardContent>
        <img src="https://img.freepik.com/free-vector/end-summer-sale-promotion-illustration_23-2148625157.jpg" alt="Ad" style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }} />
        <Typography variant="body1" fontWeight={600}>
          Summer sale is on!
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Buy your loved pieces with reduced prices up to 70% off!
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Advertisement;
