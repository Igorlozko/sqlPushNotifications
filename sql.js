import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mySqlDb.db');

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DROP TABLE IF EXISTS items;', // Drop the existing table
        [],
        () => {
          // After dropping the table, recreate it with the updated schema
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, price REAL NOT NULL);',
            [],
            () => {
              resolve();
            },
            (_, err) => {
              reject(err);
            }
          );
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const insertItem = (newItem) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            `INSERT INTO items (title) VALUES (?);`,
            [newItem.title],  // An array of data that can be inserted into the swl query
            (xx, result) => { // xx is the transaction id which we don't use
              resolve(result);
            },
            (xx, err) => {
              reject(err);
            }
          );
        });
      });
      return promise;
};

export const fetchItems = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM items', // could add WHERE etc. 
            [],  // An array of data that can be inserted into the sql query, not used here
            (xx, result) => {
              resolve(result.rows._array);
            },
            (xx, err) => {
              reject(err);
            }
          );
        });
      });
      return promise;
};