import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, RefreshCcw, Battery, MapPin } from 'lucide-react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

type RobotStatus = 'operational' | 'warning' | 'offline';

interface Robot {
  id: string;
  name: string;
  status: RobotStatus;
  task?: string;
  battery: number;
  location: string;
  lastUpdate: string;
}

const mockRobots: Robot[] = [
  {
    id: '1',
    name: 'RBT-001',
    status: 'operational',
    task: 'Assembly Line Operation',
    battery: 85,
    location: 'Production Line 3',
    lastUpdate: '2024-02-21T10:30:00Z',
  },
  {
    id: '2',
    name: 'RBT-002',
    status: 'warning',
    task: 'Quality Control',
    battery: 45,
    location: 'Quality Control Station',
    lastUpdate: '2024-02-21T10:29:00Z',
  },
  {
    id: '3',
    name: 'RBT-003',
    status: 'offline',
    battery: 0,
    location: 'Maintenance Bay',
    lastUpdate: '2024-02-21T09:15:00Z',
  },
  // Add more robots as needed
];

type Filter = 'all' | 'operational' | 'warning' | 'offline';

const FilterButton = ({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }) => (
  <TouchableOpacity
    style={[
      styles.filterButton,
      active && { backgroundColor: '#2563eb', borderColor: '#2563eb' },
    ]}
    onPress={onPress}>
    <Text
      style={[
        styles.filterButtonText,
        active && { color: '#ffffff' },
      ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const StatusIndicator = ({ status }: { status: RobotStatus }) => {
  const colors = {
    operational: '#22c55e',
    warning: '#f97316',
    offline: '#ef4444',
  };

  return (
    <View
      style={[
        styles.statusIndicator,
        { backgroundColor: colors[status] },
      ]}
    />
  );
};

const RobotCard = ({ robot }: { robot: Robot }) => {
  const router = useRouter();

  return (
    <Animated.View
      entering={FadeIn}
      layout={Layout}
      style={styles.robotCard}>
      <View style={styles.robotHeader}>
        <StatusIndicator status={robot.status} />
        <Text style={styles.robotName}>{robot.name}</Text>
      </View>
      <Text style={styles.robotStatus}>
        {robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}
      </Text>
      {robot.task && (
        <Text style={styles.robotTask}>{robot.task}</Text>
      )}
      <View style={styles.robotInfo}>
        <View style={styles.infoItem}>
          <Battery size={16} color="#64748b" />
          <Text style={styles.infoText}>{robot.battery}%</Text>
        </View>
        <View style={styles.infoItem}>
          <MapPin size={16} color="#64748b" />
          <Text style={styles.infoText}>{robot.location}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => router.push(`/robots/${robot.id}`)}>
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function RobotMonitoring() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [robots, setRobots] = useState(mockRobots);

  const filteredRobots = robots.filter(robot => {
    if (filter === 'all') return true;
    return robot.status === filter;
  });

  const stats = {
    operational: robots.filter(r => r.status === 'operational').length,
    warning: robots.filter(r => r.status === 'warning').length,
    offline: robots.filter(r => r.status === 'offline').length,
  };

  const refreshData = () => {
    // In a real app, this would fetch new data
    setLastUpdate(new Date());
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1e293b" />
          </Pressable>
          <Text style={styles.headerTitle}>Robot Monitoring</Text>
          <Pressable onPress={refreshData} style={styles.refreshButton}>
            <RefreshCcw size={24} color="#1e293b" />
          </Pressable>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { borderLeftColor: '#22c55e' }]}>
          <Text style={styles.statValue}>{stats.operational}</Text>
          <Text style={styles.statLabel}>Operational</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#f97316' }]}>
          <Text style={styles.statValue}>{stats.warning}</Text>
          <Text style={styles.statLabel}>Warnings</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
          <Text style={styles.statValue}>{stats.offline}</Text>
          <Text style={styles.statLabel}>Offline</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton
            title="All Robots"
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <FilterButton
            title="Operational"
            active={filter === 'operational'}
            onPress={() => setFilter('operational')}
          />
          <FilterButton
            title="Warnings"
            active={filter === 'warning'}
            onPress={() => setFilter('warning')}
          />
          <FilterButton
            title="Offline"
            active={filter === 'offline'}
            onPress={() => setFilter('offline')}
          />
        </ScrollView>
      </View>

      <ScrollView
        style={styles.robotList}
        contentContainerStyle={styles.robotListContent}>
        {filteredRobots.map(robot => (
          <RobotCard key={robot.id} robot={robot} />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.updateText}>
          Last update: {Math.round((new Date().getTime() - lastUpdate.getTime()) / 1000)}s ago
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingTop: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#1e293b',
  },
  refreshButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#1e293b',
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginRight: 8,
    backgroundColor: '#ffffff',
  },
  filterButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#64748b',
  },
  robotList: {
    flex: 1,
  },
  robotListContent: {
    padding: 16,
    gap: 16,
  },
  robotCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  robotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  robotName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
  robotStatus: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  robotTask: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 12,
  },
  robotInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  detailsButton: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#1e293b',
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  updateText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});