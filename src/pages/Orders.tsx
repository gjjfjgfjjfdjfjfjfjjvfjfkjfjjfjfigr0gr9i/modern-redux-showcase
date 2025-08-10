import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

import { AppDispatch } from '@/store';
import {
  fetchOrdersRequest,
  createOrderRequest,
  updateOrderRequest,
  deleteOrderRequest,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
} from '@/features/order/orderSlice';
import { Order } from '@/types';

const Orders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectOrders) || [];
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    status: 'pending' as Order['status'],
    paymentStatus: 'pending' as Order['paymentStatus'],
    notes: '',
  });

  // Загружаем заказы при монтировании компонента
  useEffect(() => {
    dispatch(fetchOrdersRequest());
  }, [dispatch]);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createOrderRequest(formData));
    setIsCreateModalOpen(false);
    setFormData({ status: 'pending', paymentStatus: 'pending', notes: '' });
    toast.success('Заказ создается...');
  };

  const handleUpdateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    dispatch(updateOrderRequest({ id: editingOrder.id, order: formData }));
    setEditingOrder(null);
    setFormData({ status: 'pending', paymentStatus: 'pending', notes: '' });
    toast.success('Заказ обновляется...');
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      dispatch(deleteOrderRequest(orderId));
      toast.success('Заказ удаляется...');
    }
  };

  const openEditModal = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      status: order.status,
      paymentStatus: order.paymentStatus,
      notes: order.notes || '',
    });
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setEditingOrder(null);
    setFormData({ status: 'pending', paymentStatus: 'pending', notes: '' });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-400">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Ошибка загрузки
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
          <p className="mt-1 text-sm text-gray-500">
            Демонстрация Redux-Saga для обработки заказов
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Создать заказ
        </button>
      </div>

      {/* Информация о Redux-Saga */}
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-green-400">ℹ️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Redux-Saga в действии
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Эта страница демонстрирует использование Redux-Saga для сложных
                асинхронных workflows:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Загрузка списка заказов с задержкой</li>
                <li>Создание нового заказа с валидацией</li>
                <li>Обновление статуса заказа</li>
                <li>Удаление заказа с подтверждением</li>
                <li>Обработка ошибок и уведомления</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Список заказов */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-500 hover:bg-primary-400 transition ease-in-out duration-150 cursor-not-allowed">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Загрузка заказов...
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {orders.map(order => (
              <li key={order.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Заказ #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {order.user.name} • {formatDate(order.createdAt)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Сумма: {order.totalAmount.toLocaleString('ru-RU')} ₽
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm text-gray-500">
                            Трек: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status === 'pending' && 'Ожидает'}
                          {order.status === 'confirmed' && 'Подтвержден'}
                          {order.status === 'shipped' && 'Отправлен'}
                          {order.status === 'delivered' && 'Доставлен'}
                          {order.status === 'cancelled' && 'Отменен'}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus === 'pending' &&
                            'Ожидает оплаты'}
                          {order.paymentStatus === 'paid' && 'Оплачен'}
                          {order.paymentStatus === 'failed' && 'Ошибка оплаты'}
                        </span>
                      </div>
                    </div>
                    {order.items.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-500">
                          Товары: {order.items.length} шт.
                        </p>
                      </div>
                    )}
                    {order.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <strong>Примечание:</strong> {order.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="ml-6 flex space-x-2">
                    <button
                      onClick={() => openEditModal(order)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Модальное окно создания заказа */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Создать новый заказ
              </h3>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Статус
                  </label>
                  <select
                    value={formData.status}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        status: e.target.value as Order['status'],
                      })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="pending">Ожидает</option>
                    <option value="confirmed">Подтвержден</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Статус оплаты
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        paymentStatus: e.target.value as Order['paymentStatus'],
                      })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="pending">Ожидает оплаты</option>
                    <option value="paid">Оплачен</option>
                    <option value="failed">Ошибка оплаты</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Примечание
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Создать
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования заказа */}
      {editingOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Редактировать заказ #{editingOrder.id}
              </h3>
              <form onSubmit={handleUpdateOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Статус
                  </label>
                  <select
                    value={formData.status}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        status: e.target.value as Order['status'],
                      })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="pending">Ожидает</option>
                    <option value="confirmed">Подтвержден</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Статус оплаты
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        paymentStatus: e.target.value as Order['paymentStatus'],
                      })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="pending">Ожидает оплаты</option>
                    <option value="paid">Оплачен</option>
                    <option value="failed">Ошибка оплаты</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Примечание
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
