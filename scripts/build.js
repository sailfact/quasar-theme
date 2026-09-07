const fs = require("fs");
const path = require("path");
const generate = require("./generate");

const THEME_DIR = path.join(__dirname, "..", "themes");

module.exports = async () => {
  const variants = await generate();

  if (!fs.existsSync(THEME_DIR)) {
    fs.mkdirSync(THEME_DIR, { recursive: true });
  }

  return Promise.all(
    variants.map(({ file, theme }) =>
      fs.promises
        .writeFile(
          path.join(THEME_DIR, file),
          JSON.stringify(theme, null, 4) + "\n",
        )
        .then(() => console.log(`themes/${file}`)),
    ),
  );
};

if (require.main === module) {
  module.exports().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
