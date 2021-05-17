const { writeFile } = require('fs');
const { join } = require('path');
const blend = require('@mapbox/blend');
const argv = require('minimist')(process.argv.slice(2));
const got = require('got');

const {
    greeting = 'Hello',
    who = 'You',
    width = 400,
    height = 500,
    color = 'Pink',
    size = 100,
} = argv;

const api_url = `https://cataas.com/cat/says/`;
const filename = `cat-card.jpg`;

async function getRawImage(text) {
    try {
        const request = {
            url: api_url + text + '?width=' + width + '&height=' + height + '&color=' + color + '&s=' + size,
            encoding: 'binary'
        };
        const response = await got(request);
        console.log('Received response with status:' + response.statusCode);
        return response.body;
    } catch (error) {
        console.log(error.response.body);
    }
}

function createImage(rawImage, x, y) {
    return {
        buffer: Buffer.from(rawImage, 'binary'), x, y
    }
}

(async () => {
    blend([
        createImage(await getRawImage(greeting), 0, 0),
        createImage(await getRawImage(who), width, 0)
    ], {
        width: width * 2,
        height,
        format: 'jpeg',
    }, (err, data) => {
        const fileOut = join(process.cwd(), filename);
        writeFile(fileOut, data, 'binary', (err) => {
            if (err) return console.log(err);
            console.log("The file was saved!");
        });
    });
})();