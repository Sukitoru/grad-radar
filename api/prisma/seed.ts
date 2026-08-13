/**
 * prisma/seed.ts
 *
 * Deterministic seed data for the graduate application tracker.
 *
 * Run:  npx tsx prisma/seed.ts
 *   or: npx prisma db seed   (with the package.json config at the bottom of this file)
 */

import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";
import { DegreeLevel, DecisionStatus } from "../src/generated/prisma/client";
import { prisma } from "../lib/prisma";

// Same data every run. Change or remove for fresh data each time.
faker.seed(20260813);

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CONFIG = {
  users: 50,
  schools: 24,
  programsPerSchool: { min: 2, max: 5 },
  applicationsPerUser: { min: 4, max: 12 },
  // Share of applications that have received a decision.
  decisionRate: 0.7,
} as const;

// Placeholder bcrypt hash. Every seeded user gets the same one so you can log in
// during development. Replace with a real hash of a known password, e.g.:
//   const passwordHash = await bcrypt.hash("password123", 10);
const PASSWORD_HASH = "$2b$10$KIXQ9vJ8Zz1nQ9pYy0m8XeR7hVJqK4bJz9oQmN0dLx2sVpB1uYw3C";

const SCHOOL_NAMES = [
  "Stanford University",
  "Massachusetts Institute of Technology",
  "Carnegie Mellon University",
  "University of California, Berkeley",
  "California Institute of Technology",
  "Princeton University",
  "Cornell University",
  "Columbia University",
  "University of Michigan, Ann Arbor",
  "Georgia Institute of Technology",
  "University of Washington",
  "University of Illinois Urbana-Champaign",
  "University of Texas at Austin",
  "New York University",
  "Johns Hopkins University",
  "Duke University",
  "Northwestern University",
  "Brown University",
  "Rice University",
  "University of Wisconsin-Madison",
  "Purdue University",
  "University of Maryland, College Park",
  "Boston University",
  "University of Pennsylvania",
  "Yale University",
  "University of Chicago",
  "University of Toronto",
  "ETH Zurich",
];

const PROGRAM_NAMES = [
  "Computer Science",
  "Electrical and Computer Engineering",
  "Applied Mathematics",
  "Artificial Intelligence",
  "Data Science",
  "Robotics",
  "Bioinformatics",
  "Human-Computer Interaction",
  "Statistics",
  "Information Systems",
  "Computational Biology",
  "Machine Learning",
];

const RESEARCH_AREAS = [
  "Distributed systems",
  "Programming languages and compilers",
  "Computer vision",
  "Natural language processing",
  "Reinforcement learning",
  "Database systems",
  "Computer architecture",
  "Cryptography and security",
  "Theoretical computer science",
  "Graphics and rendering",
  "Human-computer interaction",
  "Computational neuroscience",
];

const AWARD_NAMES = [
  "Dean's List",
  "NSF Graduate Research Fellowship (honorable mention)",
  "Summa Cum Laude",
  "Undergraduate Research Award",
  "Barry Goldwater Scholarship",
  "Phi Beta Kappa",
  "Best Undergraduate Thesis",
  "ACM Student Research Competition finalist",
  "Departmental Excellence Award",
  "Tau Beta Pi",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalizes to UTC midnight. The @db.Date columns store a calendar date with
 * no time component, so any local-time offset can shift the stored day by one.
 */
function dateOnly(value: Date): Date {
  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
  );
}

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(base: Date, days: number): Date {
  return dateOnly(new Date(base.getTime() + days * 86_400_000));
}

/** GPA that fits Decimal(3, 2). Returned as a string so no float rounding creeps in. */
function randomGpa(): string {
  return faker.number.float({ min: 2.9, max: 4.0, fractionDigits: 2 }).toFixed(2);
}

function randomAwards(): string | null {
  if (faker.datatype.boolean({ probability: 0.35 })) return null;
  return faker.helpers
    .arrayElements(AWARD_NAMES, { min: 1, max: 3 })
    .join("\n");
}

