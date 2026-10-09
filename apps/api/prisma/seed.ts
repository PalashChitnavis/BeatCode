import { PrismaClient } from "@prisma/client";
import { problems } from "./problems/catalog";
import { buildProblem } from "./problems/build";

const prisma = new PrismaClient();

async function main() {
  for (const def of problems) {
    const { problem, languages, testCases } = buildProblem(def);
    await prisma.$transaction(async (tx) => {
      const { id } = await tx.problem.upsert({
        where: { slug: problem.slug },
        create: problem,
        update: problem,
      });
      await tx.problemLanguage.deleteMany({ where: { problemId: id } });
      await tx.testCase.deleteMany({ where: { problemId: id } });
      await tx.problemLanguage.createMany({ data: languages.map((l) => ({ ...l, problemId: id })) });
      await tx.testCase.createMany({ data: testCases.map((t) => ({ ...t, problemId: id })) });
    });
    console.log(`seeded ${problem.number}. ${problem.title} (${testCases.length} tests)`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
