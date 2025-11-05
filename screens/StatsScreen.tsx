import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Transaction, ExpenseCategory } from '../types';
import { format, addMonths, subMonths, isSameMonth, isAfter } from 'date-fns';

const OTHER_COLOR = '#95A5A6';

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  '식비': '#FF6B6B',
  '교통': '#4ECDC4',
  '쇼핑': '#45B7D1',
  '문화/여가': '#FFA07A',
  '주거/통신': '#98D8C8',
  '의료/건강': '#F7DC6F',
  '기타': OTHER_COLOR,
};

interface StatsScreenProps {
  transactions: Transaction[];
}

export default function StatsScreen({ transactions }: StatsScreenProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevMonth = () => {
    setSelectedDate(current => subMonths(current, 1));
  };
  const handleNextMonth = () => {
    setSelectedDate(current => addMonths(current, 1));
  };

  const now = new Date();
  const isNextMonthDisabled = isSameMonth(selectedDate, now) || isAfter(selectedDate, now);

  const chartData = useMemo(() => {
    const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    const monthExpenses = transactions.filter((t) => {
      // 1. 날짜 데이터 안정성 확보
      if (!t.date || isNaN(new Date(t.date).getTime())) {
        return false;
      }
      const tDate = new Date(t.date);
      return t.type === 'expense' && tDate >= monthStart && tDate <= monthEnd;
    });
    
    const categoryTotals: Record<string, number> = {};
    
    // 2. reduce 함수에 명시적인 초깃값 0 제공
    const totalExpense = monthExpenses.reduce((sum, t) => {
        const category = t.category || '기타';
        categoryTotals[category] = (categoryTotals[category] || 0) + t.amount;
        return sum + t.amount;
    }, 0); // <-- 이 부분이 확실히 포함되어 있는지 확인

    if (totalExpense === 0) {
      return { pieData: [], listData: [], total: 0 };
    }

    // 3. 카테고리 색상 조회 안정성 확보
    const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
      value,
      color: CATEGORY_COLORS[name as ExpenseCategory] || OTHER_COLOR,
      text: `${((value / totalExpense) * 100).toFixed(0)}%`,
      label: name,
    }));

    const listData = Object.entries(categoryTotals)
        .map(([name, value]) => ({
            name,
            value,
            percentage: ((value / totalExpense) * 100).toFixed(1),
            color: CATEGORY_COLORS[name as ExpenseCategory] || OTHER_COLOR,
        }))
        .sort((a,b) => b.value - a.value);

    return { pieData, listData, total: totalExpense };
  }, [transactions, selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <ChevronLeft color="#374151" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{format(selectedDate, 'yyyy년 MM월')}</Text>
          <TouchableOpacity onPress={handleNextMonth} disabled={isNextMonthDisabled}>
            <ChevronRight color={isNextMonthDisabled ? '#D1D5DB' : '#374151'} />
          </TouchableOpacity>
        </View>
        
        {chartData.total === 0 ? (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>이번 달 지출 내역이 없습니다.</Text>
            </View>
        ) : (
            <>
              <View style={styles.chartContainer}>
                <Text style={styles.sectionTitle}>카테고리별 소비</Text>
                <View style={styles.pieChartWrapper}>
                  <PieChart
                    data={chartData.pieData}
                    donut showText textColor="black" radius={120} textSize={14}
                    focusOnPress innerRadius={70}
                    centerLabelComponent={() => (
                      <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 14, color: '#6B7280'}}>총 지출</Text>
                        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#1F2937'}}>
                          {chartData.total.toLocaleString()}원
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </View>

              <View style={styles.listContainer}>
                <Text style={styles.sectionTitle}>카테고리별 상세</Text>
                {chartData.listData.map(item => (
                    <View key={item.name} style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <View style={[styles.legendDot, { backgroundColor: item.color }]}/>
                            <Text style={styles.categoryName}>{item.name}</Text>
                        </View>
                        <View style={styles.listItemRight}>
                            <Text style={styles.amountText}>{item.value.toLocaleString()}원</Text>
                            <Text style={styles.percentageText}>{item.percentage}%</Text>
                        </View>
                    </View>
                ))}
              </View>
            </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ... styles는 이전과 동일 ...

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContainer: { padding: 16 },
  monthSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24 },
  monthText: { fontSize: 16, fontWeight: '600' },
  chartContainer: { backgroundColor: 'white', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#1F2937' },
  pieChartWrapper: { alignItems: 'center', paddingVertical: 20 },
  listContainer: {},
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#F3F4F6' },
  listItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  legendDot: { width: 14, height: 14, borderRadius: 7 },
  categoryName: { fontSize: 16, color: '#374151' },
  listItemRight: { alignItems: 'flex-end' },
  amountText: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  percentageText: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyText: { fontSize: 16, color: '#9CA3AF' },
});