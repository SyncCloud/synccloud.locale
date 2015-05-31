import passport from 'koa-passport';
import {Strategy as LocalStrategy} from 'passport-local';
import auth from '../auth';
import UserModel from '../models/user';

passport.serializeUser(function(userData, done) {
  UserModel.findOne({login: userData.login})
    .then(function(user) {
      if (user) {
        done(null, user._id);
      } else {
        return new UserModel(userData).save().then((user) => {
          done(null, user._id);
        })
      }
    })
    .error(done)
});

passport.deserializeUser(function(id, done) {
  UserModel.findOne(id)
    .then((user) => {
      done(null, user.toJSON());
    })
    .error(done);
});

passport.use(new LocalStrategy(function(username, password, done) {
    auth.login(username, password)
      .then((user) => {
        if (user) {
          done(null, {
            name: user.fullName,
            avatarUrl: user.avatarUrl,
            login: username
          })
        } else {
          done(null, false);
        }
      })
      .catch(done);
}));

export default passport;
