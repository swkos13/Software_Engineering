import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
  Platform
} from 'react-native';
import { Users, Shield, Lock, Pencil, Trash2, UserPlus, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, ChevronDown } from 'lucide-react-native';
import Animated, { 
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';

type UserRole = 'administrator' | 'supervisor' | 'technician' | 'operator';
type UserStatus = 'active' | 'inactive';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    role: 'administrator',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    username: 'janesmith',
    role: 'supervisor',
    status: 'active'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    username: 'bobwilson',
    role: 'technician',
    status: 'inactive'
  }
];

const rolePermissions = {
  administrator: {
    dashboard: true,
    robotMonitoring: true,
    taskAssignment: true,
    maintenance: true,
    reports: true,
    settings: true
  },
  supervisor: {
    dashboard: true,
    robotMonitoring: true,
    taskAssignment: true,
    maintenance: true,
    reports: true,
    settings: false
  },
  technician: {
    dashboard: true,
    robotMonitoring: true,
    taskAssignment: false,
    maintenance: true,
    reports: false,
    settings: false
  },
  operator: {
    dashboard: true,
    robotMonitoring: true,
    taskAssignment: false,
    maintenance: false,
    reports: false,
    settings: false
  }
};

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'security'>('users');
  const [users, setUsers] = useState(mockUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    username: '',
    role: 'operator' as UserRole
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    minPasswordLength: 8
  });

  const handleAddUser = async () => {
    try {
      // Here you would make an API call to create the user
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowAddUser(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      setErrorMessage('Failed to create user');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      // Here you would make an API call to delete the user
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      setShowDeleteConfirm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      setErrorMessage('Failed to delete user');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const TabButton = ({ title, icon: Icon, isActive }: { title: string; icon: any; isActive: boolean }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={() => setActiveTab(title.toLowerCase() as any)}
    >
      <Icon size={20} color={isActive ? '#2563eb' : '#64748b'} />
      <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const UserCard = ({ user }: { user: User }) => (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.userCard}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.userMeta}>
          <View style={[
            styles.roleBadge,
            { backgroundColor: user.role === 'administrator' ? '#f0fdf4' : '#f1f5f9' }
          ]}>
            <Text style={[
              styles.roleText,
              { color: user.role === 'administrator' ? '#22c55e' : '#64748b' }
            ]}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: user.status === 'active' ? '#f0fdf4' : '#fef2f2' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: user.status === 'active' ? '#22c55e' : '#ef4444' }
            ]}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Pencil size={20} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            setSelectedUser(user);
            setShowDeleteConfirm(true);
          }}
        >
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
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
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Animated.View>
      )}

      <View style={styles.tabs}>
        <TabButton 
          title="Users" 
          icon={Users} 
          isActive={activeTab === 'users'} 
        />
        <TabButton 
          title="Permissions" 
          icon={Shield} 
          isActive={activeTab === 'permissions'} 
        />
        <TabButton 
          title="Security" 
          icon={Lock} 
          isActive={activeTab === 'security'} 
        />
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'users' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>User Management</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddUser(true)}
              >
                <UserPlus size={20} color="#ffffff" />
                <Text style={styles.addButtonText}>Add User</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.userList}>
              {users.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </View>
          </View>
        )}

        {activeTab === 'permissions' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Role Permissions</Text>
            {Object.entries(rolePermissions).map(([role, permissions]) => (
              <View key={role} style={styles.permissionCard}>
                <Text style={styles.roleName}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
                <View style={styles.permissionList}>
                  {Object.entries(permissions).map(([feature, allowed]) => (
                    <View key={feature} style={styles.permissionItem}>
                      <Text style={styles.featureName}>
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </Text>
                      {allowed ? (
                        <CheckCircle2 size={20} color="#22c55e" />
                      ) : (
                        <AlertTriangle size={20} color="#ef4444" />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'security' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Settings</Text>
            <View style={styles.securityCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                  <Text style={styles.settingDescription}>
                    Require two-factor authentication for all users
                  </Text>
                </View>
                <Switch
                  value={securitySettings.twoFactor}
                  onValueChange={(value) => 
                    setSecuritySettings(prev => ({ ...prev, twoFactor: value }))
                  }
                />
              </View>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Minimum Password Length</Text>
                  <Text style={styles.settingDescription}>
                    Set minimum required password length
                  </Text>
                </View>
                <TextInput
                  style={styles.numberInput}
                  value={securitySettings.minPasswordLength.toString()}
                  onChangeText={(value) => 
                    setSecuritySettings(prev => ({ 
                      ...prev, 
                      minPasswordLength: parseInt(value) || 8 
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add User Modal */}
      <Modal
        visible={showAddUser}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New User</Text>
              <TouchableOpacity
                onPress={() => setShowAddUser(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={newUser.name}
                  onChangeText={(text) => setNewUser(prev => ({ ...prev, name: text }))}
                  placeholder="Enter full name"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={newUser.email}
                  onChangeText={(text) => setNewUser(prev => ({ ...prev, email: text }))}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={newUser.username}
                  onChangeText={(text) => setNewUser(prev => ({ ...prev, username: text }))}
                  placeholder="Enter username"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Role</Text>
                <TouchableOpacity style={styles.roleSelector}>
                  <Text style={styles.roleSelectorText}>
                    {newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)}
                  </Text>
                  <ChevronDown size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddUser(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  (!newUser.name || !newUser.email || !newUser.username) && 
                  styles.createButtonDisabled
                ]}
                onPress={handleAddUser}
                disabled={!newUser.name || !newUser.email || !newUser.username}
              >
                <Text style={styles.createButtonText}>Create User</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>Delete User</Text>
            <Text style={styles.confirmText}>
              Are you sure you want to delete user {selectedUser?.name}?
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.confirmButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmButtonYes]}
                onPress={handleDeleteUser}
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
              ✅ The operation was successful
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
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  tabButtonActive: {
    backgroundColor: '#e0e7ff',
  },
  tabButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#64748b',
  },
  tabButtonTextActive: {
    color: '#2563eb',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#1e293b',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
  userList: {
    gap: 12,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  roleText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
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
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  permissionCard: {
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
  roleName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 16,
  },
  permissionList: {
    gap: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  featureName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  securityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  numberInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 8,
    width: 60,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
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
  formField: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1e293b',
  },
  roleSelector: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleSelectorText: {
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
  createButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  createButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
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