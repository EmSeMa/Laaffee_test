import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, FAB, Dialog, Portal, TextInput, Chip } from 'react-native-paper';
import { maintenanceService } from '../services/api';
import { formatDate } from 'date-fns';
import { de } from 'date-fns/locale';

const MaintenanceScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    field_id: '',
    task_type: 'cleaning',
    priority: 'medium',
    scheduled_date: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await maintenanceService.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      await maintenanceService.create(newTask);
      setDialogVisible(false);
      setNewTask({
        title: '',
        description: '',
        field_id: '',
        task_type: 'cleaning',
        priority: 'medium',
        scheduled_date: '',
      });
      loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#d32f2f';
      case 'medium':
        return '#f57c00';
      case 'low':
        return '#388e3c';
      default:
        return '#999';
    }
  };

  const renderTask = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Chip
            mode="flat"
            style={{ backgroundColor: getPriorityColor(item.priority) }}
            textStyle={{ color: 'white' }}
          >
            {item.priority}
          </Chip>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.fieldInfo}>Feld: {item.field_id}</Text>
        <Text style={styles.date}>
          {formatDate(new Date(item.scheduled_date), 'dd.MM.yyyy', { locale: de })}
        </Text>
        <Text style={[
          styles.status,
          item.status === 'completed' ? styles.statusCompleted : styles.statusPending
        ]}>
          {item.status === 'completed' ? 'Abgeschlossen' : 'Ausstehend'}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadTasks} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Keine Wartungsaufgaben vorhanden</Text>
        }
      />
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setDialogVisible(true)}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Neue Aufgabe</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Titel"
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Beschreibung"
              value={newTask.description}
              onChangeText={(text) => setNewTask({ ...newTask, description: text })}
              mode="outlined"
              style={styles.input}
              multiline
            />
            <TextInput
              label="Feld ID"
              value={newTask.field_id}
              onChangeText={(text) => setNewTask({ ...newTask, field_id: text })}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Datum (YYYY-MM-DD)"
              value={newTask.scheduled_date}
              onChangeText={(text) => setNewTask({ ...newTask, scheduled_date: text })}
              mode="outlined"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Abbrechen</Button>
            <Button onPress={handleCreateTask}>Erstellen</Button>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
  fieldInfo: {
    fontSize: 12,
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    marginTop: 5,
  },
  status: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  statusCompleted: {
    color: 'green',
  },
  statusPending: {
    color: 'orange',
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

export default MaintenanceScreen;
