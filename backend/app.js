const express = require('express');
const zkRoutes = require('./routes/zk');
const app = express();

app.use(express.json());
app.use('/api/zk', zkRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));