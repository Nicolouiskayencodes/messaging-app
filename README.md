# passport-prisma-template

Template for authenticating users 
npm init -y
npm install express express-session passport passport-local bcryptjs ejs @prisma/client @quixo3/prisma-session-store
npm install dotenv prisma --save-dev

npx prisma init

add DATABASE_URL and SECRET to .env

model Session {
  id        String   @id
  sid       String   @unique
  data      String   @db.MediumText  // MediumText may be needed for MySql
  expiresAt   DateTime
}

model Users {
  id    Int     @id @default(autoincrement())
  username String @unique
  password String
}

npx prisma generate

npx prisma migrate dev --name init