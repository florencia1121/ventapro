import { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'ventapro-demo-v1';
const money = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(value) || 0);
const dateTime = (value) => new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
const id = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
const PRODUCT_PHOTOS = {
  jacket: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85',
  lamp: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85',
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85',
  bottle: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85',
  shirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85',
  watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85',
  speaker: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=85',
  fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85',
};
const DEMO_PRODUCT_PHOTOS = {
  'VP-001': PRODUCT_PHOTOS.jacket,
  'VP-002': PRODUCT_PHOTOS.headphones,
  'VP-003': PRODUCT_PHOTOS.lamp,
  'VP-004': PRODUCT_PHOTOS.backpack,
  'VP-005': PRODUCT_PHOTOS.bottle,
  'VP-006': PRODUCT_PHOTOS.shirt,
  'VP-007': PRODUCT_PHOTOS.watch,
  'VP-008': PRODUCT_PHOTOS.speaker,
};
const imageFor = (category, name = '') => {
  const productName = name.toLocaleLowerCase('es');
  if (/auricular|headphone/.test(productName)) return PRODUCT_PHOTOS.headphones;
  if (/parlante|speaker/.test(productName)) return PRODUCT_PHOTOS.speaker;
  if (/l[aá]mpara|lamp/.test(productName)) return PRODUCT_PHOTOS.lamp;
  if (/botella|termo/.test(productName)) return PRODUCT_PHOTOS.bottle;
  if (/mochila|backpack|bolso/.test(productName)) return PRODUCT_PHOTOS.backpack;
  if (/reloj|watch/.test(productName)) return PRODUCT_PHOTOS.watch;
  if (/remera|camiseta|shirt/.test(productName)) return PRODUCT_PHOTOS.shirt;
  if (/campera|buzo|chaqueta|jacket/.test(productName)) return PRODUCT_PHOTOS.jacket;
  return ({
    Indumentaria: PRODUCT_PHOTOS.fashion,
    Accesorios: PRODUCT_PHOTOS.backpack,
    Electrónica: PRODUCT_PHOTOS.headphones,
    Hogar: PRODUCT_PHOTOS.lamp,
  }[category] || PRODUCT_PHOTOS.fashion);
};

function demoData() {
  const productRows = [
    ['VP-001', 'Campera vintage', 'Indumentaria', 'Denim rígido · fit relajado', 38000, 68900, 14, 5],
    ['VP-002', 'Auriculares Studio', 'Electrónica', 'Sonido inmersivo · Bluetooth', 22000, 38900, 3, 5],
    ['VP-003', 'Lámpara Nórdica', 'Hogar', 'Cerámica artesanal · luz cálida', 12400, 24900, 18, 6],
    ['VP-004', 'Mochila Weekend', 'Accesorios', 'Lona impermeable · edición oliva', 16800, 31900, 9, 4],
    ['VP-005', 'Botella térmica', 'Hogar', 'Acero inoxidable · 750 ml', 8700, 16900, 2, 5],
    ['VP-006', 'Remera Essential', 'Indumentaria', 'Algodón premium · color natural', 6800, 14900, 26, 8],
    ['VP-007', 'Reloj Minimal', 'Accesorios', 'Malla de acero · diseño clásico', 27500, 49900, 7, 3],
    ['VP-008', 'Parlante portátil', 'Electrónica', 'Sonido estéreo · 12 h de batería', 31500, 56900, 11, 4],
  ];
  const products = productRows.map(([sku, name, category, description, cost, price, stock, minStock], index) => ({
    id: `prod-${index + 1}`, sku, name, category, description, cost, price, stock, minStock,
    image: DEMO_PRODUCT_PHOTOS[sku], createdAt: new Date(Date.now() - (45 - index) * 86400000).toISOString(),
  }));
  const sales = [];
  const sampleItems = [[0, 1], [3, 0], [5, 7], [2, 1], [1, 4], [7, 0], [4, 5], [6, 3], [3, 5], [0, 2], [7, 1], [2, 5], [5, 0], [1, 3], [6, 0], [4, 2]];
  sampleItems.forEach(([productIndex, daysAgo], index) => {
    const product = products[productIndex];
    const quantity = 1 + (index % 2);
    const date = new Date(Date.now() - daysAgo * 86400000);
    date.setHours(9 + (index % 9), (index * 13) % 60, 0, 0);
    sales.push({
      id: `sale-${index + 1}`, number: `VP-${String(1001 + index).padStart(5, '0')}`,
      date: date.toISOString(), items: [{ productId: product.id, sku: product.sku, name: product.name, quantity, unitPrice: product.price, unitCost: product.cost }],
      subtotal: product.price * quantity, discount: index % 4 === 0 ? 1000 : 0,
      total: product.price * quantity - (index % 4 === 0 ? 1000 : 0),
      payment: ['Efectivo', 'Transferencia', 'Débito', 'Crédito'][index % 4],
      clientId: '', clientName: '', status: 'Completada',
    });
  });
  return {
    products, sales,
    movements: [
      { id: 'mov-1', productId: products[1].id, productName: products[1].name, type: 'Salida', quantity: 2, reason: 'Venta registrada', date: new Date(Date.now() - 86400000).toISOString() },
      { id: 'mov-2', productId: products[4].id, productName: products[4].name, type: 'Entrada', quantity: 5, reason: 'Reposición inicial', date: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: 'mov-3', productId: products[0].id, productName: products[0].name, type: 'Entrada', quantity: 8, reason: 'Ingreso de mercadería', date: new Date(Date.now() - 4 * 86400000).toISOString() },
    ],
    clients: [
      { id: 'client-1', name: 'Lucía Fernández', dni: '32.456.789', phone: '11 4567-8910', email: 'lucia@email.com' },
      { id: 'client-2', name: 'Mateo González', dni: '29.123.456', phone: '11 6123-4567', email: 'mateo@email.com' },
      { id: 'client-3', name: 'Valentina Ruiz', dni: '35.987.654', phone: '351 555-0123', email: 'valentina@email.com' },
    ],
    settings: { business: 'Casa Nativa', owner: 'Florencia', phone: '11 4000-1234', discount: 0 },
  };
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return demoData();
    const parsed = JSON.parse(saved);
    if (!parsed.products || !parsed.sales || !parsed.movements || !parsed.clients || !parsed.settings) return demoData();
    return { ...parsed, products: parsed.products.map((product) => ({
      ...product,
      image: DEMO_PRODUCT_PHOTOS[product.sku] || product.image || imageFor(product.category, product.name),
    })) };
  } catch (error) {
    console.error('No se pudieron cargar los datos guardados de VentaPro:', error);
    return demoData();
  }
}

