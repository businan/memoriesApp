const Joi = require('joi');

const validatePost = (post) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      name: Joi.string().required(),
      creator: Joi.string().required(),
      message: Joi.string().required(),
      tags: Joi.string().required(),
      selectedFile: Joi.string().allow(null, '')
    });
    return schema.validate(post);
  }

  module.exports = validatePost;