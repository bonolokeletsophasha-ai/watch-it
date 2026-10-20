const express = require("express");
const movieRoutes = require("./routes/movieRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON request bodies.
app.use(express.json());

// Basic welcome route.
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Watch-It Movie Watchlist API",
    endpoints: {
      movies: "/api/movies",
      singleMovie: "/api/movies/:id"
    }
  });
});

// Movie API routes.
app.use("/api/movies", movieRoutes);

// Return a clear JSON response for unknown endpoints.
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Handle malformed JSON and other unexpected errors.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Watch-It API is running on http://localhost:${PORT}`);
});

module.exports = app;