const NAV = [
  { id: 'new-sale', label: 'Caja', mark: '01' },
  { id: 'products', label: 'Productos', mark: '02' },
  { id: 'history', label: 'Ventas', mark: '03' },
  { id: 'clients', label: 'Clientes', mark: '04' },
  { id: 'reports', label: 'Informes', mark: '05' },
];

const ICON_PATHS = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></>,
  receipt: <><path d="M4 3h16v18l-4-2-4 2-4-2-4 2V3Z" /><path d="M8 8h8M8 12h8M8 16h4" /></>,
  box: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" /></>,
  chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-5 5" /></>,
  user: <><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="8" r="4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19 13.5 1.2.9-1.2 2.1-1.5-.5a7 7 0 0 1-1.4.8l-.3 1.6h-2.5l-.3-1.6a7 7 0 0 1-1.5-.8l-1.4.5-1.2-2.1 1.2-.9a6 6 0 0 1 0-1.7l-1.2-.9 1.2-2.1 1.5.5a7 7 0 0 1 1.4-.8l.3-1.6h2.5l.3 1.6a7 7 0 0 1 1.5.8l1.4-.5 1.2 2.1-1.2.9a6 6 0 0 1 0 1.7Z" /></>,
  arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
  print: <><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></>,
};

function Icon({ name, size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON_PATHS[name] || ICON_PATHS.box}</svg>;
}

function ProductPhoto({ product, className = '' }) {
  return <div className={`product-photo ${className}`}><img src={product.image || imageFor(product.category, product.name)} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><span>{product.category}</span></div>;
}

function Chart({ data, color = '#d86a45', format = money }) {
  const [hover, setHover] = useState(null);
  const width = 650;
  const height = 220;
  const pad = { top: 17, right: 15, bottom: 30, left: 12 };
  const values = data.map((item) => Number(item.value) || 0);
  const max = Math.max(...values, 1) * 1.2;
  const x = (index) => pad.left + index * ((width - pad.left - pad.right) / Math.max(values.length - 1, 1));
  const y = (value) => pad.top + (height - pad.top - pad.bottom) * (1 - value / max);
  const points = values.map((value, index) => `${x(index)},${y(value)}`).join(' ');
  return <div className="chart-wrap"><svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label="Gráfico de ingresos">
    {[0, 1, 2, 3].map((line) => <line key={line} x1={pad.left} x2={width - pad.right} y1={pad.top + line * ((height - pad.top - pad.bottom) / 3)} y2={pad.top + line * ((height - pad.top - pad.bottom) / 3)} className="chart-grid" />)}
    <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {data.map((item, index) => <g key={`${item.label}-${index}`} className="chart-point" onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)}>
      <circle cx={x(index)} cy={y(values[index])} r={hover === index ? 6 : 4} fill={color} stroke="#fffaf4" strokeWidth="3" />
      <rect x={x(index) - 18} y="0" width="36" height={height - pad.bottom} fill="transparent" />
      {hover === index && <g><rect x={Math.min(Math.max(x(index) - 61, 2), width - 126)} y={Math.max(y(values[index]) - 39, 0)} width="124" height="28" rx="7" fill="#34302b" /><text x={Math.min(Math.max(x(index) - 51, 12), width - 116)} y={Math.max(y(values[index]) - 21, 18)} fill="#fffaf4" fontSize="11">{`${item.label}: ${format(values[index])}`}</text></g>}
    </g>)}
    {data.map((item, index) => <text key={`label-${index}`} x={x(index)} y={height - 7} textAnchor="middle" className="chart-label">{item.label}</text>)}
  </svg></div>;
}

function Modal({ title, subtitle, onClose, children, wide = false }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true">
    <div className="modal-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-btn" onClick={onClose} aria-label="Cerrar"><Icon name="close" /></button></div>
    {children}
  </div></div>;
}

