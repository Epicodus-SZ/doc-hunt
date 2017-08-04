//Include our Back end logic
var betterDoctor = require('./../app/scripts/betterdoctor.js');

///////////////////////////////////
//UI LOGIC

// UI callback function for dropdown
var showDrInfo = function(allData) {
  console.log(allData);

};


//the document ready method
$(document).ready(function() {

  //basic API test
  var test = new betterDoctor();
  test.getDoctors("heart",showDrInfo);

}); //end of jQuery ready
