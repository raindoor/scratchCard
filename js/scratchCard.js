var score;
var cardList;
var scoreBoard;
var disabled;
var curCardNums;
var disableTime;
var gameMode;
var errorCnt;

$(function(){
  init();
});

function init(){
  score = 0;
  cardList = $('#cardList');
  scoreBoard = $('#centerCardArea');
  disabled = new Array();
  curCardNums = new Array();
  disableTime = 100;
  gameMode = 's';
  errorCnt = 0;

  generate('top');
  generate('left');
  generate('right');
  generate('bottom');

  $('#centerCardArea').text(0);
  $('#errorArea').text(0);
  $(".cardClickArea").on("tap",function(){
    var dir;
    if($(this).hasClass('topCard'))         { dir = 'top'; }
    else if($(this).hasClass('leftCard'))   { dir = 'left'; }
    else if($(this).hasClass('rightCard'))  { dir = 'right'; }
    else if($(this).hasClass('bottomCard')) { dir = 'bottom'; }

    doMoveIfAble(dir);
  });
  // $('.cardClickArea').click(function(){
  //   var dir;
  //   if($(this).hasClass('topCard'))         { dir = 'top'; }
  //   else if($(this).hasClass('leftCard'))   { dir = 'left'; }
  //   else if($(this).hasClass('rightCard'))  { dir = 'right'; }
  //   else if($(this).hasClass('bottomCard')) { dir = 'bottom'; }
  //
  //   doMoveIfAble(dir);
  // });

  $('body').keydown(function(e){
    e.preventDefault();
    switch (e.keyCode) {
      case 37:
          doMoveIfAble('left')
          break;
      case 38:
          doMoveIfAble('top');
          break;
      case 39:
          doMoveIfAble('right');
          break;
      case 40:
          doMoveIfAble('bottom');
    }
  });
}

function generate(dir){
  makeCard(getRanNum(1, 9), dir);
}

function makeCard(num, dir){
  $(cardList).append('<div class="cardImageDiv '+dir+'Card card' + num + '">'+num+'</div>');
}

function getRanNum(start, end){
  while(true){
    var ranNum = Math.floor((Math.random()*(end-start+1))+start);
    if(curCardNums.indexOf(ranNum) == -1){
      curCardNums.push(ranNum);
      return ranNum;
    }
  }
}

function addScore(){
  $('#centerCardArea').text(parseInt($('#centerCardArea').text())+1);
}

function addError(){
  $('#errorArea').text(parseInt($('#errorArea').text())+1);
}

function isDisabled(dir){
  return (disabled.indexOf(dir) != -1)
}

function doMoveIfAble(dir){
  if(dir && !isDisabled(dir)){
    var targetCard = $('.cardImageDiv.'+dir+'Card');
    var targetNum = parseInt($(targetCard).attr('class').replace(/[a-z]/gi, ""));
    if(!isCorrect(targetNum)){
      addError();
      return;
    }
    disabled.push(dir);
    var cssObj = {opacity: 0};
    if(dir == 'top' || dir == 'bottom') cssObj.top = "188px";
    if(dir == 'left' || dir == 'right') cssObj.left = "200px";

    curCardNums.splice(curCardNums.indexOf(targetNum), 1);
    decCardNum(1);
    addScore();
    generate(dir);
    $(targetCard).animate(cssObj, disableTime, function() {
      disabled.splice(disabled.indexOf(dir), 1);
      $(targetCard).remove();
    });
  };
}

function isCorrect(targetNum){
  for(var i = 0; i<curCardNums.length; i++){
    if(targetNum > curCardNums[i]) {//smaller
      return false;
    }
  }
  return true;
}

function decCardNum(num){
  $('.cardImageDiv').each(function(){
    var eachNum = parseInt($(this).attr('class').replace(/[a-z]/gi, ""));
    console.log(eachNum);
    if(curCardNums.includes(eachNum)){
      $(this).removeClass('card'+eachNum)
             .addClass('card'+(eachNum-1))
             .text(eachNum-1);
      console.log("card"+eachNum+" -> card"+(eachNum-1));
    }
  })
  for(var i = 0; i<curCardNums.length; i++){
    curCardNums[i] -= num;
  }
}
