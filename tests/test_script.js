const $ = require('jquery');
const { nextSequence, playSound, animatePress, checkAnswer, startOver } = require('../script'); // Adjust the path as necessary

// Mocking the Audio class for sound playback
class MockAudio {
  constructor() {
    this.play = jest.fn();
  }
}

// Replace the Audio constructor with the mock
global.Audio = MockAudio;

describe('Simon Game Functions', () => {
  beforeEach(() => {
    // Reset the game state before each test
    startOver();
  });

  test('nextSequence should increment level and update gamePattern', () => {
    nextSequence();
    expect(level).toBe(1);
    expect(gamePattern.length).toBe(1);
    expect(buttonColours).toContain(gamePattern[0]);
  });

  test('playSound should play the correct sound for each color', () => {
    const colors = ['red', 'blue', 'green', 'yellow'];
    colors.forEach(color => {
      playSound(color);
      expect(MockAudio.prototype.play).toHaveBeenCalled();
    });
  });

  test('animatePress should add and remove pressed class', () => {
    const color = 'green';
    animatePress(color);
    expect($(`#${color}`).hasClass('pressed')).toBe(true);
    
    // Simulate the timeout
    jest.advanceTimersByTime(100);
    expect($(`#${color}`).hasClass('pressed')).toBe(false);
  });

  test('checkAnswer should call nextSequence if answer is correct', () => {
    gamePattern = ['red', 'blue'];
    userClickedPattern = ['red', 'blue'];
    
    jest.spyOn(global, 'setTimeout'); // Mock setTimeout
    checkAnswer(1);
    
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  test('checkAnswer should call startOver if answer is incorrect', () => {
    gamePattern = ['red', 'blue'];
    userClickedPattern = ['red', 'green']; // Incorrect answer

    const startOverSpy = jest.spyOn(window, 'startOver');
    checkAnswer(1);
    
    expect(startOverSpy).toHaveBeenCalled();
    expect($('h1').text()).toBe('Game Over, Press Any Key to Restart!');
  });

  test('startOver should reset the game state', () => {
    level = 5;
    gamePattern = ['red', 'blue', 'green'];
    userClickedPattern = ['red', 'blue'];

    startOver();
    
    expect(level).toBe(0);
    expect(gamePattern).toEqual([]);
    expect(userClickedPattern).toEqual([]);
    expect(started).toBe(0);
  });
});

// Mocking jQuery for DOM manipulation tests
beforeEach(() => {
  jest.useFakeTimers();
  document.body.innerHTML = `
    <h1 id="level-title">Press A Key to Start</h1>
    <div class="container">
      <div class="row">
        <div type="button" id="green" class="btn green"></div>
        <div type="button" id="red" class="btn red"></div>
      </div>
      <div class="row">
        <div type="button" id="yellow" class="btn yellow"></div>
        <div type="button" id="blue" class="btn blue"></div>
      </div>
    </div>
  `;
});

afterEach(() => {
  jest.clearAllMocks();
});