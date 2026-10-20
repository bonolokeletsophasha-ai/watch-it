// Temporary in-memory movie collection. Data resets when the server restarts.
let movies = [
  { id: 1, title: "The Shawshank Redemption", genre: "Drama", year: 1994, watched: true },
  { id: 2, title: "Inception", genre: "Science Fiction", year: 2010, watched: false },
  { id: 3, title: "Black Panther", genre: "Action", year: 2018, watched: true },
  { id: 4, title: "Spirited Away", genre: "Animation", year: 2001, watched: false },
  { id: 5, title: "The Dark Knight", genre: "Action", year: 2008, watched: false }
];

let nextId = 6;

const getAllMovies = (req, res) => {
  return res.status(200).json({ count: movies.length, movies });
};

const getMovieById = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Movie ID must be a positive integer" });
  }

  const movie = movies.find((item) => item.id === id);

  if (!movie) {
    return res.status(404).json({ message: `Movie with ID ${id} was not found` });
  }

  return res.status(200).json(movie);
};

const validateMovie = (body) => {
  const { title, genre, year, watched } = body ?? {};
  const errors = [];

  if (typeof title !== "string" || !title.trim()) {
    errors.push("Title is required and must be a non-empty string");
  }

  if (typeof genre !== "string" || !genre.trim()) {
    errors.push("Genre is required and must be a non-empty string");
  }

  if (!Number.isInteger(year) || year < 1888 || year > new Date().getFullYear() + 5) {
    errors.push("Year must be a valid integer release year");
  }

  if (typeof watched !== "boolean") {
    errors.push("Watched must be true or false");
  }

  return errors;
};

const createMovie = (req, res) => {
  const errors = validateMovie(req.body);

  if (errors.length) {
    return res.status(400).json({ message: "Invalid movie data", errors });
  }

  const newMovie = {
    id: nextId++,
    title: req.body.title.trim(),
    genre: req.body.genre.trim(),
    year: req.body.year,
    watched: req.body.watched
  };

  movies.push(newMovie);
  return res.status(201).json({ message: "Movie created successfully", movie: newMovie });
};

const updateMovie = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Movie ID must be a positive integer" });
  }

  const movieIndex = movies.findIndex((item) => item.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: `Movie with ID ${id} was not found` });
  }

  const errors = validateMovie(req.body);
  if (errors.length) {
    return res.status(400).json({ message: "Invalid movie data", errors });
  }

  movies[movieIndex] = {
    id,
    title: req.body.title.trim(),
    genre: req.body.genre.trim(),
    year: req.body.year,
    watched: req.body.watched
  };

  return res.status(200).json({
    message: "Movie updated successfully",
    movie: movies[movieIndex]
  });
};

const deleteMovie = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Movie ID must be a positive integer" });
  }

  const movieIndex = movies.findIndex((item) => item.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: `Movie with ID ${id} was not found` });
  }

  const [deletedMovie] = movies.splice(movieIndex, 1);
  return res.status(200).json({
    message: "Movie deleted successfully",
    movie: deletedMovie
  });
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};
