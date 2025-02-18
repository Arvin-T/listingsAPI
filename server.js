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

dotenv.config(); 

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

const db = new ListingDB();

// Helper function for handling responses
const handleRequest = async (req, res, operation) => {
  try {
    const result = await operation(req);
    if (!result) {
      return res.status(404).json({ error: "Not Found" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    console.log("✅ Database initialized successfully");

    
    app.get("/", (req, res) => {
      res.json({ message: "API Listening" });
    });

  
    app.post("/api/listings", async (req, res) => {
      try {
        const listing = await db.addListing(req.body);
        console.log(`✅ New listing added: ${listing._id}`);
        res.status(201).json(listing);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    
    app.get("/api/listings", async (req, res) => {
      try {
        const { page = 1, perPage = 10, name } = req.query;
        const listings = await db.getListings(page, perPage, name);
        res.json(listings);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

   
    app.get("/api/listings/:id", async (req, res) => {
      await handleRequest(req, res, () => db.getListingById(req.params.id));
    });

     
    app.put("/api/listings/:id", async (req, res) => {
      await handleRequest(req, res, async (req) => {
        const updatedListing = await db.updateListing(req.params.id, req.body);
        console.log(`✅ Listing ${req.params.id} updated`);
        return updatedListing;
      });
    });

    
    app.delete("/api/listings/:id", async (req, res) => {
      try {
        const result = await db.deleteListing(req.params.id);
        if (!result) return res.status(404).json({ error: "Not Found" });

        console.log(`❌ Listing ${req.params.id} deleted`);
        res.status(204).json({ message: "Listing deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Start server
    const HTTP_PORT = process.env.PORT || 8080;
    app.listen(HTTP_PORT, () => console.log(`🚀 Server listening on port: ${HTTP_PORT}`));
  })
  .catch((err) => console.error("❌ Initialization failed:", err));
