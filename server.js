'use strict';

const express = require('express');
const api = require('./apikey');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/find/:term', (req, res) => {
  var term = req.params.term;
  var Airtable = require('airtable');
  var base = new Airtable({ apiKey: api.apikey }).base('appMP6cjNNTKqPJLD');

  var response = {};
  var id;
  var message;
  var images = [];
  var finded = false;

  base('有效主動轉傳素材').select({
    // Selecting the first 3 records in 超激！訊息搜集處:
    maxRecords: 100,
    view: "機器人查詢用"
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function (record) {
      var checkWords = record.get('機器人查詢用');
      if (!finded && checkWords.match(term) && record.get('回傳給長輩的文字訊息')) {
        finded = true;
        message = record.get('回傳給長輩的文字訊息');
        console.log(message);
        if (record.get('素材圖片、影片')) {
          record.get('素材圖片、影片').forEach(function (item) {
            images.push(item.url);
          });
        }
      }
      
      // console.log('Retrieved', record.get('訊息'));
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

  }, function done(err) {
    if (err) { console.error(err); return; }
    var recordData = {};
    if (message) {
      recordData.messages = [message];
      
      recordData.images = images;
      response = doArrangeResponse(recordData);
      console.log(response);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(response));
    }
    else {
      recordData.messages = ["抱歉，目前我們取不到此關鍵字的資料，請試著輸入其他關鍵字。"];
      response = doArrangeResponse(recordData);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(response));
    }
  });
});

function doArrangeResponse(object) {
  var response = {
    "messages": []
  }
  if (object.messages) {
    object.messages.forEach(function(msg) {
      if (msg) {
        response.messages.push({ "text": msg });
      }
    });
  }
  if (object.images) {
    object.images.forEach(function(url){
      response.messages.push({
        "attachment": {
          "type": "image",
          "payload": {
            "url": url
          }
        }
      });
    });
  }
  return response;
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);