const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./db");
const app = express();
const path = require("path");

// Handle cors policy
app.use(cors());
// Handle req.body
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  // setup static content
  app.use(express.static(path.join(__dirname, "frontend/build")));
}

// ROUTES

// REGISTER AND LOGIN
app.use("/auth", require("./routes/authjwt"));

// DASHBOARD
app.use("/dashboard", require("./routes/dashboard"));

//CREATE ANIME ENTRY IN THE DB
app.post("/mal/anime", async (req, res) => {
  try {
    const { image, title, studio, description } = req.body;
    const newAnime = await pool.query(
      "INSERT INTO anime (title,description, studio,image) VALUES($1, $2, $3, $4) RETURNING *",
      [title, description, studio, image]
    );
    res.json(newAnime.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// GET ALL ANIME FROM DATABASE
app.get("/mal/anime", async (req, res) => {
  try {
    const allAnime = await pool.query("SELECT * FROM anime");
    res.json(allAnime.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// CREATE A USER
app.post("/mal", async (req, res) => {
  try {
    const { description } = req.body;
    const newPerson = await pool.query(
      "INSERT INTO person (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newPerson.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// GET ALL USERS
app.get("/mal", async (req, res) => {
  try {
    const allPersons = await pool.query("SELECT * FROM person");
    res.json(allPersons.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//GET SPECIFIC USER
app.get("/mal/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const person = await pool.query("SELECT * FROM person WHERE userID = $1", [
      id,
    ]);
    res.json(person.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// UPDATE A USER DESCRIPTION
app.put("/mal/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updatePerson = await pool.query(
      "UPDATE person SET description = $1 WHERE userID = $2",
      [description, id]
    );
    res.json("User description was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

// DELETE A USER

app.delete("/mal/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletePerson = await pool.query(
      "DELETE FROM person WHERE userID = $1",
      [id]
    );
    res.json("User was deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

// Function for the default loading of all titles was /rak/content_default
app.get("/rak/content_default", async (req, res) => {
  try {
    let sql =
      "SELECT AC.title, AI.description, AI.rating, AI.image_url" +
      " FROM anime_content AC, anime_info AI " +
      " WHERE AC.title = AI.title " +
      " GROUP BY AC.title, AI.description, AI.rating, AI.image_url; ";
    const titles = await pool.query(sql);
    res.json(titles.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get all titles based on rating
app.get("/rak/content_rating", async (req, res) => {
  try {
    let sql =
      "SELECT AC.title, AI.description, AI.rating, AI.image_url" +
      " FROM anime_content AC, anime_info AI " +
      " WHERE AC.title = AI.title " +
      " GROUP BY AC.title, AI.description, AI.rating, AI.image_url " +
      " ORDER BY AI.rating DESC;";
    const titles = await pool.query(sql);
    res.json(titles.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// All titles Descending Alphabetically
app.get("/rak/content_alpha_desc", async (req, res) => {
  try {
    let sql =
      "SELECT AC.title, AI.description, AI.rating, AI.image_url" +
      " FROM anime_content AC, anime_info AI " +
      " WHERE AC.title = AI.title " +
      " GROUP BY AC.title, AI.description, AI.rating, AI.image_url " +
      " ORDER BY AC.title DESC;";
    const titles = await pool.query(sql);
    res.json(titles.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// All titles cost low to high
// Add the format to the title to keep it unique.
// Add cost also.
app.get("/rak/content_low_high", async (req, res) => {
  try {
    let sql =
      "SELECT AC.title || ' ' || AC.format As title, AI.description, AI.rating, AI.image_url, AC.cost" +
      " FROM anime_content AC, anime_info AI " +
      " WHERE AC.title = AI.title " +
      " ORDER BY AC.cost ASC;";
    const titles = await pool.query(sql);
    res.json(titles.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// All titles cost high to low
app.get("/rak/content_high_low", async (req, res) => {
  try {
    let sql =
      "SELECT AC.title || ' ' || AC.format As title, AI.description, AI.rating, AI.image_url, AC.cost" +
      " FROM anime_content AC, anime_info AI " +
      " WHERE AC.title = AI.title " +
      " ORDER BY AC.cost DESC;";
    const titles = await pool.query(sql);
    res.json(titles.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Specific title search
app.get("/rak/content_title_search/", async (req, res) => {
  const { title } = req.params;
  try {
    let sql =
      "SELECT AC.title, AI.description, AI.rating, AI.image_url" +
      " FROM anime_content AC, anime_info AI " +
      " WHERE AC.title = AI.title AND LOWER(AI.title) = LOWER($1) " +
      " GROUP BY AC.title, AI.description, AI.rating, AI.image_url ";
    const titles = await pool.query(sql, [title]);
    res.json(titles.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Check if a title is in stock. Specific title is needed (preferably through a click on a title so it will be exact always)
// This will return stock amount for each format (if 0 out of stock for that particular one)
app.get("/rak/stock_amount", async (req, res) => {
  try {
    let sql =
      "SELECT DVD.title as title, DVD.image_url as url, DVD.format as dvd_format, DVD.num_stock as dvd_stock, DVD.cost as dvd_cost, BR.format as br_format, BR.num_stock as br_stock, BR.cost as br_cost, DIG.format as dig_format, DIG.num_stock as dig_stock, DIG.cost as dig_cost " +
      "FROM " +
      "(SELECT AC2.title, AC2.format, AC2.num_stock, AC2.cost, AI2.image_url " +
      "FROM anime_content AC2, anime_info AI2 " +
      "WHERE AC2.format = 'DVD' AND AC2.title = AI2.title) As DVD, " +
      "(SELECT AC3.title, AC3.format, AC3.num_stock, AC3.cost " +
      "FROM anime_content AC3 " +
      "WHERE AC3.format = 'Blu-Ray') As BR, " +
      "(SELECT AC4.title, AC4.format, AC4.num_stock, AC4.cost " +
      "FROM anime_content AC4 " +
      "WHERE AC4.format = 'Digital') As DIG " +
      "WHERE DVD.title = BR.title AND BR.title = DIG.title; ";
    const stock_per_format = await pool.query(sql);
    res.json(stock_per_format.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Match function for narrowing search if possible
app.post("/rak/store_search/", async (req, res) => {
  const { partial } = req.body;
  try {
    let sql =
      "SELECT DVD.title as title, DVD.image_url as url, DVD.format as dvd_format, DVD.num_stock as dvd_stock, DVD.cost as dvd_cost, BR.format as br_format, BR.num_stock as br_stock, BR.cost as br_cost, DIG.format as dig_format, DIG.num_stock as dig_stock, DIG.cost as dig_cost " +
      "FROM " +
      "(SELECT AC2.title, AC2.format, AC2.num_stock, AC2.cost, AI2.image_url " +
      "FROM anime_content AC2, anime_info AI2 " +
      "WHERE AC2.format = 'DVD' AND AC2.title = AI2.title) As DVD, " +
      "(SELECT AC3.title, AC3.format, AC3.num_stock, AC3.cost " +
      "FROM anime_content AC3 " +
      "WHERE AC3.format = 'Blu-Ray') As BR, " +
      "(SELECT AC4.title, AC4.format, AC4.num_stock, AC4.cost " +
      "FROM anime_content AC4 " +
      "WHERE AC4.format = 'Digital') As DIG " +
      "WHERE DVD.title = BR.title AND BR.title = DIG.title AND LOWER(DVD.title) LIKE LOWER($1 || '%'); ";
    const stock_per_format = await pool.query(sql, [partial]);
    res.json(stock_per_format.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/rak/rent/", async (req, res) => {
  const { title, username, format } = req.body;
  try {
    let sql = "SELECT * FROM rent($1,$2,$3);";
    const stock_per_format = await pool.query(sql, [username, title, format]);
    res.json(stock_per_format.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/rak/return/", async (req, res) => {
  const { title, username, format } = req.body;
  try {
    let sql = "SELECT * FROM return_rent($1,$2,$3);";
    const stock_per_format = await pool.query(sql, [username, title, format]);
    res.json(stock_per_format.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/rak/amount_due/", async (req, res) => {
  const { username } = req.body;
  try {
    let sql =
      "SELECT sum(AC.cost) As cost " +
      "FROM rented_ass RA, anime_content AC " +
      "WHERE RA.username = $1 AND RA.inventory_number = AC.inventory_number; ";
    const stock_per_format = await pool.query(sql, [username]);
    res.json(stock_per_format.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Return all rentals for an specific user
app.post("/rak/user_rentals/", async (req, res) => {
  const { username } = req.body;
  try {
    let sql =
      "SELECT AC.title, AC.format, AI.image_url, RA.due_date, AC.cost " +
      "FROM rented_ass RA, anime_content AC, anime_info AI " +
      "WHERE RA.username = $1 AND RA.inventory_number = AC.inventory_number AND AC.title = AI.title; ";
    const stock_per_format = await pool.query(sql, [username]);
    res.json(stock_per_format.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// favorite functions

app.post("/rak/favorite/", async (req, res) => {
  const { title, username } = req.body;
  try {
    let sql =
      "INSERT INTO favorite_ass " +
      "SELECT US.username, AC.inventory_number " +
      "FROM anime_content as AC, users As US " +
      "WHERE AC.title = $1 AND US.username = $2 " +
      "LIMIT 1; ";
    const addfave = await pool.query(sql, [title, username]);
    res.json(addfave.rows);
  } catch (err) {
    res.json("Error");
    console.error(err.message);
  }
});

// should work
app.post("/rak/user_favorites/", async (req, res) => {
  const { username } = req.body;
  try {
    let sql =
      "SELECT AC.title, AI.image_url, AI.rating " +
      "FROM anime_content AC, anime_info AI, favorite_ass FA " +
      "WHERE FA.username = $1 AND FA.inventory_number = AC.inventory_number AND AC.title = AI.title; ";
    const user_fav = await pool.query(sql, [username]);
    res.json(user_fav.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/rak/unfavorite/", async (req, res) => {
  const { title, username } = req.body;
  try {
    let sql =
      "DELETE FROM favorite_ass " +
      "WHERE inventory_number IN ( " +
      "    SELECT AC.inventory_number " +
      "    FROM anime_content AC " +
      "    WHERE AC.title = $1 " +
      ") AND username IN ( " +
      "    SELECT US.username " +
      "    FROM users US " +
      "    WHERE US.username = $2 " +
      "); ";
    const remfave = await pool.query(sql, [title, username]);
    res.json(remfave.rows);
  } catch (err) {
    console.error(err.message);
  }
});
// Non-db routes
app.use("/", require("./routes/firstRoute"));

// catch all random routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});

/*app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());*/

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Running on port http://localhost:${PORT}`);
});
