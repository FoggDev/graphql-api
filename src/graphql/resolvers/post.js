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
      return models.Post.findByPk(id, {
        include: [{
          model: models.Tag,
          as: 'tags'
        }]
      })
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
    },
    updatePost: async (_, { id, input }, { models }) => {
      const {
        title,
        slug,
        content,
        readingTime,
        language,
        published,
        tags
      } = input

      // Finding post
      const post = await models.Post.findOne({ where: { id } })
      let newTags = []

      // If the post does not exists we throw an error
      if (!post) {
        throw Error(`Post not updated (id: ${id})`)
      }

      // Updating the post with new data
      post.title = title
      post.slug = slug
      post.content = content
      post.readingTime = readingTime
      post.language = language
      post.published = published
      post.tags = tags

      // Removing all existing tags
      await models.Tag.destroy({
        where: {
          postId: id
        }
      })

      // If we have new tags we re-inserted them
      if (tags.length > 0) {
        newTags = tags.map(({ name }) => ({
          postId: id,
          name
        }))

        await models.Tag.bulkCreate(newTags)
      }

      await post.save()

      return post
    }
  }
}
