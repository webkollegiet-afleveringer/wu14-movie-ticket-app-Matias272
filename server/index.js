const express = import('express');
const mongoose = import('mongoose');
const cors = import('cors');
import('dotenv').config();
const app = express();
const showtimeRoutes = import('./routes/showtimeRoutes');

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to Database"))
    .catch(err => console.error("Connection failed:", err))

app.get("/", (req, res) => {
    res.send("Server is running");
});
app.use('/api/showtimes', showtimeRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in PORT:${PORT}`);
})