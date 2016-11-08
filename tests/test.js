import fs from 'fs';
import path from 'path';
import parse from '../src/index.js';
import ansi from 'ansi-256-colors';
import size from 'window-size';

function getFiles(srcpath) {
    const files = fs.readdirSync(srcpath).map(file => path.join(srcpath, file));
    return files.filter(file => fs.statSync(file).isFile());
}

function getBoundingBox(pts) {
    let left = 0;
    let top = 0;
    let right = 0;
    let bottom = 0;

    pts.forEach(pt => {
        if (pt.x < left) {
            left = pt.x;
        } else if (pt.x > right) {
            right = pt.x;
        }

        if (pt.y < top) {
            top = pt.y;
        } else if (pt.y > bottom) {
            bottom = pt.y;
        }
    });

    return { left, top, right, bottom };
}

function paint(instructions) {
    const locs = instructions.filter(instruction => instruction.type === 'location');
    const pts = locs.map(loc => loc.position);
    const bounds = getBoundingBox(pts);

    const paintingWidth = bounds.right - bounds.left;
    const paintingHeight = bounds.bottom - bounds.top;

    const image = pts.reduce((img, pt) => {
        const normX = (pt.x - bounds.left) / paintingWidth;
        const normY = (pt.y - bounds.top) / paintingHeight;

        const termX = Math.floor(normX * size.width);
        const termY = Math.floor(normY * size.height);

        const i = termY * size.width + termX;

        if (!img[i]) {
            img[i] = 0;
        }

        img[i]++;

        return img;
    }, []);

    const maxBrightness = image.reduce((max, pixel) => pixel > max ? pixel : max, 0);
    console.log(maxBrightness);

    const pixel = (v) => {
        const c = Math.floor(v * 23);
        process.stdout.write(ansi.bg.grayscale[c] + ' ');
    };

    for (let y = 0; y < size.height; y++) {
        for (let x = 0; x < size.width; x++) {
            const i = y * size.width + x;
            const v = image[i] || 0;
            pixel(v / maxBrightness);
        }

        process.stdout.write('\r\n');
    }

    process.stdout.write(ansi.reset);
}

function main() {
    if (process.argv.length !== 3) {
        console.log('Must specify directory containing ArtRage script files');
        process.exit(1);
    }

    const scriptDirPath = process.argv[2];
    const scripts = getFiles(scriptDirPath);

    const parsePromises = scripts.map(scriptPath => {
        console.log('parsing', scriptPath);
        return parse(fs.createReadStream(scriptPath, { encoding: 'utf16le' }));
    });

    Promise.all(parsePromises)
        .then(instructionSets => instructionSets.forEach(ins => paint(ins)))
        .catch(err => console.log('failed:', err));
}

main();
