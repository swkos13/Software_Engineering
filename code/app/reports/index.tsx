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
import { FileText, Calendar, ChevronDown, TriangleAlert as AlertTriangle, Plus, Bot, Clock, CircleCheck as CheckCircle2, Loader as Loader2 } from 'lucide-react-native';
import Animated, { 
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';

type ReportStatus = 'available' | 'in_progress';
type DataType = 'working_time' | 'completed_tasks' | 'downtime' | 'all';

interface Report {
  id: string;
  name: string;
  createdAt: string;
  status: ReportStatus;
  type: DataType;
  period: {
    start: string;
    end: string;
  };
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Robot Performance - March 2025',
    createdAt: '2025-03-15T10:30:00Z',
    status: 'available',
    type: 'all',
    period: {
      start: '2025-03-01',
      end: '2025-03-15'
    }
  },
  {
    id: '2',
    name: 'Efficiency Analysis Q1',
    createdAt: '2025-03-14T15:45:00Z',
    status: 'in_progress',
    type: 'working_time',
    period: {
      start: '2025-01-01',
      end: '2025-03-31'
    }
  }
];

const dataTypes = [
  { value: 'working_time', label: 'Working Time' },
  { value: 'completed_tasks', label: 'Completed Tasks' },
  { value: 'downtime', label: 'Downtime' },
  { value: 'all', label: 'All Metrics' }
];

const mockRobots = [
  { id: '1', name: 'RBT-001' },
  { id: '2', name: 'RBT-002' },
  { id: '3', name: 'RBT-003' }
];

