import express from 'express';
import cheerio from 'cheerio';
import request from 'request';
import htmlToText from 'html-to-text';
import iconv from 'iconv-lite';
import sleep from 'sleep';

const app = express();

b = "tmp global variable for temp values";

function include(arr, num) {
  return arr.length > num;
}

app.get('/', (req, res) => {
  //get light files function
  //command example: .get https://raw.githubusercontent.com/Creeplays/LK.BIN-Parser/master/Readme.md

  b = req.query.msg.slice(req.query.msg.search(/\s/));
  new Promise(resolve => {
    const a = request(b, (error, response, body) => {
      if (!error) {
        resolve(body);
      } else {
        console.log(error);
      }
    });
  }).then(response => {
    console.log(response);
    res.send(`answer:${ response }`);
  });
});

app.get('/google', (req, res) => {
  // googling function
  // command example: .google github

  b = req.query.msg.slice(req.query.msg.search(/\s/) + 1);
  totalResults = 0; //needs define
  new Promise(resolve => {
    url1 = `https://www.google.ru/search?q=${ encodeURIComponent(b) }`;
    request({
      uri: url1,
      method: 'GET',
      encoding: 'binary'
    }, (error, response, body) => {
      if (error) {
        console.log(`Не удалось получить страницу из за следующей ошибки: ${ error }`);
        return;
      }
      mylist = [];

      const $ = cheerio.load(iconv.encode(iconv.decode(new Buffer(body, 'binary'), 'win1251'), 'utf8'));

      const links = $(".r a");

      links.each((i, link) => {
        let url = $(link).attr("href");
        url = url.replace("/url?q=", "").split("&")[0];
        //console.log(url);
        if (url.charAt(0) === "/" || (i = links.length)) {
          resolve(mylist);
        }
        mylist.push(`${ url } - ${ htmlToText.fromString($(link).html()) }`);
        totalResults++;
      });
    });
  }).then(response => {

    while (`answer:${ response.join("\n") }\n More: ${ url1 }`.length >= 1500) response.pop();
    console.log(response.join("\n"));
    console.log(`answer:${ response.join("\n") }\n More: ${ url1 }`.length);
    res.send(`answer:${ response.join("\n") }\n More: ${ url1 }`);
  });
});

app.get('/man', (req, res) => {
  // googling function
  // command example: .memes блеать, become a men, bleat


  b = req.query.msg.slice(req.query.msg.search(/\s/) + 1);

  listb = b.split(', ');
  
  const mass = {};

  mass["блеать"] = "79265063";
  mass["какой"] = "79276954";
  mass["хуйхурма"] = "79275596";
  mass["подозрительно"] = "61520";
  mass["повсюду"] = "347390";
  mass["мтк"] = "101470";
  mass["пиздабол"] = "79273671";
  mass["пиздюк"] = "79273881";
  mass['чтоесли'] = "61583";
  mass['бухал'] = "79273483";
  mass['заявление'] = "79276423";

  console.log(`-->${ listb[0].trim() }<--`);

  if (listb[0].trim() == 'лист' || listb[0].trim() == 'memes' || listb[0].trim() == 'w') {
    res.send(`answer:${ Object.keys(mass).join(" ") }`);
    return;
  }

  temp = mass[listb[0].trim().replace(/\s/g, '')];
  if (!temp) {
    url1 = `https://api.imgflip.com/caption_image?max_font_size=60&template_id=79265063&username=srt&password=kernels&text0=${ encodeURIComponent("нет такой команды") }&text1=${ encodeURIComponent("блеать") }`;
  } else {

    url1 = `https://api.imgflip.com/caption_image?max_font_size=60&template_id=${ temp }&username=srt&password=kernels&text0=${ include(listb, 1) ? encodeURIComponent(listb[1]) : " " }&text1=${ include(listb, 2) ? encodeURIComponent(listb[2]) : " " }`;
  }

  new Promise(resolve => {

    request(url1, (error, response, body) => {
      if (!error) {
        resolve(body);
      } else {
        console.log(error);
      }
    });
  }).then(response => {

    console.log(response);
    res.send(`img: :${ JSON.parse(response).data.url.replace(/:/g, '|') }`);
  });
});

app.listen(8081, () => {});
