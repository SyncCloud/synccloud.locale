import mongoose from 'mongoose';

const log = $log('synccloud:locale:config:db');

mongoose.Model.findById = function (id, ...args) {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return $q.resolve(null); //prevent CastError
  } else {
    return this.findOne({_id: id});
  }
};

export default async function initDatabase({mongo}) {
  const connectionString = `mongodb://${mongo.host}:${mongo.port}/${mongo.db}`;

  log(`initing database connection ${connectionString}`);
  return await new Promise((resolve, reject) => {
    mongoose.connect(connectionString);
    mongoose.connection
      .on("error", function (err) {
        log(`failed to connect to MongoDB using ${connectionString}`);
        reject(err);
      })
      .on('connected', function () {
        log(`connected to MongoDB using ${connectionString}`);
        resolve(mongoose.connection);
      });
  })
}
