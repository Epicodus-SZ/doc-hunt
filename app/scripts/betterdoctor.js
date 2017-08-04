var apiKey = require('../../.env').apiKey;
const location = "47.607424%2C-122.335993"

//BUSINESS logic
function BetterDoctor(){
}

BetterDoctor.prototype.getDoctors = function(medicalIssue, passedUIFunction){
  $.get('https://api.betterdoctor.com/2016-03-01/doctors?query='+ medicalIssue+'&location='+location+'%2C100&user_location='+location+'&skip=0&limit=20&user_key=' + apiKey)
   .then(function(result) {
     console.log("URL sent is>"+'https://api.betterdoctor.com/2016-03-01/doctors?query='+ medicalIssue+'&location=45.5231%2C-122.6765%2C%205&user_location=45.5231%2C-122.6765&skip=0&limit=20&user_key=' + apiKey);
     console.log("the results are",result);
    })
   .fail(function(error){
      console.log("fail");
    });
};

module.exports = BetterDoctor;
