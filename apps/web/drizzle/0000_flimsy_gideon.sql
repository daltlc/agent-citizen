CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"citizen_id" uuid NOT NULL,
	"message" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "citizens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_id" text NOT NULL,
	"username" text NOT NULL,
	"avatar_url" text,
	"citizen_score" integer DEFAULT 0 NOT NULL,
	"bio" text,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"issue_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"citizen_id" uuid NOT NULL,
	"type" text DEFAULT 'code' NOT NULL,
	"external_ref" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"impact_score" integer DEFAULT 0 NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" text DEFAULT 'beginner' NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"created_by" uuid NOT NULL,
	"assigned_to" uuid,
	"assigned_agent_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"tags" text[] DEFAULT '{}',
	"created_by" uuid NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"repo_url" text,
	"visibility" text DEFAULT 'public' NOT NULL,
	"min_citizen_score" integer DEFAULT 0 NOT NULL,
	"owner_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_citizen_id_citizens_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "public"."citizens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_citizen_id_citizens_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "public"."citizens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_created_by_citizens_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."citizens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_assigned_to_citizens_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."citizens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_created_by_citizens_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."citizens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_citizens_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."citizens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "applications_project_id_idx" ON "applications" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "applications_citizen_id_idx" ON "applications" USING btree ("citizen_id");--> statement-breakpoint
CREATE UNIQUE INDEX "citizens_github_id_idx" ON "citizens" USING btree ("github_id");--> statement-breakpoint
CREATE UNIQUE INDEX "citizens_username_idx" ON "citizens" USING btree ("username");--> statement-breakpoint
CREATE INDEX "contributions_citizen_id_idx" ON "contributions" USING btree ("citizen_id");--> statement-breakpoint
CREATE INDEX "contributions_issue_id_idx" ON "contributions" USING btree ("issue_id");--> statement-breakpoint
CREATE INDEX "contributions_project_id_idx" ON "contributions" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "issues_project_status_idx" ON "issues" USING btree ("project_id","status");--> statement-breakpoint
CREATE INDEX "issues_assigned_to_idx" ON "issues" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "problems_category_idx" ON "problems" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "projects_problem_id_idx" ON "projects" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "projects_owner_id_idx" ON "projects" USING btree ("owner_id");