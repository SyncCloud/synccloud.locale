require('./server').catch(function (err) {
  console.error(err.stack);
});
