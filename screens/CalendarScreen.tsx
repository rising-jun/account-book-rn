import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Badge } from '../components/ui/Badge'; // 재사용 가능한 Badge 컴포넌트
import TransactionList from '../components/TransactionList';
import { Transaction } from '../types';

// 달력 라이브러리 한글 설정
LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

interface CalendarScreenProps {
  transactions: Transaction[];
}

// 목업 데이터
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'expense', title: '점심 식사', category: '식비', amount: 12000, date: '2025-10-28T12:30:00.000Z' },
  { id: '2', type: 'income', title: '용돈', amount: 50000, date: '2025-10-28T15:00:00.000Z' },
  { id: '3', type: 'expense', title: '영화 관람', category: '문화/여가', amount: 15000, date: '2025-10-25T19:00:00.000Z' },
];

export default function CalendarScreen({ transactions }: CalendarScreenProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const markedDates = useMemo(() => {
    const marks: { [key: string]: { marked?: boolean; dotColor?: string; selected?: boolean; selectedColor?: string } } = {};

    // 1. 모든 거래 내역을 순회하며 점을 찍을 날짜를 찾습니다.
    transactions.forEach(transaction => {
      const dateString = transaction.date.split('T')[0]; // '2025-10-30T...' -> '2025-10-30'
      marks[dateString] = { marked: true, dotColor: '#F97316' }; // 지출이 있는 날은 주황색 점
    });

    // 2. 현재 선택된 날짜에 선택되었다는 스타일을 추가로 적용합니다.
    if (marks[selectedDate]) {
      marks[selectedDate].selected = true;
      marks[selectedDate].selectedColor = '#3B82F6';
    } else {
      marks[selectedDate] = { selected: true, selectedColor: '#3B82F6' };
    }

    return marks;
  }, [transactions, selectedDate]);

  // 선택된 날짜의 거래 내역 필터링
  const selectedTransactions = transactions.filter(t => t.date.startsWith(selectedDate));
  const dayIncome = selectedTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const dayExpense = selectedTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            arrowColor: '#3B82F6',
            todayTextColor: '#3B82F6',
            textSectionTitleColor: '#6B7280',
          }}
        />

        {/* 선택된 날짜 정보 */}
        <View style={styles.detailsContainer}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateTitle}>{selectedDate}</Text>
            <View style={styles.badgeContainer}>
              {dayIncome > 0 && <Badge type="income" text={`수입 +${dayIncome.toLocaleString()}원`} />}
              {dayExpense > 0 && <Badge type="expense" text={`지출 -${dayExpense.toLocaleString()}원`} />}
            </View>
          </View>
          <TransactionList transactions={selectedTransactions} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  detailsContainer: { padding: 16, marginTop: 8 },
  dateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  dateTitle: { fontSize: 18, fontWeight: 'bold' },
  badgeContainer: { flexDirection: 'row', gap: 8 },
});