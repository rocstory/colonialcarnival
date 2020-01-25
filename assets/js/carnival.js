/**
 * carnival.js
 * The JavaScript file for the carnival's home page.
 */

function Item()
{
    this.name   = null; // make array 
    this.amount = null;
}

var itemsArray = new Array();

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

        // Get the carnival items and then populate the table.
        GET_CARNIVAL_ITEMS().then(()=>
        {
            // the items array is populated now
            // create the table.
            createItemTable();
        });
    });
});


/**
 * 
 * Load Carnival Items from the database
 * 
 */

function GET_CARNIVAL_ITEMS()
{
    
    return new Promise((resolve, reject)=>{
        db.collection('carnivalitems').get().then((allItems) =>
        {
           
            allItems.forEach((doc)=>{
                var newItem = new Item;
                newItem.name   = doc.data().name;
                newItem.amount = doc.data().amount;
                itemsArray.push(newItem);
            });
            resolve();
        }).catch((error)=>
        {
            console.log('Error!', error);
        });
    })
};

function createItemTable()
{
    
    var table = document.getElementById('itemTable');
    for (var i = 0; i < itemsArray.length; i++)
    {
        var row = document.createElement("tr");
        var nameCol = document.createElement('td');
        var marbleCol = document.createElement('td');
        nameCol.innerHTML = itemsArray[i].name;
        marbleCol.innerHTML = itemsArray[i].amount;
        row.appendChild(nameCol);
        row.appendChild(marbleCol);
        table.appendChild(row);
    }
};
