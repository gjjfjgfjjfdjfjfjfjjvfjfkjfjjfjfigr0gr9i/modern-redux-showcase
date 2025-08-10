// Базовые типы
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Пользователи
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: string;
  phone?: string;
  website?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    language: 'ru' | 'en';
    notifications: boolean;
  };
}

// Продукты
export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  tags: string[];
  isActive: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image?: string;
  productCount: number;
}

// Корзина
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  discount?: number;
  discountCode?: string;
}

// Заказы
export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order extends BaseEntity {
  userId: string;
  user: User;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: 'card' | 'cash' | 'transfer';
  paymentStatus: 'pending' | 'paid' | 'failed';
  trackingNumber?: string;
  notes?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Уведомления
export interface Notification extends BaseEntity {
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

// Аналитика
export interface AnalyticsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: Product[];
  recentOrders: Order[];
  salesChart: SalesDataPoint[];
  userGrowth: GrowthDataPoint[];
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface GrowthDataPoint {
  date: string;
  users: number;
  growth: number;
}

// API типы
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Состояния загрузки
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Фильтры и поиск
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
}

export interface OrderFilters {
  status?: Order['status'];
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
}

// Формы
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  tags: string[];
}

export interface OrderForm {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: Address;
  paymentMethod: Order['paymentMethod'];
  notes?: string;
}

// Redux типы
export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

export interface AsyncListState<T> extends LoadingState {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Все типы уже экспортированы выше
