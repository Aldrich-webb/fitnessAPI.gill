const express = require("express");
const workoutController = require("../controllers/workout");
const { verify } = require("../auth");

const router = express.Router();

router.post("/addWorkout", verify, workoutController.addWorkout);
router.get("/getmyWorkouts", verify, workoutController.getMyWorkouts);
router.get("/getSingleWorkout/:workoutId", verify, workoutController.getSingleWorkout);
router.put("/updateWorkout/:workoutId", verify, workoutController.updateWorkout);
router.put("/completeWorkoutStatus/:workoutId", verify, workoutController.completeWorkoutStatus);
router.delete("/deleteWorkout/:workoutId", verify, workoutController.deleteWorkout);

module.exports = router;