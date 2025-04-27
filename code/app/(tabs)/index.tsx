import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Notebook as Robot, 
  Calendar, 
  ListTodo, 
  Bell, 
  ChartBar as BarChart3, 
  Settings, 
  TriangleAlert as AlertTriangle,
  FileText,
  MessageSquare
} from 'lucide-react-native';

const StatCard = ({ title, value, color }: { title: string; value: string; color: string }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const ActionButton = ({ icon: Icon, title, onPress }: { icon: any; title: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Icon size={24} color="#2563eb" />
    <Text style={styles.actionButtonText}>{title}</Text>
  </TouchableOpacity>
);

export default function Dashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning,</Text>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.role}>Production Supervisor</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard title="Robots in Operation" value="8/10" color="#22c55e" />
        <StatCard title="Maintenance Alerts" value="2" color="#f97316" />
        <StatCard title="Pending Tasks" value="5" color="#ef4444" />
      </View>

      <View style={styles.actionsGrid}>
        <ActionButton 
          icon={Robot} 
          title="Robot Monitoring" 
          onPress={() => router.push('/robots')}
        />
        <ActionButton 
          icon={Calendar} 
          title="Job Scheduling" 
          onPress={() => router.push('/scheduling')}
        />
        <ActionButton 
          icon={ListTodo} 
          title="Task Assignment" 
          onPress={() => router.push('/assignment')}
        />
        <ActionButton 
          icon={Bell} 
          title="Notifications" 
          onPress={() => router.push('/notifications')}
        />
        <ActionButton 
          icon={AlertTriangle} 
          title="Report Error" 
          onPress={() => router.push('/error-report')}
        />
        <ActionButton 
          icon={FileText} 
          title="Reports" 
          onPress={() => router.push('/reports')}
        />
        <ActionButton 
          icon={MessageSquare} 
          title="Messages" 
          onPress={() => router.push('/messages')}
        />
        <ActionButton 
          icon={Settings} 
          title="Settings" 
          onPress={() => router.push('/settings')}
        />
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
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  greeting: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#64748b',
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#1e293b',
    marginTop: 4,
  },
  role: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  statsContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
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
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 4,
  },
  statTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748b',
  },
  actionsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '48%',
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
  actionButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#1e293b',
    marginTop: 8,
    textAlign: 'center',
  },
});