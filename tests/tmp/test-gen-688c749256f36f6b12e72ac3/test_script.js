const $ = require('jquery');
const { nextSequence, playSound, animatePress, checkAnswer, startOver } = require('../script'); // Adjust the path as necessary

describe('Simon Game Functions', () => {
  beforeEach(() => {
    // Reset the game state before each test
    startOver();
  });

  test('nextSequence should increase level and update gamePattern', () => {
    const initialLevel = level;
    nextSequence();

    expect(level).toBe(initialLevel + 1);
    expect(gamePattern.length).toBe(1);
    expect(buttonColours).toContain(gamePattern[0]);
  });

  test('playSound should play the correct sound for each color', () => {
    const audioSpy = jest.spyOn(window.Audio.prototype, 'play').mockImplementation(() => {});

    playSound('red');
    expect(audioSpy).toHaveBeenCalledWith(expect.anything());
    expect(audioSpy).toHaveBeenCalledTimes(1);

    playSound('blue');
    expect(audioSpy).toHaveBeenCalledTimes(2);

    audioSpy.mockRestore();
  });

  test('animatePress should add and remove pressed class', () => {
    const color = 'green';
    animatePress(color);

    expect($(`#${color}`).hasClass('pressed')).toBe(true);

    // Simulate the timeout to check if the class is removed
    jest.advanceTimersByTime(100);
    expect($(`#${color}`).hasClass('pressed')).toBe(false);
  });

  test('checkAnswer should call nextSequence if answer is correct', () => {
    gamePattern = ['red', 'blue'];
    userClickedPattern = ['red', 'blue'];

    jest.spyOn(window, 'setTimeout');
    checkAnswer(1);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  test('checkAnswer should call startOver if answer is incorrect', () => {
    gamePattern = ['red', 'blue'];
    userClickedPattern = ['red', 'green'];

    const startOverSpy = jest.spyOn(window, 'startOver').mockImplementation(() => {});

    checkAnswer(1);

    expect(startOverSpy).toHaveBeenCalled();

    startOverSpy.mockRestore();
  });

  test('startOver should reset game state', () => {
    level = 5;
    gamePattern = ['red', 'blue', 'green'];
    started = 1;

    startOver();

    expect(level).toBe(0);
    expect(gamePattern).toEqual([]);
    expect(started).toBe(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});