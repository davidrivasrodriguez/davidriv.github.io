document.addEventListener('DOMContentLoaded', function() {
    const cartButton = document.getElementById('cart-button');
    const backToStoreButton = document.getElementById('back-to-store-button');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    // Navegar al carrito de compras
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }

    // Volver a la tienda
    if (backToStoreButton) {
        backToStoreButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // Añadir productos al carrito
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const product = button.closest('.product');
                const id = product.dataset.id;
                const name = product.dataset.name;
                const price = parseFloat(product.dataset.price);
                addToCart(id, name, price);
            });
        });
    }

    // Función para añadir productos al carrito
    function addToCart(id, name, price) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const index = cart.findIndex(item => item.id === id);
        if (index !== -1) {
            cart[index].quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Producto agregado al carrito');
    }

    // Función para renderizar el carrito
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartList = document.getElementById('cart-list');
        cartList.innerHTML = ''; // Corregido aquí

        let total = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('li'); // Cambiado a elemento de lista
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.id == 1 ? 'fotos/prote.jpg' : item.id == 2 ? 'fotos/creatina.jpg' : 'fotos/pwo.jpg'}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.price.toFixed(2)}€</p>
                <div id="cart-quantity">
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="remove-from-cart-button" data-id="${item.id}">Eliminar</button>
                </div>
            `;
            cartList.appendChild(cartItem);

            total += item.price * item.quantity;

            // Actualizar cantidad
            cartItem.querySelector('.quantity-input').addEventListener('change', function() {
                const newQuantity = parseInt(this.value);
                updateQuantity(item.id, newQuantity);
            });

            // Eliminar producto del carrito
            cartItem.querySelector('.remove-from-cart-button').addEventListener('click', function() {
                removeFromCart(item.id);
            });
        });

        const cartTotal = document.getElementById('cart-total');
        cartTotal.innerText = `Total: ${total.toFixed(2)}€`;
    }

    // Función para actualizar la cantidad de un producto en el carrito
    function updateQuantity(id, newQuantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const index = cart.findIndex(item => item.id == id);
        if (index !== -1) {
            cart[index].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    }

    // Función para eliminar un producto del carrito
    function removeFromCart(id) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id != id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    // Vaciar el carrito después de la compra
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('No se puede comprar porque el carrito está vacío.');
            } else {
                alert('Compra realizada con éxito.');
                localStorage.removeItem('cart');
                renderCart();
            }
        });
    }

    // Llamar a renderCart al cargar la página
    renderCart();
});
