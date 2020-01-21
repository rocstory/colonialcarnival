/**
 * Carnival Utilities
 * Uses Firestore for backend functionalities.
 * 
 * Note:
 * - Please make sure to include this script before all of the required Firebase scripts.
 */

const HOME_PAGE  = './pages/carnival.html';
const HOME_PAGE2  = '/pages/carnival.html';
const LOGIN_PAGE = '../index.html';

const SESSIONSTORAGE_KEY = 'userID';


var db = firebase.firestore();


var CURRENT_USER =
{
    myID: null,
    myName: null,
    myMarbles: null,
}

 /**
  * Update the current user's username
  * @param {string} newName 
  */

 function UPDATE_USERNAME(newName)
 {
     return new Promise((resolve, reject)=>{
         if (validate_username(newName))
         {
             newName = newName.toLowerCase();
             db.collection('students').doc(CURRENT_USER.myID).update({
                 "name": newName
             });
             CURRENT_USER.myName = newName;
             resolve();
         }
         else
         {
             reject();
         }
     });
 };


 /**
  * The amount of marbles that will be aded to the current user.
  * @param {number} marblesToAdd 
  */
 function ADD_MARBLES(marblesToAdd)
 {
     // promise to add marbles to the database.
     return new Promise((resolve, reject)=>{
        if (marblesToAdd < 0)
        {
            marblesToAdd = 0;
        }
        GET_MARBLES_AMOUNT_FOR(CURRENT_USER.myID)
        .then((marbleAmount)=>{
            var totalMarbles = marbleAmount + marblesToAdd;
            setMarbleAmount(totalMarbles);
            resolve(totalMarbles);
        })
        .catch((error)=>{
            reject(0);
        });
     }); 
 };

 /**
  * Gets the marble amount for the given user stored in the database.
  * 
  * @param {number} userID 
  */

 function GET_MARBLES_AMOUNT_FOR(userID)
 {
     return new Promise((resolve, reject) =>
     {
         if (userID != null)
         {
             db.collection('students').doc(CURRENT_USER.myID).get()
             .then((doc)=>{
                 if (doc.exists)
                 {
                     resolve(doc.data().marbles)
                 }
             })
             .catch((error)=>{
                 reject(error);
             });
         }
         else
         {
             reject("user id does not exist!");
         }
     });
 };

 /**
  * Setting the current user's marble amount.
  * @param {number} newAmount 
  */
 function setMarbleAmount(newAmount)
 {
     if (CURRENT_USER == null || CURRENT_USER.myID == null)
     {
         return;
     }

     db.collection("students").doc(CURRENT_USER.myID).update({
         "marbles": newAmount
     });
     CURRENT_USER.myMarbles = newAmount;
 };

 /**
  * Retrieves the user's data from the database and
  * stores it into the CURRENT_USER object.
  * @param {number} userID 
  */
 function GET_USER_DATA(userID)
 {

    return new Promise((resolve, reject)=>
    {
        if (validate_userID(userID))
        {
            db.collection("students").doc(userID).get()
            .then((doc)=>{
                if (doc.exists)
                {
                    CURRENT_USER.myID      = doc.data().id;
                    CURRENT_USER.myName    = doc.data().name;
                    CURRENT_USER.myMarbles = doc.data().marbles;
                    resolve();
                }
            })
            .catch((error)=>{
                reject();
            })
        }
        else
        {
            reject();
        }
    });
 };

  /**
  * Determines if the user's username is valid.
  * @param {string} nameToValidate 
  * @return the value that determines if name is valid or not.
  */
 function validate_username(nameToValidate)
 {
    nameToValidate = nameToValidate.trim();
    var nonDigitName = /^[a-zA-Z]+$/;

    if (nonDigitName.test(nameToValidate))
    {

        return true;
    }
    else
    {
        return false;
    }
 };

 /**
  * Determines if the user's ID is valid.
  * @param {*} idToValidate the id to e validated.
  * @return the value that determines if name is valid or not.
  */
function validate_userID(idToValidate)
{

    var isStudentID = /^502\d{5}$/;
    var isStudentID_B = /^501\d{5}$/;

    if (isStudentID.test(idToValidate) || isStudentID_B.test(idToValidate))        // If user input matches student ID...
    {
        
        return true;
    }
    else
    {
        return false;
    }
};

/**
 * Saves the user's ID number.
 */
function saveUserID()
{
    if (CURRENT_USER.myID !== null)
    {
        
        sessionStorage.setItem('userID', CURRENT_USER.myID); 
    }
    else
    {

    }
};


/**
 * Loads the current page by retrieving the user's data
 * 
 */
function loadPage()
{
    var user_id = sessionStorage.getItem('userID');
    CURRENT_USER.myID = user_id;
    GET_USER_DATA(user_id).then(()=>
    { 
        startPage();
    })
    .catch(()=>{
        window.location.assign(LOGIN_PAGE);
    })
};

function logout()
{
    sessionStorage.clear();
    window.location.assign(LOGIN_PAGE);
}

/**
 * Starts the page by setting the user's name and marble
 * amount.
 */
function startPage()
{
    var h1 = document.getElementById('username');
    var p = document.getElementById('marble-amount');
    var formattedName = CURRENT_USER.myName.replace(/^\w/, (char)=>{
        return char.toUpperCase();
    })

    h1.innerHTML = formattedName.substring(0, 10);
    p.innerHTML = 'x' + CURRENT_USER.myMarbles;

};
