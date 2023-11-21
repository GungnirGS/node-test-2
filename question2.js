require("dotenv").config(); // For reading .env
const express = require("express"); // Express js
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

// Host the app on port
const server = app.listen(process.env.PORT, function () {
  const host = server.address().address
  const port = server.address().port

  console.log("Listening at http://%s:%s", host, port)
});
