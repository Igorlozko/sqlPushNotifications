// ProductList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchItems } from './sql';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await fetchItems();
      setProducts(result);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Product List</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.title}</Text>
            <Text>Price: {item.price}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
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
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default ProductList;
