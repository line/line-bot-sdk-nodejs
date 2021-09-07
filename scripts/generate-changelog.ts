import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
const { version: lastVersion } = require("../package.json");

const changeLogPath = resolve(__dirname, "../CHANGELOG.md");

let newVersion = lastVersion;

console.log(`Gets Release Version from ${process.env.GITHUB_EVENT_PATH}`);
if (process.env.GITHUB_EVENT_PATH) {
  const {
    pull_request: { title },
  } = require(process.env.GITHUB_EVENT_PATH);

  if (/^release/i.test(title))
    newVersion = (title as string).match(/release ([\d\.]+)/i)[1];
  else {
    console.log("Not target pull request, exiting");
    process.exit(0);
  }
}

execSync(`git reset --hard HEAD`);

console.log(`New Version: ${newVersion}`);

console.log("Bump Version");
execSync(`npm version ${newVersion}`);

const gitLogOutput = execSync(
  `git log v${lastVersion}... --format=%s`
).toString("utf-8");

const commitsArray = gitLogOutput
  .split("\n")
  .filter((message) => message && message !== "");

const category = {
  miscs: [] as string[],
  features: [] as string[],
  bugFixes: [] as string[],
};

commitsArray.forEach((message) => {
  let cat: keyof typeof category;
  if (/^([\d\.]+)$/.test(message)) {
    return;
  } else if (message.includes("test")) {
    cat = "miscs";
  } else if (/(add)|(support)/i.test(message)) {
    cat = "features";
  } else if (/fix/i.test(message)) {
    cat = "bugFixes";
  } else {
    cat = "miscs";
  }
  category[cat].push(`* ${message}`);
});

const now = new Date();
const MonthText = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let newChangelog = `## ${newVersion} (${now.getDate()} ${
  MonthText[now.getMonth()]
} ${now.getFullYear()})
`;

if (category.features.length > 0) {
  newChangelog += `
### Feature
${category.features.join("\n")}
`;
}

if (category.bugFixes.length > 0) {
  newChangelog += `
### Bug fix
${category.bugFixes.join("\n")}
`;
}

if (category.miscs.length > 0) {
  newChangelog += `
### Misc
${category.miscs.join("\n")}
`;
}

const currentChangelog = readFileSync(changeLogPath, "utf-8");

writeFileSync(
  changeLogPath,
  `${newChangelog}
${currentChangelog}`
);
