const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Setup the JSDOM environment for testing
const dom = new JSDOM(fs.readFileSync(path.resolve(__dirname, '../index.html')), { runScripts: "dangerously" });
const $ = require('jquery')(dom.window);

// Mocking audio playback for testing
const mockAudio = jest.fn();
global.Audio = jest.fn(() => mockAudio);

// Import the script to test
require('../script.js');

describe('Simon Game Integration Tests', () => {
  beforeEach(() => {
    // Reset the game state before each test
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    started = 0;
    $('#level-title').text('Press A Key to Start');
  });

  afterEach(() => {
    // Clear any mocks after each test
    jest.clearAllMocks();
  });

  test('should start the game when a key is pressed', () => {
    // Simulate a keypress
    $(document).trigger('keypress');

    expect(started).toBe(1);
    expect($('#level-title').text()).toBe('Level 1');
    expect(gamePattern.length).toBe(1);
  });

  test('should play sound and animate button when a button is clicked', () => {
    // Start the game
    $(document).trigger('keypress');

    // Simulate button click
    $('#green').click();

    expect(mockAudio).toHaveBeenCalledWith('./sounds/sounds_green.mp3');
    expect($('#green').hasClass('pressed')).toBe(true);
  });

  test('should check the answer correctly', () => {
    // Start the game and simulate the first sequence
    $(document).trigger('keypress');
    $('#green').click(); // User clicks the first button

    // Check the answer
    checkAnswer(0);

    expect(userClickedPattern.length).toBe(1);
    expect(gamePattern.length).toBe(1);
    expect($('#level-title').text()).toBe('Level 1');
  });

  test('should handle wrong answer and restart the game', () => {
    // Start the game and simulate the first sequence
    $(document).trigger('keypress');
    $('#green').click(); // User clicks the first button

    // Simulate a wrong answer
    userClickedPattern.push('red'); // Wrong answer
    checkAnswer(0);

    expect($('#level-title').text()).toBe('Game Over, Press Any Key to Restart!');
    expect(started).toBe(0);
    expect(mockAudio).toHaveBeenCalledWith('./sounds/sounds_wrong.mp3');
  });

  test('should proceed to the next sequence after a correct answer', () => {
    // Start the game and simulate the first sequence
    $(document).trigger('keypress');
    $('#green').click(); // User clicks the first button

    // Check the answer
    checkAnswer(0);

    // Simulate the next sequence
    expect(gamePattern.length).toBe(1);
    expect(level).toBe(1);
    expect($('#level-title').text()).toBe('Level 1');
  });

  test('should animate button press correctly', () => {
    // Start the game
    $(document).trigger('keypress');

    // Simulate button click
    $('#green').click();

    expect($('#green').hasClass('pressed')).toBe(true);
    setTimeout(() => {
      expect($('#green').hasClass('pressed')).toBe(false);
    }, 100);
  });
});