import { all } from 'redux-saga/effects';

// Импортируем все саги (пока пустые, добавим позже)
import { userSaga } from '@/features/user/userSaga';
import { cartSaga } from '@/features/cart/cartSaga';
import { notificationSaga } from '@/features/notification/notificationSaga';
import { productSaga } from '@/features/product/productSaga';
import { orderSaga } from '@/features/order/orderSaga';
import { analyticsSaga } from '@/features/analytics/analyticsSaga';

// Корневая saga, которая объединяет все саги
export function* rootSaga() {
  yield all([
    userSaga(),
    cartSaga(),
    notificationSaga(),
    productSaga(),
    orderSaga(),
    analyticsSaga(),
  ]);
}
