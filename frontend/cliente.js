let carrito = [];
let productos = [];

// Inicialización al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    cargarProductosCliente();
    
    // Configurar el rango de precios
    const precioSlider = document.getElementById('precio');
    precioSlider.addEventListener('input', function() {
        document.getElementById('precio-max').textContent = `Hasta $${parseInt(this.value).toLocaleString('es-ES')}`;
    });
    
    // Configurar máximo del slider según tus productos
    precioSlider.max = 1000000; // 1,000,000 como precio máximo
    precioSlider.value = 500000;
    document.getElementById('precio-max').textContent = `Hasta $${parseInt(precioSlider.value).toLocaleString('es-ES')}`;
});

// Funciones de UI
function logout() {
  localStorage.removeItem('rol');
  window.location.href = 'index.html';
}

function verCarrito() {
    document.getElementById('modal-carrito').classList.remove('hidden');
    actualizarCarrito();
}

function cerrarCarrito() {
    document.getElementById('modal-carrito').classList.add('hidden');
}

function cerrarDetalle() {
    document.getElementById('modal-detalle').classList.add('hidden');
}

function aplicarFiltros() {
    cargarProductosCliente();
}

// Cargar productos con filtros
async function cargarProductosCliente() {
    const categoria = document.getElementById('categoria').value;
    const marca = document.getElementById('marca').value;
    const talla = document.getElementById('talla').value;
    const precioMax = document.getElementById('precio').value;
    const searchQuery = document.getElementById('buscar').value.trim();

    // Mostrar loader
    const lista = document.getElementById('productos-cliente');
    lista.innerHTML = `
        <div class="col-span-3 flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
    `;

    let url = `http://localhost:3000/api/productos?precioMax=${precioMax}`;
    if (categoria && categoria !== 'todas') url += `&categoria=${categoria}`;
    if (marca && marca !== 'todas') url += `&marca=${marca}`;
    if (talla && talla !== 'todas') url += `&talla=${talla}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        productos = await res.json();
        mostrarProductos(productos);
    } catch (err) {
        console.error('Error cargando productos:', err);
        mostrarError();
    }
}

function mostrarError() {
    const lista = document.getElementById('productos-cliente');
    lista.innerHTML = `
        <div class="col-span-3 text-center py-10">
            <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p class="text-xl text-red-400">Error al cargar productos</p>
            <p class="text-gray-500">Por favor, intenta nuevamente más tarde</p>
        </div>
    `;
}

function mostrarProductos(productos) {
    const lista = document.getElementById('productos-cliente');
    lista.innerHTML = '';

    if (productos.length === 0) {
        lista.innerHTML = `
            <div class="col-span-3 text-center py-10">
                <i class="fas fa-search text-4xl text-gray-600 mb-4"></i>
                <p class="text-xl text-gray-400">No se encontraron productos</p>
                <p class="text-gray-500">Intenta con otros filtros de búsqueda</p>
            </div>
        `;
        return;
    }

    productos.forEach(p => {
        // Corregir la ruta de la imagen según tu BD
        const imgSrc = p.ImagenUrl.startsWith('http') ? p.ImagenUrl : 
                      `http://localhost:3000${p.ImagenUrl}`;

        // Extraer marca del nombre si no está en los datos
        const marca = extraerMarca(p.nombre) || p.marca || 'Genérico';

        const card = document.createElement('div');
        card.className = 'card bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col h-full';
        card.innerHTML = `
            <div class="p-4 flex justify-center items-center h-64">
                <img src="${imgSrc}" alt="${p.nombre}" 
                     class="sneaker-img w-full h-full object-contain rounded"
                     onerror="this.src='http://localhost:3000/public/Zapatillas/default.png'"/>
            </div>
            <div class="p-4 flex-grow flex flex-col">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-bold text-cyan-300">${p.nombre}</h3>
                    <span class="bg-gray-800 text-cyan-400 px-2 py-1 rounded text-sm">${marca}</span>
                </div>
                <p class="text-gray-400 text-sm mb-3 flex-grow">${p.descripcion || 'Zapatillas de alta calidad'}</p>
                <div class="mt-auto">
                    <p class="text-xl font-bold">$${p.precio.toLocaleString('es-ES')}</p>
                    ${p.stock <= 5
                        ? `<p class="text-red-500 text-xs">¡Últimas ${p.stock} unidades!</p>`
                        : `<p class="text-gray-500 text-xs">Disponibles: ${p.stock}</p>`}
                    <button onclick='verDetalle(${JSON.stringify(p).replace(/"/g, '&quot;')})' 
                            class="mt-3 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded transition">
                        Ver más
                    </button>
                </div>
            </div>
        `;
        lista.appendChild(card);
    });
}

