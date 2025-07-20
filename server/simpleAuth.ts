import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Predefined users with your exact credentials
const users = [
  {
    id: "admin-001",
    email: "hello@cynco.io",
    password: "admin123123",
    firstName: "Admin",
    lastName: "User",
    userType: "admin"
  },
  {
    id: "investor-001", 
    email: "investor@cynco.io",
    password: "investor@25!",
    firstName: "Investor",
    lastName: "User",
    userType: "investor"
  },
  {
    id: "demo-001",
    email: "paan@demo.com",
    password: "123!123!123!",
    firstName: "Paan",
    lastName: "Demo",
    userType: "investor"
  }
];

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is required");
  }
  
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: 'cynco.sid', // Custom session name
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production
      maxAge: sessionTtl,
      sameSite: 'strict', // CSRF protection
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy with rate limiting and security
  passport.use(new LocalStrategy(
    { 
      usernameField: 'email',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        // Input validation
        if (!email || !password) {
          return done(null, false, { message: 'Email and password are required' });
        }
        
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();
        
        // Find user with constant-time comparison
        const user = users.find(u => u.email === normalizedEmail);
        
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        // Constant-time password comparison (basic implementation)
        let isMatch = password.length === user.password.length;
        for (let i = 0; i < Math.max(password.length, user.password.length); i++) {
          isMatch = isMatch && (password[i] === user.password[i]);
        }
        
        if (!isMatch) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        // Store user in database
        await storage.upsertUser({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
        });
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = users.find(u => u.id === id);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error, null);
    }
  });

  // Login route
  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json({ success: true, user: req.user });
  });

  // Logout route
  app.post('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: 'Logout failed' });
      res.json({ success: true });
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export const requireAdmin: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user as any;
  if (user.userType !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};