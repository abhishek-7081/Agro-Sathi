const mongoDatabase = require('./mongoDatabase');

// We are exporting the mongoDatabase wrapper under the name 'supabase'
// to connect to MongoDB and restore full functionality.
const supabase = mongoDatabase;

module.exports = { supabase };
