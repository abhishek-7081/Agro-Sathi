const mockDatabase = require('./mockDatabase');

// We are exporting the mockDatabase wrapper under the name 'supabase'
// to restore full functionality since MongoDB is not running locally.
const supabase = mockDatabase;

module.exports = { supabase };
