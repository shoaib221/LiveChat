

const Test = ( req, res, next ) => {
    res.json( { "message": "Hello Test :3" } );
    next();
}



module.exports = Test;
