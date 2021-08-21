/**
 * RPS Buttons
 */
var rockButton = document.getElementById('rock');
var paperButton = document.getElementById('paper');
var scissorButton = document.getElementById('scissors');

/**
 * Input boxes.
 */
var pInput = document.getElementById('pText');
var oInput = document.getElementById('cText');

/**
 * Input container.
 */
var pContainer = document.getElementById('player-choice');
var oContainer = document.getElementById('chuck-choice');

var instructButton = document.getElementById('instructionsButton');

const rockIcon = 'icon solids fa-hand-rock';
const paperIcon = 'icon solids fa-hand-paper';
const scissorIcon = 'icon solids fa-hand-scissors';

const ROCK = 1;
const PAPER = 2;
const SCISSOR = 3;

var canPlay = true;
var playerChoice = null;
var opponentChoice = null;
var hasWon = null; // determines if the player lost, won, or is in a draw.

var opponentPoints = 0;
var playerPoints = 0;


document.getElementById('play2').addEventListener('click', ()=>{
    document.getElementById('rpsContainer').style.display = 'block';
    document.getElementById('navContainer').style.display = 'none';
});

document.getElementById('home2').addEventListener('click', ()=>{
    window.location = './carnival.html';
});


document.getElementById('playButton').addEventListener('click', (event)=>
{
    document.getElementById('gameMenu').style.display = 'block';
    document.getElementById('mainMenu').style.display = 'none';
});

instructButton.addEventListener('click', (e)=>
{
    window.location = './rps.html#carnival-footer';
});

rockButton.addEventListener('click', (event)=>{

    if (canPlay)
    {
        // show that the user selected the rock button to the screen
        pInput.className = rockIcon;
        playerChoice = ROCK;
        play();
    }
});

paperButton.addEventListener('click', (event)=>{

    if (canPlay)
    {
        // show that the user selected the rock button to the screen
        pInput.className = paperIcon;
        playerChoice = PAPER;
        play();
    }
    
});

scissorButton.addEventListener('click', (event)=>{
    if (canPlay)
    {
        // show that the user selected the rock button to the screen
        pInput.className = scissorIcon;
        playerChoice = SCISSOR;
        play();
    }
});

/**
 * Starts the game.
 */

function play()
{
    getCPUChoice();
    var winner = checkWinner();
    canPlay = false;
    if (winner == null)
    {
        // flash both screens
    }
    else if (winner == true)
    {
        playerPoints++;
        flagPlayer(true);
        ADD_MARBLES(1);
    
    }
    else if (winner == false)
    {
        opponentPoints++;
        flagOpponent(true);
    }

    displayPoints();
    setTimeout(()=>{
        canPlay = true;
        clearBoard();
        if (opponentPoints == 3)
        {
            initializeGameOver();
        }

    },2000);


};

function getCPUChoice()
{
    opponentChoice = Math.floor(Math.random() * 3) + 1;
    switch(opponentChoice)
    {
        case 1:
            oInput.className = rockIcon;
            break;
        case 2:
            oInput.className = paperIcon;
            break;
        case 3:
            oInput.className = scissorIcon;
            break;
    }
};

/**
 * Check if the player has won.
 * @param return whether or not the player has won.
 */
function checkWinner()
{
    if (playerChoice == opponentChoice)
    {
        return null; // Theres a draw
    }

    else if (playerChoice == ROCK)
    {
        if (opponentChoice == SCISSOR)
            return true; // Player won
        else if (opponentChoice == PAPER)
            return false;
    }

    else if (playerChoice == PAPER)
    {
        if (opponentChoice == ROCK)
            return true; // Player won
        else if (opponentChoice == SCISSOR)
            return false;
    }

    else if (playerChoice == SCISSOR)
    {
        if (opponentChoice == PAPER)
            return true; // Player won
        else if (opponentChoice == ROCK)
            return false;
    }
};

function flagOpponent(flag)
{
    if (flag)
    {
        oContainer.style.backgroundColor = 'orange';
        let audio = document.getElementById('wrongClip');
        audio.play();
    }
    else
    {
        oContainer.style.backgroundColor = 'orange';
    }
};

function flagPlayer(flag)
{
    //player won - flash green
    if (flag)
    {
        pContainer.style.backgroundColor = 'lightgreen';
        let audio = document.getElementById('correctClip');
        audio.play();
    }
    else
    {
        pContainer.style.backgroundColor = 'orange';
        let audio = document.getElementById('correctClip');
        audio.play();
    }

};

function initializeGameOver()
{
    canPlay = false;
    playerPoints = 0;
    opponentPoints = 0;
    flagOpponent(true);
    flagPlayer(true);
    setTimeout(()=>{
        clearBoard();
        displayPoints();
        document.getElementById('rpsContainer').style.display = 'none';
        document.getElementById('navContainer').style.display = 'block';
        canPlay = true;
    }, 2000);
};

function clearBoard()
{
    oInput.className = '';
    pInput.className = '';
    playerChoice = 0;
    opponentChoice = 0;
    pContainer.style.backgroundColor = '#D7DBDD';
    oContainer.style.backgroundColor = '#D7DBDD';
};

function displayPoints()
{
    document.getElementById('player-points').innerHTML = playerPoints;
    document.getElementById('chuck-points').innerHTML = opponentPoints;
}