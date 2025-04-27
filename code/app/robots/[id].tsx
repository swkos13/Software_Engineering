import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Battery, MapPin, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface HistoryEntry {
  id: string;
  type: 'task' | 'error' | 'maintenance';
  title: string;
  description: string;
  timestamp: string;
}

const mockHistory: HistoryEntry[] = [
  {
    id: '1',
    type: 'task',
    title: 'Assembly Line Operation',
    description: 'Completed assembly of 100 units',
    timestamp: '2024-02-21T10:30:00Z',
  },
  {
    id: '2',
    type: 'error',
    title: 'Sensor Malfunction',
    description: 'Temperature sensor reading abnormal values',
    timestamp: '2024-02-21T09:45:00Z',
  },
  {
    id: '3',
    type: 'maintenance',
    title: 'Routine Maintenance',
    description: 'Performed scheduled maintenance check',
    timestamp: '2024-02-21T08:00:00Z',
  },
];

const HistoryItem = ({ entry }: { entry: HistoryEntry }) => {
  const getIcon = () => {
    switch (entry.type) {
      case 'task':
        return <Clock size={20} color="#2563eb" />;
      case 'error':
        return <AlertTriangle size={20} color="#ef4444" />;
      case 'maintenance':
        return <MapPin size={20} color="#22c55e" />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.historyItem}>
      <View style={styles.historyIcon}>{getIcon()}</View>
      <View style={styles.historyContent}>
        <Text style={styles.historyTitle}>{entry.title}</Text>
        <Text style={styles.historyDescription}>{entry.description}</Text>
        <Text style={styles.historyTimestamp}>
          {new Date(entry.timestamp).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

export default function RobotDetails() {
  const { id } = useLocalSearchParams();

  // In a real app, fetch robot details based on id
  const robot = {
    name: 'RBT-001',
    status: 'operational',
    battery: 85,
    location: 'Production Line 3',
    uptime: '48h 30m',
    temperature: '23°C',
    lastMaintenance: '2024-02-19',
    nextMaintenance: '2024-03-19',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.robotName}>{robot.name}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.statusText}>Operational</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Battery size={20} color="#64748b" />
          <Text style={styles.statValue}>{robot.battery}%</Text>
          <Text style={styles.statLabel}>Battery</Text>
        </View>
        <View style={styles.statCard}>
          <MapPin size={20} color="#64748b" />
          <Text style={styles.statValue}>{robot.location}</Text>
          <Text style={styles.statLabel}>Location</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={20} color="#64748b" />
          <Text style={styles.statValue}>{robot.uptime}</Text>
          <Text style={styles.statLabel}>Uptime</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Maintenance Schedule</Text>
        <View style={styles.maintenanceInfo}>
          <View>
            <Text style={styles.maintenanceLabel}>Last Maintenance</Text>
            <Text style={styles.maintenanceDate}>{robot.lastMaintenance}</Text>
          </View>
          <View>
            <Text style={styles.maintenanceLabel}>Next Maintenance</Text>
            <Text style={styles.maintenanceDate}>{robot.nextMaintenance}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity History</Text>
        <View style={styles.historyList}>
          {mockHistory.map(entry => (
            <HistoryItem key={entry.id} entry={entry} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  robotName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#1e293b',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#64748b',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    marginTop: 24,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 16,
  },
  maintenanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  maintenanceLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  maintenanceDate: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyIcon: {
    marginRight: 16,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  historyDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  historyTimestamp: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#94a3b8',
  },
});