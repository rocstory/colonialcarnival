const CARNIVAL_HOME_PAGE = './pages/carnival.html';

/**
 * Login page.
 * 
 */

const idInput   = document.querySelector('#studentID');
const nameInput = document.querySelector('#studentName');

const loginButton = document.querySelector('#studentID');
var errorBlock = document.getElementsByClassName('error-message')[0];


document.getElementById('studentID').addEventListener('click', ()=>
{
    if (errorBlock.style.display == 'block')
    {
        errorBlock.style.display = 'none';

    }
})
document.getElementById('studentName').addEventListener('click', ()=>
{
    if (errorBlock.style.display == 'block')
    {
        errorBlock.style.display = 'none';

    }
})


function login()
{
    var idNum  = document.getElementById('studentID').value.trim();         // Retrieve the ID number and name
    var name   = document.getElementById('studentName').value.trim();
    name = name.toLowerCase();                                              // Change the name to lower case

    if (!validate_userID(idNum) || !validate_username(name))
    {
        // Display an error message to the user when entering an invalid input.
        
        return;
    }

    CHECK_IF_IN_SYSTEM(idNum, name).then(()=>{                              // User is in the system. Entering into the carnival.
        
        sessionStorage.setItem(SESSIONSTORAGE_KEY, idNum);
        window.location = CARNIVAL_HOME_PAGE;
    })
    .catch((error) =>
    {
        if (error == true)
        {
            errorBlock.style.display = 'block';
        }

        else 
        {
            
            CREATE_USER_IN_DB(idNum, name).then(()=>{
                sessionStorage.setItem(SESSIONSTORAGE_KEY, idNum);
                setTimeout(()=>{
                    window.location = CARNIVAL_HOME_PAGE;
                },400)
                //window.location = CARNIVAL_HOME_PAGE;
            });
        } // else
    }); // catch
}; // login

/**
 * Check if the user is in the database.
 */
function CHECK_IF_IN_SYSTEM(userID, userName)
{
    return new Promise((resolve, reject)=>
    {
        
        db.collection("students").doc(userID).get()
        .then((doc) => {
            if(doc.exists)
            {
                if (doc.data().name == userName)                            // Check if name matches the name in the database.
                {
                    
                    resolve();
                }
                else
                {
                    
                    reject(true);
                }
            } // if doc exists
            else
            {
                
                reject(false);
            }
        })
        .catch((error) => {
            
        }); // get student's information.
    });
};

/**
  * Creates a user in the database.
  * @param {number} studentID 
  * @param {string} studentName 
  */
 function CREATE_USER_IN_DB(studentID, studentName)
 {
     return new Promise((resolve, reject) =>
     {
         var newUserRef = db.doc("students/"+studentID);
         
         newUserRef.set({
             id: studentID,
             name: studentName,
             marbles: 0
         });
         resolve();
     });
 };
