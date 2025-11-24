const fs = require("fs");

console.log("Running frontend tests...");

try {
  if (!fs.existsSync("./public/index.html")) {
    console.error("✗ index.html file is missing");
    process.exit(1);
  }

  const content = fs.readFileSync("./public/index.html", "utf8");
  if (!content.includes("DevOps Message Board")) {
    console.error("✗ index.html does not contain expected title");
    process.exit(1);
  }

  console.log("✓ index.html exists");
  console.log("✓ index.html contains expected title");
  console.log("Frontend tests passed.");
  process.exit(0);
} catch (err) {
  console.error("✗ Error running frontend tests:", err.message);
  process.exit(1);
}
