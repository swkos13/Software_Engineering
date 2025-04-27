import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft, CircleHelp as HelpCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SchedulingLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Create New Task',
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
            <TouchableOpacity 
              style={{ marginRight: 8, padding: 8 }}
            >
              <HelpCircle size={24} color="#2563eb" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}