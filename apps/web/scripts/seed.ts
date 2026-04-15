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
      title: "Free, standards-compliant electronic health records are out of reach for under-resourced clinics",
      description:
        "Clinics in low-income regions and developing countries often track patients on paper or in disconnected spreadsheets. OpenEMR is the most widely deployed open-source EHR, used in clinics and hospitals across 100+ countries, but it needs contributors to improve authentication security, automate provider data entry, and send security notifications so it meets modern compliance standards. Every improvement ships to thousands of real clinics serving millions of patients who have no other option.",
      category: "healthcare",
      repoUrl: "https://github.com/openemr/openemr",
      tags: ["healthcare", "ehr", "hipaa", "rest-api"],
    },
    project: {
      name: "MedRecord",
      slug: "medrecord",
      description:
        "An open-source EHR contribution project built on top of OpenEMR. Focused on hardening authentication, automating provider data entry via the NPI Registry, and improving security compliance so under-resourced clinics worldwide can meet modern standards.",
      repoUrl: "https://github.com/openemr/openemr",
    },
    issues: [
      {
        title: "Build NPI Registry provider lookup module",
        description:
          "Create a TypeScript module that queries the NPPES NPI Registry API to search and retrieve healthcare provider records.\n\nFunction signature:\n```typescript\nlookupProvider(query: { name?: string, npi?: string, state?: string }): Promise<Provider[]>\n```\n\nThe `Provider` interface should normalize the raw NPI response into: `{ id: string, name: string, credential: string, address: string, city: string, state: string, specialty: string, phone: string }`.\n\nRequirements:\n1. Call `https://npiregistry.cms.hhs.gov/api/?version=2.1` with the provided query params\n2. Handle pagination (API returns max 200 per page; implement limit at 50 for now)\n3. Return empty array on 404 or no results\n4. Throw a typed `NpiApiError` on 5xx or malformed JSON\n5. Never return providers with deactivated status\n\nWrite unit tests with 4 fixture cases: found by name, found by NPI, not found, API error. Use `vi.mock` to avoid real HTTP calls.",
        difficulty: "beginner",
      },
      {
        title: "Implement appointment reminder notification service",
        description:
          "Create a module that reads upcoming appointments from the database and sends email reminders to patients.\n\nFunction:\n```typescript\nsendAppointmentReminders(daysAhead: number): Promise<ReminderResult>\n// ReminderResult: { sent: number, failed: number, skipped: number, errors: string[] }\n```\n\nRequirements:\n1. Query appointments where `appointment_date` is within the next `daysAhead` days AND `reminder_sent_at IS NULL`\n2. Send reminder emails via Resend (`RESEND_API_KEY` env var). If not set, log to console instead (dev fallback)\n3. Email subject: `Reminder: Your appointment on [date] at [time]`\n4. After successful send, set `reminder_sent_at = now()` on the appointment row\n5. Retry failed sends up to 3 times with 2s exponential backoff\n6. Idempotency: a second call within the same hour should skip already-reminded appointments\n7. Return a summary of sent, failed, and skipped counts\n\nWrite integration tests using a real test database (not mocks). Cover: normal send, missing email address, already-reminded guard.",
        difficulty: "intermediate",
      },
      {
        title: "Build OAuth 2.0 / SAML authentication adapter",
        description:
          "Implement an authentication adapter that allows clinics to connect their existing identity provider (Azure AD, Okta, Google Workspace) instead of managing local passwords.\n\nArchitecture: strategy pattern with a common interface:\n```typescript\ninterface AuthAdapter {\n  getRedirectUrl(state: string): Promise<string>\n  handleCallback(code: string, state: string): Promise<AuthResult>\n}\n// AuthResult: { userId: string, email: string, name: string, isNewUser: boolean }\n```\n\nImplement two strategies:\n1. `OAuth2Adapter` — standard Authorization Code flow. Config: `{ clientId, clientSecret, authorizationUrl, tokenUrl, userInfoUrl, scopes }`\n2. `SamlAdapter` — SP-initiated SSO. Config: `{ entityId, ssoUrl, certificate, attributeMapping }`\n\nCommon behavior for both:\n- On `handleCallback`: exchange code/assertion for identity, upsert user record in DB (create on first login, update name/email on subsequent), return `AuthResult`\n- Validate `state` param to prevent CSRF\n- Store pending auth state in Redis with 10-minute TTL\n\nFactory function: `createAuthAdapter(config: AdapterConfig): AuthAdapter`\n\nWrite tests for the OAuth 2.0 path using a mock identity provider. Document the SAML config fields with examples.",
        difficulty: "advanced",
      },
    ],
  },
  {
    problem: {
      title: "People managing mental health conditions have no safe space to share experiences with trusted people in their lives",
      description:
        "Mental health affects 1 in 4 people globally, yet most struggle in silence. Clinical resources are scarce and expensive. if-me is a free open-source platform where people share mood journal entries, coping strategies, and experiences not with strangers, but with specific allies they trust — a friend, family member, or therapist. It bridges the gap between therapy sessions and daily life. The platform needs better analytics, crisis-aware content handling, and location-based resource discovery to genuinely help people in their most difficult moments.",
      category: "mental_health",
      repoUrl: "https://github.com/ifmeorg/ifme",
      tags: ["mental-health", "peer-support", "accessibility", "privacy"],
    },
    project: {
      name: "MindBridge",
      slug: "mindbridge",
      description:
        "A contributor toolkit for if-me — the open-source mental health communication platform used worldwide. Issues focus on mood trend analytics, safe-messaging compliance to protect vulnerable users, and crisis resource discovery so no one faces a mental health crisis without knowing help is available.",
      repoUrl: "https://github.com/ifmeorg/ifme",
    },
    issues: [
      {
        title: "Build mood trend aggregation function",
        description:
          "Create a TypeScript function that analyzes a user's mood journal entries over time and returns a structured trend report.\n\n```typescript\nanalyzeMoodTrends(entries: MoodEntry[]): TrendReport\n\n// MoodEntry: { date: string (ISO), mood: 1 | 2 | 3 | 4 | 5, note?: string }\n// TrendReport: {\n//   average: number,\n//   trend: 'improving' | 'declining' | 'stable',\n//   streaks: { best: number, current: number },  // consecutive days with mood >= 4\n//   volatility: number,  // standard deviation of mood scores\n//   weeklyAverages: { week: string, avg: number }[]  // ISO week string\n// }\n```\n\nTrend logic:\n- Compute a 7-day moving average\n- 'improving' if the last MA value is >= 0.3 higher than the first MA value\n- 'declining' if >= 0.3 lower\n- 'stable' otherwise\n- Return `trend: 'stable'` and empty arrays if fewer than 3 entries\n\nWrite unit tests for 5 scenarios: improving trajectory, declining trajectory, stable, single entry, empty input.",
        difficulty: "beginner",
      },
      {
        title: "Implement safe messaging content filter",
        description:
          "Build a module that scans user-submitted text for crisis language and surfaces appropriate resources — without ever blocking the user's ability to post.\n\n```typescript\nscanContent(text: string): SafetyCheckResult\n\n// SafetyCheckResult: {\n//   flagged: boolean,\n//   severity: 'low' | 'medium' | 'high',\n//   matchedPatterns: string[],\n//   suggestedResources: Resource[]\n// }\n// Resource: { name: string, contact: string, url: string, available24h: boolean }\n```\n\nRequirements:\n1. Match against a curated keyword/phrase list for self-harm and crisis language using word-boundary regex (`\\b`). The list should be maintainable (exported constant), not buried in logic.\n2. Severity levels: 'low' = general distress language, 'medium' = explicit self-harm references, 'high' = immediate crisis indicators\n3. Always include these resources for 'medium' and 'high': Crisis Text Line (HOME to 741741), 988 Suicide & Crisis Lifeline, NAMI Helpline (1-800-950-NAMI)\n4. Never modify, censor, or block the original text\n5. Case-insensitive matching\n\nWrite tests for: high-severity match, low-severity match, false positive guard (\"shoot, I forgot\", \"I'm dying laughing\"), clean content returning `flagged: false`.",
        difficulty: "intermediate",
      },
      {
        title: "Create mental health resource geolocation API",
        description:
          "Build an API route that returns nearby mental health resources so users in crisis always know where to turn.\n\n`GET /api/resources?lat=X&lng=Y&type=crisis|therapy|support&radius=25`\n\nData sources (in priority order):\n1. SAMHSA Treatment Locator API (free, no key required) — for `therapy` and `support` types\n2. A seeded `crisis_hotlines` database table (always available offline) — for `crisis` type\n3. Hardcoded national fallbacks — always included regardless of type\n\nResponse:\n```typescript\n{\n  resources: Resource[],  // sorted by distance ascending\n  source: 'live' | 'cached' | 'fallback',\n  fetchedAt: string\n}\n```\n\nCaching:\n- Cache SAMHSA results in Redis for 24 hours keyed by `resources:{lat_2dp}:{lng_2dp}:{type}`\n- On Redis miss or Redis unavailable, fetch live and cache\n- On SAMHSA API error, return cached result or hardcoded fallbacks\n\nRate limit: 20 req/min per IP using the existing `lib/rate-limit.ts` utility.\n\nWrite unit tests covering: cache hit, SAMHSA live fetch, SAMHSA failure with fallback, missing lat/lng (400 error).",
        difficulty: "advanced",
      },
    ],
  },
  {
    problem: {
      title: "Essential item banks distributing diapers and period supplies have no inventory system built for their distribution model",
      description:
        "Human Essentials software serves over 3 million children and period-supply recipients across the US. Unlike traditional food banks, essential item banks track items by pack size, manage partner organization capacity, and run recurring monthly distributions. The existing open-source codebase has real bugs causing data integrity issues and missing features that make it harder for bank staff to serve their communities. Every fix reaches hundreds of organizations distributing essentials to families who can't afford them.",
      category: "social_equity",
      repoUrl: "https://github.com/rubyforgood/human-essentials",
      tags: ["inventory", "nonprofits", "distribution", "community"],
    },
    project: {
      name: "EssentialHub",
      slug: "essentialhub",
      description:
        "Open-source inventory and distribution management for diaper banks, period-supply banks, and other essential item organizations. Contributions directly improve software used by real nonprofits serving millions of children and vulnerable adults across the United States.",
      repoUrl: "https://github.com/rubyforgood/human-essentials",
    },
    issues: [
      {
        title: "Fix email case normalization across all partner records",
        description:
          "Partner emails are stored with inconsistent casing (e.g., 'Alice@Example.COM' vs 'alice@example.com'), which breaks duplicate detection and causes the same organization to appear multiple times in the system.\n\nTwo parts to this fix:\n\n**Part 1 — Migration:**\nWrite a database migration (using Drizzle `migrate`) that lowercases all existing `partner.email` values in place. The migration must be idempotent (safe to run twice).\n\n**Part 2 — Validation:**\nAdd normalization at the input layer so new and updated partner records always save emails in lowercase:\n- In the zod schema for partner creation/update, add `.toLowerCase()` transform on the email field\n- Add a PostgreSQL check constraint as a safety net: `CHECK (email = lower(email))`\n\nWrite tests that confirm:\n1. Submitting 'User@EXAMPLE.com' saves as 'user@example.com'\n2. A uniqueness check correctly identifies 'User@EXAMPLE.com' as a duplicate of an existing 'user@example.com' record\n3. The migration does not error on already-lowercase emails",
        difficulty: "beginner",
      },
      {
        title: "Build distribution analytics React component",
        description:
          "Create a `DistributionTrends` component that helps bank staff visualize item distribution patterns over time.\n\nProps:\n```typescript\ninterface DistributionTrendsProps {\n  orgId: string\n  itemId?: string  // optional: filter to a specific item\n  dateRange: { from: Date, to: Date }\n}\n```\n\nThe component should:\n1. Fetch data from `GET /api/distributions?orgId=X&itemId=Y&from=Z&to=W` — you'll also build this route. It returns `{ week: string, unitsDistributed: number, distributionCount: number }[]`\n2. Render a Recharts `ComposedChart` — bar chart for `unitsDistributed`, line chart on a secondary Y-axis for `distributionCount`\n3. Include a filter bar above the chart: date range picker (use react-day-picker), item type select, partner organization select\n4. Handle loading state (skeleton), empty state ('No distributions in this period'), and error state\n5. All chart elements must have ARIA labels. The chart should be keyboard-navigable.\n\nUse server components for the data fetch wrapper; client component only for the interactive filter bar and chart rendering.",
        difficulty: "intermediate",
      },
      {
        title: "Implement partner demand forecasting module",
        description:
          "Build a TypeScript module that predicts future item requests from a partner organization so banks can proactively stock inventory.\n\n```typescript\nforecastDemand(\n  partnerId: string,\n  itemId: string,\n  horizon: 30 | 60 | 90  // days ahead to forecast\n): Promise<ForecastResult>\n\n// ForecastResult: {\n//   predicted: { month: string, units: number, confidence: 'high' | 'medium' | 'low' }[],\n//   seasonalityDetected: boolean,\n//   dataPointsUsed: number\n// }\n```\n\nAlgorithm:\n1. Fetch monthly distribution totals for the partner+item from the database (last 24 months max)\n2. Apply simple exponential smoothing (α = 0.3): `S_t = α * x_t + (1 - α) * S_{t-1}`\n3. Detect seasonality: if the coefficient of variation across same-month values across years > 0.2, set `seasonalityDetected: true`\n4. Confidence based on data available: 'high' = 12+ months, 'medium' = 6-11, 'low' = under 6\n5. Return one predicted entry per month for the forecast horizon\n\nWrite unit tests for 3 scenarios:\n- Steady demand (should forecast near the historical average)\n- Seasonal pattern with summer spikes\n- Fewer than 6 data points (should return 'low' confidence and still produce a forecast)",
        difficulty: "advanced",
      },
    ],
  },
  {
    problem: {
      title: "Climate tech developers waste months rediscovering tools that already exist, and promising projects die from lack of contributors",
      description:
        "Over 1,000 open-source climate tech projects exist — renewable energy models, biodiversity trackers, carbon accounting tools, water quality monitors. But there is no searchable, maintained directory with health signals, no way to find which projects actively need contributors, and no API for developers to build on top of. The open-sustainable-technology project catalogs these tools in a markdown file, but without code infrastructure, most developers never find it and most projects never get the help they need.",
      category: "sustainability",
      repoUrl: "https://github.com/protontypes/open-sustainable-technology",
      tags: ["climate-tech", "open-source", "developer-tools", "discovery"],
    },
    project: {
      name: "EcoDiscover",
      slug: "ecodiscover",
      description:
        "A searchable API and contributor-matching layer on top of open climate tech project data. Helps developers find climate projects that match their skills and are actively seeking contributors, accelerating the velocity of open-source climate action.",
      repoUrl: "https://github.com/protontypes/open-sustainable-technology",
    },
    issues: [
      {
        title: "Build project metadata completeness validator",
        description:
          "Create a TypeScript function that scores a climate tech project entry for metadata quality.\n\n```typescript\nvalidateProjectMetadata(project: RawProject): ValidationResult\n\n// RawProject: { name?: string, description?: string, repo_url?: string, category?: string, license?: string, [key: string]: unknown }\n// ValidationResult: { valid: boolean, score: number, missing: string[], warnings: string[] }\n```\n\nScoring rules (100 points max):\n- `name` present and non-empty: +20\n- `description` present and length > 50 chars: +20\n- `repo_url` present and matches `https://github.com/*`: +20\n- `category` is from the allowed list (export a `VALID_CATEGORIES` constant): +20\n- `license` is a recognized SPDX identifier (MIT, Apache-2.0, GPL-3.0, AGPL-3.0, BSD-2-Clause, BSD-3-Clause, MPL-2.0): +20\n\nWarnings (reduce score by 10 each, floor at 0):\n- Description is present but under 50 chars\n- repo_url is present but not a GitHub URL\n- License is present but not in the SPDX list\n\n`valid` is `true` if score >= 60.\n\nWrite unit tests for: a perfect entry, a partial entry missing 2 fields, an entry with warnings only, and an empty object.",
        difficulty: "beginner",
      },
      {
        title: "Create searchable climate projects REST API",
        description:
          "Build a Next.js API route that lets developers search and filter the climate tech project database.\n\n`GET /api/climate-projects?q=&category=&language=&minStars=&needsContributors=&limit=20&cursor=`\n\nDatabase table `climate_projects`:\n```sql\nid uuid PK, name text, description text, repo_url text,\ncategory text, primary_language text, stars integer,\nhas_good_first_issues boolean, last_commit_at timestamptz,\ncreated_at timestamptz\n```\n\nQuery behavior:\n1. Full-text search on `name` and `description` using PostgreSQL `to_tsvector('english', name || ' ' || description)` — add a GIN index\n2. Filter by `category` (exact match), `primary_language` (exact match), `minStars` (>=), `needsContributors` (maps to `has_good_first_issues = true`)\n3. Sort: by text rank if `q` is provided, otherwise `stars DESC`\n4. Cursor-based pagination: `cursor` is an opaque base64-encoded `{id, stars}` pair\n5. Response: `{ projects: Project[], total: number, nextCursor: string | null }`\n\nValidate all query params with zod. Return 400 with descriptive error on invalid params.\n\nInclude the Drizzle migration for the `climate_projects` table with proper indexes.",
        difficulty: "intermediate",
      },
      {
        title: "Build automated repository health monitoring pipeline",
        description:
          "Create a pipeline that checks the health of climate tech repos on a daily schedule and updates their status in the database.\n\nFor each project in `climate_projects`, the pipeline should:\n1. Call GitHub API (`/repos/{owner}/{repo}`) to fetch: `stargazers_count`, `pushed_at`, `open_issues_count`\n2. Call GitHub Issues API to count issues labeled `good-first-issue`\n3. Check if a `CONTRIBUTING.md` file exists (`/repos/{owner}/{repo}/contents/CONTRIBUTING.md`)\n\nHealth score (0-100):\n- Activity (0-40): score based on days since last commit. >90 days = 0, 0-7 days = 40, interpolate linearly\n- Maintenance (0-30): issues with responses / total issues (cap at 30). Use `comments` count as proxy.\n- Contributor friendliness (0-30): 15 pts if `good-first-issue` count > 0, 15 pts if CONTRIBUTING.md exists\n\nUpdate `climate_projects` with `{ health_score, stars, has_good_first_issues, last_commit_at, health_checked_at }`.\n\nInfrastructure:\n- Run as a Vercel Cron Job (`/api/cron/health-check`, daily at 02:00 UTC)\n- Protect the route with `CRON_SECRET` header check\n- Rate limit GitHub API calls: max 1 req/sec, exponential backoff on 429\n- Authenticate with `GITHUB_TOKEN` env var (optional — degrades to 60 req/hr unauthenticated)\n\nWrite integration tests with mocked GitHub API responses covering: healthy repo, stale repo, rate limited response, missing repo (404).",
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
  {
    problem: {
      title: "Humanitarian field workers lose critical data when connectivity drops and can't adapt forms for local languages",
      description:
        "ODK Collect is the world's most widely-used mobile data collection platform, deployed by WHO, UNICEF, and thousands of NGOs. Field workers in conflict zones, disaster areas, and remote villages use it to collect health surveys, crop assessments, and aid distribution records — often on 2G or no connectivity. Two persistent gaps block impact at scale: workers only discover form validation errors after syncing (too late to re-collect), and forms can't be easily translated into indigenous or regional languages, shutting out the communities who need services most.",
      category: "humanitarian",
      repoUrl: "https://github.com/getodk/collect",
      tags: ["offline-first", "humanitarian", "data-collection", "localization"],
    },
    project: {
      name: "FieldForm",
      slug: "fieldform",
      description:
        "Open-source tooling extensions for ODK-compatible data collection: an offline constraint validation library, a multilingual form translation toolkit, and a conflict-aware sync engine for unreliable network environments. Used by humanitarian organizations worldwide to collect data that drives resource allocation decisions.",
      repoUrl: "https://github.com/getodk/collect",
    },
    issues: [
      {
        title: "Build offline XForm constraint validation library",
        description:
          "Create a TypeScript library that evaluates XForm constraint expressions locally, without network access, so field workers catch data entry errors immediately.\n\n```typescript\nvalidateConstraint(\n  expression: string,\n  value: unknown,\n  formContext: Record<string, unknown>  // other field values in scope\n): { valid: boolean, message?: string }\n```\n\nImplement evaluation for these XPath functions commonly used in ODK forms:\n- `string-length(expr)` — returns character count\n- `regex(expr, pattern)` — returns boolean\n- `number(expr)` — casts to number\n- `if(condition, then, else)` — ternary\n- `coalesce(a, b)` — returns first non-empty value\n- `selected(field, value)` — true if multi-select field contains value\n- `count-selected(field)` — count of selected values\n\nComparison operators to support: `=`, `!=`, `<`, `<=`, `>`, `>=`, `and`, `or`, `not()`.\n\nParse expressions with a simple recursive descent parser. No external parser libraries.\n\nWrite a test suite with 20 XForm constraint examples: phone number regex, date range check, required-if-other-selected, numeric bounds, string length limits.",
        difficulty: "beginner",
      },
      {
        title: "Create multilingual form translation extraction toolkit",
        description:
          "Build a CLI tool that extracts translatable strings from XLSForm or XForm files and produces a JSON locale file, making it easy to translate humanitarian forms into local languages.\n\nUsage: `npx extract-translations --input form.xlsx --output locales/form.json`\n\nOutput format:\n```typescript\n{\n  formId: string,\n  version: string,\n  strings: {\n    [key: string]: {\n      default: string,      // original English text\n      context: string,      // e.g. 'label for field: patient_age'\n      translations: Record<string, string>  // { 'sw': '...', 'fr': '...' }\n    }\n  }\n}\n```\n\nKey generation: stable hash of `{fieldPath}:{stringType}` where `stringType` is `label`, `hint`, or `constraint_message`. Using a stable key means re-extracting after form edits preserves existing translations for unchanged strings.\n\nMerge mode: if an existing locale file is provided via `--merge existing.json`, preserve `translations` for unchanged strings and flag changed strings with `{ _changed: true, _previous: '...' }`.\n\nSupport both XLSForm (parse with `xlsx` library) and XForm XML input.\n\nWrite tests with a sample XLSForm fixture covering: basic label extraction, hint extraction, merge with unchanged strings, merge with changed strings.",
        difficulty: "intermediate",
      },
      {
        title: "Implement offline-first submission sync engine with conflict resolution",
        description:
          "Build a sync engine that queues form submissions locally when offline and syncs them in order when connectivity is restored, with conflict detection.\n\n```typescript\nclass SubmissionQueue {\n  enqueue(submission: Submission): Promise<void>\n  sync(): Promise<SyncResult>\n  getStatus(): QueueStatus\n}\n\n// Submission: { instanceId: string, formId: string, data: Record<string, unknown>, submittedAt: string }\n// SyncResult: { synced: number, failed: number, conflicts: ConflictRecord[], errors: string[] }\n// QueueStatus: { pending: number, failed: number, lastSyncAt: string | null }\n// ConflictRecord: { instanceId: string, resolution: 'last-write-wins', mergeLog: string }\n```\n\nStorage: persist the queue to IndexedDB (use `idb` library). Queue must survive page reloads.\n\nSync strategy:\n1. Process queue FIFO order\n2. POST each submission to `/api/submissions`\n3. On 409 Conflict (same `instanceId` already exists): resolve via last-write-wins (the local version wins), re-POST with `X-Conflict-Resolution: overwrite`, log the conflict in `ConflictRecord`\n4. On 5xx or network error: retry up to 3 times with exponential backoff (1s, 2s, 4s), then mark as `failed`\n5. On success: remove from queue, update `lastSyncAt`\n\nEvent emitter: emit `queued`, `syncing`, `synced`, `conflict`, `failed` events so UI can show sync status.\n\nWrite unit tests for: queue persistence across simulated page reloads, conflict detection and resolution, partial sync recovery (fails on item 3 of 5, resumes from item 3).",
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
        repoUrl: entry.problem.repoUrl ?? null,
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
        repoUrl: entry.project.repoUrl ?? null,
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
