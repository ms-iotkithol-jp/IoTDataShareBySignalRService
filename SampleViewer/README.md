# SignalR で送信されるメッセージの受信テスト用 Web ページ 
[scripts/databysignalr.js](scripts/databysignalr.js) の2行目の 
```javascript
$(document).ready(function () {
    const apiBaseUrl = "< URL for Hub Function >";
    let data = { ready: false };
```
の、\<URL for Hub Function\> を、Func2 を Deploy したAzure Functions のURLに置き換える。 
このフォルダーのファイル一式をWebサイトにコピーして（ローカルフォルダーでもOK）、ブラウザで index.html を開く。