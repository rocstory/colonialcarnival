/**
 * carnival.js
 * The JavaScript file for the carnival's home page.
 */

document.getElementById('WesternTrivia_img').addEventListener('click', ()=>{
    window.location = './wcsuTrivia.html';
});

document.getElementById('MatchMatch_img').addEventListener('click', ()=>{
    window.location = './matchmatch.html';
});

document.getElementById('rps_img').addEventListener('click', ()=>{
    window.location = './rps.html';
});


document.getElementById('updateButton').addEventListener('click', ()=>{
    var newName = document.getElementById('newName').value;
    UPDATE_USERNAME(newName).then(()=>
    {
        
        document.getElementById('updateErrorMessage').style.display = 'none';
        setTimeout(()=>{
            window.location = './carnival.html';
        },400);
        
    }).catch(()=>
    {
        document.getElementById('updateErrorMessage').style.display = 'inline-block';
    });
});



window.addEventListener('load', (event) =>{
    var user_id = sessionStorage.getItem('userID');

    GET_USER_DATA(user_id).then((data)=> {
        var formattedName = CURRENT_USER.myName.replace(/^\w/, (char)=>{
            return char.toUpperCase();
        });

        document.getElementById('footer-name').innerHTML = 'Hi, ' + formattedName + '!';
    });
});
