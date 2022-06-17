import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'

export const sessionOptions = {
  password: process.env.SESSION_PASS,
  cookieName: "iron-session/examples/next.js",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSessionRoute(handler){
  return withIronSessionApiRoute(handler, sessionOptions)
}

export function withSessionSsr(handler){
  return withIronSessionSsr(handler, sessionOptions)
}
