let db;

////////////
const req = indexedDB.open('budget-tracker', 1);

req.onupgradeneeded=(e)=>{
    const db = e.target.result;
    db.createObjectStore('new_entry', { autoIncrement: true });
};
req.onsuccess=(event)=>{
    mainDB = event.target.result;
    if (navigator.onLine) {
        uploadData();
    }
};
req.onerror=(e)=>{
    console.log(e.target.errorCode);
}
//////////////

let h;

const saveRecord = (data) => {
    let ts = mainDB.transaction('new_entry', 'readwrite');
    const entryStore = ts.objectStore('new_entry');
    entryStore.add(data);
}

const update = (data)=> {
    let ts = mainDB.transaction('new_entry', 'readwrite');
    const entryStore = ts.objectStore('new_entry');
    entryStore.add(data);
}

const uploadData = () =>{
    let ts = mainDB.transaction('new_entry', 'readwrite');
    const entryStore = ts.objectStore('new_entry');

    const allEntries = entryStore.getAll();
    allEntries.onsuccess = () => {
        if (allEntries.result.length) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(allEntries.result),
            }).then((res) => res.json())
                .then(() => {
                    const ts = mainDB.transaction('new_entry', 'readwrite');
                    const entryStore = ts.objectStore('new_entry');
                    entryStore.clear();
                    alert("Updates made while offline have been successfully updated");
                }).catch((err) => {
                console.log(err);
            });
        }
    };
}
// if offline -- once back online data pushed and synced with db
window.addEventListener('online', uploadData);