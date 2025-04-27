import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Pressable 
} from 'react-native';
import { 
  Bell, 
  MessageSquare, 
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle2,
  Search,
  Plus,
  Send,
  User,
  ChevronDown
} from 'lucide-react-native';
import Animated, { 
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';

type NotificationSeverity = 'critical' | 'warning' | 'info';
type NotificationStatus = 'unread' | 'read';
type MessageStatus = 'sent' | 'delivered' | 'read';

interface Notification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  status: NotificationStatus;
  timestamp: string;
}

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  receiver: {
    id: string;
    name: string;
    role: string;
  };
  content: string;
  timestamp: string;
  status: MessageStatus;
}

interface User {
  id: string;
  name: string;
  role: string;
  online: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Task 004 completed',
    message: 'Robot RBT-001 has completed the assigned task.',
    severity: 'info',
    status: 'unread',
    timestamp: '2024-02-21T10:30:00Z'
  },
  {
    id: '2',
    title: 'Maintenance Required',
    message: 'Robot RBT-002 requires scheduled maintenance.',
    severity: 'warning',
    status: 'unread',
    timestamp: '2024-02-21T09:45:00Z'
  },
  {
    id: '3',
    title: 'Critical Error',
    message: 'Robot RBT-003 has encountered a motion control error.',
    severity: 'critical',
    status: 'read',
    timestamp: '2024-02-21T08:00:00Z'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: {
      id: '1',
      name: 'John Doe',
      role: 'Supervisor'
    },
    receiver: {
      id: '2',
      name: 'Jane Smith',
      role: 'Technician'
    },
    content: 'Please check Robot RBT-002 for maintenance.',
    timestamp: '2024-02-21T10:30:00Z',
    status: 'read'
  },
  {
    id: '2',
    sender: {
      id: '2',
      name: 'Jane Smith',
      role: 'Technician'
    },
    receiver: {
      id: '1',
      name: 'John Doe',
      role: 'Supervisor'
    },
    content: 'Maintenance completed on RBT-002.',
    timestamp: '2024-02-21T11:00:00Z',
    status: 'delivered'
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Supervisor',
    online: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Technician',
    online: true
  },
  {
    id: '3',
    name: 'Bob Wilson',
    role: 'Operator',
    online: false
  }
];

export default function MessagesScreen() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'messages'>('notifications');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [messages, setMessages] = useState(mockMessages);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({
        ...notification,
        status: 'read'
      }))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !messageText.trim()) return;

    try {
      // Here you would make an API call to send the message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: {
          id: '1', // Current user
          name: 'John Doe',
          role: 'Supervisor'
        },
        receiver: {
          id: selectedUser.id,
          name: selectedUser.name,
          role: selectedUser.role
        },
        content: messageText,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      setShowNewMessage(false);
    } catch (error) {
      setErrorMessage('Message sending failed');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const NotificationIcon = ({ severity }: { severity: NotificationSeverity }) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle size={24} color="#ef4444" />;
      case 'warning':
        return <AlertTriangle size={24} color="#f97316" />;
      case 'info':
        return <CheckCircle2 size={24} color="#3b82f6" />;
    }
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        styles.notificationCard,
        notification.status === 'unread' && styles.unreadCard
      ]}
    >
      <View style={styles.notificationHeader}>
        <NotificationIcon severity={notification.severity} />
        <View style={styles.notificationContent}>
          <Text style={[
            styles.notificationTitle,
            notification.status === 'unread' && styles.unreadText
          ]}>
            {notification.title}
          </Text>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <Text style={styles.timestamp}>
            {new Date(notification.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteNotification(notification.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const MessageCard = ({ message }: { message: Message }) => (
    <View style={styles.messageCard}>
      <View style={styles.messageHeader}>
        <View style={styles.userInfo}>
          <User size={20} color="#64748b" />
          <Text style={styles.userName}>
            {message.sender.name}
          </Text>
          <Text style={styles.userRole}>
            {message.sender.role}
          </Text>
        </View>
        <Text style={styles.messageTimestamp}>
          {new Date(message.timestamp).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.messageContent}>{message.content}</Text>
      <View style={styles.messageStatus}>
        {message.status === 'read' && (
          <CheckCircle2 size={16} color="#22c55e" />
        )}
        <Text style={[
          styles.statusText,
          message.status === 'read' && styles.statusTextRead
        ]}>
          {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
        </Text>
      </View>
    </View>
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
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Animated.View>
      )}

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
          onPress={() => setActiveTab('notifications')}
        >
          <Bell 
            size={20} 
            color={activeTab === 'notifications' ? '#2563eb' : '#64748b'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'notifications' && styles.activeTabText
          ]}>
            Notifications
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <MessageSquare 
            size={20} 
            color={activeTab === 'messages' ? '#2563eb' : '#64748b'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'messages' && styles.activeTabText
          ]}>
            Messages
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'notifications' ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllRead}
            >
              <CheckCircle2 size={20} color="#2563eb" />
              <Text style={styles.markAllText}>Mark All as Read</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content}>
            {notifications.map(notification => (
              <NotificationCard 
                key={notification.id} 
                notification={notification} 
              />
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search messages..."
            />
          </View>
          <ScrollView style={styles.content}>
            {messages.map(message => (
              <MessageCard key={message.id} message={message} />
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setShowNewMessage(true)}
          >
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </>
      )}

      {/* New Message Modal */}
      <Modal
        visible={showNewMessage}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Message</Text>
              <TouchableOpacity
                onPress={() => setShowNewMessage(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.recipientField}>
                <Text style={styles.fieldLabel}>To:</Text>
                <TouchableOpacity
                  style={styles.recipientSelector}
                  onPress={() => {/* Show user selection */}}
                >
                  {selectedUser ? (
                    <Text style={styles.selectedRecipient}>
                      {selectedUser.name} ({selectedUser.role})
                    </Text>
                  ) : (
                    <Text style={styles.placeholderText}>
                      Select recipient
                    </Text>
                  )}
                  <ChevronDown size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View style={styles.messageField}>
                <Text style={styles.fieldLabel}>Message:</Text>
                <TextInput
                  style={styles.messageInput}
                  value={messageText}
                  onChangeText={setMessageText}
                  placeholder="Type your message..."
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNewMessage(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!selectedUser || !messageText.trim()) && styles.sendButtonDisabled
                ]}
                onPress={handleSendMessage}
                disabled={!selectedUser || !messageText.trim()}
              >
                <Send size={20} color="#ffffff" />
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
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
  errorText: {
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  activeTab: {
    backgroundColor: '#e0e7ff',
  },
  tabText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#64748b',
  },
  activeTabText: {
    color: '#2563eb',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markAllText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#2563eb',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#1e293b',
  },
  content: {
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
    borderLeftColor: '#2563eb',
  },
  notificationHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  unreadText: {
    fontFamily: 'Inter_700Bold',
  },
  notificationMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  timestamp: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#94a3b8',
  },
  deleteButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    padding: 8,
  },
  deleteButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#ef4444',
  },
  messageCard: {
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
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
  userRole: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748b',
  },
  messageTimestamp: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#94a3b8',
  },
  messageContent: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 8,
  },
  messageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748b',
  },
  statusTextRead: {
    color: '#22c55e',
  },
  fab: {
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
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
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
  recipientField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 8,
  },
  recipientSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
  },
  selectedRecipient: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#1e293b',
  },
  placeholderText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#94a3b8',
  },
  messageField: {
    marginBottom: 16,
  },
  messageInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#1e293b',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#64748b',
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  sendButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  sendButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});