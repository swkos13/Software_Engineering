import { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  Pressable 
} from 'react-native';
import { useRouter } from 'expo-router';
import { TriangleAlert as AlertTriangle, Info, CircleCheck as CheckCircle2, Wrench, Circle as XCircle, ChevronRight, Clock, Bot } from 'lucide-react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  Layout,
  SlideInRight,
  SlideOutLeft 
} from 'react-native-reanimated';

type NotificationSeverity = 'critical' | 'warning' | 'info';
type NotificationStatus = 'unread' | 'read' | 'resolved';

interface Notification {
  id: string;
  title: string;
  description: string;
  severity: NotificationSeverity;
  status: NotificationStatus;
  timestamp: string;
  robotId: string;
  robotName: string;
  history?: {
    timestamp: string;
    event: string;
  }[];
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Overheating Robot RBT-002',
    description: 'Temperature sensor reading abnormal values. Immediate attention required.',
    severity: 'critical',
    status: 'unread',
    timestamp: '2024-02-21T10:30:00Z',
    robotId: 'RBT-002',
    robotName: 'Assembly Bot 2',
    history: [
      { timestamp: '2024-02-21T10:30:00Z', event: 'Temperature exceeded threshold' },
      { timestamp: '2024-02-21T10:15:00Z', event: 'Temperature warning level reached' },
    ],
  },
  {
    id: '2',
    title: 'Low Battery Warning',
    description: 'Robot RBT-001 battery level below 20%. Consider charging soon.',
    severity: 'warning',
    status: 'read',
    timestamp: '2024-02-21T09:45:00Z',
    robotId: 'RBT-001',
    robotName: 'Transport Bot 1',
  },
  {
    id: '3',
    title: 'Maintenance Complete',
    description: 'Scheduled maintenance for Robot RBT-003 completed successfully.',
    severity: 'info',
    status: 'resolved',
    timestamp: '2024-02-21T08:00:00Z',
    robotId: 'RBT-003',
    robotName: 'Quality Control Bot 1',
  },
];

const NotificationIcon = ({ severity }: { severity: NotificationSeverity }) => {
  const iconProps = {
    size: 24,
    strokeWidth: 2,
  };

  switch (severity) {
    case 'critical':
      return <AlertTriangle {...iconProps} color="#ef4444" />;
    case 'warning':
      return <AlertTriangle {...iconProps} color="#f97316" />;
    case 'info':
      return <Info {...iconProps} color="#3b82f6" />;
  }
};

const StatusBadge = ({ status }: { status: NotificationStatus }) => {
  const colors = {
    unread: { bg: '#fef3c7', text: '#d97706' },
    read: { bg: '#f1f5f9', text: '#64748b' },
    resolved: { bg: '#f0fdf4', text: '#22c55e' },
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: colors[status].bg }]}>
      <Text style={[styles.statusText, { color: colors[status].text }]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
};

const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{title}</Text>
  </View>
);

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUndoBanner, setShowUndoBanner] = useState(false);
  const [deletedNotification, setDeletedNotification] = useState<Notification | null>(null);

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => n.status === 'unread').length,
    resolved: notifications.filter(n => n.status === 'resolved').length,
  };

  const handleDelete = (notification: Notification) => {
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
    setDeletedNotification(notification);
    setShowUndoBanner(true);
    setTimeout(() => setShowUndoBanner(false), 5000);
  };

  const handleUndo = () => {
    if (deletedNotification) {
      setNotifications(prev => [...prev, deletedNotification]);
      setShowUndoBanner(false);
    }
  };

  const markAsRead = (notification: Notification) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id
          ? { ...n, status: 'read' }
          : n
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <StatCard 
          title="Total Notifications" 
          value={stats.total} 
          color="#3b82f6" 
        />
        <StatCard 
          title="Unread" 
          value={stats.unread} 
          color="#f97316" 
        />
        <StatCard 
          title="Resolved" 
          value={stats.resolved} 
          color="#22c55e" 
        />
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationList}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Animated.View
              key={notification.id}
              entering={FadeIn}
              exiting={FadeOut}
              layout={Layout}
            >
              <Pressable
                style={[
                  styles.notificationCard,
                  notification.status === 'unread' && styles.unreadCard,
                ]}
                onPress={() => {
                  setSelectedNotification(notification);
                  setShowDetails(true);
                }}
              >
                <View style={styles.cardHeader}>
                  <NotificationIcon severity={notification.severity} />
                  <Text 
                    style={[
                      styles.notificationTitle,
                      notification.status === 'unread' && styles.unreadTitle,
                    ]}
                  >
                    {notification.title}
                  </Text>
                </View>
                
                <Text style={styles.notificationDescription}>
                  {notification.description}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.timeStamp}>
                    <Clock size={16} color="#64748b" />
                    <Text style={styles.timeText}>
                      {new Date(notification.timestamp).toLocaleString()}
                    </Text>
                  </View>
                  <StatusBadge status={notification.status} />
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => markAsRead(notification)}
                  >
                    <CheckCircle2 size={20} color="#64748b" />
                    <Text style={styles.actionText}>Mark as Read</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(notification)}
                  >
                    <XCircle size={20} color="#64748b" />
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No active maintenance alerts
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Undo Banner */}
      {showUndoBanner && (
        <Animated.View 
          style={styles.undoBanner}
          entering={SlideInRight}
          exiting={SlideOutLeft}
        >
          <Text style={styles.undoText}>Notification deleted</Text>
          <TouchableOpacity onPress={handleUndo}>
            <Text style={styles.undoButton}>Undo</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Details Modal */}
      <Modal
        visible={showDetails}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notification Details</Text>
              <TouchableOpacity
                onPress={() => setShowDetails(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>

            {selectedNotification && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.detailText}>
                    {selectedNotification.description}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Related Robot</Text>
                  <View style={styles.robotInfo}>
                    <Bot size={20} color="#64748b" />
                    <Text style={styles.detailText}>
                      {selectedNotification.robotName} ({selectedNotification.robotId})
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Time Stamp</Text>
                  <Text style={styles.detailText}>
                    {new Date(selectedNotification.timestamp).toLocaleString()}
                  </Text>
                </View>

                {selectedNotification.history && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>History</Text>
                    {selectedNotification.history.map((event, index) => (
                      <View key={index} style={styles.historyItem}>
                        <Text style={styles.historyTime}>
                          {new Date(event.timestamp).toLocaleString()}
                        </Text>
                        <Text style={styles.historyEvent}>{event.event}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {selectedNotification.severity === 'critical' && (
                  <TouchableOpacity style={styles.maintenanceButton}>
                    <Wrench size={20} color="#ffffff" />
                    <Text style={styles.maintenanceButtonText}>
                      Go to Maintenance Management
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
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
  statsContainer: {
    padding: 16,
    flexDirection: 'row',
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
  notificationList: {
    flex: 1,
    padding: 16,
  },
  notificationCard: {
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
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  notificationTitle: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
  unreadTitle: {
    fontFamily: 'Inter_700Bold',
  },
  notificationDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  actionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#64748b',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  undoBanner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  undoText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
  undoButton: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#3b82f6',
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
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
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
  modalBody: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#1e293b',
  },
  robotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyItem: {
    marginBottom: 12,
  },
  historyTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  historyEvent: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#1e293b',
  },
  maintenanceButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  maintenanceButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});