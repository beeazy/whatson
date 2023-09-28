const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');


async function getAllEvents(outputFilename) {
  const response = await axios.get('https://whats-on-nairobi.com/');
  const html = response.data;

  const $ = cheerio.load(html);
  const imageData = [];

  $('td a[href^="PICS/"]').each((i, el) => {
    const $anchor = $(el);
    const src = 'https://whats-on-nairobi.com/'+$anchor.attr('href');
    const location = $anchor.find('font').first().text().trim().replace(/[\r\n\t]/g, '');
    const description = $anchor.find('font').last().text().trim().replace(/[\r\n\t]/g, '');


    if (description) {
      imageData.push({ src, description, location });
    }
  });

  fs.writeFileSync(outputFilename, JSON.stringify(imageData));
}

getAllEvents('allEvents.json');
