const $ = require('jquery');
const { nextSequence, playSound, animatePress, checkAnswer, startOver } = require('../script'); // Adjust the path as necessary

describe('Simon Game Integration Tests', () => {
  let originalTitle;
  let originalLevel;
  let originalGamePattern;
  let originalUserClickedPattern;

  beforeEach(() => {
    // Save original state
    originalTitle = $("h1").text();
    originalLevel = level;
    originalGamePattern = [...gamePattern];
    originalUserClickedPattern = [...userClickedPattern];

    // Reset the game state
    startOver();
  });

  afterEach(() => {
    // Restore original state
    $("h1").text(originalTitle);
    level = originalLevel;
    gamePattern = originalGamePattern;
    userClickedPattern = originalUserClickedPattern;
  });

  test('nextSequence should update the game pattern and level', () => {
    nextSequence();
    expect(gamePattern.length).toBe(1); // Should have one item after first call
    expect(level).toBe(1); // Level should increment
  });

  test('playSound should play the correct sound based on color', () => {
    const playSoundSpy = jest.spyOn(window.Audio.prototype, 'play');
    
    playSound('green');
    expect(playSoundSpy).toHaveBeenCalledTimes(1);
    
    playSound('red');
    expect(playSoundSpy).toHaveBeenCalledTimes(2);
    
    playSound('blue');
    expect(playSoundSpy).toHaveBeenCalledTimes(3);
    
    playSound('yellow');
    expect(playSoundSpy).toHaveBeenCalledTimes(4);
    
    playSoundSpy.mockRestore();
  });

  test('animatePress should add and remove pressed class', () => {
    const color = 'green';
    animatePress(color);
    
    expect($(`#${color}`).hasClass('pressed')).toBe(true);
    
    // Wait for the timeout to complete
    jest.advanceTimersByTime(100);
    
    expect($(`#${color}`).hasClass('pressed')).toBe(false);
  });

  test('checkAnswer should call nextSequence if the answer is correct', () => {
    gamePattern = ['red'];
    userClickedPattern = ['red'];
    
    const nextSequenceSpy = jest.spyOn(window, 'nextSequence');
    
    checkAnswer(0);
    
    expect(nextSequenceSpy).toHaveBeenCalled();
    
    nextSequenceSpy.mockRestore();
  });

  test('checkAnswer should trigger game over if the answer is incorrect', () => {
    gamePattern = ['red'];
    userClickedPattern = ['blue'];
    
    const wrongAudioSpy = jest.spyOn(window.Audio.prototype, 'play');
    
    checkAnswer(0);
    
    expect($("h1").text()).toBe("Game Over, Press Any Key to Restart!");
    expect(wrongAudioSpy).toHaveBeenCalled();
    
    wrongAudioSpy.mockRestore();
  });

  test('startOver should reset the game state', () => {
    level = 5;
    gamePattern = ['red', 'green', 'blue'];
    userClickedPattern = ['red', 'green'];
    
    startOver();
    
    expect(level).toBe(0);
    expect(gamePattern).toEqual([]);
    expect(userClickedPattern).toEqual([]);
  });

  test('User interaction should trigger the correct sequence', () => {
    // Simulate user clicking the buttons
    const buttonClickSpy = jest.spyOn($.fn, 'click');
    
    $('#red').click();
    expect(userClickedPattern).toContain('red');
    
    $('#green').click();
    expect(userClickedPattern).toContain('green');
    
    buttonClickSpy.mockRestore();
  });
});