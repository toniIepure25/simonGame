const $ = require('jquery');
const { nextSequence, playSound, animatePress, checkAnswer, startOver } = require('../script');

describe('Simon Game Functions', () => {
  beforeEach(() => {
    // Reset the game state before each test
    startOver();
  });

  test('nextSequence should increment level and update game pattern', () => {
    // Mock the jQuery fadeOut and fadeIn methods
    jest.spyOn($.fn, 'fadeOut').mockImplementation(() => $);
    jest.spyOn($.fn, 'fadeIn').mockImplementation(() => $);
    jest.spyOn(window, 'Audio').mockImplementation(() => ({
      play: jest.fn(),
    }));

    nextSequence();

    expect(level).toBe(1);
    expect(gamePattern.length).toBe(1);
    expect(buttonColours).toContain(gamePattern[0]);
    expect($('h1').text()).toBe('Level 1');

    // Restore the original implementations
    $.fn.fadeOut.mockRestore();
    $.fn.fadeIn.mockRestore();
    window.Audio.mockRestore();
  });

  test('playSound should play the correct sound based on color', () => {
    const audioMock = jest.fn();
    jest.spyOn(window, 'Audio').mockImplementation(() => ({
      play: audioMock,
    }));

    playSound('red');
    expect(audioMock).toHaveBeenCalledTimes(1);

    playSound('blue');
    expect(audioMock).toHaveBeenCalledTimes(2);

    // Restore the original implementation
    window.Audio.mockRestore();
  });

  test('animatePress should add and remove pressed class', () => {
    const color = 'green';
    animatePress(color);
    
    expect($(`#${color}`).hasClass('pressed')).toBe(true);

    // Simulate the timeout
    jest.advanceTimersByTime(100);
    expect($(`#${color}`).hasClass('pressed')).toBe(false);
  });

  test('checkAnswer should call nextSequence if the answer is correct', () => {
    gamePattern = ['red', 'blue'];
    userClickedPattern = ['red', 'blue'];

    jest.useFakeTimers();
    const nextSequenceMock = jest.spyOn(window, 'nextSequence');

    checkAnswer(1);
    expect(nextSequenceMock).toHaveBeenCalledTimes(1);

    // Restore the original implementation
    nextSequenceMock.mockRestore();
  });

  test('checkAnswer should call startOver if the answer is incorrect', () => {
    gamePattern = ['red', 'blue'];
    userClickedPattern = ['red', 'green'];

    const startOverMock = jest.spyOn(window, 'startOver');

    checkAnswer(1);
    expect(startOverMock).toHaveBeenCalledTimes(1);

    // Restore the original implementation
    startOverMock.mockRestore();
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