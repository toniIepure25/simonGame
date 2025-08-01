const $ = require('jquery');
const { nextSequence, playSound, animatePress, checkAnswer, startOver } = require('../script');

describe('Simon Game Functions', () => {
  beforeEach(() => {
    // Reset the game state before each test
    startOver();
  });

  test('nextSequence should increase level and update game pattern', () => {
    // Mock the jQuery fadeOut and fadeIn methods
    jest.spyOn($.fn, 'fadeOut').mockImplementation(() => $);
    jest.spyOn($.fn, 'fadeIn').mockImplementation(() => $);
    jest.spyOn(window, 'Audio').mockImplementation(() => ({
      play: jest.fn(),
    }));

    // Call nextSequence
    nextSequence();

    // Check if level increased
    expect(level).toBe(1);
    // Check if gamePattern has one item
    expect(gamePattern.length).toBe(1);
    // Check if userClickedPattern is reset
    expect(userClickedPattern.length).toBe(0);
    // Check if the correct sound is played
    expect(window.Audio).toHaveBeenCalled();
  });

  test('playSound should play the correct sound based on color', () => {
    const color = 'red';
    const audioMock = jest.spyOn(window, 'Audio').mockImplementation(() => ({
      play: jest.fn(),
    }));

    playSound(color);

    expect(audioMock).toHaveBeenCalledWith('./sounds/sounds_red.mp3');
    expect(audioMock().play).toHaveBeenCalled();
  });

  test('animatePress should add and remove pressed class', () => {
    const color = 'green';

    // Call animatePress
    animatePress(color);

    // Check if the class was added
    expect($(`#${color}`).hasClass('pressed')).toBe(true);

    // Simulate the timeout
    jest.runAllTimers();

    // Check if the class was removed
    expect($(`#${color}`).hasClass('pressed')).toBe(false);
  });

  test('checkAnswer should call nextSequence if answer is correct', () => {
    // Set up the game pattern and user clicked pattern
    gamePattern = ['red', 'blue'];
    userClickedPattern = ['red', 'blue'];

    // Mock nextSequence
    const nextSequenceMock = jest.spyOn(window, 'nextSequence').mockImplementation(() => {});

    // Call checkAnswer with the last index
    checkAnswer(userClickedPattern.length - 1);

    // Check if nextSequence was called
    expect(nextSequenceMock).toHaveBeenCalled();

    // Clean up
    nextSequenceMock.mockRestore();
  });

  test('checkAnswer should call startOver if answer is incorrect', () => {
    // Set up the game pattern and user clicked pattern
    gamePattern = ['red', 'blue'];
    userClickedPattern = ['red', 'green'];

    // Mock startOver
    const startOverMock = jest.spyOn(window, 'startOver').mockImplementation(() => {});

    // Call checkAnswer with the last index
    checkAnswer(userClickedPattern.length - 1);

    // Check if startOver was called
    expect(startOverMock).toHaveBeenCalled();

    // Clean up
    startOverMock.mockRestore();
  });

  test('startOver should reset the game state', () => {
    // Simulate starting the game
    level = 2;
    gamePattern = ['red', 'blue'];
    userClickedPattern = ['red'];

    // Call startOver
    startOver();

    // Check if the game state is reset
    expect(level).toBe(0);
    expect(gamePattern.length).toBe(0);
    expect(userClickedPattern.length).toBe(0);
    expect(started).toBe(0);
  });
});