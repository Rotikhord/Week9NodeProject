// variable preparation
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

// static directory
app.use(express.static('public-access'));

// VIEW
//app.set('views', 'view-access');
app.set('view engine', 'ejs');

// CONTROL
app.get('/math', returnResults);
app.get('/rate', returnRate);
app.get('/math_service', returnJSON);
console.log(__dirname);
app.get('/', function (req, res) { res.sendFile('views/pages/home.html', { root: __dirname })});

// Have Control listening on PORT()
app.listen(port, function() {
    console.log(`The server is listening on PORT ${port} and will run here as well.`)
});

// MODEL
function calculate(request){
    console.log('request received = ' + request.url);
    // prepare variables
    var operation = request.query.operations;
    var fNum = Number(request.query.firstNum);
    var sNum = Number(request.query.secondNum);
    var answer = 0;
    
    // handle the operation
    if (operation == 'Add') {
        console.log('request received = add');
        answer = fNum + sNum;
    }
    if (operation == 'Subtract') {
        console.log('request received = subtract');
        answer = fNum - sNum;
    }
    if (operation == 'Multiply') {
        console.log('request received = multiply');
        answer = fNum * sNum;
    }
    if (operation == 'Divide') {
        console.log('request received = divide');
        answer = fNum / sNum;
    }
    
    // prepare the parameters to be sent to the calculation-results.ejs
    var params = {operation: operation, fNum: fNum, sNum: sNum, answer: answer};
    
    return params;
}

function calculateRate(request) {

}

function returnRate(request, response) {
  console.log("requesting Rate");

  var type = String(request.query.type);
  var weight = Number(request.query.weight);


  var message = '';
  var rate;
  //Check for each type
  if (type == 'card') {
    rate = .35;
    message = "A postcard with a weight of " + weight + "oz, should cost $";
  }

  if (type == 'stamp' || type == 'meter') {
    if (weight > 3.5) {
      type = 'flats';
    }
    else {
      if (type == 'stamp') {
        rate = .55;
        message = "A stamped letter with a weight of " + weight + "oz, should cost $";
      } else {
        message = "A metered letter with a weight of " + weight + "oz, should cost $";
        rate = .50;
      }

      for (var i = 1; i < 4; i++) {
        if (weight > i) {
          rate += .15;
        }
      }
    }
  }

    if (type == 'flats') {
      rate = .5;
      for (var i = 0; i < 13; i++) {
        if (weight > i) {
          rate += .15;
        }
      }
      if (weight > 13) {
        rate = -1;
      }
      message = "A large envelope with a weight of " + weight + "oz, should cost $";
    }

    if (type == 'retail') {
      if (weight < 4) {
        rate = 3.66;
      } else if (weight < 8) {
        rate = 4.39;
      } else if (weight < 12) {
        rate = 5.19;
      } else {
        rate = -1;
      }
      message = "A first class parcel with a weight of " + weight + "oz, should cost $";
    }

    if (rate == undefined) {
      message = "An error occured. Please try again later.";
    } else if (rate == -1) {
      message = "This estimator only hanldes weights of 13 oz or less..."
    } else {
      message += rate.toFixed(2) + " to ship."
    }
    console.log(message);
  
  var params = { message: message, type: type, weight: weight };

  response.render('pages/rate', params);

}


function returnResults (request, response) {
    var params = calculate(request);
    console.log('request page');
    // send to calculation-results.ejs
    // response.writeHead(200, {"Content-Type": "text/html"});
    response.render('calculation-results', params);
    response.end();
}

function returnJSON (request, response) {
    var params = JSON.stringify(calculate(request));
    console.log('request JSON');
    // 
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(params);
    response.end();
}
