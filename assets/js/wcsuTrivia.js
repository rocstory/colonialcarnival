var question_heading = document.getElementById('question');

var choice1_label = document.getElementById('l1');
var choice1_radio = document.getElementById('c1');

var choice2_label = document.getElementById('l2');
var choice2_radio = document.getElementById('c2');

var choice3_label = document.getElementById('l3');
var choice3_radio = document.getElementById('c3');

var choice4_label = document.getElementById('l4');
var choice4_radio = document.getElementById('c4');

var submitBtn = document.getElementById('submitButton');
var nextBtn   = document.getElementById('nextButton');
var playButton2  = document.getElementById('playButton2');
var homeButton  = document.getElementById('homeButton');
var instructButton = document.getElementById('instructionsButton');

var pointsText = document.getElementById('points-text');
var attemptsText = document.getElementById('attempts-text');


var Points = 0;
var Attempts = 3;

function Question()
{
    this.id         = null;
    this.question   = null; // make array 
    this.correct    = null;
    this.wrong      = new Array();
}


var correctOption = null;
var questionArray = new Array();
var ansQuestions = [];
var theQuestion = null;


var playButton = document.getElementById('playButton');


instructButton.addEventListener('click', (e)=>
{
    window.location = './wcsuTrivia.html#carnival-footer';
});

document.getElementById('homeButton').addEventListener('click', (e)=>
{
    window.location.assign('./carnival.html');
});

/**
 * Starts the game
 */
function startGame()
{
    
    // Retrieve the questions from the database.
    GET_QUESTIONS_FROM_DB().then(()=>{
        if (ansQuestions.length >= questionArray.length)
        {
            show_AllQuestionsAnswered();
        }
        else
        {
            document.getElementById('mainMenu').style.display = 'none';
            SET_QUESTION();
            document.getElementById('gameMenu').style.display = 'block';

            Points = 0;
            Attempts = 3;

            pointsText.innerHTML = 'x'+Points;
            attemptsText.innerHTML = 'x'+Attempts;
            nextBtn.disabled = false;
            submitBtn.disabled = false;
            playButton2.style.display = 'none';
            homeButton.style.display = 'none';
            submitBtn.style.display = 'block';
            reset_radioButtons();
        }
    });

};

/**
 * Action done when the user clicks the submit button.
 */

function submitAnswer()
{
    // Check if user selected an option.
    if(!choice1_radio.checked && !choice2_radio.checked && !choice3_radio.checked && !choice4_radio.checked || correctOption == null )
    {
        return;
    }

    //update answered questions array.
    ansQuestions.push(theQuestion.id);

    // User selected the correct option
    if (correctOption.checked)
    {
        //Add a marble
        ADD_MARBLES(1).then((newAmount)=>{
            Points++;
            pointsText.innerHTML = 'x'+Points;
            notifyPlayer(true);
        });
    }
    // User got the question wrong.
    else
    {
        Attempts--;
        // Game is over!
        if (Attempts <= 0)
        {
            question_heading.innerHTML = "Game over! You've earned " + Points + " marbles!";
            attemptsText.innerHTML = 'x'+0;
            submitBtn.style.display = 'none';
            nextBtn.style.display   = 'none';
            playButton2.style.display = 'inline-block';
            homeButton.style.display = 'inline-block ';
            document.getElementById('marble-amount').innerHTML = 'x'+CURRENT_USER.myMarbles;
            return;
        }
        // Update the user's attempts
        else
        {
            attemptsText.innerHTML = 'x'+Attempts;
            nextBtn.disabled = false;
            submitBtn.disabled = true;
            submitBtn.style.display = 'none';
            nextBtn.style.display   = 'block';
            notifyPlayer(false);
        }
    }

    nextBtn.disabled = false;
    submitBtn.disabled = true;
    submitBtn.style.display = 'none';
    nextBtn.style.display   = 'block';
    
};

function notifyPlayer(isCorrect)
{
    var audio;
    if (isCorrect)
    {
        question_heading.innerHTML = "Correct!";
        audio = document.getElementById('correctClip');
        audio.play();
    }
    else
    {
        question_heading.innerHTML = "Incorrect!";
        audio = document.getElementById('wrongClip');
        audio.play();
    }
}



