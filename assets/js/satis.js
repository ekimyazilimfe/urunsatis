let products = [
  {
    id: '1',
    name: 'Domates',
    price: 3,
    stock: 1,
    emoji: '🍅'
  },
  {
    id: '2',
    name: 'Elma',
    price: 4,
    stock: 3,
    emoji: '🍎'
  },
  {
    id: '3',
    name: 'Şeftali',
    price: 7,
    stock: 5,
    emoji: '🍑'
  },
  {
    id: '4',
    name: 'Karpuz',
    price: 25,
    stock: 2,
    emoji: '🍉'
  },
];

let sales = [];

function createProductHtml(product) {
  return `<li>
    <label>
      <input ${product.stock < 1 ? 'disabled' : ''} required type="radio" name="selectedProduct" value="${product.id}"> (${product.stock}) ${product.emoji} ${product.name} - ${product.price} TL
    </label>
  </li>`;
}

function renderProducts() {
  productList.innerHTML = products.map(x => createProductHtml(x)).join('');
}

function calculateSalesTotal() {
  // let total = 0;
  // for (let i = 0; i < sales.length; i++) {
  //   total += sales[i].price;
  // }
  // salesTotal.innerText = total;

  salesTotal.innerText = sales.reduce((total, current) => total + current.price, 0);
}

function handleSalesForm(e) {
  e.preventDefault();
  let formData = new FormData(salesForm);
  let formObj = Object.fromEntries(formData);

  if(!formObj.selectedProduct) {
    alert('Ürün kalmadı ne satıcan??');
    return;
  }

  let product = products.find(x => x.id === formObj.selectedProduct);
  if(product.stock - 1 < 0) {
    alert('Bu üründe yeterli stok yok!');
    return;
  }
  product.stock--;
  
  sales.push(
    {
      name: product.name,
      price: product.price
    }
  );

  calculateSalesTotal();

  salesForm.reset();
  renderProducts();
}

function handlePaymentTypeClick() {
  switch (this.value) {
    case '1':
        paidTotalInput.disabled = true;
        paidTotalInput.required = false;
        paidTotalInput.value = '';
      break;
    case '2':
        paidTotalInput.disabled = false;
        paidTotalInput.required = true;
        paidTotalInput.focus();
      break;
  }
}

function bindSalesFormEvents() {
  salesForm.addEventListener('submit', handleSalesForm);
  let paymentTypeSelectors = document.querySelectorAll('input[name="paymentType"]');
  paymentTypeSelectors.forEach(x => x.addEventListener('click', handlePaymentTypeClick));
}

function handleNewProduct(e) {
  e.preventDefault();
  let formData = new FormData(newProductForm);
  let formObj = Object.fromEntries(formData);
  formObj.id = crypto.randomUUID();
  formObj.price = Number(formObj.price);
  formObj.stock = Number(formObj.stock);
  products.push(formObj);
  newProductForm.reset();
  renderProducts();
}

function handleEditProduct(e) {
  e.preventDefault();
  let formData = new FormData(editProductForm);
  let formObj = Object.fromEntries(formData);

  formObj.price = Number(formObj.price);
  formObj.stock = Number(formObj.stock);

  let product = products.find(x => x.name === formObj.name);
  if(product) {
    product.emoji = formObj.emoji
    product.price = formObj.price
    product.stock = formObj.stock
  } else {
    alert('Bu isimde bir ürün bulunmamaktadır. Kontrol edip tekrar deneyiniz.');
  }

  editProductForm.reset();
  renderProducts();
}

function handleDeleteProduct(e) {
  e.preventDefault();
  let formData = new FormData(editProductForm);
  let formObj = Object.fromEntries(formData);

  let productIndex = products.findIndex(x => x.name === formObj.name);
  if (productIndex > -1) {
    products.splice(productIndex, 1);
  } else {
    alert('Bu isimde bir ürün bulunmamaktadır. Kontrol edip tekrar deneyiniz.');
  }

  editProductForm.reset();
  renderProducts();
}

function bindEditorEvents() {
  newProductForm.addEventListener('submit', handleNewProduct);
  editProductForm.addEventListener('submit', handleEditProduct);
  document.querySelector('#deleteBtn').addEventListener('click', handleDeleteProduct);
}

function init() {
  renderProducts();
  bindSalesFormEvents();
  bindEditorEvents();
}

init();
