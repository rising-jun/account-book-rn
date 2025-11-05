import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { ArrowUpCircle, ArrowDownCircle, Plus } from 'lucide-react-native';
import TransactionList from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';
import { Transaction } from '../types';

// TransactionList에 전달할 임시 목업(mockup) 데이터
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'expense', title: '점심 식사', category: '식비', amount: 12000, date: new Date().toISOString() },
  { id: '2', type: 'income', title: '월급', amount: 3000000, date: new Date().toISOString() },
  { id: '3', type: 'expense', title: '지하철', category: '교통', amount: 1450, date: new Date().toISOString() },
];
// HomeScreen이 받을 props 타입을 정의합니다.
interface HomeScreenProps {
  transactions: Transaction[];
  reloadData: () => void;
}
export default function HomeScreen({ transactions, reloadData }: HomeScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const currentMonthTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return tDate >= currentMonthStart && tDate <= currentMonthEnd;
  });

  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 상단 요약 카드 페이저 */}
        <View style={styles.pagerContainer}>
          <PagerView
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
          >
            {/* 수입 카드 */}
             <View key="1" style={styles.cardWrapper}>
              <View style={[styles.card, styles.incomeCard]}>
                <View style={styles.cardHeader}>
                  <ArrowUpCircle color="white" size={32} />
                  <Text style={styles.cardTitle}>이번 달 총 수입</Text>
                </View>
                <Text style={styles.cardAmount}>{totalIncome.toLocaleString()}<Text style={styles.cardUnit}> 원</Text></Text>
              </View>
            </View>
            {/* 지출 카드: 동적으로 계산된 값을 표시 */}
            <View key="2" style={styles.cardWrapper}>
              <View style={[styles.card, styles.expenseCard]}>
                <View style={styles.cardHeader}>
                  <ArrowDownCircle color="white" size={32} />
                  <Text style={styles.cardTitle}>이번 달 총 지출</Text>
                </View>
                <Text style={styles.cardAmount}>{totalExpense.toLocaleString()}<Text style={styles.cardUnit}> 원</Text></Text>
              </View>
            </View>
          </PagerView>
          {/* 페이저 인디케이터 */}
          <View style={styles.indicatorContainer}>
            {[0, 1].map((i) => (
              <View
                key={i}
                style={[styles.indicator, currentPage === i ? styles.activeIndicator : {}]}
              />
            ))}
          </View>
        </View>

        {/* 거래 내역 리스트 */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>거래 내역</Text>
          <TransactionList transactions={currentMonthTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())} />
        </View>
      </ScrollView>

      {/* 플로팅 액션 버튼 */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalOpen(true)} aria-label="거래 추가">
        <Plus color="white" size={28} />
      </TouchableOpacity>

      {/* 내역 추가 모달 */}
       <AddTransactionModal
        visible={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={reloadData} // 저장 성공 시 App.tsx의 데이터 다시 불러오기 함수 호출
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContainer: { padding: 16, paddingBottom: 80 },
  pagerContainer: { marginBottom: 24 },
  pagerView: { width: '100%', height: 150 },
  cardWrapper: { paddingHorizontal: 4 },
  card: { borderRadius: 16, padding: 20, justifyContent: 'center' },
  incomeCard: { backgroundColor: '#3B82F6' },
  expenseCard: { backgroundColor: '#F97316' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardTitle: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 16 },
  cardAmount: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  cardUnit: { fontSize: 20, fontWeight: 'normal' },
  indicatorContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 16 },
  indicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D5DB' },
  activeIndicator: { width: 24, backgroundColor: '#3B82F6' },
  listContainer: { marginTop: 16 },
  listTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#1F2937' },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
});