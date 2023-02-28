(function () {
    // all the code will be here  
    // ...
    if (!window.indexedDB) {
        console.log(`Your browser doesn't support IndexedDB`);
        return;
    }

    const request = indexedDB.open('REVIEW', 1);

    // create the Contacts object store and indexes
    request.onupgradeneeded = (event) => {
        let db = event.target.result;

        // create the Contacts object store 
        // with auto-increment id
        let store = db.createObjectStore('Contacts', {
            autoIncrement: true
        });

        // create an index on the email property
        let index = store.createIndex('email', 'email', {
            unique: true
        });
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
   
        insertContact(db, {
            email: 'john.doe@outlook.com',
            message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime veritatis iste'
        });
   
        insertContact(db, {
            email: 'jane.doe@gmail.com',
            message: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium laboriosam modi'
        });

        /*let btn = document.getElementById("btn-add");
        btn.addEventListener('click', () => {

            let mail = document.getElementById('email');
            let fName = document.getElementById('firstName');
            let lName = document.getElementById('lastName');
        

            insertContact(db, {
                email: mail.value,
                firstName: fName.value,
                lastName: lName.value
            });

            mail.value = "";
            fName.value = "";
            lName.value = "";
            
            console.log('hello')
        });*/

        getAllContacts(db);
   };


    function insertContact(db, contact) {
        // create a new transaction
        const txn = db.transaction('Contacts', 'readwrite');
    
        // get the Contacts object store
        const store = txn.objectStore('Contacts');
        //
        let query = store.put(contact);
    
        // handle success case
        query.onsuccess = function (event) {
            console.log(event);
        };
    
        // handle the error case
        query.onerror = function (event) {
            console.log(event.target.errorCode);
        }
    
        // close the database once the 
        // transaction completes
        txn.oncomplete = function () {
            db.close();
        };
    }

    function getAllContacts(db) {
        const txn = db.transaction('Contacts', "readonly");
        const objectStore = txn.objectStore('Contacts');
    
        objectStore.openCursor().onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
                let contact = cursor.value;
                console.log(contact);
                
                let review = document.getElementById('review-section');

                let paragraph = document.createElement('p');
                let h1 = document.createElement('h1');

                paragraph.innerHTML = contact.message;
                h1.innerHTML = contact.email;

                review.appendChild(h1);
                review.appendChild(paragraph);
                // continue next record
                cursor.continue();
            }
        };
        // close the database connection
        txn.oncomplete = function () {
            db.close();
        };
    }
 })();