function publicationLinksFor(count: number): string | null {
  if (count === 0) return null;
  return Array.from({ length: count }, () =>
    `https://doi.org/10.${faker.number.int({ min: 1000, max: 9999 })}/${faker.string.alphanumeric(8).toLowerCase()}`,
  ).join("\n");
}

// ---------------------------------------------------------------------------
// Reset
// ---------------------------------------------------------------------------

async function reset() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_SEED_PROD !== "true") {
    throw new Error("Refusing to truncate tables with NODE_ENV=production.");
  }

  // Order matters: Program, School and Term use onDelete: Restrict, so children
  // have to go first.
  await prisma.decision.deleteMany();
  await prisma.application.deleteMany();
  await prisma.program.deleteMany();
  await prisma.school.deleteMany();
  await prisma.term.deleteMany();
  await prisma.user.deleteMany();
}

// ---------------------------------------------------------------------------
// Seeders
// ---------------------------------------------------------------------------

type SeededUser = {
  id: string;
  username: string;
  passwordHash: string;
  defaultGpa: string;
  defaultAwards: string | null;
  defaultPublications: number;
  defaultPublicationLinks: string | null;
};

async function seedUsers(): Promise<SeededUser[]> {
  const usernames = new Set<string>();

  const users: SeededUser[] = Array.from({ length: CONFIG.users }, () => {
    let username = faker.internet.username().toLowerCase().slice(0, 50);
    while (usernames.has(username)) {
      username = `${faker.internet.username().toLowerCase().slice(0, 44)}${faker.number.int({ min: 10, max: 9999 })}`;
    }
    usernames.add(username);

    const defaultPublications = faker.helpers.weightedArrayElement([
      { weight: 5, value: 0 },
      { weight: 3, value: 1 },
      { weight: 2, value: 2 },
      { weight: 1, value: 3 },
    ]);

    return {
      id: randomUUID(),
      username,
      passwordHash: PASSWORD_HASH,
      defaultGpa: randomGpa(),
      defaultAwards: randomAwards(),
      defaultPublications,
      defaultPublicationLinks: publicationLinksFor(defaultPublications),
    };
  });

  await prisma.user.createMany({ data: users });
  return users;
}

type SeededSchool = { id: string; name: string };

async function seedSchools(): Promise<SeededSchool[]> {
  const names = faker.helpers
    .arrayElements(SCHOOL_NAMES, Math.min(CONFIG.schools, SCHOOL_NAMES.length));

  const schools = names.map((name) => ({ id: randomUUID(), name }));
  await prisma.school.createMany({ data: schools });
  return schools;
}

type SeededProgram = { id: string; schoolId: string; degreeLevel: DegreeLevel };

async function seedPrograms(schools: SeededSchool[]): Promise<SeededProgram[]> {
  const programs: Array<SeededProgram & { name: string }> = [];

  for (const school of schools) {
    // @@unique([schoolId, name, degreeLevel]) means the pair has to be unique
    // within a school, so track what has already been used.
    const used = new Set<string>();
    const count = faker.number.int(CONFIG.programsPerSchool);

    for (let i = 0; i < count; i++) {
      const name = faker.helpers.arrayElement(PROGRAM_NAMES);
      const degreeLevel = faker.helpers.weightedArrayElement([
        { weight: 3, value: DegreeLevel.Masters },
        { weight: 2, value: DegreeLevel.Doctoral },
      ]);

      const key = `${name}::${degreeLevel}`;
      if (used.has(key)) continue;
      used.add(key);

      programs.push({ id: randomUUID(), schoolId: school.id, name, degreeLevel });
    }
  }

  await prisma.program.createMany({ data: programs });
  return programs;
}

type SeededTerm = { id: string; startDate: Date };

