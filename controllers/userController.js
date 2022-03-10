const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const userController = {
  find: catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'servers',
        select: '-__v -users -createdAt',
      })
      .select('-__v');

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  }),
};

module.exports = userController;
