import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../src/lib/db/schema";

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client, { schema });

const SEED_DATA = [
  {
    problem: {
      title: "Community water quality data is scattered and inaccessible",
      description:
        "Millions of people rely on local water sources without knowing if they're safe. Water quality data exists across EPA databases, local utilities, and NGO reports.but it's fragmented, inconsistent, and nearly impossible for a regular person to use. Communities near industrial sites, aging infrastructure, or agricultural runoff have no simple way to check contamination risks. We need open-source tools that aggregate public water quality data and make it understandable at the neighborhood level.",
      category: "clean_water",
      tags: ["data-aggregation", "public-health", "geospatial", "api"],
    },
    project: {
      name: "AquaWatch",
      slug: "aquawatch",
      description:
        "An open-source dashboard and API that aggregates public water quality data from EPA, local utilities, and volunteer monitoring networks. Displays contamination risks on an interactive map at the ZIP code level.",
    },
    issues: [
      {
        title: "Build EPA water quality data ingestion pipeline",
        description:
          "Create a data pipeline that fetches water quality reports from the EPA ECHO API (https://echo.epa.gov/). The pipeline should:\n\n1. Fetch facility-level discharge and compliance data for a given state\n2. Parse and normalize the response into a standard schema (facility name, lat/lng, contaminant type, violation status, date)\n3. Store results in a PostgreSQL table\n4. Handle pagination and rate limiting\n5. Include error handling for API downtime\n\nUse TypeScript. Write it as a standalone module that can be imported and called with a state code parameter.",
        difficulty: "intermediate",
      },
      {
        title: "Create ZIP code risk score calculator",
        description:
          "Write a function that calculates a water quality risk score (0-100) for a given ZIP code based on nearby facility violations. Input: ZIP code string. Output: { score: number, factors: string[], nearbyViolations: number }.\n\nThe score should factor in:\n- Number of facilities with active violations within 10 miles\n- Severity of violations (significant vs. minor)\n- Recency of violations (last 12 months weighted higher)\n\nUse the Haversine formula for distance calculations. Write unit tests with at least 3 test cases.",
        difficulty: "beginner",
      },
      {
        title: "Design the contamination map React component",
        description:
          "Build a React component that renders an interactive map showing water quality risk by ZIP code. Requirements:\n\n1. Use Mapbox GL JS or Leaflet (open-source preferred)\n2. Color-code regions: green (0-30 score), yellow (31-60), red (61-100)\n3. Click a region to see detailed risk factors\n4. Include a search bar for ZIP code lookup\n5. Mobile-responsive\n6. Server-side render the initial state, hydrate on client\n\nThe component should accept risk data as props.don't worry about data fetching, just the visualization.",
        difficulty: "advanced",
      },
    ],
  },
  {
    problem: {
      title: "Food banks waste surplus while nearby shelters go without",
      description:
        "Food banks across the US receive unpredictable donations. Some days they're overwhelmed with perishable goods, other days shelves are bare. Meanwhile, nearby shelters, soup kitchens, and community fridges may have the opposite problem. The coordination happens via phone calls and spreadsheets, leading to food waste on one end and hunger on the other. A real-time inventory and matching system could dramatically reduce waste and improve distribution to where it's needed most.",
      category: "food_security",
      tags: ["logistics", "matching-algorithm", "real-time", "nonprofits"],
    },
    project: {
      name: "FeedForward",
      slug: "feedforward",
      description:
        "A real-time inventory and matching platform for food banks, shelters, and community organizations. Organizations post surplus or needs, and the system suggests optimal redistribution routes based on proximity, expiration dates, and capacity.",
    },
    issues: [
      {
        title: "Build the surplus/need matching algorithm",
        description:
          "Implement a matching algorithm that pairs food surplus postings with nearby organizations that need them. The algorithm should:\n\n1. Accept a list of surplus items (type, quantity, expiration date, location) and a list of needs (type, quantity needed, location, capacity)\n2. Score matches based on: distance (closer = better), expiration urgency (sooner = higher priority), quantity fit (minimize partial matches)\n3. Return ranked match suggestions with a confidence score\n4. Handle edge cases: no matches available, expired items, over-capacity\n\nInput/output should be typed TypeScript interfaces. Include unit tests for the scoring logic.",
        difficulty: "intermediate",
      },
      {
        title: "Create organization onboarding form with validation",
        description:
          "Build a multi-step form for organizations to register on the platform. Steps:\n\n1. Organization info: name, type (food bank / shelter / community fridge / other), address\n2. Capacity details: storage type (refrigerated / dry / frozen), max capacity in lbs\n3. Operating hours and contact info\n4. Review and submit\n\nUse React with zod validation at each step. Address should be geocoded to lat/lng on submit (use a free geocoding API). The form should save progress between steps (not lose data on back navigation). Use server components where possible, client components only for interactive steps.",
        difficulty: "beginner",
      },
      {
        title: "Build real-time inventory webhook receiver",
        description:
          "Create a Next.js API route that receives inventory update webhooks from partner organizations. Requirements:\n\n1. POST /api/webhooks/inventory accepts JSON payloads with: org_id, items (array of {name, category, quantity, unit, expiration_date}), timestamp\n2. Validate payload with zod.reject malformed requests with 400\n3. Verify webhook signature using HMAC-SHA256 (secret per org)\n4. Upsert inventory records in the database\n5. Trigger matching algorithm for new surplus items\n6. Return 200 with processed item count\n\nInclude rate limiting (max 60 requests/minute per org). Write integration tests.",
        difficulty: "advanced",
      },
    ],
  },
  {
    problem: {
      title: "Individuals have no easy way to measure their carbon footprint",
      description:
        "Most people want to reduce their environmental impact but have no idea where to start. Carbon footprint calculators exist, but they're either oversimplified (just flights), locked behind corporate paywalls, or require manual data entry that nobody maintains. There's no open, programmatic way to estimate carbon impact from everyday activities like commuting, diet, energy use, and purchases. An open API and toolkit would let developers build carbon awareness into any app.",
      category: "climate",
      tags: ["api", "open-source", "carbon-emissions", "developer-tools"],
    },
    project: {
      name: "CarbonLens",
      slug: "carbonlens",
      description:
        "An open-source REST API and SDK that calculates carbon footprint estimates for common activities. Developers can integrate carbon awareness into any application. Ride-sharing apps can show trip emissions, meal planners can compare dietary impact, and personal finance apps can estimate purchase footprints.",
    },
    issues: [
      {
        title: "Implement transportation emissions calculator module",
        description:
          "Create a TypeScript module that estimates CO2 emissions for transportation. The module should export a function:\n\n```typescript\ncalculateTransportEmissions(input: { mode: TransportMode, distanceKm: number, passengers?: number }): { co2Kg: number, comparison: string }\n```\n\nSupported modes: car_gas, car_electric, car_hybrid, bus, train, subway, bicycle, walking, plane_domestic, plane_international\n\nEmission factors should be based on EPA and DEFRA published data (hardcode reasonable defaults with source comments). The `comparison` field should return a human-readable string like \"equivalent to charging 45 smartphones\".\n\nInclude unit tests covering all transport modes and edge cases (0 distance, negative values).",
        difficulty: "beginner",
      },
      {
        title: "Build the REST API with rate limiting and API keys",
        description:
          "Create Next.js API routes for the CarbonLens public API:\n\n1. POST /api/v1/calculate/transport.accepts transport parameters, returns emissions\n2. POST /api/v1/calculate/energy.accepts energy usage (kWh, fuel type), returns emissions\n3. POST /api/v1/calculate/diet.accepts meal description or diet type, returns daily/annual emissions\n4. GET /api/v1/factors.returns all emission factors with sources\n\nRequirements:\n- API key authentication via x-api-key header\n- Rate limiting: 100 requests/hour for free tier\n- Consistent error response format: { error: string, code: string }\n- OpenAPI/Swagger documentation comments\n- Input validation with zod on all endpoints\n\nStore API keys and usage counts in the database.",
        difficulty: "advanced",
      },
      {
        title: "Create an interactive emissions comparison widget",
        description:
          "Build a React component that lets users compare the carbon footprint of two activities side by side. For example: \"Driving 20 miles vs. Taking the train 20 miles\".\n\n1. Two input panels.each with activity type selector and parameters\n2. Real-time calculation as inputs change (debounced)\n3. Visual bar chart comparison showing CO2 in kg\n4. \"Did you know?\" fact based on the difference (e.g., \"Switching to train for this trip saves X kg CO2/year if done daily\")\n5. Share button that generates a URL with encoded parameters\n\nUse the calculator modules internally (don't call the API). Make it accessible (ARIA labels, keyboard navigation).",
        difficulty: "intermediate",
      },
    ],
  },
  {
    problem: {
      title: "Educational content is inaccessible to learners with disabilities",
      description:
        "Open educational resources (OER).textbooks, course materials, tutorials.are overwhelmingly published as PDFs or web pages that don't meet accessibility standards. Screen readers struggle with complex layouts, math notation is rarely tagged properly, and content isn't available in simplified language for cognitive disabilities or in multiple languages for ESL learners. Automated tooling could convert and enhance existing educational content to meet WCAG standards and reach millions of underserved learners.",
      category: "education",
      tags: ["accessibility", "wcag", "content-conversion", "nlp"],
    },
    project: {
      name: "LearnForAll",
      slug: "learnforall",
      description:
        "A toolkit that analyzes educational content for accessibility issues and automatically generates enhanced versions: proper heading structure, alt text suggestions, math notation in MathML, simplified language alternatives, and screen-reader-optimized layouts.",
    },
    issues: [
      {
        title: "Build HTML accessibility audit module",
        description:
          "Create a TypeScript module that audits an HTML string for educational content accessibility issues. The function should:\n\n```typescript\nauditAccessibility(html: string): AuditResult\n```\n\nCheck for:\n- Missing or empty alt text on images\n- Improper heading hierarchy (h1 -> h3 skipping h2)\n- Missing lang attribute\n- Low contrast text (parse inline styles)\n- Images of text (detect common patterns)\n- Missing table headers\n- Links with non-descriptive text (\"click here\", \"read more\")\n\nReturn structured results: { score: number (0-100), issues: Array<{ rule: string, severity: 'error'|'warning', element: string, suggestion: string }> }\n\nInclude tests with sample HTML containing various accessibility issues.",
        difficulty: "beginner",
      },
      {
        title: "Implement automatic alt text suggestion engine",
        description:
          "Build a module that suggests alt text for images in educational content. Since we can't run image recognition locally, focus on context-based suggestions:\n\n1. Parse surrounding text (caption, paragraph, figure element) to infer image purpose\n2. Detect common educational image patterns from filenames and paths (diagram, chart, graph, equation, photo)\n3. Generate descriptive alt text templates: \"[Type] showing [inferred subject].[context from surrounding text]\"\n4. Flag images that likely need human review (complex diagrams, photos)\n5. Handle decorative images (suggest empty alt=\"\")\n\nInput: HTML string. Output: Array<{ imgSrc: string, currentAlt: string, suggestedAlt: string, confidence: number, needsReview: boolean }>\n\nWrite tests with realistic educational HTML samples.",
        difficulty: "intermediate",
      },
      {
        title: "Create WCAG-compliant content transformer",
        description:
          "Build a pipeline that transforms raw educational HTML into WCAG 2.1 AA compliant output. The transformer should:\n\n1. Fix heading hierarchy (re-level headings to be sequential)\n2. Add ARIA landmarks (navigation, main, complementary) to common page structures\n3. Convert data tables to have proper th/scope attributes\n4. Add skip navigation links\n5. Ensure all interactive elements are keyboard accessible (add tabindex where needed)\n6. Convert inline styles to semantic HTML where possible (bold -> strong, italic -> em)\n7. Add language attributes based on content detection\n\nThe pipeline should be composable.each transform is a separate function that can be used independently or chained. Input and output are HTML strings. Preserve original content while enhancing structure.\n\nWrite comprehensive tests for each transformer.",
        difficulty: "advanced",
      },
    ],
  },
  {
    problem: {
      title: "Disaster response volunteers lack real-time coordination tools",
      description:
        "When disasters strike.wildfires, hurricanes, floods.volunteer response is chaotic. Volunteers self-organize on social media, duplicating effort in some areas while neglecting others. Supply donations pile up at drop-off points with no visibility into what's actually needed where. Professional responders (FEMA, Red Cross) have coordination tools, but grassroots volunteers are left with group chats and Google Docs. An open-source coordination platform could help volunteers self-organize effectively during the critical first 72 hours.",
      category: "disaster_response",
      tags: ["real-time", "geolocation", "coordination", "crisis-response"],
    },
    project: {
      name: "FirstHours",
      slug: "firsthours",
      description:
        "An open-source coordination platform for disaster response volunteers. During the critical first 72 hours after a disaster, FirstHours helps volunteers see where help is needed, what supplies are available, and how to avoid duplicating effort, all without requiring accounts or complex onboarding.",
    },
    issues: [
      {
        title: "Build the needs/offers board data model and API",
        description:
          "Create the data model and API routes for a real-time needs/offers board. Community members post what they need (shelter, water, medical, transport, labor) or what they can offer.\n\nData model:\n- Post: { id, type: 'need'|'offer', category, description, location: {lat, lng, address}, contact, status: 'active'|'matched'|'resolved', urgency: 'critical'|'high'|'medium'|'low', createdAt, expiresAt }\n- Match: { id, needId, offerId, status: 'proposed'|'confirmed'|'completed', createdAt }\n\nAPI routes:\n1. POST /api/posts.create a need or offer (no auth required.disaster context)\n2. GET /api/posts?type=need&category=shelter&lat=X&lng=Y&radiusKm=Z.filter and search\n3. PATCH /api/posts/:id.update status\n4. POST /api/matches.propose a match between a need and offer\n\nValidate all inputs with zod. Include geospatial filtering (Haversine distance). No authentication required.speed over security in crisis contexts.",
        difficulty: "intermediate",
      },
      {
        title: "Create the volunteer check-in system",
        description:
          "Build a lightweight check-in system so volunteers can register their availability without creating an account. Requirements:\n\n1. Simple form: name, phone/email (optional), skills (checkboxes: medical, construction, cooking, transport, childcare, general labor), available hours, current location\n2. Generate a unique check-in code (6 chars, alphanumeric).volunteers use this to update their status later\n3. GET /api/volunteers?skill=medical&lat=X&lng=Y&radiusKm=Z.find available volunteers by skill and location\n4. PATCH /api/volunteers/:code.update availability or check out\n5. Auto-expire check-ins after 12 hours (mark as inactive)\n\nDesign for speed.the form should work on slow 3G connections and low-end phones. Minimal JavaScript, progressive enhancement. Use server components and form actions.",
        difficulty: "beginner",
      },
      {
        title: "Build real-time coordination map with live updates",
        description:
          "Create a map interface that shows all active needs, offers, and volunteers in real-time. Requirements:\n\n1. Map centered on disaster area with clustered markers\n2. Color-coded pins: red (critical needs), orange (high needs), blue (offers), green (volunteers)\n3. Filter panel: by category, urgency, type\n4. Click marker to see details and take action (offer help, confirm match)\n5. Live updates.new posts appear without page refresh (use Server-Sent Events or polling with 30s interval)\n6. Offline-capable: cache last known state in localStorage, show stale data warning when offline\n7. Works on mobile.touch-friendly, minimal UI chrome\n\nUse Leaflet (no API key required) with OpenStreetMap tiles. The map should be usable within 3 seconds on a 3G connection.lazy load non-critical UI.",
        difficulty: "advanced",
      },
    ],
  },
];

