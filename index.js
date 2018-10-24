const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
// var bodyParser = require('body-parser');
// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};
app.use(allowCrossDomain);
// // parse application/json
// app.use(bodyParser.json());
/*静态文件托管 
所有文件的路径都是相对于存放目录的，
因此，存放静态文件的目录名不会出现在 URL 中。
http://localhost:3000/images/kitten.jpg
*/
// app.use('/static',express.static('public'));
app.use('/public',express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')))
// var birds = require('./router/birds');
// app.use('/birds', birds);
app.get('/',function(req,res){
    res.sendFile(__dirname + '/public/html/home.html')
})
app.get('/cityData',function(req,res){
  fs.readFile('./public/data/city.json',{encoding:'utf-8'}, function(err, data) {
    // 读取文件失败/错误
    if (err) {
        throw err;
    }
    // 读取文件成功
    // console.log(typeof data)
    res.json(JSON.parse(data));
});
  
})
app.get('*',function(req, res) {
    res.status(404).send('Sorry cant find that!');
  });
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});