export default function ReportsScreen() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<{ start: string; end: string } | null>(null);
  const [selectedType, setSelectedType] = useState<DataType | null>(null);
  const [showNewReport, setShowNewReport] = useState(false);
  const [newReportData, setNewReportData] = useState({
    name: '',
    robots: [] as string[],
    period: { start: '', end: '' },
    type: '' as DataType
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateReport = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    try {
      // Here you would make an API call to create the report
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowNewReport(false);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setShowError(true);
      setIsLoading(false);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const ReportCard = ({ report }: { report: Report }) => (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={() => router.push('/reports/view')}
    >
      <View style={styles.reportHeader}>
        <FileText size={24} color="#2563eb" />
        <View style={styles.reportMeta}>
          <Text style={styles.reportName}>{report.name}</Text>
          <Text style={styles.reportDate}>
            Created on {new Date(report.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.reportDetails}>
        <View style={styles.reportPeriod}>
          <Calendar size={16} color="#64748b" />
          <Text style={styles.periodText}>
            {new Date(report.period.start).toLocaleDateString()} - 
            {new Date(report.period.end).toLocaleDateString()}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: report.status === 'available' ? '#f0fdf4' : '#fef3c7' }
        ]}>
          {report.status === 'available' ? (
            <CheckCircle2 size={16} color="#22c55e" />
          ) : (
            <Loader2 size={16} color="#d97706" />
          )}
          <Text style={[
            styles.statusText,
            { color: report.status === 'available' ? '#22c55e' : '#d97706' }
          ]}>
            {report.status === 'available' ? 'Available' : 'In Progress'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
          <Text style={styles.errorText}>
            Report creation error. Try again.
          </Text>
        </Animated.View>
      )}

      <View style={styles.filtersBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Calendar size={20} color="#64748b" />
          <Text style={styles.filterButtonText}>
            {selectedPeriod ? 
              `${new Date(selectedPeriod.start).toLocaleDateString()} - ${new Date(selectedPeriod.end).toLocaleDateString()}` : 
              'Select Period'
            }
          </Text>
          <ChevronDown size={20} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, styles.typeButton]}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>
            {selectedType ? 
              dataTypes.find(t => t.value === selectedType)?.label : 
              'All Types'
            }
          </Text>
          <ChevronDown size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {mockReports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowNewReport(true)}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* New Report Modal */}
      <Modal
        visible={showNewReport}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Report</Text>
              <TouchableOpacity
                onPress={() => setShowNewReport(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Report Name</Text>
                <TextInput
                  style={styles.input}
                  value={newReportData.name}
                  onChangeText={(text) => setNewReportData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter report name..."
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Select Robots</Text>
                <View style={styles.robotList}>
                  {mockRobots.map(robot => (
                    <TouchableOpacity
                      key={robot.id}
                      style={[
                        styles.robotChip,
                        newReportData.robots.includes(robot.id) && styles.robotChipSelected
                      ]}
                      onPress={() => {
                        setNewReportData(prev => ({
                          ...prev,
                          robots: prev.robots.includes(robot.id)
                            ? prev.robots.filter(id => id !== robot.id)
                            : [...prev.robots, robot.id]
                        }));
                      }}
                    >
                      <Bot size={16} color={newReportData.robots.includes(robot.id) ? '#ffffff' : '#64748b'} />
                      <Text style={[
                        styles.robotChipText,
                        newReportData.robots.includes(robot.id) && styles.robotChipTextSelected
                      ]}>
                        {robot.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Time Period</Text>
                {Platform.OS === 'web' ? (
                  <View style={styles.dateContainer}>
                    <View style={styles.dateField}>
                      <Text style={styles.dateLabel}>Start Date</Text>
                      <input
                        type="date"
                        value={newReportData.period.start}
                        onChange={(e) => {
                          setNewReportData(prev => ({
                            ...prev,
                            period: { ...prev.period, start: e.target.value }
                          }));
                        }}
                        style={styles.webDateInput}
                      />
                    </View>
                    <View style={styles.dateField}>
                      <Text style={styles.dateLabel}>End Date</Text>
                      <input
                        type="date"
                        value={newReportData.period.end}
                        onChange={(e) => {
                          setNewReportData(prev => ({
                            ...prev,
                            period: { ...prev.period, end: e.target.value }
                          }));
                        }}
                        style={styles.webDateInput}
                      />
                    </View>
                  </View>
                ) : (
                  <Text>Native date picker would go here</Text>
                )}
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Data Type</Text>
                <View style={styles.typeList}>
                  {dataTypes.map(type => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeChip,
                        newReportData.type === type.value && styles.typeChipSelected
                      ]}
                      onPress={() => {
                        setNewReportData(prev => ({
                          ...prev,
                          type: type.value as DataType
                        }));
                      }}
                    >
                      <Text style={[
                        styles.typeChipText,
                        newReportData.type === type.value && styles.typeChipTextSelected
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNewReport(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  (!newReportData.name || !newReportData.type || !newReportData.period.start) && 
                  styles.createButtonDisabled
                ]}
                onPress={() => setShowConfirm(true)}
                disabled={!newReportData.name || !newReportData.type || !newReportData.period.start}
              >
                <Text style={styles.createButtonText}>Create Report</Text>
              </TouchableOpacity>
            </View>
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
            <Text style={styles.confirmTitle}>Create Report</Text>
            <Text style={styles.confirmText}>
              Do you want to create the report with the above criteria?
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
                onPress={handleCreateReport}
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
              ✅ The report was successfully created
            </Text>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Loader2 size={32} color="#2563eb" />
            <Text style={styles.loadingText}>Creating report...</Text>
          </View>
        </View>
      )}
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
  filtersBar: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
  },
  typeButton: {
    flex: 0.6,
    justifyContent: 'space-between',
  },
  filterButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  reportMeta: {
    flex: 1,
  },
  reportName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  reportDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  reportDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportPeriod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
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
  robotList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  robotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  robotChipSelected: {
    backgroundColor: '#2563eb',
  },
  robotChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#64748b',
  },
  robotChipTextSelected: {
    color: '#ffffff',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  webDateInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    fontSize: 16,
  },
  typeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeChipSelected: {
    backgroundColor: '#2563eb',
  },
  typeChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#64748b',
  },
  typeChipTextSelected: {
    color: '#ffffff',
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
});