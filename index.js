const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

async function scrapeImages() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://whats-on-nairobi.com/');

  const imageUrls = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.map(img => img.src);
  });

  const filteredImageUrls = [];
  for (const url of imageUrls) {
    if (!url.endsWith('.gif') && !url.includes('skyline') && !url.includes('jay.JPG') && url.includes('whats-on-nairobi.com/PICS/')) {
      try {
        const response = await axios.head(url, {
          headers: { 'Content-Type': 'image/jpeg' },
          responseType: 'stream',
        });
        if (response.headers['content-length'] / 1024 >= 78) {
          filteredImageUrls.push(url);
        }
      } catch (err) {
        console.error(`Error fetching image URL ${url}: ${err.message}`);
      }
    }
  }

  fs.writeFileSync('posters.json', JSON.stringify({ imageUrls: filteredImageUrls }));

  await browser.close();
}

scrapeImages();



