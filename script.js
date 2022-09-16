// Variables
let buttonColours = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];

let level = 0;
let randomChosenColour = 0;
let started = 0;

// Functions
function nextSequence() {
  let randomNumber = Math.floor(Math.random() * 4);
  userClickedPattern = [];
  randomChosenColour = buttonColours[randomNumber];

  $(`#${randomChosenColour}`).fadeOut(200).fadeIn(200);
  playSound(randomChosenColour);
  gamePattern.push(randomChosenColour);

  level++;
  $("h1").text(`Level ${level}`);
  //   return randomNumber;
}

function playSound(name) {
  switch (name) {
    case "blue":
      let blueAudio = new Audio("./sounds/sounds_blue.mp3");
      blueAudio.play();
      break;
    case "red":
      let redAudio = new Audio("./sounds/sounds_red.mp3");
      redAudio.play();
      break;
    case "green":
      let greenAudio = new Audio("./sounds/sounds_green.mp3");
      greenAudio.play();
      break;
    case "yellow":
      let yellowAudio = new Audio("./sounds/sounds_yellow.mp3");
      yellowAudio.play();
      break;
    default:
      break;
  }
}

function animatePress(currentColour) {
  $(`#${currentColour}`).addClass("pressed");
  setTimeout(function () {
    $(`#${currentColour}`).toggleClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length)
      setTimeout(nextSequence, 1000);
  } else {
    let wrongAudio = new Audio("./sounds/sounds_wrong.mp3");
    wrongAudio.play();

    $("body").toggleClass("game-over");

    setTimeout(function () {
      $("body").toggleClass("game-over");
    }, 200);

    $("h1").text("Game Over, Press Any Key to Restart!");

    startOver();
  }
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = 0;
}

// Event Handlers

$(".btn").click(function (e) {
  let userChosenColor = e.target.id;
  userClickedPattern.push(userChosenColor);
  console.log(userClickedPattern.length);
  playSound(userChosenColor);

  animatePress(userChosenColor);

  let lenght = userClickedPattern.length - 1;
  checkAnswer(lenght);
});

// $(document).one("keypress", nextSequence);
$(document).on("keypress", function () {
  if (!started) {
    started = 1;
    nextSequence();
  }
});
