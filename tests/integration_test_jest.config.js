const $ = require('jquery');
const { nextSequence, playSound, animatePress, checkAnswer, startOver } = require('../script'); // Adjust the path as necessary

describe('Simon Game Integration Tests', () => {
  let originalBody;
  
  beforeAll(() => {
    // Set up the DOM for testing
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
    originalBody = document.body;
  });

  afterAll(() => {
    // Clean up the DOM after tests
    document.body = originalBody;
  });

  beforeEach(() => {
    // Reset the game state before each test
    startOver();
  });

  test('nextSequence should update gamePattern and level', () => {
    nextSequence();
    expect(gamePattern.length).toBe(1);
    expect(level).toBe(1);
  });

  test('playSound should play the correct sound for each color', () => {
    const audioMock = jest.spyOn(window, 'Audio').mockImplementation(() => ({
      play: jest.fn(),
    }));

    playSound('red');
    expect(audioMock).toHaveBeenCalledWith('./sounds/sounds_red.mp3');
    expect(audioMock().play).toHaveBeenCalled();

    playSound('blue');
    expect(audioMock).toHaveBeenCalledWith('./sounds/sounds_blue.mp3');
    expect(audioMock().play).toHaveBeenCalled();

    audioMock.mockRestore();
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
    gamePattern = ['red'];
    userClickedPattern = ['red'];

    jest.spyOn(window, 'setTimeout');
    checkAnswer(0);
    
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  test('checkAnswer should call startOver if answer is incorrect', () => {
    gamePattern = ['red'];
    userClickedPattern = ['blue'];

    const startOverMock = jest.spyOn(window, 'startOver');
    checkAnswer(0);
    
    expect(startOverMock).toHaveBeenCalled();
    startOverMock.mockRestore();
  });

  test('clicking a button should trigger the correct sequence', () => {
    const button = $('#green');
    button.click();
    
    expect(userClickedPattern.length).toBe(1);
    expect(userClickedPattern[0]).toBe('green');
  });

  test('pressing a key should start the game', () => {
    const event = new KeyboardEvent('keypress');
    document.dispatchEvent(event);
    
    expect(started).toBe(1);
    expect(level).toBe(1);
  });
});