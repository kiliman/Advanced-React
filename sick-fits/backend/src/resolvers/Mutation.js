const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')

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

  async signout(parent, args, ctx) {
    ctx.response.clearCookie('token')
    return { message: 'Successfully signed out' }
  },

  async requestReset(parent, { email }, ctx, info) {
    // 1. Check if this is a real user
    email = email.toLowerCase()
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) {
      throw new Error(`No such user found for email ${email}`)
    }

    // 2. Set a reset token and expiry on that user
    const randomBytesPromisified = promisify(randomBytes)
    const resetToken = (await randomBytesPromisified(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // 3. Email then that reset token

    return { message: `Password reset link sent to ${email} ${resetToken}` }
  },
  async resetPassword(
    parent,
    { resetToken, password, confirmPassword },
    ctx,
    info,
  ) {
    // 1. Check if the password match
    if (password !== confirmPassword) {
      throw new Error(`Your new passwords don't match. Please try again.`)
    }
    // 2. Check if the reset token exists
    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    })
    if (!user) {
      throw new Error(`Invalid or expired reset token`)
    }
    // 3. Hash their new password
    const hash = await bcrypt.hash(password, 10)

    // 4. Save new password and reset tokens
    const res = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: {
        password: hash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    // 5. Set token
    setToken(ctx, user)

    // 6. Return user
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