function GET_QUESTIONS_FROM_DB()
{
    return new Promise((resolve, reject)=>{
        db.collection('trivia').get().then((allQuestions)=>{
            allQuestions.forEach((doc)=>{
                var newQuestion = new Question;
                newQuestion.id       = doc.id;
                newQuestion.question = doc.data().question;
                newQuestion.correct  = doc.data().correct;
                newQuestion.wrong.push(doc.data().wrong1);
                newQuestion.wrong.push(doc.data().wrong2);
                newQuestion.wrong.push(doc.data().wrong3);
                questionArray.push(newQuestion);
            }); //forEach
            resolve();
        }).catch((error)=>
        {

        });
    })
};


/**
 *  Display the question onto the screen.
 */
function SET_QUESTION()
{
    // Check if all questions have been answered.
    if (ansQuestions.length >= questionArray.length)
    {
        show_AllQuestionsAnswered();
        return;
    }

    /**
     * Search for a new question
     */
    var isNewQuestion = false;
    do {
        var questionNum = Math.floor(Math.random() * questionArray.length); // pick a random question from the gathered questions.
        theQuestion = questionArray[questionNum];
        var isFound = ansQuestions.find((element) =>                        // Check if the question has been already answered.
        {
            if (theQuestion.id == element)
            {
                return true;
            }
        });

        // Question has not been answered
        if (isFound == undefined)
        {
            isNewQuestion = true;
        }
        // check if the question has been answered.        
    } while (!isNewQuestion);

    //theQuestion = questionArray[questionNum];

    // Display the question onto the screen
    question_heading.innerHTML = theQuestion.question;

    // determine which option will contain the correct answer
    var correctIndex = Math.floor(Math.random() * 4);
    switch (correctIndex)
    {
        // the first choice
        case 0:
            choice1_label.innerHTML = theQuestion.correct; // set the text to the correct answer
            choice2_label.innerHTML = theQuestion.wrong[0];
            choice3_label.innerHTML = theQuestion.wrong[1];
            choice4_label.innerHTML = theQuestion.wrong[2];

            correctOption = choice1_radio;

            break;
        case 1:
            choice1_label.innerHTML = theQuestion.wrong[0]; 
            choice2_label.innerHTML = theQuestion.correct;
            choice3_label.innerHTML = theQuestion.wrong[1];
            choice4_label.innerHTML = theQuestion.wrong[2];

            correctOption = choice2_radio;

            break;
        case 2:
            choice1_label.innerHTML = theQuestion.wrong[1]; 
            choice2_label.innerHTML = theQuestion.wrong[2];
            choice3_label.innerHTML = theQuestion.correct;
            choice4_label.innerHTML = theQuestion.wrong[0];

            correctOption = choice3_radio;

            break;
        case 3:
            choice1_label.innerHTML = theQuestion.wrong[0]; 
            choice2_label.innerHTML = theQuestion.wrong[1];
            choice3_label.innerHTML = theQuestion.wrong[2];
            choice4_label.innerHTML = theQuestion.correct;

            correctOption = choice4_radio;
            break;
        default:
            choice1_label.innerHTML = theQuestion.correct; // set the text to the correct answer
            choice2_label.innerHTML = theQuestion.wrong[0];
            choice3_label.innerHTML = theQuestion.wrong[1];
            choice4_label.innerHTML = theQuestion.wrong[2];

            correctOption = choice1_radio;
            break;
    }
};

/**
 * Move to the next question 
 */
function NEXT_QUESTION()
{
    nextBtn.disabled = true;
    submitBtn.disabled = false;
    submitBtn.style.display = 'block';
    nextBtn.style.display   = 'none';
    SET_QUESTION();

    var radioButtons = document.getElementsByClassName('question-input');
    
    reset_radioButtons();
};

function reset_radioButtons()
{
    var radioButtons = document.getElementsByClassName('question-input');
    
    for(var i = 0; i < radioButtons.length; i++)
    {
        radioButtons[i].checked = false;
    }
};

function show_AllQuestionsAnswered()
{
    question_heading.innerHTML = "You have answered all of the questions! Play again another time.";
    submitBtn.style.display    = 'none';
    nextBtn.style.display      = 'none';
    playButton2.style.display  = 'none';
    homeButton.style.display   = 'inline-block';
}