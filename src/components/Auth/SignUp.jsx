import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box, Grid, InputAdornment, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import KeyIcon from "@mui/icons-material/Key";
import { styled } from "@mui/system";

import axios from "axios";
import { BaseUrl } from "../../endpoint/apiUrl";

const Root = styled(Box)({
  display: "flex",
  minHeight: "100vh",
  alignItems: "center",
  justifyContent: "center",
  padding: ".5rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "20px",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", 
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "20px",
    background: "linear-gradient(135deg, rgba(63, 81, 181, 0.2), rgba(103, 58, 183, 0.2))",
    zIndex: -1,
    boxShadow: "0px 10px 30px rgba(103, 58, 183, 0.3)",
  },
});
const FormContainer = styled(Box)({
  padding: "2rem",
  maxWidth: "450px",
  width: "100%",
  backgroundColor: "white",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
});

const ImageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundImage: "url('https://files.cdn-files-a.com/uploads/5851485/normal_62d7fab73bece_filter_62d7fab8245b4.jpg')", // Replace with actual image path
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    height: "80vh",
    width: "100%",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
  },
}));

function SignUp() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const navigate=useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match before sending the request
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Clear any previous error messages
    setErrorMessage("");

    // Sending the user data to the backend API
    try {
      const response = await axios.post(`${BaseUrl}/signup/`, formData);

      // On success, you can handle the response, for example, redirect the user
      navigate("/login"); // Replace with your desired route after login


    } catch (error) {
      if (error.response) {
        const data = error.response.data;
     
        // Check for field-specific error (like email already in use)
        if (data.email && Array.isArray(data.email)) {
          setErrorMessage(data.email[0]);
     
        } 
        if (data.username && Array.isArray(data.username)) {
          setErrorMessage(data.username[0]);
   
        }
        else {
          setErrorMessage(data.detail || "Something went wrong!");
        }
      } else {
        setErrorMessage("Network error. Please try again later.");
      }
    }    
  };
  return (
    <Root>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12} sm={8} md={6} display="flex" justifyContent="center">
          <FormContainer>
            <Typography variant="h5" fontWeight={600} color="#3f51b5" gutterBottom>
              Connected
            </Typography>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              Create an account
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              To continue, fill out your personal info
            </Typography>

          {/* Show error message if any */}
          {errorMessage && <Typography color="error" sx={{ mt: 1, backgroundColor: "red", color: "#fff", padding: "10px" }} variant="body2">{errorMessage}</Typography>}

          
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Full name" name="fullname" margin="normal" onChange={handleChange} required />
              <TextField fullWidth label="Username" name="username" margin="normal" onChange={handleChange} required />
              <TextField fullWidth label="E-mail" name="email" type="email" margin="normal" onChange={handleChange} required />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                label="Repeat password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                margin="normal"
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleToggleConfirmPassword} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Typography variant="body2" color="textSecondary" mt={2}>
                By clicking Sign Up, you agree to our Terms and Conditions and confirm you have read our Privacy Policy.
              </Typography>
              <Button variant="contained" fullWidth type="submit" sx={{ mt: 2, backgroundColor: "#3f51b5", color: "#fff", padding: "12px" }}>
                Sign Up
              </Button>
            </form>
            <Typography variant="body2" mt={2} textAlign="center">
              Already have an account? <Link to="/login" style={{ textDecoration: "none", color: "#3f51b5" }}>Login</Link>
            </Typography>
          </FormContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <ImageContainer />
        </Grid>
      </Grid>
    </Root>
  );
}

export default SignUp;
