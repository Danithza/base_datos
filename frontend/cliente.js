// Espera a que el contenido del DOM esté cargado para ejecutar la función
window.addEventListener('DOMContentLoaded', () => {
    // Establece el texto de la etiqueta de rol
    const rolLabel = document.getElementById('rol-label');
    rolLabel.textContent = 'Rol: Cliente';
  
    // Muestra la vista para el cliente
    document.getElementById('vista-cliente').style.display = 'block';
    
    // Carga los productos cuando la página se carga
    cargarProductosCliente();
  
    // Agrega los escuchadores de eventos para filtrar los productos por categoría o búsqueda
    document.getElementById('categoria').addEventListener('change', cargarProductosCliente);
    document.getElementById('buscar').addEventListener('input', cargarProductosCliente);
  });
  
  // Función que carga los productos desde el backend y los muestra en la página
  async function cargarProductosCliente() {
    // Obtiene los valores de los filtros
    const categoria = document.getElementById('categoria')?.value || '';
    const search = document.getElementById('buscar')?.value || '';
  
    // Construye la URL con los parámetros de filtrado
    let url = `http://localhost:3000/api/productos`;
    const params = new URLSearchParams();
  
    if (categoria) params.append('categoria', categoria);
    if (search) params.append('search', search);
  
    // Agrega los parámetros a la URL si existen
    if (params.toString()) {
      url += '?' + params.toString();
    }
  
    try {
      // Realiza la petición al servidor para obtener los productos
      const res = await fetch(url);
      const productos = await res.json();
  
      // Obtiene el contenedor de productos y lo limpia
      const lista = document.getElementById('productos-cliente');
      lista.innerHTML = '';
  
      // Crea y agrega las tarjetas de productos al DOM
      productos.forEach(p => {
        const card = document.createElement('li');
        card.className = 'card bg-gray-900 p-6 rounded-lg shadow-lg';
        card.innerHTML = `
          <h3 class="text-xl font-bold mb-2 text-cyan-300">${p.nombre}</h3>
          <p class="text-gray-400">Precio: <strong>$${p.precio}</strong></p>
          <p class="text-gray-400">Categoría: <strong>${p.categoria}</strong></p>
          <p class="text-gray-400">Disponible: <strong>${p.stock}</strong></p>
          ${p.stock <= 5 ? `<p class="text-red-500">¡Quedan solo ${p.stock} unidades!</p>` : ''}
          <img src="${p.imagen}" alt="${p.nombre}" class="w-full h-40 object-cover mb-4"/>
          <button onclick="agregarAlCarrito('${p.id}', 1)" 
            class="mt-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
            Agregar al carrito
          </button>
        `;
        lista.appendChild(card);
      });
    } catch (err) {
      // Si ocurre un error al cargar los productos, muestra un mensaje en la consola
      console.error('Error cargando productos:', err);
    }
  }
  
 // Asegúrate de que este código esté en tu archivo de JS del frontend (ej. cliente.js)

async function agregarAlCarrito(idProducto, cantidad) {
    try {
      // Obtener el producto completo antes de agregarlo al carrito
      const resProducto = await fetch(`http://localhost:3000/api/productos/${idProducto}`);
      const producto = await resProducto.json();
  
      // Preparar el objeto para agregar al carrito
      const productoCarrito = {
        idProducto,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
      };
  
      // Realiza la petición POST para agregar el producto al carrito
      const res = await fetch('http://localhost:3000/api/carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoCarrito)
      });
  
      if (res.ok) {
        alert('Producto agregado al carrito');
        cargarProductosCliente(); // Refresca el stock
      } else {
        const msg = await res.text();
        alert(msg);
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    const rolLabel = document.getElementById('rol-label');
    rolLabel.textContent = 'Rol: Cliente';
  
    document.getElementById('vista-cliente').style.display = 'block';
    cargarProductosCliente();
  
    document.getElementById('categoria').addEventListener('change', cargarProductosCliente);
    document.getElementById('buscar').addEventListener('input', cargarProductosCliente);
  });
  