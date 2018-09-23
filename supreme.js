const JSSoup = require('jssoup').default;
const axios = require('axios');
const fs = require('fs');

const categories = ['jackets', 'shirts', 'tops_sweaters', 'sweatshirts', 'pants', 't-shirts', 'hats', 'bags', 'accessories'];
const season = 'fallwinter2018';

async function fetchCategoryHTML(season, category) {
    return await axios.get(`https://www.supremenewyork.com/previews/${season}/all/${category}.js`)
        .then((res) => res.data);
}

let items = [];

async function fetchItems() {
    for(let category of categories) {
        await fetchCategoryHTML(season, category).then((res) => {
            const soup = new JSSoup(res);
            const articles = soup.findAll('article');
            for(let article of articles) {
                const image = article.nextElement.nextElement.nextElement;
                const name = image.nextElement.nextElement;
                items.push({name: name.string.toString(), category: category, image: image.attrs.src})
            }
        });
    }
}

fetchItems().then(_ => {
    fs.writeFile('out.json', JSON.stringify(items, null, 2), (err) => {
        if (err) return console.log(err);
        console.log(`Wrote ${items.length} items to out.json`);
    });
})