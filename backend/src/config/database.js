const mongoDatabase = require('./mongoDatabase');

// We are exporting the mongoDatabase wrapper under the name 'supabase'
// to maintain compatibility with all services and controllers.
const supabase = mongoDatabase;

module.exports = { supabase };
