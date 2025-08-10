import { call, put, takeLatest, delay } from 'redux-saga/effects';
import {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  updateOrderRequest,
  updateOrderSuccess,
  updateOrderFailure,
  deleteOrderRequest,
  deleteOrderSuccess,
  deleteOrderFailure,
} from './orderSlice';
import type { Order } from '@/types';

// API функции для работы с заказами
const ordersApi = {
  fetchOrders: async (): Promise<Order[]> => {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts?_limit=10'
    );
    if (!response.ok) {
      throw new Error('Ошибка загрузки заказов');
    }
    const posts = await response.json();

    // Преобразуем posts в заказы для демонстрации
    return posts.map((post: Record<string, unknown>, index: number) => ({
      id: String(post.id || index),
      userId: (index + 1).toString(),
      user: {
        id: (index + 1).toString(),
        name: `Пользователь ${index + 1}`,
        email: `user${index + 1}@example.com`,
        role: 'user' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      items: [
        {
          id: `item-${String(post.id || index)}`,
          productId: String(post.id || index),
          product: {
            id: String(post.id || index),
            name: `Продукт ${post.id}`,
            description: post.title,
            price: Math.floor(Math.random() * 1000) + 100,
            category: 'electronics',
            image: `https://picsum.photos/200/200?random=${post.id}`,
            stock: Math.floor(Math.random() * 50) + 1,
            rating: Math.random() * 5,
            reviews: Math.floor(Math.random() * 100),
            tags: ['electronics', 'gadget'],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          quantity: Math.floor(Math.random() * 5) + 1,
          price: Math.floor(Math.random() * 1000) + 100,
        },
      ],
      status: ['pending', 'confirmed', 'shipped', 'delivered'][
        Math.floor(Math.random() * 4)
      ] as Order['status'],
      totalAmount: Math.floor(Math.random() * 5000) + 500,
      shippingAddress: {
        street: `Улица ${post.id}`,
        city: 'Москва',
        state: 'Московская область',
        zipCode: '123456',
        country: 'Россия',
      },
      paymentMethod: ['card', 'cash', 'transfer'][
        Math.floor(Math.random() * 3)
      ] as Order['paymentMethod'],
      paymentStatus: ['pending', 'paid', 'failed'][
        Math.floor(Math.random() * 3)
      ] as Order['paymentStatus'],
      trackingNumber: `TRK${String(post.id || index).padStart(6, '0')}`,
      notes: String(post.body || '').substring(0, 100),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  },

  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Ошибка создания заказа');
    }

    const post = await response.json();

    // Создаем заказ на основе ответа
    return {
      id: post.id.toString(),
      userId: '1',
      user: {
        id: '1',
        name: 'Пользователь',
        email: 'user@example.com',
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      items: [],
      status: 'pending',
      totalAmount: 0,
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      paymentMethod: 'card',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData,
    };
  },

  updateOrder: async (
    id: string,
    orderData: Partial<Order>
  ): Promise<Order> => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!response.ok) {
      throw new Error('Ошибка обновления заказа');
    }

    const post = await response.json();

    return {
      id: post.id.toString(),
      userId: '1',
      user: {
        id: '1',
        name: 'Пользователь',
        email: 'user@example.com',
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      items: [],
      status: 'pending',
      totalAmount: 0,
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      paymentMethod: 'card',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData,
    };
  },

  deleteOrder: async (id: string): Promise<void> => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Ошибка удаления заказа');
    }
  },
};

// Saga для загрузки заказов
function* fetchOrdersSaga() {
  try {
    // Имитируем задержку для демонстрации
    yield delay(1000);

    const orders: Order[] = yield call(ordersApi.fetchOrders);
    yield put(fetchOrdersSuccess(orders));
  } catch (error) {
    yield put(
      fetchOrdersFailure(
        error instanceof Error ? error.message : 'Ошибка загрузки заказов'
      )
    );
  }
}

// Saga для создания заказа
function* createOrderSaga(action: ReturnType<typeof createOrderRequest>) {
  try {
    // Имитируем задержку для демонстрации
    yield delay(1500);

    const order: Order = yield call(ordersApi.createOrder, action.payload);
    yield put(createOrderSuccess(order));
  } catch (error) {
    yield put(
      createOrderFailure(
        error instanceof Error ? error.message : 'Ошибка создания заказа'
      )
    );
  }
}

// Saga для обновления заказа
function* updateOrderSaga(action: ReturnType<typeof updateOrderRequest>) {
  try {
    // Имитируем задержку для демонстрации
    yield delay(1000);

    const order: Order = yield call(
      ordersApi.updateOrder,
      action.payload.id,
      action.payload.order
    );
    yield put(updateOrderSuccess({ id: action.payload.id, order }));
  } catch (error) {
    yield put(
      updateOrderFailure(
        error instanceof Error ? error.message : 'Ошибка обновления заказа'
      )
    );
  }
}

// Saga для удаления заказа
function* deleteOrderSaga(action: ReturnType<typeof deleteOrderRequest>) {
  try {
    // Имитируем задержку для демонстрации
    yield delay(800);

    yield call(ordersApi.deleteOrder, action.payload);
    yield put(deleteOrderSuccess(action.payload));
  } catch (error) {
    yield put(
      deleteOrderFailure(
        error instanceof Error ? error.message : 'Ошибка удаления заказа'
      )
    );
  }
}

// Root saga для заказов
export function* orderSaga() {
  yield takeLatest(fetchOrdersRequest.type, fetchOrdersSaga);
  yield takeLatest(createOrderRequest.type, createOrderSaga);
  yield takeLatest(updateOrderRequest.type, updateOrderSaga);
  yield takeLatest(deleteOrderRequest.type, deleteOrderSaga);
}