async function seedTerms(): Promise<SeededTerm[]> {
  const definitions = [
    { name: "Fall", academicYear: 2024, start: utcDate(2024, 8, 26), end: utcDate(2024, 12, 20) },
    { name: "Spring", academicYear: 2025, start: utcDate(2025, 1, 21), end: utcDate(2025, 5, 16) },
    { name: "Fall", academicYear: 2025, start: utcDate(2025, 8, 25), end: utcDate(2025, 12, 19) },
    { name: "Spring", academicYear: 2026, start: utcDate(2026, 1, 20), end: utcDate(2026, 5, 15) },
    { name: "Fall", academicYear: 2026, start: utcDate(2026, 8, 24), end: utcDate(2026, 12, 18) },
    { name: "Spring", academicYear: 2027, start: utcDate(2027, 1, 19), end: utcDate(2027, 5, 14) },
  ];

  const terms = definitions.map((t) => ({
    id: randomUUID(),
    name: t.name,
    academicYear: t.academicYear,
    startDate: t.start,
    endDate: t.end,
  }));

  await prisma.term.createMany({ data: terms });
  return terms.map((t) => ({ id: t.id, startDate: t.startDate }));
}

async function seedApplicationsAndDecisions(
  users: SeededUser[],
  programs: SeededProgram[],
  terms: SeededTerm[],
) {
  const today = dateOnly(new Date());
  const applications: any[] = [];
  const decisions: any[] = [];

  for (const user of users) {
    const count = faker.number.int(CONFIG.applicationsPerUser);
    // One application per program/term pair per user keeps the data sane even
    // though the schema does not enforce it.
    const used = new Set<string>();

    for (let i = 0; i < count; i++) {
      const program = faker.helpers.arrayElement(programs);
      const term = faker.helpers.arrayElement(terms);

      const key = `${program.id}::${term.id}`;
      if (used.has(key)) continue;
      used.add(key);

      // Applications go out roughly 8 to 12 months before the term starts.
      const submissionDate = addDays(
        term.startDate,
        -faker.number.int({ min: 240, max: 360 }),
      );
      if (submissionDate > today) continue;

      const publications = faker.datatype.boolean({ probability: 0.6 })
        ? user.defaultPublications
        : faker.number.int({ min: 0, max: 4 });

      const applicationId = randomUUID();

      applications.push({
        id: applicationId,
        userId: user.id,
        // programs.schoolId is the source of truth so the denormalized
        // schoolId on Application always agrees with the program.
        schoolId: program.schoolId,
        programId: program.id,
        termId: term.id,
        gpa: faker.datatype.boolean({ probability: 0.85 }) ? user.defaultGpa : randomGpa(),
        researchArea: faker.helpers.arrayElement(RESEARCH_AREAS),
        awards: faker.datatype.boolean({ probability: 0.7 })
          ? user.defaultAwards
          : randomAwards(),
        publications,
        publicationLinks: publicationLinksFor(publications),
        comments: faker.datatype.boolean({ probability: 0.4 })
          ? faker.lorem.sentence({ min: 8, max: 20 })
          : null,
        submissionDate,
      });

      // Decisions land 45 to 150 days after submission, and never in the future.
      const decisionDate = addDays(submissionDate, faker.number.int({ min: 45, max: 150 }));
      if (decisionDate > today) continue;
      if (!faker.datatype.boolean({ probability: CONFIG.decisionRate })) continue;

      decisions.push({
        id: randomUUID(),
        applicationId,
        status: faker.helpers.weightedArrayElement([
          { weight: 55, value: DecisionStatus.REJECTED },
          { weight: 30, value: DecisionStatus.ACCEPTED },
          { weight: 15, value: DecisionStatus.WAITLISTED },
        ]),
        decisionDate,
      });
    }
  }

  await prisma.application.createMany({ data: applications });
  await prisma.decision.createMany({ data: decisions });

  return { applications: applications.length, decisions: decisions.length };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.time("seed");
  await reset();

  const users = await seedUsers();
  const schools = await seedSchools();
  const programs = await seedPrograms(schools);
  const terms = await seedTerms();
  const counts = await seedApplicationsAndDecisions(users, programs, terms);

  console.table({
    users: users.length,
    schools: schools.length,
    programs: programs.length,
    terms: terms.length,
    applications: counts.applications,
    decisions: counts.decisions,
  });
  console.timeEnd("seed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/*
Install:
  npm i -D @faker-js/faker tsx

package.json:
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
*/
