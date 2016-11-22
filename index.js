const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'frontend', 'static')))

// app.get('/', (req, res) => {

// })

if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}