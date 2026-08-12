const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use('/api', routes);

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server started and listening on port ${PORT} ...`);
    }
});