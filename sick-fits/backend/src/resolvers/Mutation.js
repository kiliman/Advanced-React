const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Mutations = {
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
        },
      },
      info,
    )
    return item
  },
  async updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args }
    // remove the ID from the updates
    delete updates.id

    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: { id: args.id },
      },
      info,
    )
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id }
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{id, title}`)
    // 2. check if they own that item, or have the permissions
    // TODO
    // 3. delete it
    return ctx.db.mutation.deleteItem({ where }, info)
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase()
    // hash their password
    const hash = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password: hash,
          permissions: { set: ['USER'] },
        },
      },
      info,
    )
    setToken(ctx, user)
    return user
  },

  async signin(parent, { email, password }, ctx) {
    email = email.toLowerCase()
    // hash their password
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) {
      throw new Error(`No such user found for email ${email}`)
    }
    // compare signin hash with stored hash
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid email or password')
    }
    setToken(ctx, user)

    return user
  },
}

const setToken = (ctx, user) => {
  // create JWT token
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
  // set the cookie
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  })
}

module.exports = Mutations
