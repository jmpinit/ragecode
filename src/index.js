// warning: this was designed to be fast to write, not elegant, performant, or correct

// TODO
// slice out <StartupFeatures> ... </StartupFeatures> (return as Buffer)
// watch for undo and then remove previous stroke

import readline from 'readline';

function parseTime(timeString) {
    const [, , minutes, seconds ] = (/((\d+):)?(\d+\.\d+)/g).exec(timeString);

    let time = parseFloat(seconds);

    if (minutes) {
        time += parseFloat(minutes) * 60;
    }

    return time;
}

class ScriptParser {
    constructor() {
        this.context = [];

        this.tokenPatterns = {
            tagOpen: {
                pattern: /<([a-zA-Z]+?)>/g,
                value: res => res[1],
            },
            tagClose: {
                pattern: /<\/([a-zA-Z]+?)>/g,
                value: res => res[1],
            },
            wait: {
                pattern: /Wait: ((\d+:)?\d+(\.\d+))?s/g,
                value: res => parseTime(res[1]),
            },
            location: {
                pattern: /Loc: \((\d+(\.\d+)?), (\d+(\.\d+)?)\)/g,
                value: res => ({
                    x: parseFloat(res[1]),
                    y: parseFloat(res[3]),
                }),
            },
            pressure: {
                pattern: /Pr: (\d+(\.\d+)?)/g,
                value: res => parseFloat(res[1]),
            }
        };

        this.instructions = [];
    }

    currentTag() {
        return this.context[this.context.length - 1];
    }

    parseLine(line) {
        const containsBinary = line.split('').some(c => c.charCodeAt(0) >= 126);

        if (containsBinary) {
            // we ignore binary data for now
            return;
        }

        // remove comments
        const rComment = /(.*)\/\/.*/g;
        const commentParts = rComment.exec(line);

        if (commentParts !== null) {
            line = commentParts[1];
        }

        const tokens = Object.keys(this.tokenPatterns).reduce((ms, patternName) => {
            const { pattern: r, value: getValueOf } = this.tokenPatterns[patternName]
            const results = [];

            while (r.lastIndex < line.length) {
                const res = r.exec(line);

                if (res) {
                    results.push(res);
                } else {
                    // no more matches
                    break;
                }
            }

            // reset Regex's state :(
            r.lastIndex = 0;

            results.forEach(res => {
                ms.push({
                    name: patternName,
                    result: getValueOf(res),
                    index: res.index,
                });
            });

            return ms;
        }, []);

        tokens.sort((a, b) => {
            if (a.index < b.index) {
                return -1;
            } else if (a.index > b.index) {
                return 1;
            }

            return 0;
        });

        // consume the tokens

        tokens.forEach(token => {
            switch (token.name) {
                case 'tagOpen':
                    this.context.push(token.result);
                    break;
                case 'tagClose':
                    if (this.currentTag() === token.result) {
                        this.context.pop();
                    } else {
                        throw new Error(`No matching opening tag for "${token.result}"`);
                    }
                    break;
                case 'wait':
                    if (this.currentTag() === 'StrokeEvent') {
                        this.instructions.push({ type: 'wait', length: token.result });
                    }
                    break;
                case 'location':
                    if (this.currentTag() === 'StrokeEvent') {
                        this.instructions.push({ type: 'location', position: token.result });
                    }
                    break;
                case 'pressure':
                    if (this.currentTag() === 'StrokeEvent') {
                        this.instructions.push({ type: 'pressure', position: token.result });
                    }
                    break;
            }
        });
    }
}

function parse(scriptStream) {
    return new Promise((fulfill, reject) => {
        const parser = new ScriptParser();

        // feed the script to the parser line-by-line

        const lineByLine = readline.createInterface({ input: scriptStream });

        lineByLine.on('line', line => parser.parseLine(line));

        lineByLine.on('close', () => {
            fulfill(parser.instructions);
        });
    });
}

export default parse;