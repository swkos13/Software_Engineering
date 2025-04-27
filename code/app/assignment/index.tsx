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
import { useRouter } from 'expo-router';
import { Battery, MapPin, CircleAlert as AlertCircle, ChevronDown } from 'lucide-react-native';

interface Task {
  id: string;
  description: string;
  priority: 'low' | 'normal' | 'high';
  category: string;
}

interface Robot {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'offline';
  location: string;
  battery: number;
  type: string;
  isAvailable: boolean;
}

const mockTasks: Task[] = [
  {
    id: '1',
    description: 'Move pallet from Location A to Location B',
    priority: 'high',
    category: 'Transfer',
  },
  {
    id: '2',
    description: 'Quality check on production line 2',
    priority: 'normal',
    category: 'Quality Control',
  },
  {
    id: '3',
    description: 'Reset assembly line 3',
    priority: 'low',
    category: 'Reset',
  },
];

const mockRobots: Robot[] = [
  {
    id: '1',
    name: 'RBT-001',
    status: 'operational',
    location: 'Production Line 1',
    battery: 85,
    type: 'Transport',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'RBT-002',
    status: 'warning',
    location: 'Storage Area',
    battery: 45,
    type: 'Assembly',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'RBT-003',
    status: 'offline',
    location: 'Maintenance Bay',
    battery: 20,
    type: 'Quality Control',
    isAvailable: false,
  },
  {
    id: '4',
    name: 'RBT-004',
    status: 'operational',
    location: 'Production Line 2',
    battery: 90,
    type: 'Transport',
    isAvailable: true,
  },
];

const PriorityBadge = ({ priority }: { priority: Task['priority'] }) => {
  const colors = {
    low: { bg: '#f0fdf4', text: '#22c55e' },
    normal: { bg: '#fef3c7', text: '#d97706' },
    high: { bg: '#fef2f2', text: '#ef4444' },
  };

  return (
    <View style={[styles.priorityBadge, { backgroundColor: colors[priority].bg }]}>
      <Text style={[styles.priorityText, { color: colors[priority].text }]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Text>
    </View>
  );
};

const StatusIndicator = ({ status }: { status: Robot['status'] }) => {
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

export default function AssignmentScreen() {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAssignment = async () => {
    if (!selectedTask || !selectedRobot) return;
    
    setShowConfirm(false);
    try {
      // Here you would make an API call to assign the task
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if robot is still available
      const isStillAvailable = true; // This would be checked via API
      if (!isStillAvailable) {
        setErrorMessage('The robot is no longer available');
        setShowError(true);
        return;
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);
    } catch (error) {
      setErrorMessage('Job assignment error. Please try again.');
      setShowError(true);
    }
  };

  return (
    <View style={styles.container}>
      {showError && (
        <View style={styles.errorBanner}>
          <AlertCircle size={20} color="#ffffff" />
          <Text style={styles.errorBannerText}>{errorMessage}</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        {/* Task Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Task</Text>
          <Pressable
            style={styles.taskSelector}
            onPress={() => setShowTaskPicker(true)}
          >
            {selectedTask ? (
              <View>
                <Text style={styles.selectedTaskTitle}>
                  {selectedTask.description}
                </Text>
                <View style={styles.taskMeta}>
                  <Text style={styles.taskCategory}>{selectedTask.category}</Text>
                  <PriorityBadge priority={selectedTask.priority} />
                </View>
              </View>
            ) : (
              <Text style={styles.placeholderText}>Select a task to assign</Text>
            )}
            <ChevronDown size={20} color="#64748b" />
          </Pressable>
        </View>

        {/* Robot Selection */}
        {selectedTask && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Robots</Text>
            <View style={styles.robotGrid}>
              {mockRobots.map((robot) => (
                <TouchableOpacity
                  key={robot.id}
                  style={[
                    styles.robotCard,
                    !robot.isAvailable && styles.robotCardDisabled,
                    selectedRobot?.id === robot.id && styles.robotCardSelected,
                  ]}
                  onPress={() => robot.isAvailable && setSelectedRobot(robot)}
                  disabled={!robot.isAvailable}
                >
                  <View style={styles.robotHeader}>
                    <StatusIndicator status={robot.status} />
                    <Text style={styles.robotName}>{robot.name}</Text>
                  </View>
                  <Text style={styles.robotType}>{robot.type}</Text>
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
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {selectedTask && selectedRobot && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.assignButton}
            onPress={() => setShowConfirm(true)}
          >
            <Text style={styles.assignButtonText}>Assign Task</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Task Selection Modal */}
      <Modal
        visible={showTaskPicker}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Task</Text>
              <TouchableOpacity
                onPress={() => setShowTaskPicker(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            {mockTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => {
                  setSelectedTask(task);
                  setShowTaskPicker(false);
                }}
              >
                <Text style={styles.taskDescription}>{task.description}</Text>
                <View style={styles.taskMeta}>
                  <Text style={styles.taskCategory}>{task.category}</Text>
                  <PriorityBadge priority={task.priority} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>Confirm Assignment</Text>
            <Text style={styles.confirmText}>
              Are you sure you want to assign the task "{selectedTask?.description}" to the robot "{selectedRobot?.name}"?
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.confirmButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmButtonYes]}
                onPress={handleAssignment}
              >
                <Text style={[styles.confirmButtonText, styles.confirmButtonTextYes]}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
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
              ✅ The task was successfully assigned to robot {selectedRobot?.name}
            </Text>
          </View>
        </View>
      </Modal>
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
  errorBannerText: {
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 16,
  },
  taskSelector: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedTaskTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 8,
  },
  placeholderText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#94a3b8',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskCategory: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  robotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  robotCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  robotCardDisabled: {
    opacity: 0.5,
  },
  robotCardSelected: {
    borderWidth: 2,
    borderColor: '#2563eb',
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
  robotType: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  robotInfo: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  assignButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#1e293b',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#64748b',
  },
  taskItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  taskDescription: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 8,
  },
  confirmModal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  confirmTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 8,
  },
  confirmText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  confirmButtonYes: {
    backgroundColor: '#2563eb',
  },
  confirmButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#64748b',
  },
  confirmButtonTextYes: {
    color: '#ffffff',
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
});