//initialize variables
let menuItems;

// Each individual page
let guests;
let reservations;
let checkIn;
let checkOut;
let market;

// reservations button
let resButton;

// reservation inputs
let reservationInputs;

// to hold list of guests
let guestList;

// guest check ins
let guestCheckIn;

// check in list
let checkInList;

// area that displays currently selected guest's info checking in
let guestDisplay;

// check in button
let buttonCheckIn;
let buttonCreateCheckIn;

// active guest selected for check in
let currentGuest;

// radio buttons on check in screen
let singleRadio;
let doubleRadio;

// holds room selection on check in screen
let selection;

let options;


// check in room selection variables
let startRooms = 1; // start counting rooms from here
let endRooms = 24; // stop counting rooms here

// create arrays holding room types single or double
let singleRooms = [];
let doubleRooms = [];

let roomListOccupied; // holds a list for each room whether occupied or not
let roomListGuest; // holds who is in each room

// check out list area
let guestCheckOut;

// list of check outs
let checkOutList;

// list of check out list divs
let guestCheckOutList;

// check out button
let buttonCheckOut;


// add event listener to wait until page loads before starting
window.addEventListener('load', initialize);

// set all pages to blank
function setPagesBlank () {
guests.style.display = 'none';
reservations.style.display = 'none';
checkIn.style.display = 'none';
checkOut.style.display = 'none';
}

function initialize () {
    // < ******* Initial page Load ******** >

    // get menu items
    menuItems = document.getElementsByClassName('menuItem');

    // get each page contents
    guests = document.getElementById('guests');
    reservations = document.getElementById('reservations');
    checkIn = document.getElementById('checkIn');
    checkOut = document.getElementById('checkOut');
    market = document.getElementById('market');

    // add click events to menu
    for(i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener('click', loadPage);
    }

    // ---------------- RESERVATIONS ------------------------

    // get reservations button
    resButton = document.querySelector('#reservationsButton');
    buttonCreateCheckIn = document.getElementById('guestCreator');

    // add event listener to reservations button
    resButton.addEventListener('click', createReservation);
    buttonCreateCheckIn.addEventListener('click', FillRegistration);

    // retrieve the inputs for reservations
    reservationInputs = document.querySelectorAll('.reservationInput');

    // array to hold list of guests
    guestList = [];

    checkOutList = [];
    // make sure no guest is still in variable
    currentGuest = null;

    // grab guest check in area
    guestCheckIn = document.getElementById('guestCheckIn');

    // display area for selected guest checking in
    guestDisplay = document.querySelector('#guestInfo ul');


    // set event for radio buttons on check in page
    singleRadio = document.getElementById('radioSingle');
    doubleRadio = document.getElementById('radioDouble');

    singleRadio.addEventListener('change', setRoomSelection);
    singleRadio.addEventListener('click', setRoomSelection);

    doubleRadio.addEventListener('change', setRoomSelection);
    let roomType; // holds whether single or double was selected as 1 or 2

    // set up initial selection in check in
    selection = document.getElementById('roomSelect');
    
    // grab and assign all rooms to variables
    singleRooms = document.querySelectorAll('.single');
    doubleRooms = document.querySelectorAll('.double');

    // holds a list for each room whether occupied or not
    // true or false values
    // set starting value to false
    roomListOccupied = new Array(24);
    for(i = 0; i < roomListOccupied.length; i++) {
        roomListOccupied[i] = false;
    }
    
    // holds who is in each room
    // initialize all guest rooms
    // to an empty string value
    roomListGuest = new Array(24); 

    // for(i = 0; i < roomListGuest.length; i++) {
    //     roomListGuest[i] = '';
    //     console.log(roomListGuest);
    // }
    
    // select single room type initially to start and call setRoomSelection method
    document.getElementById('radioSingle').click();

    // grab check in button and set click event
    buttonCheckIn = document.getElementById('buttonCheckIn');
    buttonCheckIn.addEventListener('click', checkGuestIn);

    // check out list area
    guestCheckOut = document.getElementById('guestCheckOut');

    // check out button
    buttonCheckOut = document.getElementById('buttonCheckOut');
    buttonCheckOut.addEventListener('click', checkOutGuest); // add click event

    // load initial check in data
    loadGuestData(); // guest data loaded into guestList
    loadCheckins(); // guest data loaded into check in screen

    // Clear out Guest info displayed previously
    clearDisplayGuest();



    
    loadCheckOuts();
    generateRooms();

    // set all pages blank
    setPagesBlank();

    // open guests page to start
    menuItems[0].click();
    
    window.addEventListener('click', clearStyles);
}

