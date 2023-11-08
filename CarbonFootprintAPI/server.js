const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const carbonFootprintRoutes = require("./Routes/carbonFootprintRoutes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/carbonFootprint", carbonFootprintRoutes);

app.listen(5000, (req, res) => {
    console.log("Server listening on localhost:5000");
});
