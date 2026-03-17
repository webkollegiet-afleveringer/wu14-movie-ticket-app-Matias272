const express = import('express');
const router = express.Router();
const Showtime = import('../models/Showtime'); // Import the model

// 1. Fetch all showtimes for a specific movie
router.get('/movie/:mid', async (req, res) => {
    try {
        // Find showtimes in DB that match the TMDB ID
        const showtimes = await Showtime.find({ movieId: req.params.mid });
        res.json(showtimes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching showtimes" });
    }
});

// 2. Fetch a specific showtime (for seat selection)
router.get('/:id', async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id);
        res.json(showtime);
    } catch (err) {
        res.status(500).json({ message: "Error fetching specific showtime" });
    }
});

module.exports = router;