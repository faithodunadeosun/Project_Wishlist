const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect( 'mongodb://localhost:27017/wishlist', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('::::> Connected to MongoDB');
  } catch (error) {
    console.log('::::> Error connecting to MongoDB: ', error.messag);
    throw new Error(error.message);
  }
};
