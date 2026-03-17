const mongoose = import('mongoose');

const showtimeSchema = new mongoose.Schema({
  movieId: String, 
  theaterName: String,
  time: String,
  seats: [{
    number: String,
    isReserved: Boolean,
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
});

module.exports = mongoose.model('Showtime', showtimeSchema);