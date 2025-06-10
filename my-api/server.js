const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, world! Your API is working.');
});

app.get('/data', (req, res) => {
    res.json({ message: 'Sample data from your API.' });
});

app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});

