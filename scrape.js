const puppeteer = require('puppeteer');
const fs = require('fs');

var browser;
let scrape = async () => {
    browser = await puppeteer.launch({headless: true});
    
    // Actual Scraping goes Here...
    const page = await browser.newPage();
    await page.goto('http://lexopen.dk/');
    
    //await page.waitFor(1000);

    await page.screenshot({path: 'img/front.png'});

    const result = await page.evaluate(() => {
        const links = document.querySelectorAll('table')[2].querySelectorAll('a');

        //convert into array of hrefs
        const urls = Array.prototype.slice.call(links).map(x => x.href)
        return urls;
    });

    page.close();



    //browser.close();
    return result;
  // Return a value
};



let scrapeCategories = async(x) => {
    
    const url = x;
    console.log("browsing " + url);
    let page = await browser.newPage();
    await page.goto(url);
    const pageInfo = await page.evaluate(() => {
        const title = document.getElementsByTagName('font')[1].innerText.trim().replace(/\s|-/g, '_').replace(/_{2,}/g, '_');
        const links = Array.prototype.slice.call(document.querySelectorAll('a')) //converts to array
                        .filter(x => x.parentElement == document.getElementsByTagName('body')[0])
                        .map(x => x.href);
        return {title, links};
    });

    const filePath = 'img/categories/' + pageInfo.title + '/';
    
    fs.mkdir(filePath, { recursive: true }, (err) => {
        //console.log(err);
    });
    await page.screenshot({path: filePath + pageInfo.title +'.png'});


    page.close();
    return pageInfo;
};




scrape().then(async (value) => {
    // for(var i = 0; i < value.length; i++)
    let categories = [];
    for(var i = 0; i < 30; i++)
    {
        pages = await scrapeCategories(value[i]);

        //scrape articles from page.links
        //..
        pages.links.forEach(x => console.log(x));
        categories.push(pages);


    }
    //console.log(categories);
});