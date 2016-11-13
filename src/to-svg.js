import h from 'virtual-dom/h';
import toHTML from 'vdom-to-html';

const namespace = 'http://www.w3.org/2000/svg';

function hsvg(elementName, parameters, children) {
    const opts = Object.assign({ namespace }, parameters);
    return h(elementName, opts, children);
}

function toSVG(instructions) {
    let lastLocation;

    const elements = instructions.reduce((elems, instruction) => {
        if (instruction.type === 'location') {
            const { x, y } = instruction.position;

            if (lastLocation) {
                elems.push(hsvg('line', {
                    attributes: {
                        x1: lastLocation.x,
                        y1: lastLocation.y,
                        x2: x,
                        y2: y,
                    },
                }));
            }

            lastLocation = { x, y };
        } else if (instruction.type === 'endStroke') {
            lastLocation = undefined;
        }

        return elems;
    }, []);

    const svg = hsvg('svg', {
        attributes: {
            xmlns: 'http://www.w3.org/2000/svg',
            version: '1.1',
            style: 'stroke: black',
        },
    }, elements);

    return toHTML(svg);
}

export default toSVG;
