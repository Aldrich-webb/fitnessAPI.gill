const Workout = require("../models/Workout");

module.exports.addWorkout = (req, res) => {
    let newWorkout = new Workout({
        name: req.body.name,
        duration: req.body.duration,
        status: req.body.status || "pending",
        dateAdded: req.body.dateAdded || Date.now(),
        userId: req.user.id 
    });

    newWorkout.save()
        .then(savedWorkout => res.status(201).send({
            message: "Workout successfully added",
            workout: savedWorkout
        }))
        .catch(saveErr => {
            console.error("Error in saving the workout:", saveErr);
            return res.status(500).send({ error: 'Failed to save the workout' });
        });
};

module.exports.getMyWorkouts = (req, res) => {
    Workout.find({ userId: req.user.id }) 
        .then(workouts => {
            if (workouts.length > 0) {
                return res.status(200).send({ workouts });
            } else {
                return res.status(200).send({ message: 'No workouts found.' });
            }
        })
        .catch(err => {
            console.error("Error finding workouts:", err);
            res.status(500).send({ error: 'Error finding workouts.' });
        });
};


module.exports.updateWorkout = (req, res) => {
    let workoutUpdates = {
        name: req.body.name,
        duration: req.body.duration,
        status: req.body.status,
        dateAdded: req.body.dateAdded
    };

    Workout.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id }, 
        workoutUpdates,
        { new: true }
    )
    .then(updatedWorkout => {
        if (!updatedWorkout) {
            return res.status(404).send({ error: 'Workout not found or not authorized' });
        }
        return res.status(200).send({
            message: 'Workout updated successfully',
            updatedWorkout: updatedWorkout
        });
    })
    .catch(err => {
        console.error("Error in updating a workout:", err);
        return res.status(500).send({ error: 'Error in updating a workout.' });
    });
};


module.exports.deleteWorkout = (req, res) => {
    Workout.deleteOne({ _id: req.params.id, userId: req.user.id }) 
    .then(deletedResult => {
        if (deletedResult.deletedCount < 1) {
            return res.status(404).send({ error: 'Workout not found or not authorized to delete' });
        }
        return res.status(200).send({ message: 'Workout deleted successfully' });
    })
    .catch(err => {
        console.error("Error in deleting a workout:", err);
        return res.status(500).send({ error: 'Error in deleting a workout.' });
    });
};

module.exports.completeWorkoutStatus = (req, res) => {
    const workoutId = req.params.id;

    Workout.findOneAndUpdate(
        { _id: workoutId, userId: req.user.id }, // ensure user owns the workout
        { status: "completed" },
        { new: true }
    )
    .then(updatedWorkout => {
        if (!updatedWorkout) {
            return res.status(404).send({ error: 'Workout not found or not authorized' });
        }
        return res.status(200).send({
            message: 'Workout marked as completed',
            updatedWorkout
        });
    })
    .catch(err => {
        console.error("Error completing workout:", err);
        res.status(500).send({ error: 'Failed to complete workout.' });
    });
};