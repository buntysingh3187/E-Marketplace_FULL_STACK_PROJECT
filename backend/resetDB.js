const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/emarket')
  .then(async () => {
    console.log('Connected to MongoDB...');
    
    // Drop the database
    await mongoose.connection.db.dropDatabase();
    console.log('✅ Database reset successfully!');
    console.log('All collections have been removed.');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error connecting to MongoDB:', err.message);
    console.log('\nMake sure MongoDB is running on localhost:27017');
    console.log('You can start MongoDB by running: mongod');
    process.exit(1);
  });
