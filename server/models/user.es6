const log = $log('synccloud:locale:model:user');

export default {
  tableName: 'user',
  schema: true,
  attributes: {
    createdAt: Date,
    login: {
      unique: true,
      index: true,
      type: String
    },
    token: String,
    name: String,
    avatarUrl: String
  },
  beforeCreate(values, next) {
    values.createdAt = new Date();
    log('save %o', values);
    next();
  }
}
