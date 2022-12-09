import { Product, Scraper } from './modules/priceScraper.js';

const mobo = new Product('Gigabyte Z690 GAMING X DDR4', {
   morele: 'https://www.morele.net/plyta-glowna-gigabyte-z690-gaming-x-ddr4-9381882/',
   xkom: 'https://www.x-kom.pl/p/691355-plyta-glowna-socket-1700-gigabyte-z690-gaming-x-ddr4.html',
   euro: 'https://www.euro.com.pl/plyty-glowne/gigabyte-p-yta-g-wna-giga-z690-gaming-x-ddr4-1-0.bhtml',
   media: 'https://www.mediaexpert.pl/komputery-i-tablety/podzespoly-komputerowe/plyty-glowne/plyta-glowna-gigabyte-z690-gaming-x-1',
   komputronik:
      'https://www.komputronik.pl/product/737337/gigabyte-z690-gaming-x-ddr4.html?utm_source=Ceneo&utm_medium=link&utm_campaign=Promo&ceneo_cid=4b97cdb2-26d6-3b7e-7600-64eed064e17d',
   skapiec: 'https://www.skapiec.pl/site/cat/13/comp/897125786',
   amazon:
      'https://www.amazon.pl/GIGABYTE-Z690-Gaming-Gen2X2-gamingowa/dp/B09J5TC4F8/ref=sr_1_3?__mk_pl_PL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1WOJJGC0NA61B&keywords=GIGABYTE+Z690+GAMING+X+DDR4&qid=1670492827&sprefix=gigabyte+z690+gaming+x+ddr4%2Caps%2C88&sr=8-3',
});
const cpu = new Product('Intel Core i5 13600KF', {
   morele: 'https://www.morele.net/procesor-intel-core-i5-13600kf-2-6-ghz-24-mb-box-bx8071513600kf-11789640/',
   xkom: 'https://www.x-kom.pl/p/1075057-procesory-intel-core-i5-intel-core-i5-13600kf.html',
   media: 'https://www.mediaexpert.pl/komputery-i-tablety/podzespoly-komputerowe/procesory/procesor-intel-core-i5-13600kf',
   komputronik: 'https://www.komputronik.pl/product/785286/intel-core-i5-13600kf.html',
   euro: 'https://www.euro.com.pl/procesory/intel-procesor-intel-core-i513600kf-box-3-5ghz.bhtml#afterSearch-intel%20core%20i5%2013600kf||||product',
   amazon:
      'https://www.amazon.pl/Intel%C2%AE-i5-13600KF-Procesor-biurkowy-podr%C4%99czna/dp/B0BG64N549/ref=sr_1_2?__mk_pl_PL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=14SM5B7K8VIQ4&keywords=i5-13600kf&qid=1670492999&sprefix=i5-13600kf%2Caps%2C105&sr=8-2',
   skapiec: 'https://www.skapiec.pl/site/cat/1/comp/913519073',
});
const scraper = new Scraper();

scraper.addProduct(mobo);
scraper.addProduct(cpu);

// console.log(scraper.getProducts());

await scraper.start().then(() => {
   for (let product of scraper.getProducts()) {
      console.log(`${product.name}:`);
      for (let price in product.prices) console.log(`${price}: ${product.prices[price]}`);
      console.log('- - - - - - - - - -');
   }
});
