// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductList from './ProductList'; // Import the ProductList component

const db = SQLite.openDatabase('mySqlDb.db');
const Stack = createStackNavigator(); // Create a stack navigator

export default function App() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    // Initialize the database schema
    initDatabase();
  }, []);

  const initDatabase = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DROP TABLE IF EXISTS items;',
          [],
          () => {
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, price REAL NOT NULL);',
              [],
              () => resolve(),
              (_, err) => reject(err)
            );
          },
          (_, err) => reject(err)
        );
      });
    });
  };

  const handleAddProduct = async () => {
    if (!title || !price) {
      Alert.alert('Error', 'Please enter both title and price');
      return;
    }

    try {
      await insertItem({ title, price });
      setTitle('');
      setPrice('');

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Product Added Successfully',
          body: 'The product has been added to the database.',
        },
        trigger: null,
      });

      Alert.alert('Success', 'Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product. Please try again later.');
    }
  };

  const insertItem = (newItem) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO items (title, price) VALUES (?, ?);',
          [newItem.title, newItem.price],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      });
    });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{ title: 'Add Product' }}
        />
        <Stack.Screen
          name="ProductList"
          component={ProductList}
          options={{ title: 'Product List' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const AddProductScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const handleAddProduct = () => {
    // Add your logic to add a product
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter product title"
      />
      <Text style={styles.label}>Product Price:</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter product price"
        keyboardType="numeric"
      />
      <Button title="Add Product" onPress={handleAddProduct} />
      <Button
        title="View Products"
        onPress={() => navigation.navigate('ProductList')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
