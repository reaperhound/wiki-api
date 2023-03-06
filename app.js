const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();
//EJS setup
app.set("view engine", "ejs");

//BodyParser setup
app.use(bodyParser.urlencoded({ extended: true }));

//public folder setup
app.use(express.static("public"));

// MONGODB URL
const MongoDB_URL = `mongodb+srv://reaperhound:MinIsTheBestGirl@cluster0.4ndxvyl.mongodb.net/wikiDB`;

//Mongo connect
mongoose
  .connect(MongoDB_URL)
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.log(err));

mongoose.set("strictQuery", false);

//Mongo Schema
const wikiSchema = {
  title: String,
  content: String,
};

//Mongo model
const Wiki = mongoose.model("articles", wikiSchema);

// ----------------------------

//setting up server
app.listen(3000 || process.env.PORT, () => console.log(`server started at PORT 3000`));

// // Articles GET route
// app.get(`/articles`);

// //Articles POST route
// app.post(`/articles`);

// //Articles DELETE route
// app.delete(`/articles`);

////////////////////////////////////// Request Targeting all Articles //////////////////////////////////////////
app
  .route(`/articles`)
  .get((req, res) => {
    Wiki.find()
      .then((foundArticles) => {
        res.send(foundArticles);
      })
      .catch((err) => res.send(err));
  })
  .post((req, res) => {
    const newArticle = new Wiki({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle
      .save()
      .then(() => res.send(`Successfully added`))
      .catch((err) => res.send(err));
  })
  .delete((req, res) => {
    Wiki.deleteMany()
      .then(() => res.send(`Successfully deleted`))
      .catch((err) => res.send(err));
  });

////////////////////////////////////// Request Targeting Specific Article //////////////////////////////////////////

app
  .route(`/articles/:article`)

  .get((req, res) => {
    Wiki.findOne({ title: req.params.article })
      .then((articleFound) => {
        res.send(articleFound);
      })
      .catch((err) => res.send(err));
  })

  .put((req, res) => {
    Wiki.findOneAndReplace(
      { title: req.params.article },
      {
        title: req.body.title,
        content: req.body.content,
      }
    )
      .then(() => res.send(`Successfully Updated`))

      .catch((err) => res.send(err));
  })

  .patch((req, res) => {
    Wiki.findOneAndUpdate(
      {
        title: req.params.article,
      },
      { $set: req.body }
    )
      .then(() => res.send(`Updated successfully`))
      .catch((err) => console.log(err));
  })

  .delete((req, res) => {
    Wiki.findOneAndDelete({
      title: req.params.article,
    })
      .then(() => res.send("Successfully deleted Document"))
      .catch((err) => res.send(err));
  });
