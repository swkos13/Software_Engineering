import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Settings, User, Bell, Shield, LogOut } from 'lucide-react-native';

const MenuItem = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Icon size={20} color="#64748b" />
    <Text style={styles.menuItemText}>{title}</Text>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.role}>Production Supervisor</Text>
      </View>

      <View style={styles.menuSection}>
        <MenuItem icon={User} title="Edit Profile" />
        <MenuItem icon={Bell} title="Notification Settings" />
        <MenuItem icon={Shield} title="Privacy & Security" />
        <MenuItem icon={Settings} title="General Settings" />
        <MenuItem icon={LogOut} title="Logout" />
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
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 4,
  },
  role: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  menuSection: {
    backgroundColor: '#ffffff',
    marginTop: 24,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
  },
});