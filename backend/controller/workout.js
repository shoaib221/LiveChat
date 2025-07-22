

const express = require("express");
const Workout = require("../models/workout.js");
const { requireAuth } = require("./middlewire.js");

// req.user_id

const CreateWorkout = async ( req, res, next ) => {
    const { title, load, reps } = req.body;
    console.log( req.body );

    try {
        const workout = await Workout.create({ title, load, reps, owner_id: req.user_id });
        res.status(200).json( workout );
    } catch (error) {
        res.status(400).json( { error: error.message} );
    } finally {
        next();
    }
}


const getWorkouts = async ( req, res, next ) => {
    
    try {
        const workouts = await Workout.find({ owner_id: req.user_id });
        res.status(200).json( workouts );
    } catch (error) {
        res.status(400).json( { error: error.message } );
    } finally {
        next();
    }
}

const deleteWorkout = async ( req, res, next ) => {
    const {id} = req.params;
    console.log( "delete "+ id);

    try {
        const ret = await Workout.findOne({ _id: id }) ;
        if( !ret ) throw Error("No such workout");
        await Workout.deleteOne( { _id : id } );
        res.status(200).json(ret) 
    } catch (error) {
        res.status(400).json( { error: error.message } )
        console.log(error.message)
    }

    next();
}

const updateWorkout = async ( req, res, next ) => {
    const {id} = req.params;
    const updation = req.body;

    try {
        const ret = await Workout.findOne({  });
        if(!ret) 
        await Workout.updateOne({ _id: id} , { $set : updation }  );
        res.status(200).json( ret );
        
    } catch( error ) {
        response.status(400).json( {  error: error.message } );
    } finally {
        next();
    }
}

const workoutRouter = express.Router();
workoutRouter.use(requireAuth);
workoutRouter.post( "/create", CreateWorkout );
workoutRouter.get( "/pull", getWorkouts );
workoutRouter.delete( "/:id" , deleteWorkout );
workoutRouter.patch( "/:id", updateWorkout );

module.exports = { workoutRouter };