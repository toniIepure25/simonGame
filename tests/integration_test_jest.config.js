const $ = require('jquery');
const { nextSequence, playSound, animatePress, checkAnswer, startOver } = require('../script'); // Adjust the path as necessary

describe('Simon Game Integration Tests', () => {
  let originalTitle;

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
    originalTitle = document.getElementById('level-title').innerText;
  });

  afterEach(() => {
    // Reset the game state after each test
    startOver();
    document.getElementById('level-title').innerText = originalTitle;
  });

  test('should start the game on keypress', () => {
    $(document).trigger($.Event('keypress'));
    expect(document.getElementById('level-title').innerText).toBe('Level 1');
  });

  test('should play sound and animate button when clicked', () => {
    const playSoundMock = jest.spyOn(window, 'Audio').mockImplementation(() => ({
      play: jest.fn(),
    }));

    const button = $('#green');
    button.trigger('click');

    expect(playSoundMock).toHaveBeenCalledWith('green');
    expect(button.hasClass('pressed')).toBe(true);

    // Clean up
    playSoundMock.mockRestore();
  });

  test('should check answer correctly', () => {
    // Simulate a sequence
    gamePattern.push('green');
    userClickedPattern.push('green');
    checkAnswer(0);
    expect(userClickedPattern.length).toBe(1);
    expect(gamePattern.length).toBe(1);
  });

  test('should trigger game over on wrong answer', () => {
    // Simulate a sequence
    gamePattern.push('green');
    userClickedPattern.push('red'); // Wrong answer
    checkAnswer(0);
    
    expect(document.getElementById('level-title').innerText).toBe('Game Over, Press Any Key to Restart!');
    expect(started).toBe(0); // Game should be reset
  });

  test('should reset game state correctly', () => {
    level = 2;
    gamePattern = ['green', 'red'];
    userClickedPattern = ['green', 'red'];
    startOver();
    
    expect(level).toBe(0);
    expect(gamePattern).toEqual([]);
    expect(userClickedPattern).toEqual([]);
    expect(started).toBe(0);
  });

  test('should proceed to next sequence after correct answer', () => {
    // Simulate a correct sequence
    gamePattern.push('green');
    userClickedPattern.push('green');
    checkAnswer(0);
    
    // Simulate the next sequence
    jest.useFakeTimers();
    setTimeout(() => {
      expect(level).toBe(1);
    }, 1000);
    jest.runAllTimers();
  });
});