const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const store = admin.firestore();
    
exports.onCreateNumberOfTodos = functions.firestore.document('todos/{todoId}')
    .onCreate((snap, context) => {
        const todo = snap.data();
        const userRef = store.doc(`users/${todo.userUid}`);

        return userRef.get()
            .then(doc => {
                userRef.update({ 'numberOfTodos': doc.data().numberOfTodos + 1 }); 
                return; 
            })
            .catch(error => { console.log(error) });
            
    }); 

exports.onUpdateNumberOfTodos = functions.firestore.document('todos/{todoId}')
    .onUpdate((change, context) => {
        const newTodo = change.after.data();
        const previousTodo = change.before.data();
        const userRef = store.doc(`users/${newTodo.userUid}`);

        if(newTodo.done !== previousTodo.done){
            if(newTodo.done){
                return userRef.get()
                    .then(doc => {
                        userRef.update({ 'numberOfTodos': doc.data().numberOfTodos - 1 });  
                        userRef.update({ 'numberOfTodosCompleted': doc.data().numberOfTodosCompleted + 1 });  
                        return;
                    })
                    .catch(error => { console.log(error) });
            } else {
                return userRef.get()
                    .then(doc => {
                        userRef.update({ 'numberOfTodos': doc.data().numberOfTodos + 1 });  
                        userRef.update({ 'numberOfTodosCompleted': doc.data().numberOfTodosCompleted - 1 }); 
                        return;
                    })
                    .catch(error => { console.log(error) });
            }
        }
        return;
    });

exports.onDeleteNumberOfTodos = functions.firestore.document('todos/{todoId}')
    .onDelete((snap, context) => {
        const todo = snap.data();
        const userRef = store.doc(`users/${todo.userUid}`);
        
        if(todo.done){
            return userRef.get()
                .then(doc => {
                    userRef.update({ 'numberOfTodosCompleted': doc.data().numberOfTodosCompleted - 1 });   
                    return;
                })
                .catch(error => { console.log(error) });
        } else {
            return userRef.get()
                .then(doc => {
                    userRef.update({ 'numberOfTodos': doc.data().numberOfTodos - 1 });  
                    return;
                })
                .catch(error => { console.log(error) });
        }
        
    });