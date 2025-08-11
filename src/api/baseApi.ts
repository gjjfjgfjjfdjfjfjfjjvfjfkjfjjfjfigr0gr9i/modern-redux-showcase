import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  User,
  Product,
  Order,
  AnalyticsData,
  ProductFilters,
  OrderFilters,
  PaginatedResponse,
  ApiError,
} from '@/types';

// Базовый API с RTK Query
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com', // Используем JSONPlaceholder для демонстрации
    prepareHeaders: headers => {
      // Добавляем заголовки авторизации если нужно
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Product', 'Order', 'Cart', 'Notification', 'Analytics'],
  endpoints: builder => ({
    // Пользователи
    getUsers: builder.query<
      PaginatedResponse<User>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/users?_page=${page}&_limit=${limit}`,
      providesTags: ['User'],
      transformResponse: (response: User[], meta, { page = 1, limit = 10 }) => {
        const total = meta?.response?.headers.get('X-Total-Count') || '0';
        return {
          data: response,
          pagination: {
            page,
            limit,
            total: parseInt(total),
            totalPages: Math.ceil(parseInt(total) / limit),
          },
        };
      },
    }),

    getUser: builder.query<User, string>({
      query: id => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<User, Partial<User>>({
      query: user => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation<User, { id: string; user: Partial<User> }>({
      query: ({ id, user }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        'User',
      ],
    }),

    deleteUser: builder.mutation<void, string>({
      query: id => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Продукты
    getProducts: builder.query<
      PaginatedResponse<Product>,
      { page?: number; limit?: number; filters?: ProductFilters }
    >({
      query: ({ page = 1, limit = 10, filters = {} }) => {
        const params = new URLSearchParams({
          _page: page.toString(),
          _limit: limit.toString(),
        });
        // Добавляем фильтры только если они есть
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('q', filters.search);
        return `/posts?${params}`; // Используем posts как продукты для демонстрации
      },
      providesTags: ['Product'],
      transformResponse: (
        response: unknown[],
        meta,
        { page = 1, limit = 10 }
      ) => {
        const total = meta?.response?.headers.get('X-Total-Count') || '0';
        // Трансформируем posts в продукты
        const products: Product[] = (
          response as Array<{ id: number; title: string; body: string }>
        ).map((post, _index) => ({
          id: post.id.toString(),
          name: post.title,
          description: post.body,
          price: Math.floor(Math.random() * 1000) + 100,
          category: ['Электроника', 'Одежда', 'Книги', 'Спорт'][
            Math.floor(Math.random() * 4)
          ],
          image: `https://placehold.co/300x200/4F46E5/FFFFFF?text=Product+${post.id}`,
          stock: Math.floor(Math.random() * 100) + 1,
          rating: Math.random() * 5,
          reviews: Math.floor(Math.random() * 100),
          tags: ['популярный', 'новинка', 'скидка'],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        return {
          data: products,
          pagination: {
            page,
            limit,
            total: parseInt(total),
            totalPages: Math.ceil(parseInt(total) / limit),
          },
        };
      },
    }),

    getProduct: builder.query<Product, string>({
      query: id => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
      transformResponse: (post: {
        id: number;
        title: string;
        body: string;
      }) => ({
        id: post.id.toString(),
        name: post.title,
        description: post.body,
        price: Math.floor(Math.random() * 1000) + 100,
        category: ['Электроника', 'Одежда', 'Книги', 'Спорт'][
          Math.floor(Math.random() * 4)
        ],
        image: `https://placehold.co/300x200/4F46E5/FFFFFF?text=Product+${post.id}`,
        stock: Math.floor(Math.random() * 100) + 1,
        rating: Math.random() * 5,
        reviews: Math.floor(Math.random() * 100),
        tags: ['популярный', 'новинка', 'скидка'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    }),

    createProduct: builder.mutation<Product, Partial<Product>>({
      query: product => ({
        url: '/posts',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation<
      Product,
      { id: string; product: Partial<Product> }
    >({
      query: ({ id, product }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        'Product',
      ],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: id => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Заказы
    getOrders: builder.query<
      PaginatedResponse<Order>,
      { page?: number; limit?: number; filters?: OrderFilters }
    >({
      query: ({ page = 1, limit = 10, filters = {} }) => {
        const params = new URLSearchParams({
          _page: page.toString(),
          _limit: limit.toString(),
          ...filters,
        });
        return `/posts?${params}`; // Используем posts как заказы для демонстрации
      },
      providesTags: ['Order'],
      transformResponse: (
        response: Array<{
          id: number;
          userId?: number;
          title: string;
          body: string;
        }>,
        meta,
        { page = 1, limit = 10 }
      ) => {
        const total = meta?.response?.headers.get('X-Total-Count') || '0';
        // Трансформируем posts в заказы
        const orders: Order[] = response.map((post, _index) => ({
          id: post.id.toString(),
          userId: (post.userId || 1).toString(),
          user: {
            id: (post.userId || 1).toString(),
            email: `user${post.userId || 1}@example.com`,
            name: `Пользователь ${post.userId || 1}`,
            role: 'user' as const,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          items: [
            {
              id: `item-${post.id}`,
              productId: post.id.toString(),
              product: {
                id: post.id.toString(),
                name: post.title,
                description: post.body,
                price: Math.floor(Math.random() * 1000) + 100,
                category: 'Электроника',
                image: `https://picsum.photos/300/200?random=${post.id}`,
                stock: 10,
                rating: 4.5,
                reviews: 50,
                tags: ['популярный'],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              quantity: Math.floor(Math.random() * 5) + 1,
              price: Math.floor(Math.random() * 1000) + 100,
            },
          ],
          status: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'][
            Math.floor(Math.random() * 5)
          ] as Order['status'],
          totalAmount: Math.floor(Math.random() * 5000) + 1000,
          shippingAddress: {
            street: 'ул. Примерная, 123',
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        return {
          data: orders,
          pagination: {
            page,
            limit,
            total: parseInt(total),
            totalPages: Math.ceil(parseInt(total) / limit),
          },
        };
      },
    }),

    getOrder: builder.query<Order, string>({
      query: id => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
      transformResponse: (post: {
        id: number;
        userId?: number;
        title: string;
        body: string;
      }) => ({
        id: post.id.toString(),
        userId: (post.userId || 1).toString(),
        user: {
          id: (post.userId || 1).toString(),
          email: `user${post.userId || 1}@example.com`,
          name: `Пользователь ${post.userId || 1}`,
          role: 'user' as const,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        items: [
          {
            id: `item-${post.id}`,
            productId: post.id.toString(),
            product: {
              id: post.id.toString(),
              name: post.title,
              description: post.body,
              price: Math.floor(Math.random() * 1000) + 100,
              category: 'Электроника',
              image: `https://picsum.photos/300/200?random=${post.id}`,
              stock: 10,
              rating: 4.5,
              reviews: 50,
              tags: ['популярный'],
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            quantity: Math.floor(Math.random() * 5) + 1,
            price: Math.floor(Math.random() * 1000) + 100,
          },
        ],
        status: 'pending' as const,
        totalAmount: Math.floor(Math.random() * 5000) + 1000,
        shippingAddress: {
          street: 'ул. Примерная, 123',
          city: 'Москва',
          state: 'Московская область',
          zipCode: '123456',
          country: 'Россия',
        },
        paymentMethod: 'card' as const,
        paymentStatus: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    }),

    createOrder: builder.mutation<Order, Partial<Order>>({
      query: order => ({
        url: '/posts',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),

    updateOrder: builder.mutation<Order, { id: string; order: Partial<Order> }>(
      {
        query: ({ id, order }) => ({
          url: `/posts/${id}`,
          method: 'PUT',
          body: order,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: 'Order', id },
          'Order',
        ],
      }
    ),

    deleteOrder: builder.mutation<void, string>({
      query: id => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),

    // Аналитика
    getAnalytics: builder.query<AnalyticsData, void>({
      query: () => '/posts',
      providesTags: ['Analytics'],
      transformResponse: (
        response: Array<{
          id: number;
          userId?: number;
          title: string;
          body: string;
        }>
      ) => ({
        totalUsers: 1250,
        totalOrders: 3420,
        totalRevenue: 1250000,
        averageOrderValue: 365,
        topProducts: response.slice(0, 5).map((post, _index) => ({
          id: post.id.toString(),
          name: post.title,
          description: post.body,
          price: Math.floor(Math.random() * 1000) + 100,
          category: 'Электроника',
          image: `https://picsum.photos/300/200?random=${post.id}`,
          stock: Math.floor(Math.random() * 100) + 1,
          rating: Math.random() * 5,
          reviews: Math.floor(Math.random() * 100),
          tags: ['популярный'],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        recentOrders: response.slice(0, 10).map((post, _index) => ({
          id: post.id.toString(),
          userId: (post.userId || 1).toString(),
          user: {
            id: (post.userId || 1).toString(),
            email: `user${post.userId || 1}@example.com`,
            name: `Пользователь ${post.userId || 1}`,
            role: 'user' as const,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          items: [
            {
              id: `item-${post.id}`,
              productId: post.id.toString(),
              product: {
                id: post.id.toString(),
                name: post.title,
                description: post.body,
                price: Math.floor(Math.random() * 1000) + 100,
                category: 'Электроника',
                image: `https://picsum.photos/300/200?random=${post.id}`,
                stock: 10,
                rating: 4.5,
                reviews: 50,
                tags: ['популярный'],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              quantity: Math.floor(Math.random() * 5) + 1,
              price: Math.floor(Math.random() * 1000) + 100,
            },
          ],
          status: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'][
            Math.floor(Math.random() * 5)
          ] as Order['status'],
          totalAmount: Math.floor(Math.random() * 5000) + 1000,
          shippingAddress: {
            street: 'ул. Примерная, 123',
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        salesChart: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2024, i, 1).toISOString(),
          revenue: Math.floor(Math.random() * 100000) + 50000,
          orders: Math.floor(Math.random() * 500) + 100,
        })),
        userGrowth: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2024, i, 1).toISOString(),
          users: Math.floor(Math.random() * 1000) + 500,
          growth: Math.random() * 20 + 5,
        })),
      }),
    }),
  }),
});

// Утилиты для обработки ошибок
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'data' in error
  );
};

// Хуки для работы с API
export const {
  // Пользователи
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,

  // Продукты
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  // Заказы
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,

  // Аналитика
  useGetAnalyticsQuery,

  // Middleware и reducer
  middleware: apiMiddleware,
  reducer: apiReducer,
  reducerPath: apiReducerPath,
} = baseApi;
