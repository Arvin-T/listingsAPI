const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080; // assign a port

app.get("/", (req, res) => res.json({ message: "API Listening" }));

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
