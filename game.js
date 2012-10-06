/*
1- Initiate the boards with N images. Each image has a corresponding paired image.
2- Shuffle Image Location.
3- When User Clicks One Image
  3.1- The image opened before the previous image will be closed
  3.2- Will check to see if the new image is a match with the opened image. If it is, grey out both images.
4- When all of these are completed, show results.
*/

var boxopened = "";
var imgopened = "";
var count = 0;
var found = 0;


function randomFromTo(from, to){
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function shuffle() {
  var children = $("#boxcard").children();
  var child = $("#boxcard div:first-child");
  var array_img = [];
  
  for (i=0; i<children.length; i++) {
    array_img[i] = $("#"+child.attr("id")+" img").attr("src");
    child = child.next();
  }
  
  child = $("#boxcard div:first-child");
  
  for (z=0; z<children.length; z++) {
    randIndex = randomFromTo(0, array_img.length - 1);
    
    // set new image
    $("#"+child.attr("id")+" img").attr("src", array_img[randIndex]);
    array_img.splice(randIndex, 1);
    
    child = child.next();
  }
}

function initImg(pair) {
  var i = 1;
  var pairCount = Object.keys(pair).length;
  
  $.each(pair, function(key, val) {
    var j = parseInt(i, 10) + parseInt(pairCount, 10);

    var tempImg = $('<img>').attr('src', key);
    var temp = $('<div>').attr('id', 'card'+i).append(tempImg);
    $('#boxcard').append(temp);
    tempImg = $('<img>').attr('src', val);
    temp = $('<div>').attr('id', 'card'+j).append(tempImg);
    $('#boxcard').append(temp);
    i++;
  });
  
}

function resetGame() {
  shuffle();
  $("img").hide();
  $("img").removeClass("opacity");
  count = 0;
  $("#msg").remove();
  $("#count").html("" + count);
  boxopened = "";
  imgopened = "";
  found = 0;
  return false;
}

$(document).ready(function() {
/*
Here are the settings you can adjust:
1- Put the image paths in pair (one for image, and one for text) in the following format: 'image_file_path':'text_image_path'. So if you put the files in images folder and the file name is img1.jpg, then the path will be 'images/img1.jpg'
2- All the adjustable text are in msg and link
*/
  var pair = {
    'http://flickholdr.com/100/100/1/': 'http://flickholdr.com/100/100/1/',
    'http://flickholdr.com/100/100/2/': 'http://flickholdr.com/100/100/2/',
    'http://flickholdr.com/100/100/3/': 'http://flickholdr.com/100/100/3/',
    'http://flickholdr.com/100/100/4/': 'http://flickholdr.com/100/100/4/',
    'http://flickholdr.com/100/100/5/': 'http://flickholdr.com/100/100/5/',
    'http://flickholdr.com/100/100/6/': 'http://flickholdr.com/100/100/6/',
    'http://flickholdr.com/100/100/7/': 'http://flickholdr.com/100/100/7/',
    'http://flickholdr.com/100/100/8/': 'http://flickholdr.com/100/100/8/'
  };
  msg = '<span id="msg">Congrats ! You Found All With </span>';
  var link;

  initImg(pair);
  $("img").hide();
  $("#boxcard div").click(openCard);
  shuffle();
  
  function openCard() {
    
    id = $(this).attr("id");
    
    if ($("#"+id+" img").is(":hidden")) {
      $("#boxcard div").unbind("click", openCard);
      
      $("#"+id+" img").slideDown('fast');
      
      if (imgopened === "") {
        boxopened = id;
        imgopened = $("#"+id+" img").attr("src");
        setTimeout(function() {
          $("#boxcard div").bind("click", openCard);
        }, 300);
      } else {
        currentopened = $("#"+id+" img").attr("src");
        if (imgopened != currentopened) {
          // close again
          setTimeout(function() {
            $("#"+id+" img").slideUp('fast');
            $("#"+boxopened+" img").slideUp('fast');
            boxopened = "";
            imgopened = "";
          }, 400);
        } else {
          // found
          $("#"+id+" img").addClass("opacity");
          $("#"+boxopened+" img").addClass("opacity");
          found++;
          boxopened = "";
          imgopened = "";
        }
        
        setTimeout(function() {
          $("#boxcard div").bind("click", openCard);
        }, 400);
      }
      
      
      count++;
      $("#count").html("" + count);
      
      if (found == Object.keys(pair).length) {
        $("span.link").prepend(msg);
        console.log(link);
        $("#boxbutton").append(link);
      }
    }
  }
});