const log = $log('synccloud:locale:model:item');

export default {
  tableName: 'activity',
  schema: true,
  attributes: {
    createdBy: Object,
    createdAt: Date,
    project: String,
    action: String,
    data: {},
    translations: {}
  },
  beforeCreate(values, next) {
    values.createdAt = new Date();
    log('save %o', values);
    next();
  },
  *byProject(projectId) {
    yield
      this.find({
        project: projectId
      })
      .sort('-createdAt')
      .exec();
  }
};
