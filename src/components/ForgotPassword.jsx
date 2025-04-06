import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";

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

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
  };

  return (
    <Root>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={8} md={6} display="flex" justifyContent="center">
          <FormContainer>
            <Typography variant="h5" fontWeight={600} color="#3f51b5" gutterBottom>
              Connected
            </Typography>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              Forgot Password?
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Enter your email address to receive a password reset link.
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="E-mail" name="email" type="email" margin="normal" onChange={handleChange} required />
              <Button variant="contained" fullWidth type="submit" sx={{ mt: 2, backgroundColor: "#3f51b5", color: "#fff", padding: "12px" }}>
                Send Reset Link
              </Button>
            </form>
            <Typography variant="body2" mt={2} textAlign="center">
              Remember your password? <Link to="/login" style={{ textDecoration: "none", color: "#3f51b5" }}>Login</Link>
            </Typography>
          </FormContainer>
        </Grid>
      </Grid>
    </Root>
  );
}

export default ForgotPassword;
