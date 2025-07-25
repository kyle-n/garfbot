import axios from 'axios';
import * as cheerio from 'cheerio';

export function randomGarfDate() {
	const start = new Date('1978-06-19');
	const end = new Date();
	const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	return randomDate;
}

export async function getGarf(date: Date) {
  const response = await axios.get<string>(`https://www.gocomics.com/garfield/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch Garfield comic for ${date.toISOString()}`);
  }

  const $ = cheerio.load(response.data);

  // remove "Five Favorites" section with incorrect comics
  $('section').filter((_, elem) => {
    const cssClasses = elem.attribs['class']?.split(' ') ?? [];
    return cssClasses.some(cssClass => cssClass.toLowerCase().startsWith('showfivefavorites'));
  }).remove();

  console.log($('body').html());

  const comicImage = $('img').filter((_, elem) => {
    const cssClass = elem.attribs['class']?.split(' ') ?? []
    return cssClass.some(cssClass => cssClass.toLowerCase().startsWith('comic_comic__image_isstrip'))
  })
  console.log(`Found ${comicImage.length} comic images for ${date.toISOString()}`);
  if (!comicImage.length) {
    throw new Error(`Failed to parse Garfield comic for ${date.toISOString()}`);
  }

  const src = comicImage.first().attr('src')
  if (!src) {
    throw new Error(`No image source found for Garfield comic on ${date.toISOString()}`);
  }
  return {
    date: date.toISOString(),
    imageUrl: src,
    altText: comicImage.first().attr('alt') || 'Garfield comic for ' + date.toISOString(),
  };
}