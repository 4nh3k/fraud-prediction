// src/FraudPrediction.tsx
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const FraudPrediction = () => {
  const [time, setTime] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [vValues, setVValues] = useState<string[]>(Array(28).fill(""));
  const [prediction, setPrediction] = useState<string | null>(null);
  const [inputString, setInputString] = useState<string>("");

  // Handle change for the string input field and auto-populate the time, v1 to v28, and amount
  const handleInputStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputString(value);

    // Split the input string and update corresponding state variables
    const values = value.split(",").map((v) => v.trim());

    if (values.length === 30) {
      // Ensure that we have 30 values (time + 28 v-values + amount)
      setTime(values[0]);
      setVValues(values.slice(1, 29)); // Set v1 to v28 values
      setAmount(values[29]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedVValues = [...vValues];
    updatedVValues[index] = e.target.value;
    setVValues(updatedVValues);
  };

  const handleSubmit = async () => {
    const data = [time, ...vValues, amount].join(",");

    try {
      const response = await axios.post("http://localhost/predict", { data });
      setPrediction(response.data === 1 ? "Fraud" : "Not Fraud");
    } catch (error) {
      console.error("Error predicting fraud:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Fraud Prediction
      </Typography>

      {/* Input field for the string with added spacing */}
      <Grid item xs={12}>
        <TextField
          label="Paste Data String (Time, V1 to V28, Amount)"
          variant="outlined"
          fullWidth
          value={inputString}
          onChange={handleInputStringChange}
          multiline
          rows={2}
          sx={{ marginBottom: 2 }}
        />
      </Grid>

      {/* The rest of the fields */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Time"
            variant="outlined"
            fullWidth
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Grid>

        {Array.from({ length: 28 }, (_, index) => (
          <Grid item xs={12} key={index}>
            <TextField
              label={`V${index + 1}`}
              variant="outlined"
              fullWidth
              value={vValues[index]}
              onChange={(e) => handleInputChange(e, index)}
            />
          </Grid>
        ))}

        <Grid item xs={12}>
          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ padding: "12px" }}
          >
            Send
          </Button>
        </Grid>
      </Grid>

      {prediction && (
        <Typography
          variant="h6"
          align="center"
          sx={{
            marginTop: 2,
            color: prediction === "Fraud" ? "#d9534f" : "#28a745",
          }}
        >
          {prediction === "Fraud" ? "Fraud" : "Not Fraud"}
        </Typography>
      )}
    </Box>
  );
};

export default FraudPrediction;
