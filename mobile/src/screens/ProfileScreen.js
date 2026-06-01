import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Divider } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.roleLabel}>Rolle</Text>
          <Text style={styles.role}>
            {user?.role === 'admin' ? 'Administrator' : 'Benutzer'}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Informationen</Text>
          <Text style={styles.infoText}>
            Version: 1.0.0
          </Text>
          <Text style={styles.infoText}>
            Entwickler-Kontakt: support@sportplatz.de
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={logout}
        style={styles.logoutButton}
        color="#d32f2f"
      >
        Abmelden
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  roleLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  logoutButton: {
    marginTop: 'auto',
  },
});

export default ProfileScreen;
