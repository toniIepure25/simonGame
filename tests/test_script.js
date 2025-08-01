const $ = require('jquery');
const { nextSequence, playSound, animatePress, checkAnswer, startOver } = require('../script');

describe('Simon Game Functions', () => {
  beforeEach(() => {
    // Reset the game state before each test
    startOver();
  });

  test('nextSequence should generate a new random color and update the game state', () => {
    const initialLevel = level;
    nextSequence();

    expect(gamePattern.length).toBe(1); // Should have one color in the game pattern
    expect(level).toBe(initialLevel + 1); // Level should increment
    expect(buttonColours).toContain(gamePattern[0]); // The color should be one of the button colors
  });

  test('playSound should play the correct sound for each color', () => {
    const playSoundMock = jest.spyOn(window.Audio.prototype, 'play').mockImplementation(() => {});

    playSound('red');
    expect(playSoundMock).toHaveBeenCalledWith(expect.anything());
    
    playSound('green');
    expect(playSoundMock).toHaveBeenCalledWith(expect.anything());

    playSound('blue');
    expect(playSoundMock).toHaveBeenCalledWith(expect.anything());

    playSound('yellow');
    expect(playSoundMock).toHaveBeenCalledWith(expect.anything());

    playSoundMock.mockRestore(); // Restore original implementation
  });

  test('animatePress should add and remove the pressed class', () => {
    const color = 'green';
    animatePress(color);

    expect($(`#${color}`).hasClass('pressed')).toBe(true); // Class should be added

    // Simulate the timeout to check if the class is removed
    jest.advanceTimersByTime(100);
    expect($(`#${color}`).hasClass('pressed')).toBe(false); // Class should be removed
  });

  test('checkAnswer should call nextSequence if the answer is correct', () => {
    gamePattern.push('red');
    userClickedPattern.push('red');

    const nextSequenceMock = jest.spyOn(window, 'nextSequence').mockImplementation(() => {});

    checkAnswer(0);
    expect(nextSequenceMock).toHaveBeenCalled();

    nextSequenceMock.mockRestore(); // Restore original implementation
  });

  test('checkAnswer should trigger game over if the answer is incorrect', () => {
    gamePattern.push('red');
    userClickedPattern.push('blue');

    const startOverMock = jest.spyOn(window, 'startOver').mockImplementation(() => {});

    checkAnswer(0);
    expect(started).toBe(0); // Game should be reset
    expect(startOverMock).toHaveBeenCalled();

    startOverMock.mockRestore(); // Restore original implementation
  });

  test('startOver should reset the game state', () => {
    level = 5;
    gamePattern = ['red', 'blue'];
    userClickedPattern = ['red'];

    startOver();

    expect(level).toBe(0);
    expect(gamePattern).toEqual([]);
    expect(userClickedPattern).toEqual([]);
    expect(started).toBe(0);
  });
});