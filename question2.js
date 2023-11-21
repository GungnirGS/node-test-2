require("dotenv").config(); // For reading .env
const express = require("express"); // Express js
const axios = require("axios") // For HTTP requests
const crypto = require("crypto")

const app = express();

app.get("/endpoint1", async (req, res) => {
  try {
    // Wait 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Hashes are not theoratically unique, but practically unique for it's usecases
    const hash = crypto.createHash('sha256').update(String(Math.random())).digest('hex')
    return res.status(201).json(hash);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error occured!");
  }
});

app.get("/endpoint2", async (req, res) => {
  try {
    // send request to endpoint 1
    const response = await axios.get("http://localhost:8081/endpoint1");
    const lastChar = response.data.charAt(response.data.length - 1)
    // check if last character is a number and if it is odd number
    if (lastChar >= "0" && lastChar <= "9" && Number(lastChar) % 2 === 1) {
      return res.status(201).json(response.data);
    }
    return res.status(400).send("Pass!");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error occured!");
  }
});

app.get("/endpoint3", async (req, res) => {
  try {
    // loop for sending request
    while (true) {
      // wait 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      // send request to endpoint2 and continue, don't await so to make sure 1 request is sent (almost) every second
      // callback funtion will handle the response
      axios.get("http://localhost:8081/endpoint2").then((response) => console.log(response.data)).catch(() => console.log("Pass!"));
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error occured!");
  }
});

// Host the app on port
const server = app.listen(process.env.PORT, function () {
  const host = server.address().address
  const port = server.address().port

  console.log("Listening at http://%s:%s", host, port)
});
