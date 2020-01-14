/**
 * Interactable elements.
 */
var startButton = document.getElementById('startButton');
var redBlock = document.getElementById('redBlock');
var blueBlock = document.getElementById('blueBlock');
var greenBlock = document.getElementById('greenBlock');
var yellowBlock = document.getElementById('yellowBlock');

var instructButton = document.getElementById('instructionsButton');

var playButton = document.getElementById('playButton');


let order = [];
let playerOrder = [];
let flash; // number of flashes
let turn;
let good; 
let compTurn;
let intervalId;
let strict = false; // may remove later.
let noise = true;  // whether to play sound
let on = false; // may remove later
let win; // whether the player won.
const rounds = 1000;
let Points = 0;


playButton.addEventListener('click', ()=>
{
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameMenu').style.display = 'block';
})

instructButton.addEventListener('click', (e)=>
{
    window.location = './matchmatch.html#carnival-footer';
});

startButton.addEventListener('click', (e) =>{
    on = true;
    if (on || win)
    {
        play();
    }
})

function play()
{
    startButton.style.display = 'none'; 
    Points = 0;
    updatePlayersPoints();
    win = false;
    order = [];
    playerOrder = [];
    intervalId = 0;
    flash = 0;
    turn = 1;
    good = true;
    for (var i = 0; i < rounds; i++)
    {
        order.push(Math.floor(Math.random() * 4) + 1);
    }

    compTurn = true;
    intervalId = setInterval(gameTurn, 800);
}

function gameTurn()
{
    on = false; // disable blocks.. somehow
    if (flash == turn)
    {
        clearInterval(intervalId);
        compTurn = false;
        clearColor();
        on = true;
    }

    if (compTurn)
    {
        clearColor();
        setTimeout(()=>
        {
            if (order[flash] == 1) one();  //red
            if (order[flash] == 2) two();  //green
            if (order[flash] == 3) three(); // blue
            if (order[flash] == 4) four(); // yellow
            flash++;
        }, 200);
    }
}

/**
 * Red 
 */
function one()
{
    if (noise)
    {
        let audio = document.getElementById('clip1');
        audio.play();
    }
    noise = true;
    redBlock.style.backgroundColor = 'orange';
    
}

function two()
{
    if (noise)
    {
        let audio = document.getElementById('clip2');
        audio.play();
    }
    noise = true;
    greenBlock.style.backgroundColor = 'lightgreen';
}

function three()
{
    if (noise)
    {
        let audio = document.getElementById('clip3');
        audio.play();
    }
    noise = true;
    blueBlock.style.backgroundColor = 'lightskyblue';
}

function four()
{
    if (noise)
    {
        let audio = document.getElementById('clip4');
        audio.play();
    }
    noise = true;
    yellowBlock.style.backgroundColor = 'yellow';
    
}

function clearColor()
{
    redBlock.style.backgroundColor = 'darkred';
    blueBlock.style.backgroundColor = 'darkblue';
    greenBlock.style.backgroundColor = 'darkgreen';
    yellowBlock.style.backgroundColor = 'goldenrod';
}

function flashColor()
{
    redBlock.style.backgroundColor = 'tomato';
    blueBlock.style.backgroundColor = 'lightskyblue';
    greenBlock.style.backgroundColor = 'lightgreen';
    yellowBlock.style.backgroundColor = 'yellow';
}

redBlock.addEventListener('click', (e) =>{
    if (on)
    {
        playerOrder.push(1);
        check(); // check if user has won
        one();
        if (!win)
        {
            setTimeout(()=>
            {
                clearColor();
            }, 300);
        }
    }
})

greenBlock.addEventListener('click', (e) =>{
    if (on)
    {
        playerOrder.push(2);
        check(); // check if user has won
        two();
        if (!win)
        {
            setTimeout(()=>
            {
                clearColor();
            }, 300);
        }
    }
})

blueBlock.addEventListener('click', (e) =>{
    if (on)
    {
        playerOrder.push(3);
        check(); // check if user has won
        three();
        if (!win)
        {
            setTimeout(()=>
            {
                clearColor();
            }, 300);
        }
    }
})


yellowBlock.addEventListener('click', (e) =>{
    if (on)
    {
        playerOrder.push(4);
        check(); // check if user has won
        four();
        if (!win)
        {
            setTimeout(()=>
            {
                clearColor();
            }, 300);
        }
    }
})


function check()
{
    // player is wrong.
    if (playerOrder[playerOrder.length -1] !== order[playerOrder.length - 1])
     good = false;

     // player has correctly answered all N sequences.
    if (playerOrder.length == rounds && good)
    {
        winGame();
    }

    if (good == false) // player is wrong Game over!
    {
        flashColor(); // flash color
        // lose an attempt, allow the player to press start again
        setTimeout(() => {
            clearColor();
            ADD_MARBLES(Points).then(()=>
            {
                startButton.style.display = 'inline-block';
                on = false;
            })
        }, 800);

        noise = false;
    }

    if (turn == playerOrder.length && good && !win)
    {
        turn++;
        playerOrder = [];
        compTurn = true;
        flash = 0;
        // user gains a point here.
        Points++;
        updatePlayersPoints();
        intervalId = setInterval(gameTurn, 800);
    }


}

function winGame()
{
    flashColor();
    // add points to DB
    on = false;
    win = true;
}

function updatePlayersPoints()
{
    document.getElementById('points-text').innerHTML = "x" + Points;
}

