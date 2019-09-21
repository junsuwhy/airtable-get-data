# 使用說明

1. 建立一個 `apikey.js` 裡面填入

```js
module.exports = {
  apikey: '{your_api_key}',
};
```

2. 執行 `sh build.sh` 然後執行 `sh run.sh`

3. 連到 `http://your.domain.com:22344/find/something` 就會去找資料表，吐出特定的圖文

4. 可設到 [chatfuel](https://chatfuel.com) 觸發輸入和輸出動作