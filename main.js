var https = require("https");
var express = require("express");
var fs = require("fs");
var hbs = require("hbs");
var path = require("path");
var cli = require("commander");

// Globals

var config = JSON.parse(fs.readFileSync("config.json"));
var options = {
    key: fs.readFileSync("key.pem"),
    cert:fs.readFileSync("cert.pem")
};

// Parse cmd line

cli.version("0.1")
    .usage("This runs the journaling server.")
    .option("-p, --port <n>", "The port number to listen on.", parseInt, 2000)
    .parse(process.argv);

// Set Up Express

var app = express();
app.use(express.bodyParser());
app.set("views", __dirname + "/private/");
app.set("view engine", "html");
app.engine("html", hbs.__express);


// ---- ROUTING ----

app.get("/", function(req, res) {
    res.status(200).sendfile("public/index.html");
});

app.get("/icon.png", function(req, res) {
    res.status(200).sendfile("public/icon.png");
});

app.post("/newpost", function(req, res) {
    if (req.body.password === config.password) {
        res.status(200).render("journal.html", config);
    } else {
        res.status(200).sendfile("public/denied.html");
    }
});

app.post("/createpost", function(req, res) {
    if (req.body.password === config.password) {
        var weather = null;
        try {
            if (req.body.weather !== "") {
                weather = JSON.parse(req.body.weather);
            }
        } catch(e) {}

        var write = {
            time: Date.now(),
            tz: (new Date()).getTimezoneOffset(),
            userAgent: req.headers["user-agent"],
            text: req.body.mainText,
            pos: {
                latitude: req.body.posLat,
                longitude: req.body.posLong,
                accuracy: req.body.posAcc
            },
            weather: weather
        };

        var writeStr = JSON.stringify(write);

        fs.writeFile("posts/"+Date.now()+".json", writeStr, function(err) {
            if(err) {
                console.log(err);
            }
        }); 
        res.status(200).sendfile("private/success.html");
    } else {
        res.status(200).sendfile("public/denied.html");
    }
});

https.createServer(options, app).listen(cli.port);
