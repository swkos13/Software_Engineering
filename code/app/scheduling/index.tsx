import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CircleAlert as AlertCircle } from 'lucide-react-native';

type TaskCategory = 'transfer' | 'quality' | 'control' | 'reset';
type Priority = 'low' | 'normal' | 'high';

interface FormData {
  description: string;
  category: TaskCategory;
  startDate: Date;
  endDate: Date;
  duration: string;
  deadline: Date | null;
  priority: Priority;
  notes: string;
}

interface ValidationErrors {
  description?: string;
  dates?: string;
}

const categories: { value: TaskCategory; label: string }[] = [
  { value: 'transfer', label: 'Transfer' },
  { value: 'quality', label: 'Quality Control' },
  { value: 'control', label: 'Product Control' },
  { value: 'reset', label: 'Reset: Transfer of Product Inspection' },
];

const priorities: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
];

export default function JobScheduling() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    description: '',
    category: 'transfer',
    startDate: new Date(),
    endDate: new Date(Date.now() + 3600000), // +1 hour
    duration: '',
    deadline: null,
    priority: 'normal',
    notes: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const validate = () => {
    const newErrors: ValidationErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.endDate <= formData.startDate) {
      newErrors.dates = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setShowConfirm(true);
    }
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    try {
      // Here you would typically make an API call to save the job
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const FormField = ({ label, required }: { label: string; required?: boolean }) => (
    <Text style={styles.label}>
      {label} {required && <Text style={styles.required}>*</Text>}
    </Text>
  );

  return (
    <ScrollView style={styles.container}>
      {showError && (
        <View style={styles.errorBanner}>
          <AlertCircle size={20} color="#ffffff" />
          <Text style={styles.errorBannerText}>
            The job was not registered. Please try again.
          </Text>
        </View>
      )}

      <View style={styles.form}>
        <View style={styles.field}>
          <FormField label="Work Description" required />
          <TextInput
            style={[
              styles.input,
              errors.description && styles.inputError
            ]}
            value={formData.description}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, description: text }));
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: undefined }));
              }
            }}
            placeholder="Describe the task..."
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        <View style={styles.field}>
          <FormField label="Task Category" required />
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryButton,
                  formData.category === category.value && styles.categoryButtonActive
                ]}
                onPress={() => setFormData(prev => ({ ...prev, category: category.value }))}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    formData.category === category.value && styles.categoryButtonTextActive
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <FormField label="Execution Period" required />
          {Platform.OS === 'web' ? (
            <View style={styles.dateContainer}>
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>Start</Text>
                <input
                  type="datetime-local"
                  value={formData.startDate.toISOString().slice(0, 16)}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      startDate: new Date(e.target.value)
                    }));
                  }}
                  style={styles.webDateInput}
                />
              </View>
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>End</Text>
                <input
                  type="datetime-local"
                  value={formData.endDate.toISOString().slice(0, 16)}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      endDate: new Date(e.target.value)
                    }));
                  }}
                  style={styles.webDateInput}
                />
              </View>
            </View>
          ) : (
            <View style={styles.dateContainer}>
              <DateTimePicker
                value={formData.startDate}
                mode="datetime"
                onChange={(event, date) => {
                  if (date) {
                    setFormData(prev => ({ ...prev, startDate: date }));
                  }
                }}
              />
              <DateTimePicker
                value={formData.endDate}
                mode="datetime"
                onChange={(event, date) => {
                  if (date) {
                    setFormData(prev => ({ ...prev, endDate: date }));
                  }
                }}
              />
            </View>
          )}
          {errors.dates && (
            <Text style={styles.errorText}>{errors.dates}</Text>
          )}
        </View>

        <View style={styles.field}>
          <FormField label="Expected Duration (minutes)" />
          <TextInput
            style={styles.input}
            value={formData.duration}
            onChangeText={(text) => setFormData(prev => ({ ...prev, duration: text }))}
            keyboardType="numeric"
            placeholder="Enter duration in minutes..."
          />
        </View>

        <View style={styles.field}>
          <FormField label="Task Priority" required />
          <View style={styles.priorityContainer}>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.value}
                style={[
                  styles.priorityButton,
                  formData.priority === priority.value && styles.priorityButtonActive
                ]}
                onPress={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    formData.priority === priority.value && styles.priorityButtonTextActive
                  ]}
                >
                  {priority.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <FormField label="Notes/Instructions" />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            multiline
            numberOfLines={4}
            placeholder="Add any additional notes or instructions..."
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !formData.description && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!formData.description}
          >
            <Text style={styles.submitButtonText}>Create Task</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Task Creation</Text>
            <Text style={styles.modalText}>
              Are you confirming the job entry?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmSubmit}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.successText}>
              ✅ The task was successfully created
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  form: {
    padding: 16,
    gap: 24,
  },
  field: {
    gap: 8,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#1e293b',
  },
  required: {
    color: '#ef4444',
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
  inputError: {
    borderColor: '#ef4444',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  categoryButtonActive: {
    backgroundColor: '#2563eb',
  },
  categoryButtonText: {
    color: '#64748b',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  webDateInput: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    fontSize: 14,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#2563eb',
  },
  priorityButtonText: {
    color: '#64748b',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  priorityButtonTextActive: {
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748b',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
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
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  modalButtonConfirm: {
    backgroundColor: '#2563eb',
  },
  modalButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#64748b',
  },
  modalButtonTextConfirm: {
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