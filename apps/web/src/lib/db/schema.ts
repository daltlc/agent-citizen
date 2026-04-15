import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const citizens = pgTable(
  "citizens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    githubId: text("github_id").notNull(),
    username: text("username").notNull(),
    avatarUrl: text("avatar_url"),
    citizenScore: integer("citizen_score").default(0).notNull(),
    bio: text("bio"),
    cliInstalledAt: timestamp("cli_installed_at", { withTimezone: true }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("citizens_github_id_idx").on(table.githubId),
    uniqueIndex("citizens_username_idx").on(table.username),
  ]
);

export const problems = pgTable(
  "problems",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    repoUrl: text("repo_url"),
    tags: text("tags").array().default([]),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => citizens.id),
    verified: boolean("verified").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("problems_category_idx").on(table.category)]
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    repoUrl: text("repo_url"),
    visibility: text("visibility").default("public").notNull(),
    minCitizenScore: integer("min_citizen_score").default(0).notNull(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => citizens.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("projects_slug_idx").on(table.slug),
    index("projects_problem_id_idx").on(table.problemId),
    index("projects_owner_id_idx").on(table.ownerId),
  ]
);

export const issues = pgTable(
  "issues",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    difficulty: text("difficulty").default("beginner").notNull(),
    status: text("status").default("open").notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => citizens.id),
    assignedTo: uuid("assigned_to").references(() => citizens.id),
    assignedAgentName: text("assigned_agent_name"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("issues_project_status_idx").on(table.projectId, table.status),
    index("issues_assigned_to_idx").on(table.assignedTo),
  ]
);

export const contributions = pgTable(
  "contributions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    issueId: uuid("issue_id")
      .notNull()
      .references(() => issues.id),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    citizenId: uuid("citizen_id")
      .notNull()
      .references(() => citizens.id),
    type: text("type").default("code").notNull(),
    externalRef: text("external_ref").notNull(),
    status: text("status").default("pending").notNull(),
    impactScore: integer("impact_score").default(0).notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (table) => [
    index("contributions_citizen_id_idx").on(table.citizenId),
    index("contributions_issue_id_idx").on(table.issueId),
    index("contributions_project_id_idx").on(table.projectId),
  ]
);

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    citizenId: uuid("citizen_id")
      .notNull()
      .references(() => citizens.id),
    key: text("key").notNull(),
    name: text("name").notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("api_keys_key_idx").on(table.key),
    index("api_keys_citizen_id_idx").on(table.citizenId),
  ]
);

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    citizenId: uuid("citizen_id")
      .notNull()
      .references(() => citizens.id),
    message: text("message"),
    status: text("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("applications_project_id_idx").on(table.projectId),
    index("applications_citizen_id_idx").on(table.citizenId),
  ]
);
