const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");

app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log('Error connecting to MongoDB Atlas:', error));

if(require.main === module){
    app.listen(port, () => console.log(`API is now online on port ${port}`));
}

module.exports = { app, mongoose };