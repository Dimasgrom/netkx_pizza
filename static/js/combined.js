// Общие переменные
let selectedItems = []; // Массив для хранения выбранных ингредиентов
let totalPrice = 0; // Общая стоимость заказа
let selectedPaymentMethod = null; // Выбранный метод оплаты


// Названия категорий для отображения в итоговом списке
const categoryNames = {
  size: "Розмір",
  border: "Бортики",
  sauce: "Соус",
  cheese: "Сир",
  meat: "М'ясо",
  extra: "Додатково"
};

function showPayment() {
    document.getElementById('paymentOverlay').style.display = 'flex';
  }

function selectMethod(method) {
  selectedPaymentMethod = method; // Сохраняем выбранный метод
  document.querySelectorAll('.method-card').forEach(el => {
    el.style.borderColor = '#ddd'; // Сбрасываем стили для всех карточек
  });
  event.currentTarget.style.borderColor = '#00573D'; // Подсвечиваем выбранную карточку

  // Показываем форму для карты, если выбран метод "карта"
  document.getElementById('cardForm').style.display = method === 'card' ? 'block' : 'none';

  // Обновляем интерфейс
  updateOrderSummary();
}

// Инициализация конструктора пиццы
document.addEventListener('DOMContentLoaded', () => {
  // Обработчики для выбора размера пиццы
  document.querySelectorAll('.option-button[data-size]').forEach(button => {
    button.addEventListener('click', function() {
      const size = this.dataset.size;
      const price = parseInt(this.dataset.price || 0);
      const name = `${size} см`;

      // Удаляем предыдущий выбранный размер, если он есть
      const prevSize = selectedItems.find(item => item.category === 'size');
      if (prevSize) totalPrice -= prevSize.price;

      // Добавляем новый размер в список выбранных ингредиентов
      selectedItems = [
        ...selectedItems.filter(item => item.category !== 'size'),
        { category: 'size', name, price }
      ];
      totalPrice += price;

      // Обновляем стили кнопок и итоговую сумму
      document.querySelectorAll('.option-button[data-size]').forEach(btn => 
        btn.classList.remove('selected')
      );
      this.classList.add('selected');
      updateOrderSummary();
    });
  });

  // Обработчики для выбора бортиков
  document.querySelectorAll('.option-button[data-category="border"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const price = parseInt(this.dataset.price || 0);
      const name = this.innerText.trim();

      // Удаляем предыдущий выбранный бортик, если он есть
      const prevBorder = selectedItems.find(item => item.category === 'border');
      if (prevBorder) totalPrice -= prevBorder.price;

      // Добавляем новый бортик в список выбранных ингредиентов
      selectedItems = [
        ...selectedItems.filter(item => item.category !== 'border'),
        { category: 'border', name, price }
      ];
      totalPrice += price;

      // Обновляем стили кнопок и итоговую сумму
      document.querySelectorAll('.option-button[data-category="border"]').forEach(b => 
        b.classList.remove('selected')
      );
      this.classList.add('selected');
      updateOrderSummary();
    });
  });

  // Обработчики для выбора ингредиентов (соусы, сыры, мясо, дополнительные)
  document.querySelectorAll('.ingredient-card').forEach(card => {
    card.addEventListener('click', function() {
      try {
        const category = this.dataset.category;
        const price = parseFloat(this.dataset.price || 0); // Используем parseFloat для чисел
        const name = this.querySelector('.ingredient-name').innerText;
  
        // Для соусов и сыров можно выбрать только один вариант
        if (['sauce', 'cheese'].includes(category)) {
          const prev = selectedItems.find(item => item.category === category);
          if (prev) totalPrice -= prev.price;
  
          selectedItems = [
            ...selectedItems.filter(item => item.category !== category),
            { category, name, price }
          ];
          totalPrice += price;
  
          // Обновляем стили карточек
          document.querySelectorAll(`[data-category="${category}"]`).forEach(el => 
            el.classList.remove('selected')
          );
          this.classList.add('selected');
        } else {
          // Для других ингредиентов можно выбирать несколько
          const isSelected = this.classList.toggle('selected');
          if (isSelected) {
            selectedItems.push({ category, name, price });
            totalPrice += price;
          } else {
            selectedItems = selectedItems.filter(item => item.name !== name);
            totalPrice -= price;
          }
        }
  
        updateOrderSummary(); // Обновляем итоговую информацию
      } catch (error) {
        console.error('Ошибка при выборе ингредиента:', error);
      }
    });
  });
  // Маска для ввода номера карты
  document.querySelectorAll('[data-mask]').forEach(input => {
    input.addEventListener('input', function(e) {
      const mask = this.dataset.mask;
      const value = this.value.replace(/\D/g, '');
      let formatted = '';

      for (let i = 0, j = 0; i < mask.length; i++) {
        if (mask[i] === '0') {
          if (j < value.length) formatted += value[j++];
          else break;
        } else {
          formatted += mask[i];
        }
      }
      this.value = formatted;
    });
  });
});

