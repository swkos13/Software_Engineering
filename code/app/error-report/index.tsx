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
import { useRouter } from 'expo-router';
import { ChevronDown, TriangleAlert as AlertTriangle, Bot, MapPin, Upload, X } from 'lucide-react-native';
import Animated, { 
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';

interface Robot {
  id: string;
  name: string;
  location: string;
  status: 'operational' | 'warning' | 'offline';
}

const mockRobots: Robot[] = [
  {
    id: '1',
    name: 'RBT-001',
    location: 'Production Line 1',
    status: 'operational'
  },
  {
    id: '2',
    name: 'RBT-002',
    location: 'Storage Area',
    status: 'warning'
  },
  {
    id: '3',
    name: 'RBT-003',
    location: 'Maintenance Bay',
    status: 'offline'
  }
];

const errorTypes = [
  'Motion Error',
  'Communication Error',
  'Motor Overheating',
  'Sensor Error',
  'Other'
];

export default function ErrorReportScreen() {
  const router = useRouter();
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [selectedErrorType, setSelectedErrorType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [showRobotPicker, setShowRobotPicker] = useState(false);
  const [showErrorTypePicker, setShowErrorTypePicker] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [attachments, setAttachments] = useState<string[]>([]);

  const validate = () => {
    const newErrors: {[key: string]: string} = {};

    if (!selectedRobot) {
      newErrors.robot = 'Robot selection is required';
    }
    if (!selectedErrorType) {
      newErrors.errorType = 'Error type is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setShowConfirm(true);
    }
  };

  const submitReport = async () => {
    setShowConfirm(false);
    try {
      // Here you would make an API call to submit the report
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

  const handleAttachment = () => {
    // In a real app, this would open a file picker or camera
    const mockFile = `File-${attachments.length + 1}`;
    setAttachments(prev => [...prev, mockFile]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      {showError && (
        <Animated.View 
          style={styles.errorBanner}
          entering={SlideInRight}
          exiting={SlideOutLeft}
        >
          <AlertTriangle size={20} color="#ffffff" />
          <Text style={styles.errorBannerText}>
            Report submission error. Try again.
          </Text>
        </Animated.View>
      )}

      <ScrollView style={styles.form}>
        {/* Robot Selection */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Robot Selection <Text style={styles.required}>*</Text>
          </Text>
          <Pressable
            style={[
              styles.selector,
              errors.robot && styles.selectorError
            ]}
            onPress={() => setShowRobotPicker(true)}
          >
            {selectedRobot ? (
              <View style={styles.selectedRobot}>
                <Bot size={20} color="#64748b" />
                <View>
                  <Text style={styles.selectedRobotName}>
                    {selectedRobot.name}
                  </Text>
                  <View style={styles.locationContainer}>
                    <MapPin size={16} color="#64748b" />
                    <Text style={styles.locationText}>
                      {selectedRobot.location}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <Text style={styles.placeholderText}>Select a robot</Text>
            )}
            <ChevronDown size={20} color="#64748b" />
          </Pressable>
          {errors.robot && (
            <Text style={styles.errorText}>{errors.robot}</Text>
          )}
        </View>

        {/* Error Type Selection */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Error Type <Text style={styles.required}>*</Text>
          </Text>
          <Pressable
            style={[
              styles.selector,
              errors.errorType && styles.selectorError
            ]}
            onPress={() => setShowErrorTypePicker(true)}
          >
            {selectedErrorType ? (
              <Text style={styles.selectedText}>{selectedErrorType}</Text>
            ) : (
              <Text style={styles.placeholderText}>Select error type</Text>
            )}
            <ChevronDown size={20} color="#64748b" />
          </Pressable>
          {errors.errorType && (
            <Text style={styles.errorText}>{errors.errorType}</Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Fault Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.description && styles.inputError
            ]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="Describe what you observed..."
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* Attachments */}
        <View style={styles.field}>
          <Text style={styles.label}>File Attachment</Text>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={handleAttachment}
          >
            <Upload size={20} color="#2563eb" />
            <Text style={styles.attachButtonText}>
              Add Photo or Document
            </Text>
          </TouchableOpacity>
          {attachments.length > 0 && (
            <View style={styles.attachmentList}>
              {attachments.map((file, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <Text style={styles.attachmentName}>{file}</Text>
                  <TouchableOpacity
                    onPress={() => removeAttachment(index)}
                    style={styles.removeAttachment}
                  >
                    <X size={16} color="#64748b" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
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
              (!selectedRobot || !selectedErrorType || !description) && 
              styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!selectedRobot || !selectedErrorType || !description}
          >
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Robot Selection Modal */}
      <Modal
        visible={showRobotPicker}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Robot</Text>
              <TouchableOpacity
                onPress={() => setShowRobotPicker(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            {mockRobots.map((robot) => (
              <TouchableOpacity
                key={robot.id}
                style={styles.robotItem}
                onPress={() => {
                  setSelectedRobot(robot);
                  setShowRobotPicker(false);
                  if (errors.robot) {
                    setErrors(prev => ({ ...prev, robot: undefined }));
                  }
                }}
              >
                <View style={styles.robotItemContent}>
                  <Bot size={20} color="#64748b" />
                  <View>
                    <Text style={styles.robotItemName}>{robot.name}</Text>
                    <View style={styles.locationContainer}>
                      <MapPin size={16} color="#64748b" />
                      <Text style={styles.locationText}>{robot.location}</Text>
                    </View>
                  </View>
                </View>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: robot.status === 'operational' ? '#22c55e' : 
                                   robot.status === 'warning' ? '#f97316' : '#ef4444' }
                ]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Error Type Selection Modal */}
      <Modal
        visible={showErrorTypePicker}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Error Type</Text>
              <TouchableOpacity
                onPress={() => setShowErrorTypePicker(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            {errorTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.errorTypeItem}
                onPress={() => {
                  setSelectedErrorType(type);
                  setShowErrorTypePicker(false);
                  if (errors.errorType) {
                    setErrors(prev => ({ ...prev, errorType: undefined }));
                  }
                }}
              >
                <Text style={styles.errorTypeText}>{type}</Text>
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
            <Text style={styles.confirmTitle}>Confirm Submission</Text>
            <Text style={styles.confirmText}>
              Are you confirming the submission of the bug report for robot {selectedRobot?.name}?
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
                onPress={submitReport}
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
              ✅ The report was successfully submitted
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
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  selector: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorError: {
    borderColor: '#ef4444',
  },
  selectedRobot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedRobotName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  selectedText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#1e293b',
  },
  placeholderText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#94a3b8',
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
    height: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
  },
  attachButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#2563eb',
  },
  attachmentList: {
    marginTop: 12,
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
  },
  attachmentName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#1e293b',
  },
  removeAttachment: {
    padding: 4,
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
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#64748b',
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
  robotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  robotItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  robotItemName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  errorTypeItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  errorTypeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#1e293b',
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