require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const db = require("./database");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
require("./database");

const app = express();
const PORT = process.env.PORT || 5050;
console.log("Gemini key:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");
console.log("OMDB KEY:", process.env.OMDB_API_KEY ? "Loaded" : "Missing");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Movie Recommendation Backend is running 🎬");
});

app.get("/movies/search", async (req, res) => {
  try {
    let movieName = req.query.q || "avengers";

const corrections = {
  spiderman: "Spider-Man",
  spiderMan: "Spider-Man",
  spider: "Spider-Man",
  ironman: "Iron Man",
  batman: "Batman",
  superman: "Superman",
};

const normalizedSearch = movieName.toLowerCase().replace(/\s+/g, "");

if (corrections[normalizedSearch]) {
  movieName = corrections[normalizedSearch];
}
    const apiKey = process.env.OMDB_API_KEY;

    console.log("Using OMDB key:", apiKey ? "Loaded" : "Missing");

    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: apiKey,
        s: movieName,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("OMDb Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});
app.post("/favorites", (req, res) => {
  const { imdbID, Title, Year, Poster } = req.body;

  const existing = db
    .prepare("SELECT * FROM favorites WHERE movie_id = ?")
    .get(imdbID);

  if (existing) {
    return res.json({ message: "Movie already in favorites" });
  }

  db.prepare(`
    INSERT INTO favorites (movie_id, title, poster_path, overview, rating)
    VALUES (?, ?, ?, ?, ?)
  `).run(imdbID, Title, Poster, Year, 0);

  res.json({ message: "Added to favorites" });
});

app.get("/favorites", (req, res) => {
  const favorites = db.prepare("SELECT * FROM favorites ORDER BY id DESC").all();
  res.json(favorites);
});
app.get("/movies/details/:id", async (req, res) => {
  try {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: process.env.OMDB_API_KEY,
        i: req.params.id,
        plot: "full",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Movie Details Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});
app.get("/movies/ai-recommend", async (req, res) => {
  try {
    const userMood = req.query.mood || "I want something exciting";

    const prompt = `
You are an AI movie recommendation assistant.

User request: "${userMood}"

Return ONE real movie title that matches the user's mood and language request.

Rules:
- Return ONLY the movie title.
- Do NOT return numbers.
- Do NOT return explanations.
- Do NOT return genres.
- Do NOT return year only.
- If the user asks for Tamil, return a famous Tamil movie title.
- If the user feels sad and asks Tamil, return one emotional Tamil movie.
- If the user asks for mass Tamil, return a Tamil action movie.
- If the user asks for romance Tamil, return a Tamil romance movie.
- Pick titles that are likely available in OMDb.

Examples:
"I feel sad and I want Tamil movie" -> 96
"I feel emotional and want Tamil movie" -> Pariyerum Perumal
"I want mass Tamil movie" -> Vikram
"I want Tamil action movie" -> Leo
"I want Tamil love movie" -> Vinnaithaandi Varuvaayaa
"I feel sad" -> The Pursuit of Happyness
"I want funny movie" -> The Hangover
"I want superhero movie" -> Spider-Man
`;
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let keyword = geminiResponse.text.trim();

const lowerMood = userMood.toLowerCase();

if (lowerMood.includes("tamil")) {
  if (lowerMood.includes("sad") || lowerMood.includes("emotional")) {
    keyword = "Pariyerum Perumal";
  } else if (lowerMood.includes("love") || lowerMood.includes("romantic")) {
    keyword = "Vinnaithaandi Varuvaayaa";
  } else if (lowerMood.includes("mass") || lowerMood.includes("action")) {
    keyword = "Vikram";
  } else if (lowerMood.includes("thriller")) {
    keyword = "Ratsasan";
  } else {
    keyword = "Vikram";
  }
}
const aiCorrections = {
  "96": "Pariyerum Perumal",
};

if (aiCorrections[keyword]) {
  keyword = aiCorrections[keyword];
}
    const movieResponse = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: process.env.OMDB_API_KEY,
        s: keyword,
      },
    });

    res.json({
      mood: userMood,
      keyword,
      movies: movieResponse.data.Search || [],
    });
  } catch (error) {
    console.error("AI Recommend Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});
app.get("/movies/trailer/:title", async (req, res) => {
  try {
    const movieTitle = req.params.title;

    const youtubeSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      movieTitle + " official trailer"
    )}`;

    res.json({
      trailerUrl: youtubeSearch,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Failed to fetch trailer",
    });
  }
});
app.delete("/favorites/:id", (req, res) => {
  try {
    const movieId = req.params.id;

    db.prepare("DELETE FROM favorites WHERE movie_id = ?").run(movieId);

    res.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Remove Favorite Error:", error.message);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});
app.get("/tmdb/search", async (req, res) => {
  try {
    const query = req.query.q || "Spider-Man";

    const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
        region: "IN",
      },
    });

    res.json(response.data.results);
  } catch (error) {
    console.error("TMDB Search Error:", error.message);
    res.status(500).json({ error: "Failed to search TMDB movies" });
  }
});

app.get("/tmdb/details/:id", async (req, res) => {
  try {
    const movieId = req.params.id;

    const details = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        append_to_response: "credits,videos,watch/providers",
      },
    });

    res.json(details.data);
  } catch (error) {
    console.error("TMDB Details Error:", error.message);
    res.status(500).json({ error: "Failed to fetch TMDB movie details" });
  }
});

app.get("/tmdb/watch/:id", async (req, res) => {
  try {
    const movieId = req.params.id;

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      }
    );

    const indiaProviders = response.data.results?.IN || null;

    res.json({
      flatrate: indiaProviders?.flatrate || [],
      rent: indiaProviders?.rent || [],
      buy: indiaProviders?.buy || [],
      link: indiaProviders?.link || null,
    });
  } catch (error) {
    console.error(
      "TMDB Watch Provider Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});