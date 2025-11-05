import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react-native';
import { Badge } from './ui/Badge'; // 재사용 가능한 Badge 컴포넌트

// 임시 타입 정의
type Transaction = {
  id: string;
  type: 'income' | 'expense';
  title: string;
  category?: string;
  amount: number;
  date: string;
};

type Props = {
  transactions: Transaction[];
};

export default function TransactionList({ transactions }: Props) {
  const renderItem = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === 'income';
    return (
      <View style={styles.itemContainer}>
        {isIncome ? (
          <ArrowUpCircle color="#3B82F6" size={40} />
        ) : (
          <ArrowDownCircle color="#F97316" size={40} />
        )}
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {item.category && <Badge type="category" text={item.category} />}
          </View>
          <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString('ko-KR')}</Text>
        </View>
        <Text style={[styles.itemAmount, isIncome ? styles.incomeText : styles.expenseText]}>
          {isIncome ? '+' : '-'} {item.amount.toLocaleString()}원
        </Text>
      </View>
    );
  };

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>거래 내역이 없습니다</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      scrollEnabled={false} // ScrollView 안에 있으므로 자체 스크롤 비활성화
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  itemContent: { flex: 1, marginLeft: 12 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  itemTitle: { fontSize: 16, fontWeight: '500' },
  itemDate: { color: '#6B7280', fontSize: 12 },
  itemAmount: { fontSize: 16, fontWeight: 'bold' },
  incomeText: { color: '#3B82F6' },
  expenseText: { color: '#F97316' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { color: '#9CA3AF' },
});