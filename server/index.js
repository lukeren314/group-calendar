// import the app
const app = require('./server');
// pick a port number
const port = process.env.PORT || 8000;

// start the server
app.listen(port, () => console.log(`Server Start! Listening on port ${port}`));
