var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var htmlToText = require('html-to-text');
var iconv = require('iconv-lite');
var sleep = require('sleep');

var app = express();

b = "tmp global variable for temp values";



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








app.listen(8081, function() {});
