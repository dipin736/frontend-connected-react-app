import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box, Grid, Link } from "@mui/material";
import { styled } from "@mui/system";

const Root = styled(Box)({
  display: "flex",
  minHeight: "100vh",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f8f9fa",
  padding: ".5rem",
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
  maxWidth: "500px",
  width: "100%",
  backgroundColor: "white",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  textAlign: "center",
});

const OTPContainer = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginTop: "20px",
});

const OTPInput = styled(TextField)({
  width: "50px",
  height: "50px",
  textAlign: "center",
  fontSize: "20px",
});

function EmailVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = () => {
    console.log("Entered OTP:", otp.join(""));
  };

  return (
    <Root>
      <Container maxWidth="sm">
        <FormContainer>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Confirm your email address
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            We have sent a 6-digit code to email <Link href="#" underline="none">e****@****.com</Link>.
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Enter it below
          </Typography>
          <OTPContainer container>
            {otp.map((digit, index) => (
              <Grid item key={index}>
                <OTPInput
                  variant="outlined"
                  inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: "20px" } }}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              </Grid>
            ))}
          </OTPContainer>
          <Button variant="contained" fullWidth sx={{ mt: 3, backgroundColor: "#3f51b5", color: "#fff", padding: "12px" }} onClick={handleSubmit}>
            Continue
          </Button>
          <Button variant="outlined" fullWidth sx={{ mt: 2, padding: "12px" }}>
            Request a new code
          </Button>
        </FormContainer>
      </Container>
    </Root>
  );
}

export default EmailVerification;