window.addEventListener('DOMContentLoaded', () => {
    const rolLabel = document.getElementById('rol-label');
    rolLabel.textContent = 'Rol: Administrador';
  
    document.getElementById('vista-admin').style.display = 'block';
    cargarProductosAdmin();
  });
  
  async function cargarProductosAdmin() {
    try {
      const res = await fetch('http://localhost:3000/api/productos');
      const inventario = await res.json();
  
      const lista = document.getElementById('productos-admin');
      lista.innerHTML = '';
      inventario.forEach(p => {
        const card = document.createElement('li');
        card.className = 'card bg-gray-900 p-6 rounded-lg shadow-lg';
        card.innerHTML = `
          <h3 class="text-xl font-bold mb-2 text-cyan-300">${p.nombre}</h3>
          <p class="text-gray-400">Cantidad en stock: <strong>${p.stock}</strong></p>
          <p class="text-gray-400">Categoría: <strong>${p.categoria}</strong></p>
          <img src="${p.imagen}" alt="${p.nombre}" class="w-full h-40 object-cover mt-2"/>
        `;
        lista.appendChild(card);
      });
    } catch (err) {
      console.error('Error cargando inventario:', err);
    }
  }
  
  function logout() {
    localStorage.removeItem('rol');
    window.location.href = 'index.html';
  }
  