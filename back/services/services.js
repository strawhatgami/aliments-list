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
  findAlimentsByName: ({Aliment}) => async ({query}) => {
// TODO validate query.search
    const {search} = query || {};

    let aliments = [];
    if (!search) {
      aliments = await Aliment.findAll({})
      return {
        data: null,
      }
    } else {
      aliments = await Aliment.findAll({
        where: {label: search} // TODO use LIKE %search%
      })
    }

    const aliments_json = aliments.map((aliment) => aliment.toJSON());

    return {
      data: aliments_json
    }
  },
  findAliment: ({Aliment}) => async ({params}) => {
    // TODO validate id
    const {id} = params;

    const aliment = await Aliment.findByPk(id);
// TODO 404 on not found

    if (!aliment) {
      return {
        status: 404,
      };
    }

    const aliment_json = aliment.toJSON();

    return {
      data: aliment_json
    }
  },
  findList: ({List}) => async ({params}) => {
    // TODO validate params.id
    const {id} = params;

    const list = await List.findByPk(id);
// TODO 404 on not found
    const list_json = list.toJSON();

    return {
      data: list_json
    }
  },
  createAliment: ({Aliment}) => async ({body}) => {
    // TODO validate body
    const {label, description} = body;
    const to_create = {label, description};
    Aliment.create(to_create);
// TODO handle duplicate label

    // TODO return the newly created id
    return {
      data: to_create
    }
  },
  createList: ({List}) => async ({body}) => {
    // TODO validate body
    const {label, description} = body;
    const to_create = {label, description};
    List.create(to_create);
// TODO handle duplicate label

    // TODO return the newly created id
    return {
      data: to_create
    }
  },
  addAlimentToList: ({Aliment, List}) => async ({params}) => {
    // TODO validate listid & alimentid
    const {listid, alimentid} = params;

    const list = await List.findByPk(listid);
    if (!list) {
      return {
        status: 404,
      };
    }

    const aliment = await Aliment.findByPk(alimentid);

    if (!aliment) {
      return {
        status: 404,
      };
    }

    await list.addAliment(aliment);

    return {
      data: ""
    }
  },
  updateAliment: ({Aliment}) => async ({params, body}) => {
    // TODO validate id & body
    const {id} = params;
    const {label, description} = body;
    const to_update = {label, description};

    const aliment = await Aliment.findByPk(id);

    if (!aliment) {
      return {
        status: 404,
      };
    }

// Note: see if it's better to use model.updateOne here
    Object.assign(aliment, to_update);
    await aliment.save();

    return {
      data: ""
    }
  },
  deleteAliment: ({Aliment}) => async ({params}) => {
    // TODO validate id
    const {id} = params;

    // TODO return 404 on non-deleted aliment
    await Aliment.destroy({
      where: {id}
    });

    return {
      data: ""
    }
  },
};

export default services;
  