const express = require("express");
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const hashMap = require("./bankTransfer.js"); // Import hash logic

app.post("/transfer", (req, res) => {
    const { hash } = req.body;
    const details = hashMap.getTransactionDetails(hash);

    if (!details) return res.status(400).json({ error: "Invalid hash" });

    // Process Transaction Here
    res.json({ message: `Transfer initiated for ${details.account}` });
});

app.listen(port, () => console.log(`Server running on port ${port}`));

