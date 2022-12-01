import { Product, Scraper } from './modules/priceScraper.js';

const links = {
   amazon:
      'https://www.amazon.pl/Straight-Platinum-modulowy-platyna-zasilacz/dp/B083T9STQS/ref=sr_1_1?__mk_pl_PL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1V0GKSXE66W1L&keywords=be%2Bquiet!%2BStraight%2BPower%2B11%2B850W%2B80%2BPlus%2BPlatinum&qid=1669933060&qu=eyJxc2MiOiIwLjg5IiwicXNhIjoiMC4wMCIsInFzcCI6IjAuMDAifQ%3D%3D&sprefix=be%2Bquiet%2Bstraight%2Bpower%2B11%2B850w%2B80%2Bplus%2Bplatinum%2Caps%2C247&sr=8-1&th=1',
   ceneo: 'https://www.ceneo.pl/90571442',
   euro: 'https://www.euro.com.pl/zasilacze-do-komputerow-pc/be-quiet-zasilacz-bequiet-straight-power-11-850w.bhtml',
   media: 'https://www.mediaexpert.pl/komputery-i-tablety/podzespoly-komputerowe/zasilacze/zasilacz-be-quiet-straight-power-11-850w-80-plus-platinum',
   morele: 'https://www.morele.net/zasilacz-be-quiet-straight-power-11-850w-bn308-6470639/',
   xkom: 'https://www.x-kom.pl/p/540597-zasilacz-do-komputera-be-quiet-straight-power-11-850w-80-plus-platinum.html',
};

const product = new Product('be quiet! Straight Power 11 850W 80+ Platinum', links);
const fakeProduct = 'be quiet! Straight Power 11 850W 80+ Platinum';
const scraper = new Scraper();

product.setLink(links);

scraper.addProduct(product);
// for (const producto of scraper.getProducts()) console.log(producto.name);

console.log(product);
// console.log(scraper);
