import React, { useState } from "react";
import { Box, Grid, IconButton, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Feed from "../Feed/Feed";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box>
      {/* Navbar with Hamburger Menu */}
      <Navbar />
      <IconButton 
        onClick={handleDrawerToggle} 
        sx={{ position: "absolute", top: 10, left: 5, display: { md: "none" } }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>

      <Grid container spacing={2} sx={{ padding: 2 }}>
        {/* Sidebar as a Drawer for mobile, static for larger screens */}
        <Drawer 
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: 250 }
          }}
        >
          <Sidebar />
        </Drawer>

        <Grid item xs={12} md={2}>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Sidebar />
          </Box>
        </Grid>

        {/* Feed: Always takes center space */}
        <Grid item xs={12} md={7}>
          <Feed />
        </Grid>

        {/* Right Panel: Always visible on larger screens */}
        <Grid item xs={12} md={3}>
          <RightPanel />
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainLayout;
