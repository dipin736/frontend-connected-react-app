import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box, Grid,InputAdornment,IconButton} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/system";
import KeyIcon from "@mui/icons-material/Key";
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
  borderRadius: "12px",
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

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });


  const [errorMessage, setErrorMessage] = useState("");
  const navigate=useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous error messages
    setErrorMessage("");

    try {
      // Sending the login data to the backend API
      const response = await axios.post(`${BaseUrl}/login/`, formData);

     
      const { access, refresh } = response.data;
      sessionStorage.setItem("access_token", access); // Store access token
      sessionStorage.setItem("refresh_token", refresh); // Store refresh token

      // Redirect to the dashboard or home page after successful login
      navigate("/home"); // Replace with your desired route after login

    } catch (error) {
      if (error.response) {
        // If the backend returns an error
        setErrorMessage(error.response.data.detail || "Invalid credentials. Please try again.");
        console.log(error.response.data)
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
              Welcome Back
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Please enter your credentials to login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Username" name="username" type="TEXT" margin="normal" onChange={handleChange} required />
              <TextField fullWidth label="Password" name="password"      type={showPassword ? "text" : "password"} margin="normal" onChange={handleChange} required 
               
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
              <Typography variant="body2" color="textSecondary" mt={2} textAlign="right">
                <Link to="/forgotpassword" style={{ textDecoration: "none", color: "#3f51b5" }}>Forgot Password?</Link>
              </Typography>
              <Button variant="contained" fullWidth type="submit" sx={{ mt: 2, backgroundColor: "#3f51b5", color: "#fff", padding: "12px" }}>
                Login
              </Button>

              {/* Show error message if any */}
            {errorMessage && <Typography color="error" sx={{ mt: 1, backgroundColor: "red", color: "#fff", padding: "10px" }} variant="body2">{errorMessage}</Typography>}

            </form>
            <Typography variant="body2" mt={2} textAlign="center">
              Don't have an account? <Link to="/signup" style={{ textDecoration: "none", color: "#3f51b5" }}>Sign Up</Link>
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

export default Login;