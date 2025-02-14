document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const payButton = document.querySelector('.pay');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    
    // Открытие/закрытие корзины
    payButton.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });
    
    document.querySelector('.close-cart').addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // Добавление товара в корзину
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            const product = {
                name: menuItem.querySelector('h3').textContent,
                price: parseInt(menuItem.querySelector('.price').textContent),
                quantity: 1
            };
            
            const existingItem = cart.find(item => item.name === product.name);
            if(existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(product);
            }
            
            updateCartDisplay();
        });
    });

    // Обновление отображения корзины
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} грн x ${item.quantity}</p>
                </div>
                <div class="quantity-controls">
                    <button class="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
            `;
            
            cartItem.querySelector('.increase').addEventListener('click', () => {
                item.quantity++;
                updateCartDisplay();
            });
            
            cartItem.querySelector('.decrease').addEventListener('click', () => {
                if(item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCartDisplay();
            });
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        totalPriceElement.textContent = `Загальна сума: ${total} грн`;
    }
});

function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    if(cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <svg viewBox="0 0 24 24">
                    <path d="M22 9h-4.79l-4.38-6.56c-.19-.28-.51-.42-.83-.42s-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.92 1.46h13c.92 0 1.69-.62 1.93-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1zM12 4.8L14.8 9H9.2L12 4.8zM18.5 19l-12.99.01L3.31 11H20.7l-2.2 8zM12 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <p>Кошик порожній</p>
            </div>
        `;
        totalPriceElement.textContent = '0 грн';
        return;
    }
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-price">${item.price} грн</p>
                <div class="quantity-controls">
                    <button class="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
            </div>
        `;
        
        // Обработчики для кнопок +/-
        cartItem.querySelector('.increase').addEventListener('click', () => {
            item.quantity++;
            updateCartDisplay();
        });
        
        cartItem.querySelector('.decrease').addEventListener('click', () => {
            if(item.quantity > 1) {
                item.quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCartDisplay();
        });
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    totalPriceElement.textContent = `${total} грн`;
}