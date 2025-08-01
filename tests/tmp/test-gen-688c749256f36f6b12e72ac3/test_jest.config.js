const $ = require('jquery');
const { nextSequence, playSound, animatePress, checkAnswer, startOver } = require('../script'); // Adjust the path as necessary

describe('Simon Game Functions', () => {
  beforeEach(() => {
    // Reset the game state before each test
    startOver();
  });

  test('nextSequence should generate a new random color and update the game pattern', () => {
    const initialLevel = level;
    nextSequence();
    
    expect(gamePattern.length).toBe(1); // Should add one color to the game pattern
    expect(level).toBe(initialLevel + 1); // Level should increment
    expect(buttonColours).toContain(gamePattern[0]); // The generated color should be one of the button colors
  });

  test('playSound should play the correct sound based on the color', () => {
    const playSoundMock = jest.spyOn(window.Audio.prototype, 'play').mockImplementation(() => {});
    
    playSound('red');
    expect(playSoundMock).toHaveBeenCalledTimes(1);
    expect(playSoundMock).toHaveBeenCalledWith(expect.anything()); // Check that a sound was played

    playSound('blue');
    expect(playSoundMock).toHaveBeenCalledTimes(2);

    playSoundMock.mockRestore(); // Restore original implementation
  });

  test('animatePress should add and remove the pressed class', () => {
    const color = 'green';
    animatePress(color);
    
    expect($(`#${color}`).hasClass('pressed')).toBe(true); // Check if class is added

    // Simulate the timeout to check if class is removed
    jest.advanceTimersByTime(100);
    expect($(`#${color}`).hasClass('pressed')).toBe(false); // Check if class is removed
  });

  test('checkAnswer should call nextSequence if the answer is correct', () => {
    gamePattern.push('red');
    userClickedPattern.push('red');

    const nextSequenceMock = jest.spyOn(window, 'nextSequence').mockImplementation(() => {});

    checkAnswer(0); // Check the first answer
    expect(nextSequenceMock).toHaveBeenCalledTimes(1); // Should call nextSequence

    nextSequenceMock.mockRestore(); // Restore original implementation
  });

  test('checkAnswer should trigger game over if the answer is incorrect', () => {
    gamePattern.push('red');
    userClickedPattern.push('blue'); // Incorrect answer

    const toggleClassMock = jest.spyOn($.fn, 'toggleClass');
    const textMock = jest.spyOn($.fn, 'text');

    checkAnswer(0); // Check the first answer
    expect(toggleClassMock).toHaveBeenCalledWith('game-over'); // Should toggle game-over class
    expect(textMock).toHaveBeenCalledWith('Game Over, Press Any Key to Restart!'); // Should update the header text

    toggleClassMock.mockRestore(); // Restore original implementation
    textMock.mockRestore(); // Restore original implementation
  });

  test('startOver should reset the game state', () => {
    level = 5;
    gamePattern = ['red', 'blue'];
    started = 1;

    startOver();

    expect(level).toBe(0);
    expect(gamePattern).toEqual([]);
    expect(started).toBe(0);
  });
});