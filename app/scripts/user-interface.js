//Include our Back end logic
var betterDoctor = require('./../app/scripts/betterdoctor.js');

///////////////////////////////////
//UI LOGIC

// UI callback function for dropdown
var showDrInfo = function(bdData) {
  console.log(bdData);
  var searchResults = bdData.data;
  var $template = $('#template'),
    $row = $('.results');

    var rows = [];
    $.each(searchResults, function (index, friend) {
        var templateHtml = $template.text()
          .replace(/{{last_name}}/g, this.profile.last_name)
          .replace(/{{first_name}}/g, this.profile.first_name)
          .replace(/{{bio}}/g, this.profile.bio)
          .replace(/{{phone}}/g, this.practices[0].phones[0].number
            .replace(/(\d{3})(\d{3})(\d{4})/, '($1)-$2-$3'))
          .replace(/{{practice}}/g, this.practices[0].name);
        rows.push(templateHtml);
    });

    $row.html(rows); //Append them in the end

};


//the document ready method
$(document).ready(function() {

  $("#form").submit(function(event){
    event.preventDefault();
    var ailment = $("#search").val();
    // if (validForm(submittedNum)) {
    //   displayResults(pingPong(submittedNum));
    // } else {
    //   $("#inputNum").popover('show');
    // }
    var test = new betterDoctor();
    test.getDoctors(ailment,showDrInfo);
  }); // end of submit listener




}); //end of jQuery ready
