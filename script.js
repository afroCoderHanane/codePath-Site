

//Global variables
var pattern = [2,2,4,3,2,1,2,4];
var progress = 0;
var gamePlaying = false;
var guessCounter= 0
//sounds protocol
var tonePlaying = false;
var volume = .5;//must be between .0 and 1.0
//global constants
var clueHoldTime = 1000;
const cluePauseTime= 333;
const nextClueWaitTime = 1000;

//random number gen
function getRandom(min,max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min)
}

//functions
function startGame(){
  //initialize game variables
  progress = 0;
  gamePlaying= true;
  //initialize random number
  for(let i = 0;i<pattern.length -1;i++){
    pattern[i]=getRandom(1,4);
  }
//swap the start and stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
  gamePlaying= false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightbutton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearbutton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

//clues function
  //Single clue
function playSingleClue(btn){
  if(gamePlaying){
  lightbutton(btn);
  playTone(btn,clueHoldTime);
  setTimeout(clearbutton,clueHoldTime, btn);
  }
}

  //clue sequence
function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime;//set delay to initial wait time
  for (let i = 0; i<=progress; i++){ 
    console.log("play single clue: "+ pattern[i]+ " in "+ delay+ "ms")
    setTimeout(playSingleClue, delay, pattern[i])//set a timeout to play that clue
    delay +=clueHoldTime
    delay += cluePauseTime;
    clueHoldTime-=50;
  }
}
//lose game function
function loseGame(){
  stopGame();
  alert("Game over! you lost.");
}
//game winning
function winGame(){
  stopGame();
  alert("Game over! you are the Winner🎉🎉.");
}

function guess(btn){
  console.log("user guessed: "+ btn);
  if(!gamePlaying){
    return;
  }
   if(pattern[guessCounter] == btn){
    //Guess was correct!
     if(guessCounter!=progress)
       {
         guessCounter++;
       }
    else
      {
        if(progress == pattern.length -1)
        {
          winGame();
        }
        else{
          progress++;
          playClueSequence();
        }
      }
  }else{
    //Guess was incorrect GAME OVER!
    loseGame();
  }
}