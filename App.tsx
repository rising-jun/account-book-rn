import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar as CalendarIcon, BarChart3 } from 'lucide-react-native';

import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import StatsScreen from './screens/StatsScreen';
import { getTransactions } from './lib/storage'; // storage 함수 import
import { Transaction } from './types'; // Transaction 타입 import

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // 앱이 처음 시작될 때 AsyncStorage에서 데이터를 불러옵니다.
  useEffect(() => {
    reloadData();
  }, []);

  // 데이터를 다시 불러와 상태를 업데이트하는 함수
  // 이 함수를 자식 컴포넌트에 넘겨주어 데이터가 변경되었을 때 호출하게 합니다.
  const reloadData = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            let IconComponent;
            if (route.name === '홈') {
              IconComponent = Home;
            } else if (route.name === '캘린더') {
              IconComponent = CalendarIcon;
            } else if (route.name === '통계') {
              IconComponent = BarChart3;
            }
            return IconComponent ? <IconComponent color={color} size={size} /> : null;
          },
          tabBarActiveTintColor: '#3B82F6', // 활성 탭 색상 (파란색)
          tabBarInactiveTintColor: '#9CA3AF', // 비활성 탭 색상 (회색)
          headerStyle: {
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB',
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#3B82F6',
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen name="홈" options={{ title: '핵심가계부' }}>
          {(props) => <HomeScreen {...props} transactions={transactions} reloadData={reloadData} />}
        </Tab.Screen>
        <Tab.Screen name="캘린더" options={{ title: '캘린더' }}>
          {(props) => <CalendarScreen {...props} transactions={transactions} />}
        </Tab.Screen>
        <Tab.Screen name="통계" options={{ title: '소비 통계' }}>
          {(props) => <StatsScreen {...props} transactions={transactions} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;