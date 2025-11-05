import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types'; // 잊지 말고 types.ts를 import 합니다.

const STORAGE_KEY = '@transactions';

// 모든 거래 내역 불러오기
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    // 데이터가 없으면 빈 배열을 반환
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch transactions from storage', e);
    return [];
  }
};

// 새로운 거래 내역 저장하기
export const saveTransaction = async (newTransaction: Transaction): Promise<void> => {
  try {
    // 1. 기존 데이터를 불러옵니다.
    const existingTransactions = await getTransactions();
    // 2. 새로운 데이터를 추가합니다.
    const updatedTransactions = [...existingTransactions, newTransaction];
    // 3. AsyncStorage는 문자열만 저장할 수 있으므로, JSON 문자열로 변환합니다.
    const jsonValue = JSON.stringify(updatedTransactions);
    // 4. 변환된 문자열을 저장합니다.
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save transaction to storage', e);
  }
};