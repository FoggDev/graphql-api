export default {
  Query: {
    getPostsCount: (_, args, { models }) => {
      return models.Post.count().then(count => ({
        count
      }))
    },
    getPosts: (_, { options = {} }, { models }) => {
      const {
        orderBy = 'createdAt',
        direction = 'DESC',
        limit = false,
        offset = false
      } = options

      const args = {
        order: [[orderBy, direction]],
        include: [{
          model: models.Tag,
          as: 'tags'
        }]
      }

      if (limit > 0) {
        args.limit = limit
      }

      if (offset > 0) {
        args.offset = offset
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
