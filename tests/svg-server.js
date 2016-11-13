import fs from 'fs';
import minimist from 'minimist';
import express from 'express';
import { ScriptParser, toSVG } from '../src/index';

function die(msg) {
    console.log(msg);
    process.exit(1);
}

function main() {
    const argv = minimist(process.argv.slice(2));

    if (argv._.length !== 1) {
        die('Must specify input file');
    }

    const testFile = fs.readFileSync(argv._[0], 'utf16le');

    const parser = new ScriptParser();
    const lines = testFile.split('\n');
    lines.forEach(line => parser.parseLine(line));

    const app = express();

    app.get('/', (req, res) => {
        res.set('Content-Type', 'image/svg+xml');
        res.send(toSVG(parser.instructions));
    });

    app.listen(3000, () => console.log('listening on port 3000'));
}

main();