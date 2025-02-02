import { asyncHandler } from "../utils/asyncHandler.js";

import { apiError } from "../utils/apiError.js";

const restrictedWords = [
  // Violence and Aggression
  "kill",
  "murder",
  "assault",
  "shoot",
  "bomb",
  "weapon",
  "war",
  "terrorism",
  "massacre",
  "bloodshed",
  "attack",
  "stab",
  "rape",
  "slaughter",
  "genocide",
  "execute",
  "torture",
  "lynch",
  "hostage",
  "ambush",
  "insurgent",
  "violence",

  // Hate Speech and Discrimination
  "hate speech",
  "bigot",
  "xenophobia",
  "sexism",
  "homophobia",
  "anti-Semitic",
  "anti-Islamic",
  "white supremacy",
  "racial superiority",
  "ethnic cleansing",
  "discriminatory",

  // Sensitive Content
  "suicide",
  "self-harm",
  "depression",
  "mental illness",
  "anxiety",
  "trigger warning",
  "anorexia",
  "bulimia",
  "overdose",
  "death",

  // Immoral or Inappropriate Words
  "drugs",
  "narcotics",
  "marijuana",
  "cocaine",
  "heroin",
  "porn",
  "adult content",
  "explicit",
  "prostitution",
  "gambling",
  "betting",
  "adultery",
  "affair",

  // Profanity (add more based on dataset or library)
  "curse words",

  // Exploitation and Human Rights Violations
  "trafficking",
  "slavery",
  "child abuse",
  "exploitation",
  "forced labor",
  "child pornography",
  "pedophilia",
  "molestation",
  "abduction",

  // Extremism and Radicalization
  "jihad",
  "extremist",
  "radical",
  "insurgent",
  "martyrdom",
  "recruitment",

  // Miscellaneous Sensitive Words
  "crime",
  "illegal",
  "smuggling",
  "counterfeit",
  "forgery",
  "corruption",
  "bribe",
];

const sensitiveText = asyncHandler(async (req, _, next) => {
  const { title, description, comment } = req.body;

  // Combine all inputs into a single string for simplicity
  const combinedText =
    `${title || ""} ${description || ""} ${comment || ""}`.toLowerCase();

  // Check for restricted words
  const foundWords = restrictedWords.filter((word) =>
    combinedText.includes(word.toLowerCase())
  );

  if (foundWords.length > 0) {
    return next({
      status: 400,
      message: `Your input contains restricted words: ${foundWords.join(", ")}`,
    });
  }

  // If no restricted words are found, proceed to the next middleware
  next();
});

// const checkSensitiveImage = asyncHandler(async () => {
//   const image = req.file.path;
//   let model = await nsfw.load();
//   const prediction = await model.classify(image);
//   console.log("prediction: ", prediction);
//   next();
// });

export { sensitiveText };
