import { ExpenseCategory } from '../types';

// 앱 전체에서 사용할 기본 카테고리 목록
// 이제 카테고리에 대한 모든 정보는 이 파일이 책임집니다.
export const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  '식비',
  '교통',
  '쇼핑',
  '문화/여가',
  '주거/통신',
  '의료/건강',
  '기타',
];