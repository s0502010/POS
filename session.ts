import session from 'express-session'
import { config } from 'dotenv'

declare module 'express-session' {
  interface SessionData {
user_id: number
table_id: number
}

config()
if (!process.env.SESSION_SECRET) {
  throw new Error('missing SESSION_SECRET in env')
}

export let sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
})
