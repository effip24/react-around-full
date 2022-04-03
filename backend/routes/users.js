const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUser,
  getUsers,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require("../controllers/users");
const { validateUrl } = require("../utils/validateUrl");

router.get("/users/me", getCurrentUser);
router.get("/users", getUsers);
router.get(
  "/users/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24),
    }),
  }),
  getUser,
);

router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2),
    }),
  }),
  updateUser,
);

router.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateUrl),
    }),
  }),
  updateUserAvatar,
);

module.exports = router;