function extraerMarca(nombre) {
    const marcas = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Asics', 'Vans', 'Converse', 'Salomon', 'Merrell', 'Hoka', 'Brooks', 'Saucony', 'Under Armour', 'Columbia'];
    for (const marca of marcas) {
        if (nombre.includes(marca)) return marca;
    }
    return null;
}

function verDetalle(producto) {
    // Corregir la ruta de la imagen según tu BD
    const imgSrc = producto.ImagenUrl.startsWith('http') ? producto.ImagenUrl : 
                  `http://localhost:3000${producto.ImagenUrl}`;

    document.getElementById('detalle-imagen').src = imgSrc;
    document.getElementById('detalle-nombre').textContent = producto.nombre;
    document.getElementById('detalle-descripcion').textContent = producto.descripcion;
    
    // Extraer marca del nombre si no está en los datos
    const marca = extraerMarca(producto.nombre) || producto.marca || 'Genérico';
    document.getElementById('detalle-marca').textContent = marca;
    
    document.getElementById('detalle-precio').textContent = `$${producto.precio.toLocaleString('es-ES')}`;
    document.getElementById('detalle-stock').textContent =
        producto.stock <= 5
            ? `¡Últimas ${producto.stock} unidades!`
            : `Disponibles: ${producto.stock}`;

    const btnAgregar = document.getElementById('btn-agregar-detalle');
    btnAgregar.onclick = () => agregarAlCarrito(producto);

    document.getElementById('modal-detalle').classList.remove('hidden');
}

function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`);
    document.getElementById('modal-detalle').classList.add('hidden');
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeInOut';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('animate-fadeOut');
        setTimeout(() => notificacion.remove(), 500);
    }, 3000);
}

function actualizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const total = document.getElementById('carrito-total');
    const count = document.getElementById('carrito-count');
    lista.innerHTML = '';

    let suma = 0;
    carrito.forEach((p, i) => {
        suma += p.precio;
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center bg-gray-800 p-4 rounded';
        item.innerHTML = `
            <div>
                <p class="font-bold">${p.nombre}</p>
                <p class="text-sm text-gray-400">${extraerMarca(p.nombre) || 'Genérico'} - $${p.precio.toLocaleString('es-ES')}</p>
            </div>
            <button onclick="eliminarDelCarrito(${i})" class="text-red-400 hover:text-red-600">
                <i class="fas fa-trash"></i>
            </button>
        `;
        lista.appendChild(item);
    });

    total.textContent = `$${suma.toLocaleString('es-ES')}`;
    count.textContent = carrito.length;
}

function eliminarDelCarrito(index) {
    const producto = carrito[index];
    carrito.splice(index, 1);
    actualizarCarrito();
    mostrarNotificacion(`${producto.nombre} eliminado del carrito`);
}

function realizarCompra() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    if (confirm('¿Confirmas que deseas realizar la compra?')) {
        // Aquí podrías agregar una llamada a tu API para procesar la compra
        alert("Compra realizada con éxito");
        carrito = [];
        actualizarCarrito();
        cerrarCarrito();
    }
}