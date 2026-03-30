const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb://localhost:27017";
const dbName = "smart_agri";
const client = new MongoClient(uri);

let db;

async function connectToMongo() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('✓ Using MongoDB database at mongodb://localhost:27017/smart_agri');
    
    // Auto-seed data if empty
    await seedDataIfEmpty();
  } catch (error) {
    console.error('⚠ Failed to connect to MongoDB:', error);
  }
}

connectToMongo();

async function seedDataIfEmpty() {
  try {
    const marketsInfo = await db.collection('market_prices').find({}).limit(1).toArray();
    if (marketsInfo.length === 0) {
      console.log('Seeding market_prices...');
      // To mimic mockDatabase, we can just let it be empty, or import realMarketPrices from mockDatabase.js
      // Let's just import them here for convenience
      const mockDb = require('./mockDatabase');
      const tableData = mockDb.from('market_prices').select().execute().then(res => {
         if(res.data && res.data.length > 0) {
            db.collection('market_prices').insertMany(res.data);
         }
      });
      console.log('Seeded market_prices');
      
      const schemesRes = await mockDb.from('schemes').select().execute();
      if(schemesRes.data && schemesRes.data.length > 0) {
         await db.collection('schemes').insertMany(schemesRes.data);
         console.log('Seeded schemes');
      }
    }
  } catch (e) {
    console.error('Seeding error', e);
  }
}

