const https = require('https');
const bodyParser = require('body-parser');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/',function(req,res){
    res.sendFile('index.html');
})

app.post('/', function(req,res){

    const city = req.body.city;
    const apiKey = "e0d30a338c9520f8d11dad3126505a2f";
    const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + city + "&units=metric";

    https.get(url, function(response){
        if(response.statusCode === 200)
        {
           response.on("data", function(data){
                const weatherDetails = JSON.parse(data);
                const description = weatherDetails.weather[0].description;
                const temp = weatherDetails.main.temp;
                const icon = "http://openweathermap.org/img/wn/" + weatherDetails.weather[0].icon + "@2x.png";
                res.send(`
                <html><head><style>
                body{
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    background: #1abc9c;
                }
                div
                {
                    text-align: center;
                    padding: 100px;
                }
                </style></head><body>
                <div>
                <h1> Weather in ${city} city</h1>
                <img src = ${icon}>
                <h2>The current Weather is ${description} </h2>
                <h2>The Temperature is ${temp} deg celsius</h2>
                </div></body></html>`);
            })
        }
        else
            res.sendFile(__dirname + '/city.html');  
    })
})

app.get('/retry', function(req,res){
    res.redirect('/');
});

app.listen(port, function(){
    console.log("app listening on port" , port);
})