const log = $log('synccloud:locale:model:project');

export default {
  schema: true,
  tableName: 'project',
  attributes: {
    createdAt: Date,
    createdBy: String,
    name: String,
    locales: Array
  },
  beforeCreate(values, next) {
    values.createdAt = new Date();
    log('save %o', values);
    next();
  }
};
