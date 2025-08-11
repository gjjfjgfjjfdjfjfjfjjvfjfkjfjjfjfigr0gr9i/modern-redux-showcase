import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProductsQuery } from '@/api/baseApi';
import { addToCart } from '@/features/cart/cartSlice';
import { selectUser } from '@/features/user/userSlice';
import toast from 'react-hot-toast';
import type { Product, ProductFilters } from '@/types';

const Products: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // Состояние для фильтров
  const [filters, setFilters] = useState<ProductFilters>({
    category: '',
    search: '',
    minPrice: undefined,
    maxPrice: undefined,
    rating: undefined,
    inStock: undefined,
  });

  // Состояние для пагинации
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // Получаем продукты через RTK Query
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery({
    page,
    limit,
    filters,
  });

  // Обработчик добавления в корзину
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    dispatch(addToCart({ product, quantity }));
    toast.success(`${product.name} добавлен в корзину`);
  };

  // Обработчик изменения фильтров
  const handleFilterChange = (
    key: keyof ProductFilters,
    value: string | number | boolean | undefined
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Сбрасываем страницу при изменении фильтров
  };

  // Обработчик поиска
  const handleSearch = (searchTerm: string) => {
    handleFilterChange('search', searchTerm);
  };

  // Обработчик сброса фильтров
  const handleResetFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      inStock: undefined,
    });
    setPage(1);
  };

  // Категории для фильтра
  const categories = ['Электроника', 'Одежда', 'Книги', 'Спорт'];

  // Рейтинги для фильтра
  const ratings = [1, 2, 3, 4, 5];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Продукты</h1>
          <p className="mt-1 text-sm text-gray-500">
            Демонстрация RTK Query для работы с API
          </p>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Продукты</h1>
          <p className="mt-1 text-sm text-gray-500">
            Демонстрация RTK Query для работы с API
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Ошибка загрузки продуктов
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Не удалось загрузить список продуктов. Попробуйте обновить
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

  const products = productsData?.data || [];
  const pagination = productsData?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Продукты</h1>
        <p className="mt-1 text-sm text-gray-500">
          Демонстрация RTK Query для работы с API
        </p>
      </div>

      {/* Фильтры */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Фильтры</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Поиск */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поиск
            </label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Название продукта..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Категория */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              value={filters.category || ''}
              onChange={e =>
                handleFilterChange('category', e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Все категории</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Минимальная цена */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Мин. цена
            </label>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={e =>
                handleFilterChange(
                  'minPrice',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Максимальная цена */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Макс. цена
            </label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={e =>
                handleFilterChange(
                  'maxPrice',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="10000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Рейтинг */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Минимальный рейтинг
            </label>
            <select
              value={filters.rating || ''}
              onChange={e =>
                handleFilterChange(
                  'rating',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Любой рейтинг</option>
              {ratings.map(rating => (
                <option key={rating} value={rating}>
                  {rating}+ звезд
                </option>
              ))}
            </select>
          </div>

          {/* Наличие */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Наличие
            </label>
            <select
              value={
                filters.inStock === undefined ? '' : filters.inStock.toString()
              }
              onChange={e =>
                handleFilterChange(
                  'inStock',
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Все товары</option>
              <option value="true">В наличии</option>
              <option value="false">Нет в наличии</option>
            </select>
          </div>

          {/* Кнопка сброса */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>

      {/* Список продуктов */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Найдено {pagination?.total || 0} продуктов
            </h2>
            <div className="text-sm text-gray-500">
              Страница {page} из {pagination?.totalPages || 1}
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🛍️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Продукты не найдены
            </h3>
            <p className="text-gray-500">
              Попробуйте изменить фильтры или поисковый запрос
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {products.map((product: Product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'https://placehold.co/300x200/E5E7EB/6B7280?text=No+Image';
                    }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      {product.price.toLocaleString()} ₽
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.stock > 0 ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Категория: {product.category}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0 || !user}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        product.stock === 0 || !user
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {!user
                        ? 'Войти'
                        : product.stock === 0
                          ? 'Нет в наличии'
                          : 'В корзину'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Пагинация */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Показано {(page - 1) * limit + 1} -{' '}
                {Math.min(page * limit, pagination.total)} из {pagination.total}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Назад
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  const isCurrent = pageNumber === page;
                  const isNearCurrent = Math.abs(pageNumber - page) <= 2;

                  if (
                    isCurrent ||
                    isNearCurrent ||
                    pageNumber === 1 ||
                    pageNumber === pagination.totalPages
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          isCurrent
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === page - 3 ||
                    pageNumber === page + 3
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="px-3 py-2 text-sm text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    page === pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Вперед
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
