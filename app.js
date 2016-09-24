var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var htmlToText = require('html-to-text');
var iconv = require('iconv-lite');
var sleep = require('sleep');

var app = express();

b = "tmp global variable for temp values";



function include(arr,num) {
    return (arr.length>num);
}

app.get('/', function(req, res) { //get light files function
  //command example: .get https://raw.githubusercontent.com/Creeplays/LK.BIN-Parser/master/Readme.md

  b = req.query.msg.slice(req.query.msg.search(/\s/));
  new Promise(function(resolve) {
    var a = request(b, function(error, response, body) {
      if (!error) {
        resolve(body);
      }
      else {
        console.log(error);
      }
    });
  }).then(function(response) {
    console.log(response)
    res.send("answer:" + response);
  })
});




app.get('/google', function(req, res) { // googling function
  // command example: .google github

  b = req.query.msg.slice(req.query.msg.search(/\s/) + 1);
  totalResults = 0; //needs define
  new Promise(function(resolve) {
    url1 = "https://www.google.ru/search?q=" + encodeURIComponent(b);
    request({
      uri: url1,
      method: 'GET',
      encoding: 'binary'
    }, function(error, response, body) {
      if (error) {
        console.log("Не удалось получить страницу из за следующей ошибки: " + error);
        return;
      }
      mylist = [];

      var $ = cheerio.load(
          iconv.encode(
            iconv.decode(
              new Buffer(body, 'binary'),
              'win1251'),
            'utf8')
        ),
        links = $(".r a");

      links.each(function(i, link) {
        var url = $(link).attr("href");
        url = url.replace("/url?q=", "").split("&")[0];
        //console.log(url);
        if ((url.charAt(0) === "/") || (i = links.length)) {
          resolve(mylist)
        }
        mylist.push(url + " - " + htmlToText.fromString($(link).html()))
        totalResults++;
      });
    });
  }).then(function(response) {
    
    while (("answer:" + response.join("\n") + "\n More: " + url1).length >= 1500) response.pop();
    console.log(response.join("\n"))
    console.log(("answer:" + response.join("\n") + "\n More: " + url1).length)
    res.send("answer:" + response.join("\n") + "\n More: " + url1);
  })
});


app.get('/man', function(req, res) { // googling function
  // command example: .memes блеать, become a men, bleat


  b = req.query.msg.slice(req.query.msg.search(/\s/) + 1);
	
	
		listb = b.split(', ');
		
		var mass=new Array('блеать','подозрительно','повсюду','мтк','чтоесли', 'бухал', 'пиздабол', 'пиздюк', 'хуйхурма');

mass["блеать"] = "79265063";
mass["хуйхурма"] = "79275596";
mass["подозрительно"] = "61520";
mass["повсюду"] = "347390";
mass["мтк"] = "101470";
mass["пиздабол"] = "79273671";
mass["пиздюк"] = "79273881";
mass['чтоесли'] = "61583";
mass['бухал'] = "79273483";


  if(listb[0].trim()=='лист') {
      res.send('answer:'+mass.join(" "))
      return
    
  }
  
  
  temp = mass[listb[0].trim().replace(/\s/g, '')];
  if (!temp){
       url1 = "https://api.imgflip.com/caption_image?max_font_size=60&template_id=79265063&username=srt&password=kernels&text0="+ encodeURIComponent("нет такой команды")+"&text1="+encodeURIComponent("блеать")

  } else {
		
   url1 = "https://api.imgflip.com/caption_image?max_font_size=60&template_id="+temp+"&username=srt&password=kernels&text0=" +
   (include(listb,1)?( encodeURIComponent( listb[1] )):" ")+
   "&text1="+(include(listb,2)?( encodeURIComponent( listb[2] )):" ")

}

  new Promise(function(resolve) {
   
    request(url1, function(error, response, body) {
      if (!error) {
        resolve(body);
      }
      else {
        console.log(error);
      }
    });
  }).then(function(response) {
    
    console.log(response)
    res.send("img: :" + JSON.parse(response).data.url.replace(/:/g, '|'));
  })
});





app.listen(8081, function() {});
