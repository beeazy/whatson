const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

// async function scrapeImages() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://whats-on-nairobi.com/');

//   const imageUrls = await page.evaluate(() => {
//     const images = Array.from(document.querySelectorAll('img'));
//     return images.map(img => img.src);
//   });

//   const filteredImageUrls = [];
//   for (const url of imageUrls) {
//     if (!url.endsWith('.gif') && !url.includes('skyline') && !url.includes('jay.JPG') && url.includes('whats-on-nairobi.com/PICS/')) {
//       try {
//         const response = await axios.head(url, {
//           headers: { 'Content-Type': 'image/jpeg' },
//           responseType: 'stream',
//         });
//         // if (response.headers['content-length'] / 1024 >= 78) {
//           filteredImageUrls.push(url);
//         // }
//       } catch (err) {
//         console.error(`Error fetching image URL ${url}: ${err.message}`);
//       }
//     }
//   }

//   fs.writeFileSync('output.json', JSON.stringify({ imageUrls: filteredImageUrls }));

//   await browser.close();
// }

// scrapeImages();

async function getImages(outputFilename) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://whats-on-nairobi.com/');

  const imageData = await page.$$eval('td a[href^="PICS/"]', anchors => anchors.map(a => ({ src: a.href, description: a.innerText })));

  const filteredImageData = imageData.filter(data => data.description !== '');

  fs.writeFileSync(outputFilename, JSON.stringify(filteredImageData));

  await browser.close();
}

getImages('outPutImage.json');

async function getAllEvents(outputFilename) {
  const response = await axios.get('https://whats-on-nairobi.com/');
  const html = response.data;

  const $ = cheerio.load(html);
  const imageData = [];

  $('td a[href^="PICS/"]').each((i, el) => {
    const $anchor = $(el);
    const src = 'https://whats-on-nairobi.com/'+$anchor.attr('href');
    const description = $anchor.find('font').last().text().trim();

    if (description) {
      imageData.push({ src, description });
    }
  });

  fs.writeFileSync(outputFilename, JSON.stringify(imageData));
}

getAllEvents('allEvents.json');


// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('http://whats-on-nairobi.com/special.php');

//   const data = [];

//   const dateElements = await page.$$('tr > td > p > font');
//   const imageElements = await page.$$('tr > td > p > a > img');

//   for (let i = 1; i < Math.min(dateElements.length, imageElements.length); i++) {
//     const date = await page.evaluate(el => el.textContent.trim(), dateElements[i]);
//     const imageUrl = 'http://whats-on-nairobi.com/' + await page.evaluate(el => el.getAttribute('src'), imageElements[i]);
  
//     // data.push({ date, imageUrl });

//     if (date !== "" && !imageUrl.endsWith(".GIF")) {
//       data.push({ date, imageUrl });
//     }
//   }

//   const json = JSON.stringify(data, null, 2);
//   fs.writeFileSync('hotevents.json', json);

//   await browser.close();
// })();

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('http://whats-on-nairobi.com/theatre.php');

//   const data = [];

//   const dateElements = await page.$$('tr > td > p > b > font[face="Arial"]');
//   // const imageElements = await page.$$('tr > td > p > a > img');

//   // const dateElements = await page.$$('div > table > tbody > tr > td > div > table > tbody > tr > td > p');
//   const imageElements = await page.$$('div > table > tbody > tr > td > div > table > tbody > tr > td > p > a > img');
//   const descriptionElements = await page.$$('div > table > tbody > tr > td > div > table > tbody > tr > td > p[style="margin-top: 0; margin-bottom: 0"] > font[face="Calibri"]');
//   // const descriptionElements = await page.$$('tr > td > p[style="margin-top: 0; margin-bottom: 0"] > font[face="Calibri"]');

//   for (let i = 1; i < Math.min(dateElements.length, imageElements.length); i++) {
//     const date = dateElements[i] ? await page.evaluate(el => el.textContent.trim(), dateElements[i]) : '';
//     const imageUrl = imageElements[i] ? 'http://whats-on-nairobi.com/' + await page.evaluate(el => el.getAttribute('src'), imageElements[i]) : '';
//     const description = descriptionElements[i] ? await page.evaluate(el => el.textContent.trim(), descriptionElements[i]) : '';
  
//     if(!imageUrl.includes('.GIF')) {
//       data.push({ date, imageUrl, description });
//     }
//   }

//   const json = JSON.stringify(data, null, 2);
//   fs.writeFileSync('theatre.json', json);

//   await browser.close();
// })();