async function seed() {
  console.log("Seeding Citizen database...\n");

  // First, check if a citizen exists to own the seed data.
  // If not, create a system citizen for seeding purposes.
  const existingCitizens = await db
    .select()
    .from(schema.citizens)
    .limit(1);

  let ownerId: string;

  if (existingCitizens.length > 0) {
    ownerId = existingCitizens[0].id;
    console.log(`Using existing citizen: ${existingCitizens[0].username} (${ownerId})`);
  } else {
    const [systemCitizen] = await db
      .insert(schema.citizens)
      .values({
        githubId: "system",
        username: "citizen-team",
        avatarUrl: null,
        bio: "The Citizen platform team. We seed starter problems for the community.",
      })
      .returning();
    ownerId = systemCitizen.id;
    console.log(`Created system citizen: citizen-team (${ownerId})`);
  }

  for (const entry of SEED_DATA) {
    // Create problem
    const [problem] = await db
      .insert(schema.problems)
      .values({
        title: entry.problem.title,
        description: entry.problem.description,
        category: entry.problem.category,
        tags: entry.problem.tags,
        createdBy: ownerId,
        verified: true,
      })
      .returning();
    console.log(`\n  Problem: ${problem.title}`);

    // Create project
    const [project] = await db
      .insert(schema.projects)
      .values({
        problemId: problem.id,
        name: entry.project.name,
        slug: entry.project.slug,
        description: entry.project.description,
        ownerId: ownerId,
      })
      .returning();
    console.log(`  Project: ${project.name} (/${project.slug})`);

    // Create issues
    for (const issue of entry.issues) {
      const [created] = await db
        .insert(schema.issues)
        .values({
          projectId: project.id,
          title: issue.title,
          description: issue.description,
          difficulty: issue.difficulty,
          createdBy: ownerId,
        })
        .returning();
      console.log(`    Issue [${created.difficulty}]: ${created.title}`);
    }
  }

  console.log("\n  Seed complete! Created:");
  console.log(`  - ${SEED_DATA.length} problems`);
  console.log(`  - ${SEED_DATA.length} projects`);
  console.log(`  - ${SEED_DATA.reduce((sum, e) => sum + e.issues.length, 0)} issues`);

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
