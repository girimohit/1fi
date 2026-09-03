import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});

// import { definePrismaConfig } from "prisma/config";
// import 'dotenv/config';
// import { env } from "process"; 

// export default definePrismaConfig({
//   schema: "prisma/schema.prisma",
//   skills: {
//     agents: ["claude", "cursor", "agents", "devin"],
//   },
//   datasource: {
//     url: env('DATABASE_URL')
//   },
//   migrations: {
//     path: 'prisma/migrations',
//   },
// });