window.onload = async () => {
  try {
    await cargarProductosCliente();
    await cargarProductosAdmin();

    document.getElementById('vista-cliente').style.display = 'block';
    document.getElementById('vista-admin').style.display = 'block';
  } catch (err) {
    console.error("❌ Error al cargar productos:", err);
  }
};

async function cargarProductosCliente() {
  const res = await fetch('/api/productos');
  const productos = await res.json();

  console.log("🛒 Productos cliente:", productos);

  const lista = document.getElementById('productos-cliente');
  lista.innerHTML = '';
  productos.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.nombre} - $${p.precio}`;
    lista.appendChild(li);
  });
}

async function cargarProductosAdmin() {
  const res = await fetch('/api/productos');
  const productos = await res.json();

  console.log("📦 Productos admin:", productos);

  const lista = document.getElementById('productos-admin');
  lista.innerHTML = '';
  productos.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.nombre} - $${p.precio} - Inventario: ${p.cantidad || 0}`;
    lista.appendChild(li);
  });
}

function logout() {
  localStorage.removeItem('usuario');
  location.reload();
}
