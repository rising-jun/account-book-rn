import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, SafeAreaView, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native';
import { X, Calendar as CalendarIcon, ChevronDown } from 'lucide-react-native';
import { saveTransaction } from '../lib/storage'; // saveTransaction 함수 import
import { Transaction, ExpenseCategory } from '../types'; // 타입 import
import { DEFAULT_CATEGORIES } from '../constants/categories';

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: () => void
};

export default function AddTransactionModal({ visible, onClose, onSave }: ModalProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<ExpenseCategory>(DEFAULT_CATEGORIES[0]);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const handleSubmit = async () => {
    // ... 이전과 동일 ...
    if (!title || !amount) {
      console.log('제목과 금액은 필수 항목입니다.');
      return;
    }
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      title,
      amount: parseFloat(amount),
      date: date.toISOString(),
      category: type === 'expense' ? category : undefined,
    };
    await saveTransaction(newTransaction);
    onSave();
    onClose(); // 폼 초기화는 모달이 닫힐 때 처리하는 게 더 깔끔할 수 있습니다.
  };
  const handleSelectCategory = (selectedCategory: ExpenseCategory) => {
    setCategory(selectedCategory);
    setCategoryModalVisible(false); // 카테고리 선택 후 모달 닫기
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>거래 내역 추가</Text>
            <TouchableOpacity onPress={onClose}><X color="#374151" /></TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            {/* 수입/지출 토글 */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, type === 'expense' && styles.activeExpense]}
                onPress={() => setType('expense')}
              >
                <Text style={[styles.toggleText, type === 'expense' && styles.activeText]}>지출</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, type === 'income' && styles.activeIncome]}
                onPress={() => setType('income')}
              >
                <Text style={[styles.toggleText, type === 'income' && styles.activeText]}>수입</Text>
              </TouchableOpacity>
            </View>

            {/* 입력 필드 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{type === 'expense' ? '사용처' : '제목'}</Text>
              <TextInput
                style={styles.input}
                placeholder={type === 'expense' ? '어디서 사용하셨나요?' : '수입 제목'}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {type === 'expense' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>카테고리</Text>
                <TouchableOpacity 
                  style={styles.selectButton} 
                  onPress={() => setCategoryModalVisible(true)}
                >
                  <Text style={styles.selectButtonText}>{category}</Text>
                  <ChevronDown color="#6B7280" size={16} />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>금액</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>일자</Text>
              {/* 날짜 선택은 DateTimePicker 라이브러리 사용을 권장합니다. UI만 구현합니다. */}
              <TouchableOpacity style={styles.dateInput}>
                <CalendarIcon color="#6B7280" size={16} />
                <Text>2025년 10월 29일</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>상세 내용 (선택사항)</Text>
              <TextInput style={[styles.input, styles.textarea]} multiline placeholder="메모를 남겨보세요" />
            </View>
          </View>
        </ScrollView>
        {/* 하단 버튼 */}
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.footerButton, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.footerButton, styles.saveButton]} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Modal
        visible={isCategoryModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.categoryModalContainer}>
          <View style={styles.categoryModalContent}>
            <Text style={styles.categoryModalTitle}>카테고리 선택</Text>
            <FlatList
              data={DEFAULT_CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleSelectCategory(item)}
                >
                  <Text style={styles.categoryItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setCategoryModalVisible(false)}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  formContainer: { padding: 20, gap: 24 },
  toggleContainer: { flexDirection: 'row', gap: 8 },
  toggleButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB' },
  activeExpense: { backgroundColor: '#F97316', borderColor: '#F97316' },
  activeIncome: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  toggleText: { color: '#374151', fontWeight: '500' },
  activeText: { color: 'white' },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151' },
  input: { backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', fontSize: 16 },
  dateInput: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB' },
  textarea: { height: 100, textAlignVertical: 'top' },
  footer: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  footerButton: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F3F4F6' },
  cancelButtonText: { color: '#374151', fontWeight: '600' },
  saveButton: { backgroundColor: '#3B82F6' },
  saveButtonText: { color: 'white', fontWeight: '600' },
   selectButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#1F2937',
  },
  categoryModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  categoryModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '80%',
    maxHeight: '70%',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryItem: {
    padding: 16,
  },
  categoryItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },
  closeButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    textAlign: 'center',
    fontWeight: '600',
  },
});