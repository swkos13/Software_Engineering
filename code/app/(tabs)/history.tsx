import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'lucide-react-native';

const history = [
  {
    id: '1',
    title: 'Production Batch #1234',
    status: 'Completed',
    date: '2024-02-20',
    details: 'Processed 1000 units',
  },
  {
    id: '2',
    title: 'Maintenance Check',
    status: 'Completed',
    date: '2024-02-19',
    details: 'Robot 3 maintenance',
  },
  {
    id: '3',
    title: 'System Update',
    status: 'Completed',
    date: '2024-02-18',
    details: 'Updated firmware version 2.1.0',
  },
];

const HistoryItem = ({ item }: { item: typeof history[0] }) => (
  <View style={styles.historyItem}>
    <View style={styles.dateContainer}>
      <Calendar size={20} color="#2563eb" />
      <Text style={styles.date}>{item.date}</Text>
    </View>
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.details}>{item.details}</Text>
    <View style={styles.statusContainer}>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  </View>
);

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
      </View>
      <FlatList
        data={history}
        renderItem={({ item }) => <HistoryItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#1e293b',
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  historyItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  details: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  statusContainer: {
    alignSelf: 'flex-start',
  },
  status: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#22c55e',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});