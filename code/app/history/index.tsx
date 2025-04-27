import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  Platform,
  Pressable 
} from 'react-native';
import { Calendar, ChevronDown, Bot, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Download, FileText, Loader as Loader2 } from 'lucide-react-native';
import Animated, { 
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';

type EventType = 'task' | 'error' | 'status';

interface HistoryEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  timestamp: string;
  robotId?: string;
  robotName?: string;
  status?: string;
}

const mockEvents: HistoryEvent[] = [
  {
    id: '1',
    type: 'task',
    title: 'Task Completed',
    description: 'Task 003 completed by Robot RBT-004',
    timestamp: '2024-02-21T10:30:00Z',
    robotId: 'RBT-004',
    robotName: 'Transport Bot 4',
    status: 'completed'
  },
  {
    id: '2',
    type: 'error',
    title: 'Sensor Error',
    description: 'Temperature sensor malfunction detected on Robot RBT-002',
    timestamp: '2024-02-21T09:45:00Z',
    robotId: 'RBT-002',
    robotName: 'Assembly Bot 2',
    status: 'resolved'
  },
  {
    id: '3',
    type: 'status',
    title: 'Status Change',
    description: 'Robot RBT-001 entered maintenance mode',
    timestamp: '2024-02-21T08:00:00Z',
    robotId: 'RBT-001',
    robotName: 'Transport Bot 1',
    status: 'maintenance'
  }
];

const eventTypes = [
  { value: 'all', label: 'All Events' },
  { value: 'task', label: 'Tasks' },
  { value: 'error', label: 'Errors' },
  { value: 'status', label: 'Status Changes' }
];

const robots = [
  { id: 'all', name: 'All Robots' },
  { id: 'RBT-001', name: 'Transport Bot 1' },
  { id: 'RBT-002', name: 'Assembly Bot 2' },
  { id: 'RBT-003', name: 'Quality Control Bot 1' },
  { id: 'RBT-004', name: 'Transport Bot 4' }
];

export default function HistoryScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<{ start: string; end: string } | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRobot, setSelectedRobot] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleExport = async (format: 'pdf' | 'csv') => {
    setShowExportModal(false);
    setIsLoading(true);
    try {
      // Here you would make an API call to export the data
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const EventTypeIcon = ({ type }: { type: EventType }) => {
    switch (type) {
      case 'task':
        return <CheckCircle2 size={24} color="#22c55e" />;
      case 'error':
        return <AlertTriangle size={24} color="#ef4444" />;
      case 'status':
        return <Bot size={24} color="#2563eb" />;
    }
  };

  const EventCard = ({ event }: { event: HistoryEvent }) => (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.eventCard}
    >
      <View style={styles.eventHeader}>
        <EventTypeIcon type={event.type} />
        <View style={styles.eventMeta}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.timestamp}>
            <Clock size={16} color="#64748b" />
            <Text style={styles.timestampText}>
              {new Date(event.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.eventDescription}>{event.description}</Text>
      {event.robotId && (
        <View style={styles.robotInfo}>
          <Bot size={16} color="#64748b" />
          <Text style={styles.robotText}>{event.robotName}</Text>
        </View>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {showError && (
        <Animated.View 
          style={styles.errorBanner}
          entering={SlideInRight}
          exiting={SlideOutLeft}
        >
          <AlertTriangle size={20} color="#ffffff" />
          <Text style={styles.errorText}>
            File export error. Please try again.
          </Text>
        </Animated.View>
      )}

      <View style={styles.filtersBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Calendar size={20} color="#64748b" />
          <Text style={styles.filterButtonText}>
            {selectedPeriod ? 
              `${new Date(selectedPeriod.start).toLocaleDateString()} - ${new Date(selectedPeriod.end).toLocaleDateString()}` : 
              'Select Period'
            }
          </Text>
          <ChevronDown size={20} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, styles.typeButton]}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>
            {eventTypes.find(t => t.value === selectedType)?.label}
          </Text>
          <ChevronDown size={20} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, styles.robotButton]}
          onPress={() => setShowFilters(true)}
        >
          <Bot size={20} color="#64748b" />
          <ChevronDown size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {mockEvents.length > 0 ? (
          mockEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <FileText size={48} color="#94a3b8" />
            <Text style={styles.emptyStateText}>
              No results found for the selected criteria
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Export History</Text>
            <Text style={styles.modalText}>
              Select file format for export:
            </Text>
            <View style={styles.exportButtons}>
              <TouchableOpacity
                style={styles.exportButton}
                onPress={() => handleExport('pdf')}
              >
                <FileText size={24} color="#2563eb" />
                <Text style={styles.exportButtonText}>PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exportButton}
                onPress={() => handleExport('csv')}
              >
                <FileText size={24} color="#2563eb" />
                <Text style={styles.exportButtonText}>CSV</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowExportModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.successText}>
              ✅ The history was successfully exported
            </Text>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Loader2 size={32} color="#2563eb" />
            <Text style={styles.loadingText}>Exporting data...</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.exportFab}
        onPress={() => setShowExportModal(true)}
      >
        <Download size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  errorBanner: {
    backgroundColor: '#ef4444',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  filtersBar: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
  },
  typeButton: {
    flex: 0.8,
    justifyContent: 'space-between',
  },
  robotButton: {
    flex: 0.2,
    justifyContent: 'space-between',
  },
  filterButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  eventMeta: {
    flex: 1,
  },
  eventTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  timestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestampText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748b',
  },
  eventDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 12,
  },
  robotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  robotText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  emptyStateText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  exportFab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 8,
  },
  modalText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  exportButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  exportButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#2563eb',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#64748b',
  },
  successModal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#22c55e',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
});