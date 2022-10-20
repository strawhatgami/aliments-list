const services = {
  onCredentials: ({ User }) => async (username, password, done) => {
    let user = null;
    try {
      user = await User.findOne({ where: { username } })
    } catch (err) {
      done(err);
    }

    if (!user) {
      var newUser = new User();
      newUser.username = username;
      newUser.password = newUser.generateHash(password);
      await newUser.save();
      return done(null, newUser);
    };

    if (!user.verifyPassword(password)) return done(null, false);

    return done(null, user);
  },
  serializeUser: () => (user, cb) => cb(null, user.id),
  deserializeUser: ({ User }) => async (id, cb) => {
    try {
      const user = await User.findOne({ where: { id } });
      cb(null, user);
    } catch (err) {
      cb(err);
    }
  },
  getMe: ({}) => async ({user}) => {
    const name = user?.username;

    if (!name) {
      return {
        data: null,
      }
    }

    return {
      data: {name}
    }
  },
};

export default services;
  