// Database setup script
// Run this to initialize the database

import { execSync } from "child_process"

console.log("Setting up database...")

try {
  // Generate Prisma client
  console.log("Generating Prisma client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  // Push schema to database (creates tables)
  console.log("Pushing schema to database...")
  execSync("npx prisma db push", { stdio: "inherit" })

  console.log("Database setup complete!")
} catch (error) {
  console.error("Error setting up database:", error)
  process.exit(1)
}
