/*
1- Initiate the boards with N images. Each image has a corresponding text.
2- Shuffle Text.
3- When User Clicks and Drags One Piece of Text.
  3.1- It can be dropped to a container below the image
  3.2- Will check to see if the text is a match to the image. If true, increment found.
4- When all of these are completed, show results.
*/

var count = 0;
var found = 0;
var msg = '<span id="msg">Great, You Got It</span>';
var allPairs = [
	{
		'http://dummyimage.com/150x100/000/fff&text=11': 'Text For Image 1',
		'http://dummyimage.com/150x100/000/fff&text=12': 'Text For Image 2',
		'http://dummyimage.com/150x100/000/fff&text=13': 'Text For Image 3',
		'http://dummyimage.com/150x100/000/fff&text=14': 'Text For Image 4',
		'http://dummyimage.com/150x100/000/fff&text=15': 'Text For Image 5',
		'http://dummyimage.com/150x100/000/fff&text=16': 'Text For Image 6'
	},
	{
		'http://dummyimage.com/150x100/000/fff&text=21': 'Text For Image 1',
		'http://dummyimage.com/150x100/000/fff&text=22': 'Text For Image 2',
		'http://dummyimage.com/150x100/000/fff&text=23': 'Text For Image 3',
		'http://dummyimage.com/150x100/000/fff&text=24': 'Text For Image 4',
		'http://dummyimage.com/150x100/000/fff&text=25': 'Text For Image 5',
		'http://dummyimage.com/150x100/000/fff&text=26': 'Text For Image 6'
	}
];


function init(pair) {
	$("#next").hide();
	$("#prev").hide();

	var i = 0;
	var pairCount = Object.keys(pair).length;
	var imgContainer = $('<div>').attr('id', 'imgWrapper');
	var textContainer = $('<div>').attr('id', 'textWrapper');
  
	$.each(pair, function(key, val) {
		var tempImgContainer = $('<div>').attr('id', 'imgContainer'+i).data('pair', i);
		$('<img>').attr({
			'src': key,
			'id': 'img' + i
		}).data('pair', i).appendTo(tempImgContainer);
		$('<div>').droppable({
			accept: '#textWrapper div',
			hoverClass: 'hovered',
			drop: handleDrop
		}).data('pair', i).attr('id', 'textForImg'+i).appendTo(tempImgContainer);
		imgContainer.append(tempImgContainer);
		
		var tempTextContainer = $('<div>').attr('id', 'textContainer'+i).data('pair', i).text(val).draggable({
			containment: '#boxcard',
			stack: '#textWrapper div',
			cursor: 'move',
			revert: true,
            snap: true
		});
		textContainer.append(tempTextContainer);
		
		i++;
	});
	$('#boxcard').append(imgContainer).append(textContainer);
}

function randomFromTo(from, to){
	return Math.floor(Math.random() * (to - from + 1) + from);
}

function shuffle() {
	var children = $("#textWrapper").children().get().sort(function() {
		return Math.random() - 0.5;
	});
	$("#textWrapper").append(children);
}

function handleDrop( event, ui ) {
  $('<audio preload="auto" hidden="true" autoplay><source src="audio/FlipCard.mp3" loop="false"></source><source src="audio/FlipCard.ogg" loop="false"></source>Sorry, Your Browser Does not Support This Audio</audio>').appendTo('body');
  var dropped = $(this).data('pair');
  var dragged = ui.draggable.data('pair');
  count++;
  $('#count').text(count);
  
  if(dragged == dropped) { //Match - Lock in place and increment found
    found++;
    $(this).droppable( 'disable' );
    ui.draggable.addClass( 'correct' );
    ui.draggable.draggable( 'disable' );
    ui.draggable.draggable( 'option', 'revert', false );
    ui.draggable.position({
      of: $(this),
      my: 'left top',
      at: 'left top'
    });
  } else {
    ui.draggable.draggable( 'option', 'revert', true );
  }
  
  if(found == 6) {
  	if(currentPairIndex == 0) {
  		$("#next").show();
  	} else if(parseInt(currentPairIndex, 10) + 1 == allPairs.length) {
  		$("#prev").show();
  	} else {
  		$("#next").show();
  		$("#prev").show();
  	}

    $('<audio preload="auto" hidden="true" autoplay><source src="audio/YouWin.mp3" loop="false"></source><source src="audio/YouWin.ogg" loop="false"></source>Sorry, Your Browser Does not Support This Audio</audio>').appendTo('body');
  }
} //End of Function

function resetGame(pair) {
	$("#boxcard").html("");
  init(pair);
  shuffle();
  count = 0;
  found = 0;
  boxopened = "";
  imgopened = "";
	$("#msg").remove();
  $("#count").html("" + count);
  return false;
}


$(document).ready(function() {
	function prepGame() {
		console.log(currentPairIndex);
		pair = allPairs[currentPairIndex];
		resetGame(pair);
		shuffle();
	}

	currentPairIndex = document.getElementsByTagName("body")[0].getAttribute("data-currentpage");
	prepGame();
	
	$("#prev").on("click", function() {
		currentPairIndex = parseInt(currentPairIndex, 10);
  	$("body").data("currentpage", --currentPairIndex);
  	prepGame();
	});
	$("#next").on("click", function() {
		currentPairIndex = parseInt(currentPairIndex, 10);
  	$("body").data("currentpage", ++currentPairIndex);
  	prepGame();
	});
	$('#reset').on('click', function() {
		resetGame(pair);
	});

	/*
	init(pair);
	shuffle();
	
	$('#reset').on('click', function() {
		resetGame(pair);
	});*/
});