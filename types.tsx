export type ExpenseCategory =
  | '식비'
  | '교통'
  | '쇼핑'
  | '문화/여가'
  | '주거/통신'
  | '의료/건강'
  | '기타';

// 앱 전체에서 사용할 Transaction 타입을 정의합니다.
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  date: string; // 날짜는 ISO 8601 형식의 문자열로 통일합니다. (예: new Date().toISOString())
  category?: ExpenseCategory; // 지출 유형에만 존재하므로 optional (?) 처리합니다.
}