function App() {
  const [data, setData] = useState(loadData);
  const [page, setPage] = useState('new-sale');
  const searchInputRef = useRef(null);
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState('');
  const [payment, setPayment] = useState('Efectivo');
  const [selectedClient, setSelectedClient] = useState('');
  const [historyFilter, setHistoryFilter] = useState('Todas');
  const [reportPeriod, setReportPeriod] = useState('7 días');
  const [inventoryFilter, setInventoryFilter] = useState('Todos');
  const [clientSearch, setClientSearch] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (error) { console.error('No se pudieron guardar los datos de VentaPro:', error); notify('No se pudieron guardar los cambios en este dispositivo.'); }
  }, [data]);
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 3400);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    const handleSearchShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPage('new-sale');
        window.requestAnimationFrame(() => searchInputRef.current?.focus());
      }
    };
    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  const notify = (message) => setToast(message);
  const update = (key, value) => setData((current) => ({ ...current, [key]: value }));
  const categories = useMemo(() => ['Todas', ...new Set(data.products.map((product) => product.category))], [data.products]);
  const lowStock = data.products.filter((product) => product.stock <= product.minStock);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = Math.min(Math.max(Number(discount) || 0, 0), cartSubtotal);
  const saleTotal = cartSubtotal - discountAmount;
  const completedSales = data.sales.filter((sale) => sale.status !== 'Cancelada');
  const monthSales = completedSales.filter((sale) => {
    const date = new Date(sale.date);
    const current = new Date();
    return date.getMonth() === current.getMonth() && date.getFullYear() === current.getFullYear();
  });
  const monthRevenue = monthSales.reduce((sum, sale) => sum + sale.total, 0);
  const monthCost = monthSales.reduce((sum, sale) => sum + sale.items.reduce((cost, item) => cost + item.unitCost * item.quantity, 0), 0);
  const monthProfit = monthSales.reduce((sum, sale) => sum + sale.items.reduce((profit, item) => profit + (item.unitPrice - item.unitCost) * item.quantity, 0) - sale.discount, 0);
  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() - (6 - index));
    const amount = completedSales.filter((sale) => new Date(sale.date).toDateString() === date.toDateString()).reduce((sum, sale) => sum + sale.total, 0);
    return { label: new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(date).replace('.', ''), value: amount };
  });
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(); date.setMonth(date.getMonth() - (5 - index));
    const amount = completedSales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === date.getMonth() && saleDate.getFullYear() === date.getFullYear();
    }).reduce((sum, sale) => sum + sale.total, 0);
    return { label: new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(date).replace('.', ''), value: amount };
  });
  const topProducts = useMemo(() => {
    const sold = {};
    completedSales.forEach((sale) => sale.items.forEach((item) => { sold[item.productId] = (sold[item.productId] || 0) + item.quantity; }));
    return data.products.map((product) => ({ ...product, sold: sold[product.id] || 0 })).sort((a, b) => b.sold - a.sold).slice(0, 5);
  }, [data.products, data.sales]);
  const filteredProducts = data.products.filter((product) => {
    const matches = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || product.category === categoryFilter;
    const matchesStock = page !== 'products' || inventoryFilter === 'Todos' || (inventoryFilter === 'Stock bajo' ? product.stock <= product.minStock : product.stock === 0);
    return matches && matchesCategory && matchesStock;
  });
  const filteredSales = data.sales.filter((sale) => (historyFilter === 'Todas' || sale.payment === historyFilter) && (!search || `${sale.number} ${sale.clientName}`.toLowerCase().includes(search.toLowerCase())));

  const resetDemo = () => {
    if (!window.confirm('¿Restablecer la demo? Se reemplazarán los cambios por los datos de ejemplo.')) return;
    setData(demoData()); setCart([]); setModal(null); notify('Demo restablecida con datos de ejemplo.');
  };

  const saveProduct = (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries());
    const existing = modal.product;
    const product = {
      id: existing?.id || id('prod'), sku: fields.sku.trim(), name: fields.name.trim(), category: fields.category,
      description: fields.description.trim(), image: fields.image.trim() || imageFor(fields.category, fields.name),
      cost: Number(fields.cost), price: Number(fields.price), stock: Number(fields.stock), minStock: Number(fields.minStock),
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    if (!product.sku || !product.name || product.price <= 0 || product.cost < 0 || product.stock < 0 || product.minStock < 0) { notify('Revisá los campos: nombre y código son obligatorios; el precio debe ser mayor a cero.'); return; }
    if (data.products.some((item) => item.sku.toLowerCase() === product.sku.toLowerCase() && item.id !== product.id)) { notify('Ya existe un producto con ese código.'); return; }
    update('products', existing ? data.products.map((item) => item.id === product.id ? product : item) : [product, ...data.products]);
    if (!existing) update('movements', [{ id: id('mov'), productId: product.id, productName: product.name, type: 'Entrada', quantity: product.stock, reason: 'Alta de producto', date: new Date().toISOString() }, ...data.movements]);
    setModal(null); notify(existing ? 'Producto actualizado.' : 'Producto agregado al catálogo.');
  };

  const deleteProduct = (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    update('products', data.products.filter((item) => item.id !== product.id));
    setCart((current) => current.filter((item) => item.productId !== product.id));
    notify('Producto eliminado.');
  };

  const changeCart = (product, amount) => {
    const existing = cart.find((item) => item.productId === product.id);
    const nextQuantity = (existing?.quantity || 0) + amount;
    if (nextQuantity > product.stock) { notify(`Stock insuficiente. Disponibles: ${product.stock} unidades.`); return; }
    setCart((current) => {
      if (!existing && amount > 0) return [...current, { productId: product.id, name: product.name, sku: product.sku, image: product.image, unitPrice: product.price, unitCost: product.cost, quantity: amount }];
      return current.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0);
    });
  };

  const completeSale = () => {
    if (!cart.length) { notify('Agregá al menos un producto para continuar.'); return; }
    const invalid = cart.find((item) => !data.products.some((product) => product.id === item.productId && product.stock >= item.quantity));
    if (invalid) { notify(`No hay stock suficiente de ${invalid.name}. Actualizá el carrito.`); return; }
    const client = data.clients.find((item) => item.id === selectedClient);
    const sale = {
      id: id('sale'), number: `VP-${String(1001 + data.sales.length).padStart(5, '0')}`, date: new Date().toISOString(),
      items: cart.map((item) => ({ ...item })), subtotal: cartSubtotal, discount: discountAmount, total: saleTotal,
      payment, clientId: client?.id || '', clientName: client?.name || '', status: 'Completada',
    };
    update('sales', [sale, ...data.sales]);
    update('products', data.products.map((product) => {
      const soldItem = cart.find((item) => item.productId === product.id);
      return soldItem ? { ...product, stock: product.stock - soldItem.quantity } : product;
    }));
    update('movements', [...cart.map((item) => ({ id: id('mov'), productId: item.productId, productName: item.name, type: 'Salida', quantity: item.quantity, reason: `Venta ${sale.number}`, date: sale.date })), ...data.movements]);
    setCart([]); setDiscount(''); setSelectedClient(''); setModal({ type: 'sale-detail', sale, success: true }); notify(`¡Cobro de ${money(sale.total)} registrado!`);
  };

  const addStock = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const product = data.products.find((item) => item.id === form.get('productId'));
    const quantity = Number(form.get('quantity'));
    const reason = form.get('reason').trim();
    if (!product || !Number.isInteger(quantity) || quantity < 1 || !reason) { notify('Elegí un producto, una cantidad válida y el motivo de ingreso.'); return; }
    update('products', data.products.map((item) => item.id === product.id ? { ...item, stock: item.stock + quantity } : item));
    update('movements', [{ id: id('mov'), productId: product.id, productName: product.name, type: 'Entrada', quantity, reason, date: new Date().toISOString() }, ...data.movements]);
    setModal(null); notify(`Se sumaron ${quantity} unidades de ${product.name}.`);
  };

  const cancelSale = (sale) => {
    if (sale.status === 'Cancelada') { notify('Esta venta ya fue cancelada.'); return; }
    if (!window.confirm(`¿Cancelar ${sale.number}? Los productos volverán al inventario.`)) return;
    const now = new Date().toISOString();
    update('sales', data.sales.map((item) => item.id === sale.id ? { ...item, status: 'Cancelada', cancelledAt: now } : item));
    update('products', data.products.map((product) => {
      const returned = sale.items.find((item) => item.productId === product.id);
      return returned ? { ...product, stock: product.stock + returned.quantity } : product;
    }));
    update('movements', [...sale.items.map((item) => ({ id: id('mov'), productId: item.productId, productName: item.name, type: 'Entrada', quantity: item.quantity, reason: `Devolución ${sale.number}`, date: now })), ...data.movements]);
    setModal(null); notify(`Venta ${sale.number} cancelada y stock restituido.`);
  };

  const saveClient = (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries());
    const client = { id: modal.client?.id || id('client'), name: fields.name.trim(), dni: fields.dni.trim(), phone: fields.phone.trim(), email: fields.email.trim() };
    if (!client.name || !client.phone || (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email))) { notify('Ingresá un nombre, un teléfono y un correo válido.'); return; }
    update('clients', modal.client ? data.clients.map((item) => item.id === client.id ? client : item) : [client, ...data.clients]);
    setModal(null); notify(modal.client ? 'Cliente actualizado.' : 'Cliente registrado.');
  };

  const deleteClient = (client) => {
    if (!window.confirm(`¿Eliminar a ${client.name}? El historial de ventas se conservará.`)) return;
    update('clients', data.clients.filter((item) => item.id !== client.id)); notify('Cliente eliminado.');
  };

  const downloadCsv = () => {
    const rows = [['N.º venta', 'Fecha', 'Cliente', 'Productos', 'Subtotal', 'Descuento', 'Total', 'Método de pago', 'Estado'], ...data.sales.map((sale) => [sale.number, dateTime(sale.date), sale.clientName || 'Consumidor final', sale.items.map((item) => `${item.name} x${item.quantity}`).join(' | '), sale.subtotal, sale.discount, sale.total, sale.payment, sale.status])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'ventapro-informe-ventas.csv'; link.click(); URL.revokeObjectURL(link.href); notify('Informe CSV descargado.');
  };

  const goTo = (nextPage) => { setPage(nextPage); setSearch(''); setCategoryFilter('Todas'); setInventoryFilter('Todos'); };
  const visibleSaleProducts = data.products.filter((product) => `${product.name} ${product.sku}`.toLowerCase().includes(search.toLowerCase()) && (categoryFilter === 'Todas' || product.category === categoryFilter));
  const pageHeadings = { products: ['Tu catálogo', 'Productos y disponibilidad en un solo lugar.'], history: ['Registro de ventas', 'Cada operación, ordenada para encontrarla rápido.'], clients: ['Personas que vuelven', 'Un directorio simple para conocer mejor a tus clientes.'], reports: ['Pulso comercial', 'Una lectura clara de cómo se mueve tu negocio.'], settings: ['Tu tienda, a tu manera', 'Datos visibles en los comprobantes de venta.'] };
  const todayLabel = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  return <div className="store-app">
    <header className="store-header">
      <button className="wordmark" onClick={() => goTo('new-sale')} aria-label="Ir a Caja"><span className="wordmark-symbol">v<span>.</span></span><span className="wordmark-name">VentaPro<small>FC DEV STUDIO</small></span></button>
      <nav className="main-nav" aria-label="Navegación principal">{NAV.map((item) => <button key={item.id} onClick={() => goTo(item.id)} className={page === item.id ? 'selected' : ''}><span className="nav-mark">{item.mark}</span>{item.label}{item.id === 'new-sale' && cart.length > 0 && <i className="nav-cart-count">{cart.reduce((sum, itemInCart) => sum + itemInCart.quantity, 0)}</i>}</button>)}</nav>
      <div className="header-right"><span className="store-name">{data.settings.business}</span><button className={`stock-alert ${lowStock.length ? 'has-alert' : ''}`} onClick={() => { goTo('products'); setInventoryFilter('Stock bajo'); }} title={`${lowStock.length} productos con stock bajo`}><Icon name="box" size={17} /><span>{lowStock.length}</span></button><button className="header-settings" onClick={() => goTo('settings')} aria-label="Configuración"><Icon name="settings" size={17} /></button><div className="header-avatar" title={data.settings.owner}>{(data.settings.owner || 'F').slice(0, 1).toUpperCase()}</div></div>
    </header>
    <main className="store-main">
      {page === 'new-sale' && <section className="checkout-page">
        <div className="cashier-workspace">
          <div className="cashier-intro"><div><div className="section-kicker">PUNTO DE VENTA <span>·</span> {todayLabel}</div><h1>¿Qué lleva hoy?</h1><p>Buscá, elegí y cobrá. El stock se actualiza con cada venta.</p></div><div className="today-chip"><span className="open-indicator" />Caja abierta <span className="chip-divider" />{completedSales.length} ventas registradas</div></div>
          <div className="catalog-tools"><label className="catalog-search"><Icon name="search" size={18} /><input ref={searchInputRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar prenda, accesorio o código..." /><kbd>⌘ K</kbd></label><span className="catalog-count">{visibleSaleProducts.length} artículos</span></div>
          <div className="category-tabs">{categories.map((category) => <button key={category} onClick={() => setCategoryFilter(category)} className={categoryFilter === category ? 'chosen' : ''}>{category}<span>{category === 'Todas' ? data.products.length : data.products.filter((product) => product.category === category).length}</span></button>)}</div>
          <div className="pos-product-grid">{visibleSaleProducts.map((product) => {
            const quantityInCart = cart.find((item) => item.productId === product.id)?.quantity || 0;
            return <article className={`pos-product-card ${product.stock <= product.minStock ? 'product-attention' : ''}`} key={product.id}>
              <button className="product-card-button" onClick={() => changeCart(product, 1)} disabled={product.stock === 0} aria-label={`Agregar ${product.name} al carrito`}>
                <ProductPhoto product={product} />
                <div className="pos-product-copy"><span className="pos-sku">{product.sku}</span><h3>{product.name}</h3><div className="product-price-line"><b>{money(product.price)}</b><span className={product.stock <= product.minStock ? 'stock-warning' : ''}>{product.stock === 0 ? 'Agotado' : `${product.stock} disponibles`}</span></div></div>
              </button>
              {quantityInCart > 0 ? <div className="card-quantity"><button onClick={() => changeCart(product, -1)} aria-label="Quitar unidad"><Icon name="minus" size={14} /></button><b>{quantityInCart} en carrito</b><button onClick={() => changeCart(product, 1)} aria-label="Agregar unidad"><Icon name="plus" size={14} /></button></div> : <button className="add-product" onClick={() => changeCart(product, 1)} disabled={product.stock === 0}><Icon name="plus" size={15} /> Añadir</button>}
            </article>;
          })}{visibleSaleProducts.length === 0 && <EmptyState title="No hay productos con esta búsqueda" subtitle="Probá con otro nombre o categoría." />}</div>
        </div>
        <aside className="checkout-aside">
          <div className="order-head"><div><span className="section-kicker">VENTA ACTUAL</span><h2>Tu pedido</h2></div><span className="item-count">{cart.reduce((sum, item) => sum + item.quantity, 0)} <small>items</small></span></div>
          <label className="field-label">Cliente <span>OPCIONAL</span><select value={selectedClient} onChange={(event) => setSelectedClient(event.target.value)}><option value="">Venta al público</option>{data.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label>
          {cart.length === 0 ? <div className="order-empty"><div className="empty-bag"><Icon name="cart" size={24} /></div><b>El pedido está vacío</b><span>Tocá un producto para sumarlo acá.</span></div> : <div className="order-items">{cart.map((item) => {
            const product = data.products.find((entry) => entry.id === item.productId);
            return <div className="order-item" key={item.productId}><div className="order-thumb"><img src={item.image || product?.image} alt="" /></div><div className="order-item-info"><b>{item.name}</b><small>{money(item.unitPrice)} c/u</small><div className="order-stepper"><button onClick={() => changeCart(product, -1)} aria-label="Restar">−</button><span>{item.quantity}</span><button onClick={() => changeCart(product, 1)} aria-label="Sumar">+</button></div></div><div className="order-item-price"><b>{money(item.unitPrice * item.quantity)}</b><button onClick={() => setCart((current) => current.filter((entry) => entry.productId !== item.productId))} aria-label={`Quitar ${item.name}`}><Icon name="close" size={14} /></button></div></div>;
          })}</div>}
          {cart.length > 0 && <button className="clear-order" onClick={() => { if (window.confirm('¿Vaciar el pedido actual?')) { setCart([]); setDiscount(''); } }}><Icon name="close" size={14} /> Cancelar pedido</button>}
          <div className="order-options"><label className="field-label">Forma de pago<select value={payment} onChange={(event) => setPayment(event.target.value)}>{['Efectivo', 'Transferencia', 'Débito', 'Crédito'].map((method) => <option key={method}>{method}</option>)}</select></label><label className="field-label discount-field">Descuento <div className="discount-control"><span>$</span><input aria-label="Descuento en pesos" type="number" min="0" max={cartSubtotal} value={discount} onChange={(event) => setDiscount(event.target.value)} placeholder="0" /></div></label></div>
          <div className="order-summary"><div><span>Subtotal</span><b>{money(cartSubtotal)}</b></div><div><span>Descuento aplicado</span><b>− {money(discountAmount)}</b></div><div className="summary-total"><span>Total</span><b>{money(saleTotal)}</b></div></div>
          <button className="charge-button" onClick={completeSale} disabled={!cart.length}><span>Cobrar pedido</span><b>{money(saleTotal)} <Icon name="arrow" size={16} /></b></button><p className="checkout-footnote">El inventario se actualiza automáticamente al cobrar.</p>
        </aside>
      </section>}

      {page !== 'new-sale' && <section className="secondary-page">
        <div className="secondary-heading"><div><span className="section-kicker">VENTAPRO <span>·</span> {page.toUpperCase()}</span><h1>{pageHeadings[page]?.[0]}</h1><p>{pageHeadings[page]?.[1]}</p></div>{page === 'products' && <button className="coral-button" onClick={() => setModal({ type: 'product', product: null })}><Icon name="plus" /> Nuevo producto</button>}{page === 'clients' && <button className="coral-button" onClick={() => setModal({ type: 'client', client: null })}><Icon name="plus" /> Agregar cliente</button>}</div>

        {page === 'products' && <>
          <div className="catalog-overview"><div><span>PRODUCTOS ACTIVOS</span><b>{data.products.length}</b></div><div><span>STOCK POR REPONER</span><b className={lowStock.length ? 'coral-text' : ''}>{lowStock.length}</b></div><div><span>VALOR DEL INVENTARIO</span><b>{money(data.products.reduce((sum, product) => sum + product.cost * product.stock, 0))}</b></div><div className="stock-overview-note">Costos de compra estimados para valoración.</div></div>
          <div className="catalog-toolbar"><label className="catalog-search"><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Encontrar producto o código..." /></label><select className="soft-select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select><select className="soft-select" value={inventoryFilter} onChange={(event) => setInventoryFilter(event.target.value)}><option>Todos</option><option>Stock bajo</option><option>Sin existencias</option></select><span className="catalog-count">{filteredProducts.length} productos</span></div>
          <div className="visual-catalog">{filteredProducts.map((product) => <article className="catalog-card" key={product.id}><ProductPhoto product={product} /><div className="catalog-card-content"><div className="catalog-card-top"><span className="pos-sku">{product.sku}</span><span className={`catalog-stock ${product.stock <= product.minStock ? 'stock-warning' : ''}`}>{product.stock === 0 ? 'Agotado' : `${product.stock} en stock`}</span></div><h3>{product.name}</h3><p>{product.description}</p><div className="catalog-card-footer"><div><small>Venta</small><b>{money(product.price)}</b></div><div><small>Costo</small><b>{money(product.cost)}</b></div><div className="card-actions"><button onClick={() => setModal({ type: 'stock', product })} title="Ingresar mercadería"><Icon name="box" size={15} /></button><button onClick={() => setModal({ type: 'product', product })} title="Editar producto"><span>Editar</span></button><button className="delete-product" onClick={() => deleteProduct(product)} title="Eliminar producto"><Icon name="close" size={14} /></button></div></div></div></article>)}{filteredProducts.length === 0 && <EmptyState title="No encontramos productos" subtitle="Ajustá los filtros o agregá un producto nuevo." />}</div>
          <div className="movements-preview"><div className="subsection-head"><div><span className="section-kicker">CONTROL DE MERCADERÍA</span><h2>Últimos movimientos</h2></div><span>{data.movements.length} movimientos</span></div><div className="movement-list">{data.movements.slice(0, 5).map((movement) => <div className="movement-row" key={movement.id}><span className={`movement-sign ${movement.type === 'Entrada' ? 'movement-in' : 'movement-out'}`}>{movement.type === 'Entrada' ? '+' : '−'}</span><div><b>{movement.productName}</b><small>{movement.reason} · {dateTime(movement.date)}</small></div><strong>{movement.type === 'Entrada' ? '+' : '−'}{movement.quantity}</strong></div>)}</div></div>
        </>}

        {page === 'history' && <div className="history-layout"><div className="sales-ledger"><div className="ledger-tools"><label className="catalog-search"><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="N.º de operación o cliente..." /></label><select className="soft-select" value={historyFilter} onChange={(event) => setHistoryFilter(event.target.value)}><option>Todas</option>{['Efectivo', 'Transferencia', 'Débito', 'Crédito'].map((method) => <option key={method}>{method}</option>)}</select></div><div className="ledger-list">{filteredSales.map((sale) => <button className="ledger-entry" key={sale.id} onClick={() => setModal({ type: 'sale-detail', sale })}><span className={`ledger-icon ${sale.status === 'Cancelada' ? 'ledger-cancelled' : ''}`}><Icon name="receipt" size={17} /></span><span className="ledger-info"><b>{sale.number}<i className={sale.status === 'Cancelada' ? 'status-dot cancelled-dot' : 'status-dot'} /></b><small>{dateTime(sale.date)} · {sale.clientName || 'Venta al público'}</small></span><span className="ledger-payment">{sale.payment}<small>{sale.items.reduce((sum, item) => sum + item.quantity, 0)} artículos</small></span><strong className={sale.status === 'Cancelada' ? 'cancelled-value' : ''}>{money(sale.total)}</strong><span className="ledger-arrow">↗</span></button>)}{filteredSales.length === 0 && <EmptyState title="Todavía no hay operaciones" subtitle="Las ventas cobradas aparecerán en este registro." />}</div><div className="ledger-foot">{filteredSales.length} operaciones encontradas</div></div><aside className="ledger-aside"><span className="section-kicker">RESUMEN DE CAJA</span><h2>Actividad reciente</h2><div className="ledger-total"><small>Ingresos del mes</small><b>{money(monthRevenue)}</b><span>{monthSales.length} ventas completadas</span></div><div className="ledger-total ledger-cost"><small>Ganancia bruta estimada</small><b>{money(monthProfit)}</b><span>Ingresos menos costos y descuentos</span></div><div className="ledger-note">Las ventas canceladas conservan su registro y devuelven las unidades al inventario una sola vez.</div></aside></div>}

        {page === 'clients' && <div className="clients-layout"><div className="client-directory"><div className="ledger-tools"><label className="catalog-search"><Icon name="search" /><input value={clientSearch} onChange={(event) => setClientSearch(event.target.value)} placeholder="Buscar nombre, DNI o correo..." /></label><span className="catalog-count">{data.clients.length} clientes</span></div><div className="client-list">{data.clients.filter((client) => `${client.name} ${client.dni} ${client.email}`.toLowerCase().includes(clientSearch.toLowerCase())).map((client, index) => { const purchases = data.sales.filter((sale) => sale.clientId === client.id); return <article className="client-card" key={client.id}><div className={`client-initial client-initial-${index % 4}`}>{client.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div className="client-details"><div><h3>{client.name}</h3><span>{client.dni || 'Sin identificación'}</span></div><p>{client.phone} <span>·</span> {client.email || 'Sin correo'}</p><small>{purchases.length} compras registradas{purchases.length ? ` · ${money(purchases.reduce((sum, sale) => sum + sale.total, 0))}` : ''}</small></div><div className="client-actions"><button onClick={() => setModal({ type: 'client', client })}>Editar</button><button className="delete-product" onClick={() => deleteClient(client)}>Quitar</button></div></article>; })}{!data.clients.length && <EmptyState title="Sin clientes todavía" subtitle="Agregá el primero para empezar tu directorio." />}</div></div><aside className="client-aside"><div className="client-aside-art"><span>FIEL A TU TIENDA</span><b>Las mejores ventas empiezan con una buena conversación.</b><i>“</i></div><div className="client-aside-stat"><span>VENTAS CON CLIENTE ASOCIADO</span><b>{data.sales.filter((sale) => sale.clientId).length}</b><small>Asociá clientes en caja al momento de cobrar.</small></div></aside></div>}

        {page === 'reports' && <div className="reports-view"><div className="report-toolbar"><div><span className="section-kicker">RESULTADOS DEL NEGOCIO</span><h2>Un mes con movimiento.</h2><p>Ingresos, costos y ganancia se muestran por separado.</p></div><div className="report-controls"><select className="soft-select" value={reportPeriod} onChange={(event) => setReportPeriod(event.target.value)}><option>7 días</option><option>Este mes</option><option>6 meses</option></select><button className="outline-button" onClick={downloadCsv}><Icon name="download" size={16} /> Exportar CSV</button></div></div><div className="report-kpis"><article className="report-kpi revenue-kpi"><span>INGRESOS BRUTOS</span><b>{money(monthRevenue)}</b><small>Ventas completadas del mes</small><i>↗</i></article><article className="report-kpi"><span>COSTO DE MERCADERÍA</span><b>{money(monthCost)}</b><small>Costo de compra registrado</small><i>−</i></article><article className="report-kpi profit-kpi"><span>GANANCIA BRUTA ESTIMADA</span><b>{money(monthProfit)}</b><small>Ingresos − costos − descuentos</small><i>↗</i></article></div><div className="report-columns"><article className="report-paper"><div className="report-card-head"><div><span className="section-kicker">EVOLUCIÓN</span><h3>{reportPeriod === '6 meses' ? 'Ingresos por mes' : reportPeriod === 'Este mes' ? 'Actividad del mes' : 'Ventas de los últimos 7 días'}</h3></div><span className="chart-unit">ARS <i /></span></div><Chart data={reportPeriod === '6 meses' ? monthlyData : reportPeriod === 'Este mes' ? Array.from({ length: 8 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - 7 + index); return { label: String(date.getDate()), value: completedSales.filter((sale) => new Date(sale.date).toDateString() === date.toDateString()).reduce((sum, sale) => sum + sale.total, 0) }; }) : weeklyData} /></article><article className="report-paper bestsellers"><div className="report-card-head"><div><span className="section-kicker">LO QUE MÁS SALE</span><h3>Favoritos de la tienda</h3></div><Icon name="chart" /></div>{topProducts.map((product, index) => <div className="best-seller" key={product.id}><span className={`best-rank best-rank-${index}`}>0{index + 1}</span><ProductPhoto product={product} /><div><b>{product.name}</b><small>{product.category}</small></div><strong>{product.sold}<small> un.</small></strong></div>)}{topProducts.length === 0 && <EmptyState title="Sin ventas aún" subtitle="Los productos más vendidos aparecerán acá." />}</article></div><div className="report-bottomline"><span>Los datos se calculan a partir de las operaciones completadas en esta demo.</span><span><b>FC Dev</b> · VentaPro</span></div></div>}

        {page === 'settings' && <div className="settings-view"><article className="settings-paper"><span className="section-kicker">PERFIL COMERCIAL</span><h2>Información de tu tienda</h2><p>Estos datos se imprimen en el comprobante de cada venta.</p><form onSubmit={(event) => { event.preventDefault(); const fields = Object.fromEntries(new FormData(event.currentTarget).entries()); update('settings', { ...data.settings, business: fields.business.trim(), owner: fields.owner.trim(), phone: fields.phone.trim() }); notify('Datos del negocio guardados.'); }}><div className="form-grid"><label>Nombre del negocio<input name="business" required defaultValue={data.settings.business} /></label><label>Responsable<input name="owner" required defaultValue={data.settings.owner} /></label><label>Teléfono de contacto<input name="phone" defaultValue={data.settings.phone} /></label><label>Moneda<select disabled value="ARS"><option>ARS · Peso argentino</option></select></label></div><button className="coral-button">Guardar cambios</button></form></article><aside className="demo-info"><span className="section-kicker">MODO PORTFOLIO</span><h3>Datos de demostración</h3><p>Los registros se guardan en este navegador. No representan ventas comerciales reales ni son almacenamiento seguro.</p><button className="outline-button" onClick={resetDemo}>Restablecer datos de ejemplo</button></aside></div>}
      </section>}
    </main>
    <footer className="store-footer"><span><b>VentaPro</b> <i>·</i> una experiencia de <b>FC Dev</b></span><span>Demo interactiva · Información almacenada localmente</span></footer>

    {modal?.type === 'product' && <Modal title={modal.product ? 'Editar producto' : 'Sumar al catálogo'} subtitle="Contá lo esencial de este producto." onClose={() => setModal(null)}><form className="modal-form" onSubmit={saveProduct}><div className="form-grid"><label>Nombre del producto<input name="name" required defaultValue={modal.product?.name || ''} placeholder="Ej.: Campera de jean" /></label><label>Código / SKU<input name="sku" required defaultValue={modal.product?.sku || ''} placeholder="Ej.: VP-009" /></label><label>Categoría<select name="category" defaultValue={modal.product?.category || 'Indumentaria'}>{['Indumentaria', 'Accesorios', 'Electrónica', 'Hogar', ...categories.filter((category) => category !== 'Todas' && !['Indumentaria', 'Accesorios', 'Electrónica', 'Hogar'].includes(category))].map((category) => <option key={category}>{category}</option>)}</select></label><label>Foto del producto<input name="image" type="url" defaultValue={modal.product?.image || ''} placeholder="https://..." /></label><label>Precio de compra<input name="cost" type="number" min="0" required defaultValue={modal.product?.cost ?? ''} /></label><label>Precio de venta<input name="price" type="number" min="1" required defaultValue={modal.product?.price ?? ''} /></label><label>Unidades disponibles<input name="stock" type="number" min="0" step="1" required defaultValue={modal.product?.stock ?? 0} /></label><label>Avisar cuando queden<input name="minStock" type="number" min="0" step="1" required defaultValue={modal.product?.minStock ?? 1} /></label><label className="form-full">Descripción breve<input name="description" defaultValue={modal.product?.description || ''} placeholder="Material, color o talle..." /></label></div><div className="modal-actions"><button type="button" className="outline-button" onClick={() => setModal(null)}>Cancelar</button><button type="submit" className="coral-button">Guardar producto</button></div></form></Modal>}

    {modal?.type === 'stock' && <Modal title="Reposición de producto" subtitle="Sumá unidades al inventario disponible." onClose={() => setModal(null)}><form className="modal-form" onSubmit={addStock}><label>Producto<select name="productId" required defaultValue={modal.product?.id || ''}><option value="" disabled>Seleccioná un producto</option>{data.products.map((product) => <option key={product.id} value={product.id}>{product.name} · quedan {product.stock}</option>)}</select></label><label>Unidades que ingresan<input name="quantity" type="number" min="1" step="1" required placeholder="Ej.: 12" /></label><label>Motivo<input name="reason" required placeholder="Ej.: Reposición de temporada" /></label><div className="modal-actions"><button type="button" className="outline-button" onClick={() => setModal(null)}>Cancelar</button><button type="submit" className="coral-button">Registrar entrada</button></div></form></Modal>}

    {modal?.type === 'client' && <Modal title={modal.client ? 'Editar cliente' : 'Nuevo cliente'} subtitle="Guardá los datos para futuras ventas." onClose={() => setModal(null)}><form className="modal-form" onSubmit={saveClient}><div className="form-grid"><label>Nombre y apellido<input name="name" required defaultValue={modal.client?.name || ''} /></label><label>DNI / Identificación<input name="dni" defaultValue={modal.client?.dni || ''} /></label><label>Teléfono<input name="phone" required defaultValue={modal.client?.phone || ''} /></label><label>Correo electrónico<input name="email" type="email" defaultValue={modal.client?.email || ''} /></label></div><div className="modal-actions"><button type="button" className="outline-button" onClick={() => setModal(null)}>Cancelar</button><button type="submit" className="coral-button">Guardar cliente</button></div></form></Modal>}

    {modal?.type === 'sale-detail' && <Modal title={modal.success ? '¡Venta cobrada!' : 'Detalle de operación'} subtitle={`${modal.sale.number} · ${dateTime(modal.sale.date)}`} onClose={() => setModal(null)} wide><div className="receipt" id="receipt"><div className="receipt-success"><span>✓</span><b>{money(modal.sale.total)}</b><small>Pago registrado · {modal.sale.payment}</small></div><div className="receipt-shop"><b>{data.settings.business}</b><span>VentaPro · FC Dev</span></div><div className="receipt-meta"><span>Responsable <b>{data.settings.owner || '—'}</b></span><span>Teléfono <b>{data.settings.phone || '—'}</b></span><span>Cliente <b>{modal.sale.clientName || 'Venta al público'}</b></span><span>Estado <b>{modal.sale.status}</b></span></div><div className="receipt-items"><div className="receipt-item receipt-item-head"><span>PRODUCTO</span><span>UD.</span><span>IMPORTE</span></div>{modal.sale.items.map((item, index) => <div className="receipt-item" key={`${item.productId}-${index}`}><span>{item.name}<small>{item.sku}</small></span><span>{item.quantity}</span><span>{money(item.unitPrice * item.quantity)}</span></div>)}</div><div className="receipt-totals"><div><span>Subtotal</span><b>{money(modal.sale.subtotal)}</b></div><div><span>Descuento</span><b>− {money(modal.sale.discount)}</b></div><div className="receipt-total"><span>Total</span><b>{money(modal.sale.total)}</b></div></div><p className="receipt-legal">Comprobante de demostración · No válido como factura fiscal.</p></div><div className="modal-actions receipt-actions"><button className="outline-button" onClick={() => window.print()}><Icon name="print" size={16} /> Imprimir comprobante</button>{modal.sale.status !== 'Cancelada' && <button className="outline-button cancel-sale" onClick={() => cancelSale(modal.sale)}>Cancelar venta</button>}</div></Modal>}
    {toast && <div className="toast"><span>✓</span>{toast}<button onClick={() => setToast('')} aria-label="Cerrar mensaje"><Icon name="close" size={15} /></button></div>}
  </div>;
}

function EmptyState({ title, subtitle }) {
  return <div className="empty-state"><span className="empty-state-mark">—</span><b>{title}</b><span>{subtitle}</span></div>;
}

export default App;
