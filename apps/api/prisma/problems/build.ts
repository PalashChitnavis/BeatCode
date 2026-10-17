import { LANGUAGES } from "@beatcode/shared";
import { driverCode, formatDisplay, formatStdin, starterCode } from "./codegen";
import type { ProblemDef } from "./catalog";

/** Expands a problem definition into the rows stored in the database. */
export function buildProblem(def: ProblemDef) {
  const inputFormat = def.signature.params
    .map((p) =>
      p.type === "int[]"
        ? `\`${p.name}\`: a line with its length, then a line with the space-separated values`
        : `\`${p.name}\`: a single integer on its own line`,
    )
    .join("\n");

  return {
    problem: {
      number: def.number,
      slug: def.slug,
      title: def.title,
      difficulty: def.difficulty,
      description: def.description,
      inputFormat,
      constraints: def.constraints,
      tags: def.tags,
      timeLimitMs: def.timeLimitMs ?? 2000,
    },
    languages: LANGUAGES.map((language) => ({
      language,
      starterCode: starterCode(language, def.signature),
      driverCode: driverCode(language, def.signature),
      referenceSolution: def.solutions[language],
    })),
    testCases: def.tests.map((test, order) => ({
      order,
      input: formatStdin(def.signature, test.args),
      displayInput: formatDisplay(def.signature, test.args),
      expectedOutput: String(def.reference(...test.args)),
      isSample: test.sample ?? false,
      explanation: test.explanation ?? null,
    })),
  };
}
