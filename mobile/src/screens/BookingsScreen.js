import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, FAB, Dialog, Portal, TextInput } from 'react-native-paper';
import { bookingsService } from '../services/api';
import { formatDate } from 'date-fns';
import { de } from 'date-fns/locale';

const BookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newBooking, setNewBooking] = useState({
    field_id: '',
    booking_date: '',
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsService.getAll();
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    try {
      await bookingsService.create(newBooking);
      setDialogVisible(false);
      setNewBooking({ field_id: '', booking_date: '', start_time: '', end_time: '' });
      loadBookings();
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const renderBooking = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.bookingTitle}>Feld {item.field_id}</Text>
        <Text style={styles.bookingDate}>
          {formatDate(new Date(item.booking_date), 'dd.MM.yyyy', { locale: de })}
        </Text>
        <Text>{item.start_time} - {item.end_time}</Text>
        <Text style={[
          styles.status,
          item.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending
        ]}>
          {item.status === 'confirmed' ? 'Bestätigt' : 'Ausstehend'}
        </Text>
        <Text style={styles.price}>{item.total_price}€</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadBookings} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Keine Buchungen vorhanden</Text>
        }
      />
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setDialogVisible(true)}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Neue Buchung</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Feld ID"
              value={newBooking.field_id}
              onChangeText={(text) => setNewBooking({ ...newBooking, field_id: text })}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Datum (YYYY-MM-DD)"
              value={newBooking.booking_date}
              onChangeText={(text) => setNewBooking({ ...newBooking, booking_date: text })}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Start Zeit (HH:MM)"
              value={newBooking.start_time}
              onChangeText={(text) => setNewBooking({ ...newBooking, start_time: text })}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="End Zeit (HH:MM)"
              value={newBooking.end_time}
              onChangeText={(text) => setNewBooking({ ...newBooking, end_time: text })}
              mode="outlined"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Abbrechen</Button>
            <Button onPress={handleCreateBooking}>Erstellen</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookingDate: {
    fontSize: 14,
    marginTop: 5,
  },
  status: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  statusConfirmed: {
    color: 'green',
  },
  statusPending: {
    color: 'orange',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    marginBottom: 10,
  },
});

export default BookingsScreen;
