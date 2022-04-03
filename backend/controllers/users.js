const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require("bcryptjs"); // importing bcrypt
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user was found with the given id");
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user was found with the given id");
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("Email already exists");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(200).send({
          name: user.name, about: user.about, avatar: user.avatar, email: user.email,
        }))
        .catch(next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // we're creating a token
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" },
      );

      res.send({ token });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user was found with the given id");
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user was found with the given id");
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};
