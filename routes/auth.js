const router = require( 'express' ).Router()
const User = require( '../model/User' )
const jwt = require( 'jsonwebtoken' )
const { registerValidation, loginValidation } = require( '../validation' )
const bcrypt = require( 'bcryptjs' )

// Register
router.post( '/register', async ( req, res ) => {

    // Validate Data Before Make a User
    const { error } = registerValidation( req.body )
    if ( error ) return res.status( 400 ).send( error.details[ 0 ].message )

    // Check if User already Exists
    const emailExists = await User.findOne( { email: req.body.email } )
    if ( emailExists ) return res.status( 400 ).send( 'Email already exists' )

    // Hash the Password
    const salt = await bcrypt.genSalt( 12 )
    const hashedPassword = await bcrypt.hash( req.body.password, salt )

    // Create User
    const user = new User( {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    } )
    try {
        const savedUser = await user.save()
        res.send( { user: savedUser.id } )
    } catch ( e ) {
        res.status( 400 ).send( e )
    }
} )

// Login
router.post( '/login', async ( req, res ) => {

    // Validate Data Before Login
    const { error } = loginValidation( req.body )
    if ( error ) return res.status( 400 ).send( error.details[ 0 ].message )

    // Check if email Exists
    const user = await User.findOne( { email: req.body.email } )
    if ( !user ) return res.status( 400 ).send( 'Email dose not exists' )

    // Check for Correct Password
    const validPassword = await bcrypt.compare( req.body.password, user.password )
    if ( !validPassword ) return res.status( 400 ).send( 'Invalid password' )

    // Create and Assign a jwb
    const token = jwt.sign( { _id: user._id }, process.env.TOKEN_KEY )
    res.header( 'auth-token', token ).send( token )
} )

module.exports = router
