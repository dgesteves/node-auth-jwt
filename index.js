const express = require( 'express' )
const app = express()
const dotenv = require( 'dotenv' )
const mongoose = require( 'mongoose' )

// Import Routes
const authRoute = require( './routes/auth' )
const postsRoute = require( './routes/posts' )

// Secret Data Config
dotenv.config()

// Connect to DB
mongoose.connect( process.env.DB_CONNECT,
    { useNewUrlParser: true }, () => console.log( 'Connected to DB!' ) )

// Middleware's
app.use( express.json() )

// Route Middleware
app.use( '/api/user', authRoute )
app.use( '/api/posts', postsRoute )

app.listen( 4000, () => console.log( 'Server running on port 4000' ) )
