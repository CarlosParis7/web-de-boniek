const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');
const files = fs.readdirSync(imagesDir);

const jpgFiles = files.filter(f => /\.(jpg|jpeg)$/i.test(f));

console.log(`\n🔄 Convirtiendo ${jpgFiles.length} imágenes a .webp (calidad 80)...\n`);

let totalOriginal = 0;
let totalWebp = 0;

(async () => {
    for (const file of jpgFiles) {
        const inputPath = path.join(imagesDir, file);
        const outputName = file.replace(/\.(jpg|jpeg)$/i, '.webp');
        const outputPath = path.join(imagesDir, outputName);

        const originalSize = fs.statSync(inputPath).size;
        totalOriginal += originalSize;

        await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath);

        const webpSize = fs.statSync(outputPath).size;
        totalWebp += webpSize;

        const saving = (((originalSize - webpSize) / originalSize) * 100).toFixed(1);
        const originalKB = (originalSize / 1024).toFixed(0);
        const webpKB = (webpSize / 1024).toFixed(0);

        console.log(`✅ ${file.padEnd(35)} ${originalKB}KB → ${webpKB}KB   (-${saving}%)`);
    }

    const totalSaving = (((totalOriginal - totalWebp) / totalOriginal) * 100).toFixed(1);
    console.log(`\n──────────────────────────────────────────────────────`);
    console.log(`📦 Total original:  ${(totalOriginal / 1024).toFixed(0)} KB`);
    console.log(`📦 Total .webp:     ${(totalWebp / 1024).toFixed(0)} KB`);
    console.log(`🚀 Ahorro total:    -${totalSaving}%`);
    console.log(`──────────────────────────────────────────────────────\n`);
    console.log('✔ Listo. Ahora actualiza las referencias en el HTML/JS.');
})();
