const express = require("express");
const app = express();
const https = require("https");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}))

// used to use static files like css and images naming the dir public 
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
const url = "https://us18.api.mailchimp.com/3.0/lists/2e14673f4c";
// javascipt object 
const options = {
    method: 'POST',
    auth: "dushyant:02ad3cf287dc230544a53d8b8ae5a2a6-us18"
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
app.listen(process.env.PORT || 3000);{
    console.log("Server Running 3000")
}

// api key
// 02ad3cf287dc230544a53d8b8ae5a2a6-us18 : replace usX (X) with 18 after us
// Audience id 
// 2e14673f4c