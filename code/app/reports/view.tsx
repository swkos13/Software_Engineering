import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar, Clock, CircleCheck as CheckCircle2 } from 'lucide-react-native';

export default function ReportView() {
  // In a real app, this data would come from an API
  const reportData = {
    name: 'Robot Performance - March 2025',
    period: {
      start: '2025-03-01',
      end: '2025-03-15'
    },
    metrics: {
      workingTime: '180h 30m',
      completedTasks: 245,
      downtime: '12h 15m',
      efficiency: 93.6
    },
    robots: [
      {
        name: 'RBT-001',
        metrics: {
          workingTime: '60h 10m',
          completedTasks: 82,
          downtime: '4h 05m',
          efficiency: 94.2
        }
      },
      {
        name: 'RBT-002',
        metrics: {
          workingTime: '58h 45m',
          completedTasks: 78,
          downtime: '5h 30m',
          efficiency: 91.8
        }
      },
      {
        name: 'RBT-003',
        metrics: {
          workingTime: '61h 35m',
          completedTasks: 85,
          downtime: '2h 40m',
          efficiency: 95.8
        }
      }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{reportData.name}</Text>
        <View style={styles.period}>
          <Calendar size={16} color="#64748b" />
          <Text style={styles.periodText}>
            {new Date(reportData.period.start).toLocaleDateString()} - 
            {new Date(reportData.period.end).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Performance</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Clock size={20} color="#2563eb" />
            <Text style={styles.metricValue}>{reportData.metrics.workingTime}</Text>
            <Text style={styles.metricLabel}>Working Time</Text>
          </View>
          <View style={styles.metricCard}>
            <CheckCircle2 size={20} color="#22c55e" />
            <Text style={styles.metricValue}>{reportData.metrics.completedTasks}</Text>
            <Text style={styles.metricLabel}>Completed Tasks</Text>
          </View>
          <View style={styles.metricCard}>
            <Clock size={20} color="#ef4444" />
            <Text style={styles.metricValue}>{reportData.metrics.downtime}</Text>
            <Text style={styles.metricLabel}>Downtime</Text>
          </View>
          <View style={styles.metricCard}>
            <CheckCircle2 size={20} color="#f97316" />
            <Text style={styles.metricValue}>{reportData.metrics.efficiency}%</Text>
            <Text style={styles.metricLabel}>Efficiency</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Individual Robot Performance</Text>
        {reportData.robots.map((robot, index) => (
          <View key={robot.name} style={styles.robotCard}>
            <Text style={styles.robotName}>{robot.name}</Text>
            <View style={styles.robotMetrics}>
              <View style={styles.robotMetric}>
                <Text style={styles.robotMetricLabel}>Working Time</Text>
                <Text style={styles.robotMetricValue}>{robot.metrics.workingTime}</Text>
              </View>
              <View style={styles.robotMetric}>
                <Text style={styles.robotMetricLabel}>Completed Tasks</Text>
                <Text style={styles.robotMetricValue}>{robot.metrics.completedTasks}</Text>
              </View>
              <View style={styles.robotMetric}>
                <Text style={styles.robotMetricLabel}>Downtime</Text>
                <Text style={styles.robotMetricValue}>{robot.metrics.downtime}</Text>
              </View>
              <View style={styles.robotMetric}>
                <Text style={styles.robotMetricLabel}>Efficiency</Text>
                <Text style={styles.robotMetricValue}>{robot.metrics.efficiency}%</Text>
              </View>
            </View>
          </View>
        ))}
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
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#1e293b',
    marginBottom: 12,
  },
  period: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
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
  metricValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#1e293b',
    marginVertical: 8,
  },
  metricLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  robotCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  robotName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
  },
  robotMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  robotMetric: {
    flex: 1,
    minWidth: '45%',
  },
  robotMetricLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  robotMetricValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
});