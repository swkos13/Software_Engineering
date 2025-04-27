import { Stack } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { ArrowLeft, Trash2, RotateCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function NotificationsLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Maintenance Notifications',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: 'Inter_600SemiBold',
            color: '#1e293b',
          },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ marginLeft: 8, padding: 8 }}
            >
              <ArrowLeft size={24} color="#1e293b" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity 
                style={{ marginRight: 8, padding: 8 }}
              >
                <Trash2 size={24} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ marginRight: 8, padding: 8 }}
              >
                <RotateCw size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack>
  );
}