const Workout = require("../models/Workout");

module.exports.addWorkout = (req, res) => {
    const { name, duration } = req.body;
    const userId = req.user.id;

    if (!name || !duration) {
        return res.status(400).send({ error: "Name and duration are required." });
    }

    let newWorkout = new Workout({
        name: name,
        duration: duration,
        userId: userId
    });

    newWorkout.save()
        .then(savedWorkout => res.status(201).send({ message: "Workout added successfully", workout: savedWorkout }))
        .catch(saveErr => {
            console.error("Error in saving the workout: ", saveErr);
            return res.status(500).send({ error: 'Failed to save the workout.' });
        });
};


module.exports.getMyWorkouts = (req, res) => {
    const userId = req.user.id;

    Workout.find({ userId: userId })
        .then(workouts => {
            if (workouts.length > 0) {
                return res.status(200).send({ workouts });
            } else {
                return res.status(404).send({ message: "No workouts found for this user." });
            }
        })
        .catch(err => {
            console.error("Error in finding workouts:", err);
            return res.status(500).send({ error: 'Error finding workouts.' });
        });
};


module.exports.getSingleWorkout = (req, res) => {
    const workoutId = req.params.workoutId;
    const userId = req.user.id;

    Workout.findOne({ _id: workoutId, userId: userId })
        .then(foundWorkout => {
            if (!foundWorkout) {
                return res.status(404).send({ error: 'Workout not found or you do not have access.' });
            }
            return res.status(200).send({ workout: foundWorkout });
        })
        .catch(err => {
            console.error("Error in fetching the workout: ", err);
            return res.status(500).send({ error: 'Failed to fetch workout.' });
        });
};


module.exports.updateWorkout = (req, res) => {
    const workoutId = req.params.workoutId;
    const userId = req.user.id;

    const workoutUpdates = {
        name: req.body.name,
        duration: req.body.duration
    };

    return Workout.findOneAndUpdate(
        { _id: workoutId, userId: userId },
        workoutUpdates,
        { new: true }
    )
    .then(updatedWorkout => {
        if (!updatedWorkout) {
            return res.status(404).send({ error: 'Workout not found or you do not have access.' });
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


module.exports.completeWorkoutStatus = (req, res) => {
    const workoutId = req.params.workoutId;
    const userId = req.user.id;

    const statusUpdate = {
        status: 'completed'
    };

    return Workout.findOneAndUpdate(
        { _id: workoutId, userId: userId },
        statusUpdate,
        { new: true }
    )
    .then(completedWorkout => {
        if (!completedWorkout) {
            return res.status(404).send({ error: 'Workout not found or you do not have access.' });
        }
        return res.status(200).send({
            message: 'Workout status updated to completed.',
            completedWorkout: completedWorkout
        });
    })
    .catch(err => {
        console.error("Error in completing workout status:", err);
        return res.status(500).send({ error: 'Error in completing workout status.' });
    });
};

module.exports.deleteWorkout = (req, res) => {
    const workoutId = req.params.workoutId;
    const userId = req.user.id;

    return Workout.deleteOne({ _id: workoutId, userId: userId })
        .then(deletedResult => {
            if (deletedResult.deletedCount === 0) {
                return res.status(404).send({ error: 'Workout not found or you do not have access.' });
            }
            return res.status(200).send({
                message: 'Workout deleted successfully.'
            });
        })
        .catch(err => {
            console.error("Error in deleting a workout:", err);
            return res.status(500).send({ error: 'Error in deleting a workout.' });
        });
};