// Функция для обновления итогового списка ингредиентов и суммы
function updateOrderSummary() {
    const summaryElement = document.getElementById('selected-ingredients');
    const totalElement = document.getElementById('total-price');
    const paymentMethodElement = document.getElementById('selected-payment-method'); // Новый элемент
  
    // Группируем ингредиенты по категориям
    const grouped = selectedItems.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item.name);
      return acc;
    }, {});
  
    // Отображаем выбранные ингредиенты
    summaryElement.innerHTML = Object.entries(categoryNames)
      .filter(([key]) => grouped[key])
      .map(([key, title]) => `<p><strong>${title}:</strong> ${grouped[key].join(', ')}</p>`)
      .join('');
  
    // Обновляем общую сумму
    totalElement.textContent = `${totalPrice}₴`;
  
    // Обновляем метод оплаты
    paymentMethodElement.textContent = selectedPaymentMethod || 'Не вибрано';
  }
// Логика модальных окон
const orderButton = document.querySelector('.order-button');
const modalOverlay = document.getElementById('modalOverlay');
const closeBtn = document.querySelector('.close-btn');


document.querySelector('.close-btn')?.addEventListener('click', () => {
    document.getElementById('paymentOverlay').style.display = 'none';
  });
  
  document.getElementById('paymentOverlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('paymentOverlay')) {
      document.getElementById('paymentOverlay').style.display = 'none';
    }
  });

orderButton?.addEventListener('click', () => {
  modalOverlay.style.display = 'flex';
});

closeBtn?.addEventListener('click', () => {
  modalOverlay.style.display = 'none';
});

modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none';
  }
});

// Обработка оплаты
document.getElementById('paymentForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  if (validateCard()) {
    alert('Оплата успішно проведена!');
    closePayment();
  }
});

function showPayment() {
  document.getElementById('paymentOverlay').style.display = 'flex';
}

function closePayment() {
  document.getElementById('paymentOverlay').style.display = 'none';
}

function selectMethod(method) {
    selectedPaymentMethod = method; // Сохраняем выбранный метод
    document.querySelectorAll('.method-card').forEach(el => {
      el.style.borderColor = '#ddd'; // Сбрасываем стили для всех карточек
    });
    event.currentTarget.style.borderColor = '#00573D'; // Подсвечиваем выбранную карточку
  
    // Показываем форму для карты, если выбран метод "карта"
    document.getElementById('cardForm').style.display = method === 'card' ? 'block' : 'none';
  
    // Обновляем интерфейс
    updateOrderSummary();
  }
// Валидация карты
function validateCard() {
  const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
  const expiry = document.getElementById('expiry').value.split('/');
  const cvv = document.getElementById('cvv').value;

  if (!/^\d{16}$/.test(cardNumber)) {
    alert('Невірний номер картки');
    return false;
  }

  if (expiry.length !== 2 || expiry[0] > 12 || expiry[1] < 23) {
    alert('Невірний термін дії');
    return false;
  }

  if (!/^\d{3}$/.test(cvv)) {
    alert('Невірний CVV');
    return false;
  }

  return true;
}

// Обработка заказа
document.getElementById('deliveryForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const formData = {
      name: document.getElementById('name').value.trim(),
      address: document.getElementById('address').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      comments: document.getElementById('comments').value.trim()
    };
  
    // Проверка обязательных полей
    if (!formData.name || !formData.address || !formData.phone) {
      alert('Заповніть обовʼязкові поля: Імʼя, Адреса, Телефон');
      return;
    }
  
    // Проверка метода оплаты
    if (!selectedPaymentMethod) {
      alert('Виберіть метод оплати');
      return;
    }
  
    // Логирование данных перед отправкой
    console.log("Данные для отправки:", {
      customer: formData,
      payment: { method: selectedPaymentMethod },
      items: selectedItems,
      total_price: totalPrice
    });
  
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          payment: { method: selectedPaymentMethod },
          items: selectedItems,
          total_price: totalPrice
        })
      });
  
      if (!response.ok) throw new Error('Помилка сервера');
      
      const result = await response.json();
      alert(`Замовлення №${result.order_id} успішно створено!`);
      resetOrder();
      modalOverlay.style.display = 'none';
    } catch (error) {
      console.error('Помилка:', error);
      alert('Помилка при оформленні замовлення');
    }
  });

// Сброс заказа
function resetOrder() {
  selectedItems = [];
  totalPrice = 0;
  updateOrderSummary();
  document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
}



// Навигация
document.getElementById("pizza-bulder")?.addEventListener("click", () => {
  window.location.href = "pizza_construkt.html";
});

document.getElementById("logo")?.addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("login")?.addEventListener("click", () => {
    window.location.href = "login.html";
  });


