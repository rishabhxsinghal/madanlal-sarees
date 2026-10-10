const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

const SRC = path.join(__dirname, "src", "assets", "images");
const BACKUP = path.join(__dirname, "images-backup");
const MANIFEST = path.join(__dirname, "compressed-images.json");

const MAX_WIDTH = 1400;
const HERO_WIDTH = 1920;
const QUALITY = 85;

const widthFor = (file) =>
  file.toLowerCase().includes("hero") ? HERO_WIDTH : MAX_WIDTH;

const hash = (buffer) =>
  crypto.createHash("sha1").update(buffer).digest("hex");

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

async function run() {
  const manifest = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
    : {};

  const files = walk(SRC).filter((f) => /\.(jpe?g)$/i.test(f));

  let processed = 0;
  let before = 0;
  let after = 0;

  for (const file of files) {
    const rel = path.relative(SRC, file).split(path.sep).join("/");
    const original = fs.readFileSync(file);
    const currentHash = hash(original);

    // already handled earlier
    if (manifest[rel] === currentHash) {
      continue;
    }

    // compressed by the first version of this script (original is in backup)
    if (!manifest[rel] && fs.existsSync(path.join(BACKUP, rel))) {
      manifest[rel] = currentHash;
      continue;
    }

    const output = await sharp(original)
      .rotate()
      .resize({ width: widthFor(file), withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();

    // already small enough, leave it alone
    if (output.length >= original.length) {
      manifest[rel] = currentHash;
      console.log(`skip   ${rel} (already small, ${kb(original.length)})`);
      continue;
    }

    // keep the original safe
    const backupPath = path.join(BACKUP, rel);
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    fs.writeFileSync(backupPath, original);

    fs.writeFileSync(file, output);
    manifest[rel] = hash(output);

    processed += 1;
    before += original.length;
    after += output.length;
    console.log(`done   ${rel}: ${kb(original.length)} -> ${kb(output.length)}`);
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));

  if (processed === 0) {
    console.log("\nNo new photos to compress.");
  } else {
    console.log(
      `\nCompressed ${processed} photo(s): ${kb(before)} -> ${kb(after)}`
    );
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});