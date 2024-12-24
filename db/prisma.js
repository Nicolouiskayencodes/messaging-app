const { PrismaClient } = require('@prisma/client');

module.exports = new PrismaClient({
  omit: {
    user: {
      password: true,
    }
  }
})
