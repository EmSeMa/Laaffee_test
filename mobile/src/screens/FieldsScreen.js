import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Icon } from 'react-native-paper';
import { fieldsService } from '../services/api';

const FieldsScreen = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    setLoading(true);
    try {
      const response = await fieldsService.getAll();
      setFields(response.data);
    } catch (error) {
      console.error('Error loading fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFieldIcon = (type) => {
    switch (type) {
      case 'football':
        return 'soccer';
      case 'tennis':
        return 'tennis';
      case 'basketball':
        return 'basketball';
      default:
        return 'soccer-field';
    }
  };

  const renderField = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerRow}>
          <View style={styles.fieldInfo}>
            <Text style={styles.fieldName}>{item.name}</Text>
            <Text style={styles.fieldType}>{item.type}</Text>
          </View>
          <Icon
            source={getFieldIcon(item.type)}
            size={40}
            color={item.is_available ? '#4CAF50' : '#999'}
          />
        </View>
        <Text style={styles.location}>📍 {item.location}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detail}>💰 {item.price_per_hour}€/h</Text>
          <Text style={styles.detail}>👥 {item.capacity} Personen</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={[
            styles.statusBadge,
            item.is_available ? styles.availableBadge : styles.unavailableBadge
          ]}>
            <Text style={styles.statusText}>
              {item.is_available ? 'Verfügbar' : 'Nicht verfügbar'}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={fields}
        renderItem={renderField}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadFields} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Keine Plätze vorhanden</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fieldType: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detail: {
    fontSize: 12,
    color: '#333',
  },
  statusRow: {
    marginTop: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  availableBadge: {
    backgroundColor: '#E8F5E9',
  },
  unavailableBadge: {
    backgroundColor: '#F5F5F5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default FieldsScreen;
