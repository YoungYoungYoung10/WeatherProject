const express = require('express');
const { read } = require('fs');
const https = require('https');
const app = express();



//body-parser is the package which alows us to look
//through the body of the post request and fetch
//the data based on the name of my input
const bodyParser = require("body-parser")
//接下来是bodyParser的固定写法，记住就好
app.use(bodyParser.urlencoded({extended:true}))




//这里的res代表的是我们自己的这个服务器向页面传送的数据
app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

// 为了响应html发起的post请求，我们需要app.post方法
app.post("/",function(req,res){
//通过bodyParser的解析，我们能够拿到html的post请求中的数据（通过input中的name attribute）
console.log(req.body.cityName)
const query = req.body.cityName;
const appId = "735ce9eabde3cd2e12d13d5fc4ce7a79";
const units = "metric";
const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+appId+"&units="+units
//而这里的response代表的是从后端服务器传输回来的数据
https.get(url,function(response){
    //检查响应状态
    console.log("statusCode:",response.statusCode)
    console.log(response);

    //we can also tap into the response that we get back,
    //and call a method call "on"
    //and search through it for some data
    response.on("data",function(data){
       const weatherData = JSON.parse(data)
       console.log(weatherData)
       const temp = weatherData.main.temp
       const weatherDescription = weatherData.weather[0].description
       const icon = weatherData.weather[0].icon
       const imageURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png"
       //只能有一个res.send()，要不然就会报错，但是可以有很多个res.write
       res.write("<h1>the temperature in "+req.body.cityName+" is" +" "+temp+" "+ "degree Celcius.</h1>");
       res.write("<h2>weather description:" +" "+ weatherDescription + "</h2>")
       res.write("<img src = "+imageURL+">")
       res.send()
    })
})
})

// const query = "Toronto";
// const appId = "735ce9eabde3cd2e12d13d5fc4ce7a79";
// const units = "metric";
// const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+appId+"&units="+units
// //而这里的response代表的是从后端服务器传输回来的数据
// https.get(url,function(response){
//     //检查响应状态
//     console.log("statusCode:",response.statusCode)
//     console.log(response);

//     //we can also tap into the response that we get back,
//     //and call a method call "on"
//     //and search through it for some data
//     response.on("data",function(data){
//        const weatherData = JSON.parse(data)
//        console.log(weatherData)
//        const temp = weatherData.main.temp
//        const weatherDescription = weatherData.weather[0].description
//        const icon = weatherData.weather[0].icon
//        const imageURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png"
//        //只能有一个res.send()，要不然就会报错，但是可以有很多个res.write
//        res.write("<h1>the temperature in Toronto,CA is" +" "+temp+" "+ "degree Celcius.</h1>");
//        res.write("<h2>weather description:" +" "+ weatherDescription + "</h2>")
//        res.write("<img src = "+imageURL+">")
//        res.send()
//     })
// })



app.listen(4000,function(){
    console.log("server is running on port 4000.")
})