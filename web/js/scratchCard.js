var score;
var cardList;
var scoreBoard;
var disabled;
var curCardNums;
var disableTime;
var gameMode;
var errorCnt;
var remain;
var point;
var missionResult;

// 게임 작동에 관한 모드 설정


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
  gameMode = 'on';
  errorCnt = 0;
  remain = 1;
  point = 0
  missionResult = 'fail';

  generate('top');
  generate('left');
  generate('right');
  generate('bottom');

  $('#centerCardArea').text(0);
  $(".cardClickArea").on("tap",cardClickListener);
  // $('.cardClickArea').click(cardClickListener);

  $('body').keydown(function(e){
    e.preventDefault();
    switch (e.keyCode) {
      case 37:
          doMoveIfAble('left')
          if($('#stackCount').text() == 1) {
  			AutoStart();
  		  }
          break;
      case 38:
          doMoveIfAble('top');
          if($('#stackCount').text() == 1) {
  			AutoStart();
  		  }
          break;
      case 39:
          doMoveIfAble('right');
          if($('#stackCount').text() == 1) {
  			AutoStart();
  		  }
          break;
      case 40:
          doMoveIfAble('bottom');
          if($('#stackCount').text() == 1) {
  			AutoStart();
  		  }
    }
  });
  initTimer();
}
function cardClickListener(){
  var dir;
  if($(this).hasClass('topCard'))         { dir = 'top'; }
  else if($(this).hasClass('leftCard'))   { dir = 'left'; }
  else if($(this).hasClass('rightCard'))  { dir = 'right'; }
  else if($(this).hasClass('bottomCard')) { dir = 'bottom'; }

  doMoveIfAble(dir);
  if($('#stackCount').text() == 1) {
  	AutoStart();
  }
  console.log($('#stackCount').text());
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
  $('#stackCount').text(parseInt($('#stackCount').text())+1);
  $('#centerCardArea').text(parseInt($('#centerCardArea').text())+1);
  PointCalc();
  MissionSetting();
  $('#scoreCount').text(point);
  LifeRecovery();
  console.log(remain);
}

function addError(){
  $('#errorCount').text(parseInt($('#errorCount').text())+1);
  $('#centerCardArea').text(0);

}

function isDisabled(dir){
  return (disabled.indexOf(dir) != -1)
}

function doMoveIfAble(dir){
	if(gameMode == "on"){
	  if(dir && !isDisabled(dir)){
	    var targetCard = $('.cardImageDiv.'+dir+'Card');
	    var targetNum = parseInt($(targetCard).attr('class').replace(/[a-z]/gi, ""));
	    if(!isCorrect(targetNum)){
	      addError();
	      LifeDecreation();
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


var seconds = 0, minutes = 1, hours = 0, timerEvent;
/*
function addSecond() {
  seconds++;
  if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
          minutes = 0;
          hours++;
      }
  }
  var textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" +
                    (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" +
                    (seconds > 9 ? seconds : "0" + seconds);
  setTimer(textContent);
  console.log(textContent);
  startTimer();
}
*/
function startTimer() {
//  console.log("asdf");

  /*
  timerEvent = setTimeout(addSecond, 1000);
  */

  // 시간초 모드 작성
  timerEvent = setTimeout(decSecond, 1000);
}

function initTimer(){
  $('#startTimer').click(startTimer);
  $('#stopTimer').click(function(){ clearTimeout(timerEvent); });
  $('#clearTimer').click(function() {
    clearTimeout(timerEvent);
    setTimer("00:01:00");
    seconds = 0; minutes = 1; hours = 0;
    gameMode = 'on';
    $('#stackCount').text(0);
    $('#errorCount').text(0);
    $('#centerCardArea').text(0);
    $('#scoreCount').text(0);
    point = 0;
  });
}
function setTimer(string){
  $('#timer time').text(string);
}

function decSecond() {

  if (seconds <= 0) {
  	  /*
      seconds = 59;
      minutes--;
      */
      if (minutes <= 0) {
      	  if (hours == 0) {
      	  	  gameMode = 'off';
      	  	  console.log($('#stackCount').text());
      	  	  if(missionResult == "success"){
      	  	  	 $('#centerCardArea').text("Clear");
      	  	  }
      	  	  else {
      	  	  	 $('#centerCardArea').text("Lose");
      	  	  }
      	  }
      	  else if(hours > 0) {
      	  	  hours--;
      	  	  minutes = 59;
      	  	  seconds = 60;
      	  	  seconds--;
      	  }
      }
      else if(minutes > 0) {
      	  minutes--;
      	  seconds = 60;
      	  seconds--;
      	  }
   }
   else if (seconds > 0)
   {
   seconds--;
   }



  var textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" +
                    (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" +
                    (seconds > 9 ? seconds : "0" + seconds);
  setTimer(textContent);
  console.log(textContent);
  startTimer();
}

function AutoStart() {
	initTimer();
	startTimer();
}

function LifeRecovery() {
	remain = ($('#stackCount').text()) % 3;
	if(remain == 00) {
		seconds++;
		}
}

function LifeDecreation() {
	seconds--;
	seconds--;
}

function PointCalc(){
	if($('#centerCardArea').text()>=1 && $('#centerCardArea').text()<=10)
	{
		point += 100;
	}
	else if($('#centerCardArea').text()>=11 && $('#centerCardArea').text() <=20)
	{
		point += 110;
	}
	else if($('#centerCardArea').text()>=21 && $('#centerCardArea').text() <=30)
	{
		point += 120;
	}
	else if($('#centerCardArea').text()>=31 && $('#centerCardArea').text() <=40)
	{
		point += 130;
	}
	else if($('#centerCardArea').text()>=41 && $('#centerCardArea').text() <=50)
	{
		point += 140;
	}
	else if($('#centerCardArea').text()>=51 && $('#centerCardArea').text() <=60)
	{
		point += 150;
	}
	else if($('#centerCardArea').text()>=61 && $('#centerCardArea').text() <=70)
	{
		point += 160;
	}
	else if($('#centerCardArea').text()>=71 && $('#centerCardArea').text() <=80)
	{
		point += 170;
	}
	else if($('#centerCardArea').text()>=81 && $('#centerCardArea').text() <=90)
	{
		point += 180;
	}
	else if($('#centerCardArea').text()>=91 && $('#centerCardArea').text() <=100)
	{
		point += 190;
	}
	else if($('#centerCardArea').text()>=101)
	{
		point += 200;
	}
}

function MissionSetting(){
	if($('#centerCardArea').text()>=70)
	{
		gameMode = 'off';
		console.log(point);
		console.log(gameMode);
		clearTimeout(timerEvent);
		point += seconds * 1000;
		$('#centerCardArea').text("Clear");
		missionResult = 'success';
	}
}