function loadPage (e) {
    // when item in menu is clicked, load the page
    switch(e.target) {
        // Load Guests Page
        case menuItems[0]:
            setPagesBlank();
            clearStyles();
            guests.style.display = "flex";
            break;
        // Load Reservations Page
        case menuItems[1]:
            setPagesBlank();
            clearStyles();
            reservations.style.display = "flex";
            break;
        // Load Check In Page
        case menuItems[2]:
            setPagesBlank();
            clearStyles();
            checkIn.style.display = "block";
            break;
        // Load Check Out Page
        case menuItems[3]:
            setPagesBlank();
            clearStyles();
            checkOut.style.display = "block";
    }
}

function generateRooms () {
    console.log('Generate Rooms');
    for(i = 0; i < singleRooms.length; i++) {

        console.log(roomListOccupied[i]);
        if (roomListOccupied[i] === true) {
            singleRooms[i].classList.add('occupied');
            singleRooms[i].children[1].innerText = roomListGuest[i];

            console.log(singleRooms[i].children[1].innerText);
            console.log(singleRooms[i].children[1]);
            console.log(roomListGuest[i]);
        }
        
    }

    for(i = 0; i < doubleRooms.length; i++) {

        console.log(roomListOccupied[i]);
        if (roomListOccupied[i] === true) {
            doubleRooms[i].classList.add('occupied');
            doubleRooms[i].children[1].innerText = roomListGuest[i + 20];

            console.log(doubleRooms[i].children[1].innerText);
            console.log(doubleRooms[i].children[1]);
            console.log(roomListGuest[i]);
            
        }
        
    }

}

    // ---------------- RESERVATIONS ------------------------ //

    // creating guests, array to hold guests, and sending data to check ins

    // class for generic guest
    class Guest {
        constructor() {
            this.checkInDate = "";
            this.checkOutDate = "";
            this.firstName = "";
            this.lastName = "";
            this.phone = "";
            this.email = "";
            this.address = "";
            this.city = "";
            this.state = "";
            this.zipcode = "";
        }
    }

     function createReservation (e) {
        e.preventDefault();

        let guest = new Guest()
        let props = Object.keys(guest);

        for(i = 0; i < reservationInputs.length; i++){
            guest[props[i]] = reservationInputs[i].value;
        }
        guestList.push(guest);

        // add reservation guest to check in screen
        loadCheckins(); // this loads the guest(s) into the check in list

        // save reservations
        localStorage.setItem('guestsIn', JSON.stringify(guestList));

        // clear reservation inputs for next guest
         reservationInputs.forEach(function(input){
            input.value = "";
        })
    
        // go to check in screen
        menuItems[2].click();
     }
     
     function FillRegistration(e) {
         e.preventDefault();
        reservationInputs[0].value = '2020-07-06';
        reservationInputs[1].value = '2020-07-07';
        reservationInputs[2].value = 'Lani';
        reservationInputs[3].value = 'Peterson';
        reservationInputs[4].value = '1234567890';
        reservationInputs[5].value = 'lani@peterson.com';
        reservationInputs[6].value = '123 Some Street';
        reservationInputs[7].value = 'Somewhere';
        reservationInputs[8].value = 'NV';
        reservationInputs[9].value = '22334';
     }

     // clear guest in list displayed, reload with current info in guestList.
     // call getGuestInfo
     function loadCheckins () {
         
         // guestCheckIn is where guests appear on check in screen
            guestCheckIn.innerHTML = '';
            
            if (guestList){
                guestList.forEach(function (element) {

                guestCheckIn.innerHTML += `<div>${element.firstName} ${element.lastName}</div>`;
                });
              
                getGuestInfo();
            }
            
        }
         // load guest data saved to guestList array
    function loadGuestData () {
        //console.log('LOADING GUEST DATA');
        // Load Check Ins
        if(localStorage.getItem('guestsIn') !== null){
            guestList = JSON.parse(localStorage.getItem('guestsIn'));
            
        }

        // Load Check Outs
        //console.log(JSON.parse(localStorage.getItem('guestsOut')));
        if(localStorage.getItem('guestsOut') !== null) {
            checkOutList = JSON.parse(localStorage.getItem('guestsOut'));
            //console.log(checkOutList);
        }
        
        // Load RoomListOccupied
        if (JSON.parse(localStorage.getItem('roomListOccupied')) !== null) {
            roomListOccupied = JSON.parse(localStorage.getItem('roomListOccupied'));
                //console.log(roomListOccupied);
                //console.log(JSON.parse(localStorage.getItem('roomListOccupied')));
        }
        

        // Load RoomListGuest
        if (localStorage.getItem('roomListGuest') !== null) {
            roomListGuest = JSON.parse(localStorage.getItem('roomListGuest'));
                //console.log(roomListGuest);
                //console.log(localStorage.getItem('roomListGuest'));
        }       
    }

    // grab guests checking in as displayed and add click events
    function getGuestInfo () {
        // when you click guest in check in list
        // will cause displayGuest() to
        // change look of guest within list
        checkInList = document.querySelectorAll('#guestCheckIn div');
        for(i = 0; i < checkInList.length; i++) {
            checkInList[i].addEventListener('click', displayGuest);
        }
    }

    function clearStyles (e) {
        for(i = 0; i < checkInList.length; i++){
            if(e && e.target === checkInList[i]) {
                continue;
            }
            checkInList[i].style.borderColor = 'black';
            checkInList[i].style.backgroundColor = 'white';
            checkInList[i].style.color = 'black';
            checkInList[i].style.fontWeight = 'normal';
        }

        for(i = 0; i < guestCheckOutList.length; i++) {
            if(e && e.target === guestCheckOutList[i]) {
                continue;
            }
            guestCheckOutList[i].style.borderColor = 'black';
            guestCheckOutList[i].style.backgroundColor = 'white';
            guestCheckOutList[i].style.color = 'black';
            guestCheckOutList[i].style.fontWeight = 'normal';
        }

        
        
    }
    // display data of active guest in check in list
    function displayGuest (e) {
        clearStyles();
        clearDisplayGuest();
        e.target.style.borderColor = 'blue';
        e.target.style.backgroundColor = 'navy';
        e.target.style.color = 'white';
        e.target.style.fontWeight = 'bold';

        const name = e.target.innerText; // grab text within check in list
        name.trim();
        const spaceChar = name.indexOf(' '); // find space between first & last name
        let fName, lName; // use these for comparison
        fName = name.slice(0, spaceChar); // extract first name
        lName = name.slice(spaceChar + 1) // extract last name

        /*This will compare first and last name
        to guest objects to find specific guest*/
        guestList.forEach(function(item) {
            if(item.firstName === fName && item.lastName === lName){
                // set currently selected guest for check in
                currentGuest = item;
                 let props = Object.keys(item); // get each property of the guest object as an array
                 let propertyName; // for holding property name formatted to how will be displayed
                 let guestData; // storage for current guest data to be displayed
                 // will run through object properties and set propertyName to proper formatting
                 for(i = 0; i < props.length; i++) {
                     switch (props[i]){
                         case "checkInDate":
                             propertyName = "Check In Date";
                             break;
                         case "checkOutDate":
                             propertyName = "Check Out Date";
                             break;
                        case "firstName":
                            propertyName = "First Name";
                            break;
                        case "lastName":
                            propertyName = "Last Name";
                            break;
                        case "phone":
                            propertyName = "Phone";
                            break;
                        case "email":
                            propertyName = "E-Mail";
                            break;
                        case "address":
                            propertyName = "Address";
                            break;
                        case "city":
                            propertyName = "City";
                            break;
                        case "state":
                            propertyName = "State";
                            break;
                        case "zipcode":
                            propertyName = "Zipcode";
                     }
                     // display guest data
                    guestData += `<li>${propertyName}: ${item[props[i]]}</li> \n`;
                 }
                 guestDisplay.innerHTML = guestData;
            }
        });
    
    }

    function clearDisplayGuest () {
        guestDisplay.innerHTML = '';
    }

    function setRoomSelection (e) {
        if(e.target.id === 'radioSingle') {
            startRooms = 1;
            endRooms = 19; // 1 - 19 are single beds, 20 - 24 doubles
            roomType = 1;
        } else { // room selected is double
            // 20 - 24 for double
            startRooms = 20;
            endRooms = 24; 
            roomType = 2;
        } 

        createCheckInRoomList();
    }
    // generate the select list of rooms on check in screen based on room type
    function createCheckInRoomList () {
        if (document.querySelectorAll('#roomSelect option')) {
            options = document.querySelectorAll('#roomSelect option');
            for(i = 0; i < options.length; i++) {
                selection.remove(selection.i);
            }
        }
        
        for(i = startRooms; i <= endRooms; i++) {
            
            if(singleRooms[i] && singleRooms[i].classList.contains('occupied')) {
                continue;
            }

            if (doubleRooms[i] && doubleRooms[i].classList.contains('occupied')) {
                continue;
            }
           let item; // store creation
           item = document.createElement('option');
           item.appendChild(document.createTextNode('Room ' + i));
           selection.appendChild(item);
        }
        
    }

    function checkGuestIn (e) {
        e.preventDefault();
        // make sure guest is checked, data is displayed if so,
        let roomNumber; // store room value
        if (currentGuest) { // if a guest is actively selected

            if (roomType === 1) {
                roomNumber = selection.value;
                // loop through singleRooms to find room that matches roomNumber
                // and remove that one from list
                for(i = 0; i < singleRooms.length; i++) {
                    if (singleRooms[i].children[0].innerText === roomNumber) {
                        singleRooms[i].classList.add("occupied");
                        selection.remove(roomNumber - 1);
                    }
                }

                // find the space of string in room selected from list
                const spaceChar = roomNumber.indexOf(' '); 
                // find the actual number of the room
                roomNumber = roomNumber.slice(spaceChar + 1);

                // add guest to room on main screen
                singleRooms[roomNumber - 1].children[1].innerHTML = `${currentGuest.firstName} ${currentGuest.lastName}`;
            
                // iterate through each room and assign whether room has
                // been occupied and guest name for saving later
                // iterate through single rooms first
                for(i = 0; i < singleRooms.length; i++) {
                    if(singleRooms[i].classList.contains("occupied")) {
                        roomListOccupied[i] = true;
                        roomListGuest[i] = `${currentGuest.firstName} ${currentGuest.lastName}`;
                        console.log(roomListGuest);
                    }
            }
            
            }
            if (roomType === 2) {
                    roomNumber = selection.value;
                    // loop through singleRooms to find room that matches roomNumber
                    // and remove that one from list

                    for(i = 0; i < doubleRooms.length; i++) {
                        if (doubleRooms[i].children[0].innerText === roomNumber) {
                            doubleRooms[i].classList.add("occupied");
                            selection.remove(roomNumber - 1);
                        }
                    }

                    // find the space of string in room selected from list
                    const spaceChar = roomNumber.indexOf(' '); 
                    // find the actual number of the room
                    roomNumber = roomNumber.slice(spaceChar + 1);
    
                    // add guest to room on main screen
                    doubleRooms[roomNumber - 20].children[1].innerHTML = `${currentGuest.firstName} ${currentGuest.lastName}`;
                
                    // iterate through double rooms
                    for(i = 0; i < doubleRooms.length; i++) {
                        if(doubleRooms[i].classList.contains("occupied")) {
                            roomListOccupied[i + 20] = true;
                            roomListGuest[i + 20] = `${currentGuest.firstName} ${currentGuest.lastName}`;
                            console.log(roomListGuest);
                        }
                    }
            }




                // remove guest from check in list and add to check out list
            for (i = 0; i < checkInList.length; i++) {
                if(checkInList[i].innerText === `${currentGuest.firstName} ${currentGuest.lastName}`) {
                        
                    checkInList[i].parentNode.removeChild(checkInList[i]);

                    checkOutList.push(currentGuest);

                    guestCheckOut.innerHTML += `<div>${currentGuest.firstName} ${currentGuest.lastName}</div>`;
                    loadCheckOuts();
                }
            }

            // check guestList for current guest and remove it
            for (i = 0; i < guestList.length; i++) {
                if(guestList[i] === currentGuest) {
                        
                    // if true, remove current guest
                        
                    guestList.splice(i, 1);

                }
            }
                
            

            // Clear out Guest info displayed previously
            clearDisplayGuest();


            
            
                


            console.log('saving...');
            // save data
        
            // store list of true/false values indicating whether room
            // is occupied or not
            localStorage.setItem('roomListOccupied', JSON.stringify(roomListOccupied));
            console.log(roomListOccupied);
            console.log(JSON.parse(localStorage.getItem('roomListOccupied')));

            // store list of guest name/empty strings if room was
            // occupied/not occupied
            localStorage.setItem('roomListGuest', JSON.stringify(roomListGuest));
            console.log(roomListGuest);
            console.log(localStorage.getItem('roomListGuest'));

            localStorage.setItem('guestsIn', JSON.stringify(guestList));
            localStorage.setItem('guestsOut', JSON.stringify(checkOutList));
            console.log(localStorage);
            console.log(checkOutList);

            // change screen to main guest room screen
            menuItems[0].click();

            // remove current guest object, move to check out list
            currentGuest = null;    
            

        }  
    }

    function loadCheckOuts () {
        
        guestCheckOut.innerHTML = '';
            if (checkOutList){
                checkOutList.forEach(function (element) {
                guestCheckOut.innerHTML += `<div>${element.firstName} ${element.lastName}</div>`;
            });

                getGuestOutInfo();

            }
            
    }

    function getGuestOutInfo () {
        // list of guests checking out
        guestCheckOutList = document.querySelectorAll('#guestCheckOut div');
        for(i = 0; i < guestCheckOutList.length; i++) {
            guestCheckOutList[i].addEventListener('click', displayGuestsOut);
        }

        // checkInList = document.querySelectorAll('#guestCheckIn div');
        // for(i = 0; i < checkInList.length; i++) {
        //     checkInList[i].addEventListener('click', displayGuest);
        // }
    }



    function displayGuestsOut (e) {
    // list of guests checking in
    clearStyles();
    clearDisplayGuest();
    e.target.style.borderColor = 'blue';
    e.target.style.backgroundColor = 'navy';
    e.target.style.color = 'white';
    e.target.style.fontWeight = 'bold';

        const name = e.target.innerText; // grab text within check in list
        name.trim();
        const spaceChar = name.indexOf(' '); // find space between first & last name
        let fName, lName; // use these for comparison
        fName = name.slice(0, spaceChar); // extract first name
        lName = name.slice(spaceChar + 1) // extract last name

        /*This will compare first and last name
        to guest objects to find specific guest*/
        checkOutList.forEach(function(item) {
            if(item.firstName === fName && item.lastName === lName){
                // set currently selected guest for check in
                currentGuest = item;
            }
        })
    }

    function checkOutGuest (e) {
        
        // remove guests from checkOutList
        for (i = 0; i < checkOutList.length; i++) {
            if(guestCheckOutList[i].innerText === `${currentGuest.firstName} ${currentGuest.lastName}`) {   
                guestCheckOutList[i].parentNode.removeChild(guestCheckOutList[i]);
            }
        }

        for(i = 0; i < checkOutList.length; i++) {
            if(checkOutList[i] === currentGuest) {
                checkOutList.splice(i, 1);
            }
        }

        for(i = 0; i < roomListGuest.length; i++) {
            if(roomListGuest[i] === `${currentGuest.firstName} ${currentGuest.lastName}`) {
                // remove name from Name list saved
                roomListGuest[i] = null;
                roomListOccupied[i] = false;

                // remove name from room on main screen
                if(i < 20) {
                    // remove guest from room on main screen
                    singleRooms[i].children[1].innerHTML = ``;
                }
                else {
                    // remove guest from room on main screen
                    doubleRooms[i - 20].children[1].innerHTML = ``;
                }
            }
        }


        // save data
        
        // store list of true/false values indicating whether room
        // is occupied or not
        localStorage.setItem('roomListOccupied', JSON.stringify(roomListOccupied));
        console.log(roomListOccupied);
        console.log(JSON.parse(localStorage.getItem('roomListOccupied')));

        // store list of guest name/empty strings if room was
        // occupied/not occupied
        localStorage.setItem('roomListGuest', JSON.stringify(roomListGuest));
        console.log(roomListGuest);
        console.log(localStorage.getItem('roomListGuest'));

        localStorage.setItem('guestsIn', JSON.stringify(guestList));
        localStorage.setItem('guestsOut', JSON.stringify(checkOutList));
        console.log(localStorage);
        console.log(checkOutList);

        // change screen to main guest room screen
        menuItems[0].click();

        // remove current guest object, move to check out list
        currentGuest = null;    

    }
