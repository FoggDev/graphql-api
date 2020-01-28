export default {
  Query: {
    getPosts: (_, { options: { orderBy, direction = 'ASC', limit, offset } }, { models }) => {
      const args = {
        include: [{
          model: models.Tag,
          as: 'tags'
        }]
      }

      if (orderBy && direction) {
        args.order = [[orderBy, direction]]
      }

      if (limit) {
        args.limit = Number(limit)
      }

      if (offset) {
        args.offset = Number(offset)
      }

      return models.Post.findAll(args)
    },
    getPostById: (_, { id }, { models }) => {
      return models.Post.findByPk(id)
    }
  },
  Mutation: {
    createPost: (_, { input }, { models }) => {
      return models.Post.create({ ...input }, {
        include: [{
          model: models.Tag,
          as: 'tags'
        }]
      })
    }
  }
}
