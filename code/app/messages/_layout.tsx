import { Stack } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function MessagesLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Notifications & Communication',
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
        }}
      />
    </Stack>
  );
}