// Convert Supabase queries to MongoDB queries
const mongoDatabase = {
  from(table) {
    let state = {
      table,
      match: {},
      sort: {},
      limitValue: null,
      offsetValue: null,
      countMode: false
    };

    const queryBuilder = {
      select(columns = '*', options = {}) {
        if (options.count) state.countMode = options.count === 'exact';
        return this;
      },
      eq(column, value) {
        state.match[column] = value;
        return this;
      },
      ilike(column, searchVal) {
        const val = searchVal.replace(/%/g, '');
        state.match[column] = { $regex: val, $options: 'i' };
        return this;
      },
      gte(column, value) {
        if (!state.match[column]) state.match[column] = {};
        state.match[column].$gte = value;
        return this;
      },
      limit(num) {
        state.limitValue = num;
        return this;
      },
      range(from, to) {
        state.offsetValue = from;
        state.limitValue = (to - from) + 1;
        return this;
      },
      order(column, options = {}) {
        state.sort[column] = options.ascending !== false ? 1 : -1;
        return this;
      },
      single() {
        return {
          then(onFulfilled, onRejected) {
            const promise = Promise.resolve().then(async () => {
              if(!db) return { data: null, error: new Error('DB not connected') };
              try {
                let cursor = db.collection(state.table).find(state.match);
                if (Object.keys(state.sort).length > 0) cursor = cursor.sort(state.sort);
                const results = await cursor.limit(1).toArray();
                return { data: results[0] || null, error: null };
              } catch (e) {
                return { data: null, error: e };
              }
            });
            return promise.then(onFulfilled, onRejected);
          }
        };
      },
      async execute() {
        if(!db) return { data: null, error: new Error('DB not connected') };
        try {
          let cursor = db.collection(state.table).find(state.match);
          if (Object.keys(state.sort).length > 0) cursor = cursor.sort(state.sort);
          
          let totalCount = 0;
          if (state.countMode) {
             totalCount = await db.collection(state.table).countDocuments(state.match);
          }
          
          if (state.offsetValue !== null) cursor = cursor.skip(state.offsetValue);
          if (state.limitValue !== null) cursor = cursor.limit(state.limitValue);
          
          const data = await cursor.toArray();
          return state.countMode ? { data, error: null, count: totalCount } : { data, error: null };
        } catch (e) {
             return { data: null, error: e };
        }
      },
      then(onFulfilled, onRejected) {
        return this.execute().then(onFulfilled, onRejected);
      },
      "async": async function() {
        return this.execute();
      }
    };

    return {
      select(columns = '*', options = {}) {
        if (options.count) state.countMode = options.count === 'exact';
        return queryBuilder;
      },
      insert(records) {
        return {
          select() {
            return {
              then(onFulfilled, onRejected) {
                const promise = Promise.resolve().then(async () => {
                   if(!db) return { data: null, error: new Error('DB not connected') };
                   try {
                     const docs = Array.isArray(records) ? records : [records];
                     // Supabase gives UUIDs or ids, we might need to enforce generating an ID if missing
                     docs.forEach(d => { if(!d.id) d.id = new ObjectId().toString(); });
                     await db.collection(state.table).insertMany(docs);
                     return { data: docs, error: null };
                   } catch (e) {
                     return { data: null, error: e };
                   }
                });
                return promise.then(onFulfilled, onRejected);
              },
              async single() {
                 if(!db) return { data: null, error: new Error('DB not connected') };
                 try {
                     const doc = Array.isArray(records) ? records[0] : records;
                     if(!doc.id) doc.id = new ObjectId().toString();
                     await db.collection(state.table).insertOne(doc);
                     return { data: doc, error: null };
                 } catch (e) {
                     return { data: null, error: e };
                 }
              },
              "async": async function() {
                 if(!db) return { data: null, error: new Error('DB not connected') };
                 try {
                     const docs = Array.isArray(records) ? records : [records];
                     docs.forEach(d => { if(!d.id) d.id = new ObjectId().toString(); });
                     await db.collection(state.table).insertMany(docs);
                     return { data: docs, error: null };
                 } catch(e) {
                     return { data: null, error: e };
                 }
              }
            };
          }
        };
      },
      update(updates) {
        return {
          eq(column, value) {
            state.match[column] = value;
            return {
              select() {
                return {
                  then(onFulfilled, onRejected) {
                     const promise = Promise.resolve().then(async () => {
                         if(!db) return { data: null, error: new Error('DB not connected') };
                         try {
                             await db.collection(state.table).updateMany(state.match, { $set: updates });
                             const data = await db.collection(state.table).find(state.match).toArray();
                             return { data, error: null };
                         } catch(e) {
                             return { data: null, error: e };
                         }
                     });
                     return promise.then(onFulfilled, onRejected);
                  },
                  async single() {
                     if(!db) return { data: null, error: new Error('DB not connected') };
                     try {
                         await db.collection(state.table).updateOne(state.match, { $set: updates });
                         const doc = await db.collection(state.table).findOne(state.match);
                         return { data: doc, error: null };
                     } catch(e) {
                         return { data: null, error: e };
                     }
                  }
                };
              },
              then(onFulfilled, onRejected) {
                const promise = Promise.resolve().then(async () => {
                   if(!db) return { data: null, error: new Error('DB not connected') };
                   try {
                       await db.collection(state.table).updateMany(state.match, { $set: updates });
                       return { data: null, error: null };
                   } catch(e) {
                       return { data: null, error: e };
                   }
                });
                return promise.then(onFulfilled, onRejected);
              }
            };
          }
        };
      },
      delete() {
        return {
          eq(column, value) {
            return {
              then(onFulfilled, onRejected) {
                const promise = Promise.resolve().then(async () => {
                   if(!db) return { data: null, error: new Error('DB not connected') };
                   try {
                       await db.collection(state.table).deleteMany({[column]: value});
                       return { data: null, error: null };
                   } catch(e) {
                       return { data: null, error: e };
                   }
                });
                return promise.then(onFulfilled, onRejected);
              },
              "async": async function() {
                 if(!db) return { data: null, error: new Error('DB not connected') };
                 try {
                     await db.collection(state.table).deleteMany({[column]: value});
                     return { data: null, error: null };
                 } catch(e) {
                     return { data: null, error: e };
                 }
              }
            };
          }
        };
      }
    };
  }
};

module.exports = mongoDatabase;
