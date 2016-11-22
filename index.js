const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'frontend', 'static')))

// app.get('/', (req, res) => {

// })

app.listen(8000, () => {
	console.log(`listening port 8000...`);
})