require('dotenv').config();
const express = require("express");
const app = express();
const https = require("https");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));

app.get('/', function(req, res){
    res.sendFile(__dirname+"/signup.html");
})

app.post('/',function(req, res){
    const first = req.body.First;
    const second = req.body.Second;
    const mail = req.body.email;

    // res.write("First Name: "+first);
    // res.write("Second Name: "+second);
    // res.write("Email Id: "+mail);

    const data = {
        members:[
            {
            email_address: mail,
            status: "subscribed",
            merge_fields:{
                FNAME: first,
                LNAME: second
            }
        }
    ]
};

app.post('/faliure', function(req, res){
    res.redirect('/');
})

// converts the above data into json format 
const jsonData = JSON.stringify(data);

// posting data to the external resource : mailchimp
const url = process.env.URL;
// javascipt object 
const options = {
    method: 'POST',
    auth: process.env.AUTH
}

// getting response from mailchimp server 
const request = https.request(url, options, function(response){
    if(response.statusCode === 200){
        res.sendFile(__dirname+"/success.html");
    }else{
        res.sendFile(__dirname+"/faliure.html");
    }
    response.on("data", function(data){
        // console.log(JSON.parse(data));
    });
})

// pass jsondata to mailchimp server 
request.write(jsonData);
request.end();

})

// deploying on heroku port , defineed by them or localhost:3000 
app.listen(process.env.PORT || 3000, function(){
    console.log("Server Running 3000")

})
