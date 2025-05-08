let productoEditando = null;
const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('rol-label').textContent = 'Rol: Administrador';
  cargarProductosAdmin();

  document.getElementById('btn-agregar').addEventListener('click', mostrarFormularioAgregar);
  document.getElementById('form-producto').addEventListener('submit', manejarSubmit);
});

// Cargar productos desde la API
async function cargarProductosAdmin() {
  try {
    mostrarLoader(true);
    const response = await fetch(`${API_BASE_URL}/productos`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }
    
    const productos = await response.json();
    
    if (!Array.isArray(productos)) {
      throw new Error('La respuesta no es un array de productos');
    }
    
    actualizarListaProductos(productos);
  } catch (error) {
    console.error('Error al cargar productos:', error);
    mostrarError(`Error al cargar productos: ${error.message}`);
  } finally {
    mostrarLoader(false);
  }
}

// Actualizar el DOM con los productos
function actualizarListaProductos(productos) {
  const lista = document.getElementById('productos-admin');
  lista.innerHTML = '';

  if (productos.length === 0) {
    lista.innerHTML = '<li class="col-span-12 p-8 text-center text-gray-500">No hay productos registrados</li>';
    return;
  }

  productos.forEach(producto => {
    const item = document.createElement('li');
    item.className = 'grid grid-cols-12 items-center p-4 hover:bg-gray-50';
    
    // Manejo seguro de la imagen
    let imagenUrl = producto.ImagenUrl || producto.imagenUrl || '/public/Zapatillas/default.png';
    if (!imagenUrl.startsWith('http')) {
      imagenUrl = `http://localhost:3000${imagenUrl.startsWith('/') ? '' : '/'}${imagenUrl}`;
    }
    
    item.innerHTML = `
      <div class="col-span-4 flex items-center">
        <img src="${imagenUrl}" alt="${producto.nombre}" class="w-16 h-16 object-cover rounded-md mr-4" 
             onerror="this.src='http://localhost:3000/public/Zapatillas/default.png'">
        <div>
          <h3 class="font-medium">${producto.nombre || 'Sin nombre'}</h3>
          <p class="text-sm text-gray-500">${producto.marca || 'Sin marca'}</p>
        </div>
      </div>
      <div class="col-span-2 text-center">
        <span class="px-3 py-1 rounded-full text-sm font-medium ${producto.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
          ${producto.stock || 0} unidades
        </span>
      </div>
      <div class="col-span-2 text-center text-gray-600">${producto.categoria || 'Sin categoría'}</div>
      <div class="col-span-2 text-center font-medium">$${(producto.precio || 0).toLocaleString('es-ES')}</div>
      <div class="col-span-2 flex justify-center space-x-2">
        <button onclick="editarProducto(${producto.id_producto || producto.id})" class="text-blue-600 hover:text-blue-800 p-2">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="eliminarProducto(${producto.id_producto || producto.id})" class="text-red-600 hover:text-red-800 p-2">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    lista.appendChild(item);
  });
}

// Mostrar formulario para agregar
function mostrarFormularioAgregar() {
  productoEditando = null;
  document.getElementById('form-titulo').textContent = 'Agregar Nuevo Producto';
  document.getElementById('btn-submit').textContent = 'Agregar';
  document.getElementById('form-producto').reset();
  document.getElementById('modal-form').classList.remove('hidden');
}

// Enviar formulario (crear o editar)
async function manejarSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  // Convertir FormData a objeto normal
  const producto = {};
  formData.forEach((value, key) => {
    // Convertir campos numéricos
    if (key === 'precio' || key === 'stock') {
      producto[key] = Number(value);
    } else {
      producto[key] = value;
    }
  });

  // Validaciones
  if (!producto.nombre || !producto.precio || !producto.stock || !producto.categoria) {
    mostrarError('Todos los campos obligatorios deben estar completos');
    return;
  }

  if (productoEditando) {
    producto.id = productoEditando;
  }

  try {
    mostrarLoader(true);
    const url = productoEditando 
      ? `${API_BASE_URL}/productos/${productoEditando}`
      : `${API_BASE_URL}/productos`;
      
    const method = productoEditando ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    cerrarModal();
    await cargarProductosAdmin(); // Esperar a que se recarguen los productos
    mostrarExito(productoEditando ? 'Producto actualizado' : 'Producto agregado');
  } catch (error) {
    console.error('Error al guardar producto:', error);
    mostrarError(error.message || 'Error al guardar el producto');
  } finally {
    mostrarLoader(false);
  }
}

// Editar producto
async function editarProducto(id) {
  try {
    mostrarLoader(true);
    const response = await fetch(`${API_BASE_URL}/productos/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }
    
    const producto = await response.json();
    productoEditando = id;

    // Rellenar el formulario
    const form = document.getElementById('form-producto');
    form.nombre.value = producto.nombre || '';
    form.descripcion.value = producto.descripcion || '';
    form.precio.value = producto.precio || 0;
    form.stock.value = producto.stock || 0;
    form.categoria.value = producto.categoria || '';
    form.marca.value = producto.marca || '';
    
    // Manejar la URL de la imagen
    let imagenUrl = producto.ImagenUrl || producto.imagenUrl || '';
    if (imagenUrl && !imagenUrl.startsWith('http')) {
      imagenUrl = `http://localhost:3000${imagenUrl.startsWith('/') ? '' : '/'}${imagenUrl}`;
    }
    form.ImagenUrl.value = imagenUrl;

    document.getElementById('form-titulo').textContent = 'Editar Producto';
    document.getElementById('btn-submit').textContent = 'Actualizar';
    document.getElementById('modal-form').classList.remove('hidden');
  } catch (error) {
    console.error('Error al cargar producto para editar:', error);
    mostrarError(`Error al cargar producto: ${error.message}`);
  } finally {
    mostrarLoader(false);
  }
}

// Eliminar producto
async function eliminarProducto(id) {
  if (!confirm('¿Está seguro de eliminar este producto?')) return;

  try {
    mostrarLoader(true);
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }
    
    await cargarProductosAdmin(); // Esperar a que se recarguen los productos
    mostrarExito('Producto eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    mostrarError(`Error al eliminar: ${error.message}`);
  } finally {
    mostrarLoader(false);
  }
}

// Funciones auxiliares (sin cambios)
function mostrarLoader(mostrar) {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = mostrar ? 'block' : 'none';
}

function cerrarModal() {
  document.getElementById('modal-form').classList.add('hidden');
}

function mostrarError(mensaje) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = mensaje;
  errorDiv.classList.remove('hidden');
  setTimeout(() => errorDiv.classList.add('hidden'), 5000);
}

function mostrarExito(mensaje) {
  const exitoDiv = document.getElementById('success-message');
  exitoDiv.textContent = mensaje;
  exitoDiv.classList.remove('hidden');
  setTimeout(() => exitoDiv.classList.add('hidden'), 3000);
}

function logout() {
  localStorage.removeItem('rol');
  window.location.href = 'index.html';
}