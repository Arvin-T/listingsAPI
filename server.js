/********************************************************************************
 *  WEB422 – Assignment 1
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 *  Name: Seyedarvin Tabatabaei Ferezghi Student ID: 122267230 Date: February 3, 2025
 *  Published URL: https://listings-ca9urkdmr-arvins-projects-193706f1.vercel.app/
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ListingDB = require("./modules/listingsDB");
const app = express();
const cors = require("cors");

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

dotenv.config();

app.use(express.json());

const db = new ListingDB();

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    console.log("Database initialized successfully");
    // GET: Root
    app.get("/", (req, res) => {
      res.json({ message: "API Listening" });
    });

    // POST
    app.post("/api/listings", async (req, res) => {
      try {
        const listing = await db.addListing(req.body);
        res.status(201).json(listing);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // GET: Fetch
    app.get("/api/listings", async (req, res) => {
      try {
        const { page = 1, perPage = 10, name } = req.query;
        const listings = await db.getListings(page, perPage, name);
        res.json(listings);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // function for handling errors
    const handleRequest = async (res, operation) => {
      try {
        const result = await operation();
        if (!result) {
          return res.status(404).json({ error: "Not Found" });
        }
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

    // GET: Fetch by ID
    app.get("/api/listings/:id", async (req, res) => {
      await handleRequest(res, () => db.getListingById(req.params.id));
    });

    // PUT: Update by ID
    app.put("/api/listings/:id", async (req, res) => {
      await handleRequest(res, () => db.updateListing(req.params.id, req.body));
    });

    // DELET: Delete by ID
    app.delete("/api/listings/:id", async (req, res) => {
      try {
        const result = await db.deleteListing(req.params.id);
        if (!result) return res.status(404).json({ error: "Not Found" });
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    const HTTP_PORT = process.env.PORT || 8080; // assign a port
    app.listen(HTTP_PORT, () =>
      console.log(`server listening on: ${HTTP_PORT}`)
    );
  })
  .catch((err) => console.log("Initialization faied:", err));
