const express = require('express');
const app = express();
const path = require('path');

const publicDirectoryPath = path.join(__dirname, 'public');

app.use(express.static(publicDirectoryPath));

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
