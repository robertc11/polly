export const sessionOptions = {
  password: process.env.SESSION_PASS,
  cookieName: "iron-session/examples/next.js",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
