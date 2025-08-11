import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  selectCartDiscount,
  selectCartDiscountCode,
  selectCartFinalPrice,
  selectIsCartEmpty,
  removeFromCart,
  updateQuantity,
  applyDiscount,
  removeDiscount,
  clearCart,
} from '@/features/cart/cartSlice';
import { selectUser } from '@/features/user/userSlice';
import { AppDispatch } from '@/store';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  // Селекторы корзины
  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const discount = useSelector(selectCartDiscount);
  const discountCode = useSelector(selectCartDiscountCode);
  const finalPrice = useSelector(selectCartFinalPrice);
  const isEmpty = useSelector(selectIsCartEmpty);

  // Состояние для промокода
  const [promoCode, setPromoCode] = useState('');

  // Обработчик удаления товара
  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
    toast.success('Товар удален из корзины');
  };

  // Обработчик изменения количества
  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      dispatch(updateQuantity({ itemId, quantity }));
    }
  };

  // Обработчик применения промокода
  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error('Введите промокод');
      return;
    }

    // Демонстрационные промокоды
    const promoDiscounts: Record<string, number> = {
      SALE10: 10,
      SALE20: 20,
      SALE50: 50,
      WELCOME: 15,
    };

    const discountAmount = promoDiscounts[promoCode.toUpperCase()];

    if (discountAmount) {
      const discountValue = Math.round((totalPrice * discountAmount) / 100);
      dispatch(
        applyDiscount({
          code: promoCode.toUpperCase(),
          discount: discountValue,
        })
      );
      toast.success(`Промокод применен! Скидка: ${discountAmount}%`);
      setPromoCode('');
    } else {
      toast.error('Неверный промокод');
    }
  };

  // Обработчик удаления промокода
  const handleRemovePromo = () => {
    dispatch(removeDiscount());
    toast.success('Промокод удален');
  };

  // Обработчик очистки корзины
  const handleClearCart = () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(clearCart() as any);
      toast.success('Корзина очищена');
    }
  };

  // Обработчик оформления заказа
  const handleCheckout = () => {
    if (!user) {
      toast.error('Необходимо войти в систему для оформления заказа');
      return;
    }

    if (isEmpty) {
      toast.error('Корзина пуста');
      return;
    }

    // Переходим на страницу оформления заказа
    navigate('/orders');
    toast.success('Переход к оформлению заказа');
  };

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Корзина</h1>
          <p className="mt-1 text-sm text-gray-500">
            Демонстрация Redux Toolkit для управления корзиной
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Корзина пуста
          </h3>
          <p className="text-gray-500 mb-6">
            Добавьте товары в корзину, чтобы продолжить покупки
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700"
          >
            Перейти к покупкам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Корзина</h1>
        <p className="mt-1 text-sm text-gray-500">
          Демонстрация Redux Toolkit для управления корзиной
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список товаров */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Товары в корзине ({totalItems})
                </h2>
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Очистить корзину
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {items.map(item => (
                <div key={item.id} className="p-6">
                  <div className="flex items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          'https://placehold.co/80x80/E5E7EB/6B7280?text=No+Image';
                      }}
                    />

                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.product.description}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-500">
                          Категория: {item.product.category}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          Добавлен:{' '}
                          {format(new Date(item.addedAt), 'dd MMM yyyy', {
                            locale: ru,
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="ml-4 flex items-center space-x-4">
                      {/* Количество */}
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-gray-900 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Цена */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {(item.price * item.quantity).toLocaleString()} ₽
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.price.toLocaleString()} ₽ за шт.
                        </div>
                      </div>

                      {/* Удалить */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Итого */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6 sticky top-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Итого</h2>

            {/* Промокод */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Промокод
              </label>
              {discountCode ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                  <div>
                    <div className="text-sm font-medium text-green-800">
                      {discountCode}
                    </div>
                    <div className="text-sm text-green-600">
                      Скидка: {discount?.toLocaleString()} ₽
                    </div>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-green-600 hover:text-green-800"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    placeholder="Введите промокод"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
                  >
                    Применить
                  </button>
                </div>
              )}
            </div>

            {/* Расчет */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Товары ({totalItems}):</span>
                <span className="text-gray-900">
                  {totalPrice.toLocaleString()} ₽
                </span>
              </div>

              {discount && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Скидка:</span>
                  <span className="text-green-600">
                    -{discount.toLocaleString()} ₽
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Итого:</span>
                  <span>{finalPrice.toLocaleString()} ₽</span>
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={!user}
                className={`w-full px-4 py-3 rounded-md font-medium ${
                  !user
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {!user ? 'Войдите для оформления' : 'Оформить заказ'}
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
              >
                Продолжить покупки
              </button>
            </div>

            {/* Информация */}
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Информация о заказе
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Бесплатная доставка от 5000 ₽</p>
                <p>• Возврат в течение 14 дней</p>
                <p>• Безопасная оплата</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
