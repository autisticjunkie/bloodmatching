# LifeLink

Setup and installation guide.

## Requirements

- Node.js 18 or later
- npm (bundled with Node.js)

Check what you have:

```bash
node --version
npm --version
```

## 1. Clone and install

```bash
git clone https://github.com/autisticjunkie/bloodmatching.git
cd bloodmatching
npm install
```

## 2. Create the environment file

```bash
cp .env.example .env
```

Open `.env` and set your own session secret:

```
DATABASE_URL="file:./dev.db"
SESSION_SECRET="replace-this-with-a-long-random-string"
```

Any long random string works for local use. To generate one:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Set up the database

```bash
npm run db:push
npm run db:seed
```

The first command creates the database tables. The second loads sample donors,
requesters and blood requests so there is data to work with.

## 4. Start the application

```bash
npm run dev
```

Open <http://localhost:3000> in your browser.

## Sign in

The seed data creates these accounts. All use the password `password123`:

| Role | Email |
|---|---|
| Administrator | `admin@lifelink.com` |
| Donor | `john.donor@email.com` |

## Available commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Serve the production build (run `npm run build` first) |
| `npm run db:push` | Create or update the database tables |
| `npm run db:seed` | Load sample data |
| `npm run db:studio` | Open a browser tool to inspect the database |

## Troubleshooting

**Port 3000 is already in use**

```bash
npm run dev -- -p 3001
```

**Database errors, or you want to start over**

Delete the database file and rebuild it:

```bash
rm dev.db
npm run db:push
npm run db:seed
```

**`@prisma/client did not initialize yet`**

```bash
npx prisma generate
```

**Changes to the database schema are not showing up**

Run `npm run db:push` again after editing `prisma/schema.prisma`.
