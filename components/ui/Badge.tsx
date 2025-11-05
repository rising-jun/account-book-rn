import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type BadgeType = 'income' | 'expense' | 'category';

type Props = {
  type: BadgeType;
  text: string;
};

export function Badge({ type, text }: Props) {
  const getStyle = () => {
    switch (type) {
      case 'income':
        return { container: styles.incomeContainer, text: styles.incomeText };
      case 'expense':
        return { container: styles.expenseContainer, text: styles.expenseText };
      case 'category':
      default:
        return { container: styles.categoryContainer, text: styles.categoryText };
    }
  };

  const { container, text: textStyle } = getStyle();

  return (
    <View style={[styles.container, container]}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  text: { fontSize: 12, fontWeight: '500' },
  incomeContainer: { backgroundColor: '#DBEAFE', borderWidth: 1, borderColor: '#BFDBFE' },
  incomeText: { color: '#3B82F6' },
  expenseContainer: { backgroundColor: '#FFE4E6', borderWidth: 1, borderColor: '#FECDD3' },
  expenseText: { color: '#F97316' },
  categoryContainer: { backgroundColor: '#F3F4F6' },
  categoryText: { color: '#4B5563' },
});