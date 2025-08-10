import React from 'react';
import { useGetAnalyticsQuery } from '@/api/baseApi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Analytics: React.FC = () => {
  // Получаем данные аналитики через RTK Query
  const { data: analytics, isLoading, error, refetch } = useGetAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
          <p className="mt-1 text-sm text-gray-500">
            Демонстрация RTK Query для аналитических данных
          </p>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
          <p className="mt-1 text-sm text-gray-500">
            Демонстрация RTK Query для аналитических данных
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Ошибка загрузки аналитики
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Не удалось загрузить аналитические данные. Попробуйте обновить
                  страницу.
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => refetch()}
                  className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                >
                  Попробовать снова
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
        <p className="mt-1 text-sm text-gray-500">
          Демонстрация RTK Query для аналитических данных
        </p>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Пользователи
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics.totalUsers.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📦</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Заказы
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics.totalOrders.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Выручка
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics.totalRevenue.toLocaleString()} ₽
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Средний чек
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics.averageOrderValue.toLocaleString()} ₽
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Топ продуктов */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Топ продуктов</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="ml-3 w-12 h-12 object-cover rounded-md"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'https://via.placeholder.com/48x48?text=Нет+фото';
                    }}
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {product.price.toLocaleString()} ₽
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ⭐ {product.rating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.reviews} отзывов
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Последние заказы */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Последние заказы
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.recentOrders.slice(0, 5).map(order => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          #{order.id}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {order.user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.createdAt), 'dd MMM yyyy', {
                          locale: ru,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {order.totalAmount.toLocaleString()} ₽
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'confirmed'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'pending'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status === 'delivered'
                        ? 'Доставлен'
                        : order.status === 'shipped'
                          ? 'Отправлен'
                          : order.status === 'confirmed'
                            ? 'Подтвержден'
                            : order.status === 'pending'
                              ? 'Ожидает'
                              : 'Отменен'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График продаж */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Продажи по месяцам
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.salesChart.map((dataPoint, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-primary-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">
                      {format(new Date(dataPoint.date), 'MMMM yyyy', {
                        locale: ru,
                      })}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {dataPoint.revenue.toLocaleString()} ₽
                    </div>
                    <div className="text-sm text-gray-500">
                      {dataPoint.orders} заказов
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Рост пользователей */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Рост пользователей
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.userGrowth.map((dataPoint, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">
                      {format(new Date(dataPoint.date), 'MMMM yyyy', {
                        locale: ru,
                      })}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {dataPoint.users.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">
                      +{dataPoint.growth.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Информация о демонстрации */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-blue-400">ℹ️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Демонстрация RTK Query
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Эта страница демонстрирует использование RTK Query для получения
                аналитических данных. Все данные генерируются автоматически и
                обновляются в реальном времени благодаря кэшированию и
                автоматическому рефетчингу RTK Query.
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Автоматическое кэширование данных</li>
                <li>Фоновое обновление при фокусе</li>
                <li>Оптимистичные обновления</li>
                <li>Обработка ошибок и состояний загрузки</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
