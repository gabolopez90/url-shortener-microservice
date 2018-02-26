const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const shortUrl = require("./models/shortUrl");
const path = require("path");
const app = express();
const shortid = require('shortid');
var mlab = "mongodb://gabo:user@ds117271.mlab.com:17271/to-do";
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.use(cors());
mongoose.connect(mlab);
app.use(express.static(path.join(__dirname, "/public/")));

app.get("/new/:url(*)", (req, res)=>{
    var urlToShorten = req.params.url;
    var regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    if(regex.test(urlToShorten)){
        
        shortUrl.findOne({"originalUrl": urlToShorten}, {_id:0, __v:0},  (err, doc)=>{
            if(err) return res.send("Unable to connect to the database");
            if(doc){
                res.send(doc);
           }
           else {
                var shortId = shortid.generate().toString();
                var data = new shortUrl({
                    "originalUrl": urlToShorten,
                    "shorterUrl": "https://url-shortener-microservice-gabolopez90.c9users.io/" + shortId
                });
                data.save(err=>{
                    if(err) return res.send("Error saving to database");
                });
                res.send({
                    "originalUrl": urlToShorten,
                    "shorterUrl": "https://url-shortener-microservice-gabolopez90.c9users.io/" + shortId
                });
           }
        });
    }
    else {
        res.json({"originalUrl": "Not a valid Url"});
    }
});

app.get("/:urlToForward", (req, res)=>{
    var shorterUrl = req.params.urlToForward;
    shortUrl.findOne({"shorterUrl": "https://url-shortener-microservice-gabolopez90.c9users.io/" + shorterUrl}, {_id:0, __v:0}, (err, doc)=>{
        if(err) return res.send("Unable to connect to the database");
        if(doc){
            var re = new RegExp("^(http|https)://","i");
            if(re.test(doc.originalUrl)){
                res.redirect(doc.originalUrl);
            }
            else{
                res.redirect("https://"+doc.originalUrl);
            }
        }
        else{
            res.redirect("index.html");
        }
    });
});


app.listen(process.env.PORT, function(){
   console.log("Now listening on port "+ process.env.PORT);
});