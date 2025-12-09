// -------------------- DATA --------------------
let products = [
    {id:1,name:"Wireless Mouse",price:12.5,img:"images/product1.jpg",desc:"High precision wireless mouse"},
    {id:2,name:"Mechanical Keyboard",price:45,img:"images/product2.jpg",desc:"RGB mechanical keyboard"},
    {id:3,name:"USB-C Cable",price:3.5,img:"images/product3.jpg",desc:"Durable USB-C cable"}
];

let customers = [];
let orders = [];
let cart = [];
let loggedCustomer = null;

// -------------------- PANELS --------------------
function showPanel(id){
    document.querySelectorAll('.panel').forEach(p=>p.style.display='none');
    document.getElementById(id).style.display='block';
}

// -------------------- ADMIN --------------------
function adminLogin(){
    if(document.getElementById('adminUser').value==='admin' &&
        document.getElementById('adminPass').value==='1234'){
        // Hide panel buttons
        document.getElementById('panelButtons').style.display = 'none';
        showPanel('adminDashboard');
        renderAdminProducts();
        renderAdminCustomers();
        renderAdminOrders();
    } else alert("Invalid credentials");
}


// -------- PRODUCTS --------
function addProduct(){
    let name = document.getElementById('pname').value;
    let price = Number(document.getElementById('pprice').value);
    let desc = document.getElementById('pdesc').value;
    if(!name||!price||!desc) return alert("Enter all fields");

    let fileInput = document.getElementById('pfile');
    if(fileInput.files.length === 0) return alert("Please select an image");

    let reader = new FileReader();
    reader.onload = function(evt){
        let imgData = evt.target.result;
        products.push({id:Date.now(),name,price,img:imgData,desc});
        document.getElementById('pname').value='';
        document.getElementById('pprice').value='';
        document.getElementById('pdesc').value='';
        fileInput.value='';
        renderAdminProducts();
    };
    reader.readAsDataURL(fileInput.files[0]);
}

let editProductIndex = null;

function renderAdminProducts(){
    let container=document.getElementById('productTable');
    container.innerHTML='';
    products.forEach((p,index)=>{
        let div=document.createElement('div');
        div.className='product-card';
        div.innerHTML=`
            <img src="${p.img}" alt="${p.name}">
            <b>${p.name}</b><br>Price: ${p.price}<p>${p.desc}</p>
            <button onclick="openProductModal(${index})">Edit</button>
            <button onclick="deleteProduct(${index})">Delete</button>
        `;
        container.appendChild(div);
    });
}

function deleteProduct(index){
    if(confirm("Delete this product?")){
        products.splice(index,1);
        renderAdminProducts();
    }
}

// -------- PRODUCT MODAL --------
function openProductModal(index){
    editProductIndex = index;
    let p = products[index];
    document.getElementById('editName').value = p.name;
    document.getElementById('editPrice').value = p.price;
    document.getElementById('editDesc').value = p.desc;
    document.getElementById('editPreview').src = p.img;
    document.getElementById('editFile').value='';
    document.getElementById('editModal').style.display='block';
}

function closeModal(){
    document.getElementById('editModal').style.display='none';
}

function saveEdit(){
    if(editProductIndex===null) return;
    let p = products[editProductIndex];
    p.name = document.getElementById('editName').value;
    p.price = Number(document.getElementById('editPrice').value);
    p.desc = document.getElementById('editDesc').value;

    let fileInput = document.getElementById('editFile');
    if(fileInput.files.length>0){
        let reader = new FileReader();
        reader.onload=function(evt){
            p.img = evt.target.result;
            renderAdminProducts();
            closeModal();
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        renderAdminProducts();
        closeModal();
    }
}

// -------- CUSTOMERS --------
let editCustomerIndex = null;

function renderAdminCustomers(){
    let container=document.getElementById('customerTable');
    container.innerHTML='';
    customers.forEach((c,index)=>{
        let div=document.createElement('div');
        div.className='list-item';
        div.innerHTML=`<span>${c.name} - ${c.email}</span>
            <div>
                <button onclick="editCustomer(${index})">Edit</button>
                <button onclick="deleteCustomer(${index})">Delete</button>
            </div>`;
        container.appendChild(div);
    });
}

function editCustomer(index){
    editCustomerIndex = index;
    let c = customers[index];
    document.getElementById('editCustomerName').value = c.name;
    document.getElementById('editCustomerEmail').value = c.email;
    document.getElementById('editCustomerModal').style.display = 'block';
}

function closeCustomerModal(){
    document.getElementById('editCustomerModal').style.display = 'none';
}

function saveCustomerEdit(){
    if(editCustomerIndex === null) return;
    let c = customers[editCustomerIndex];
    c.name = document.getElementById('editCustomerName').value;
    c.email = document.getElementById('editCustomerEmail').value;
    renderAdminCustomers();
    renderAdminOrders(); // update orders if email changed
    closeCustomerModal();
}

function deleteCustomer(index){
    if(confirm("Delete this customer?")){
        let c = customers[index];
        customers.splice(index,1);
        orders = orders.filter(o=>o.customer!==c.email);
        renderAdminCustomers();
        renderAdminOrders();
    }
}

// -------- ORDERS --------
let editOrderIndex = null;

function renderAdminOrders(){
    let container = document.getElementById('orderTable');
    container.innerHTML='';
    orders.forEach((o,index)=>{
        let div=document.createElement('div');
        div.className='list-item';
        div.innerHTML=`<span>Order #${o.id} - ${o.customer} - Total: $${o.total}</span>
            <div>
                <button onclick="viewAdminOrderDetail(${index})">View Details</button>
                <button onclick="editOrder(${index})">Edit</button>
                <button onclick="deleteOrder(${index})">Delete</button>
            </div>`;
        container.appendChild(div);
    });
}


function editOrder(index){
    editOrderIndex = index;
    let o = orders[index];
    document.getElementById('editOrderCustomer').value = o.customer;
    document.getElementById('editOrderTotal').value = o.total;
    document.getElementById('editOrderModal').style.display = 'block';
}

function closeOrderModal(){
    document.getElementById('editOrderModal').style.display = 'none';
}

function saveOrderEdit(){
    if(editOrderIndex===null) return;
    let o = orders[editOrderIndex];
    o.customer = document.getElementById('editOrderCustomer').value;
    o.total = Number(document.getElementById('editOrderTotal').value);
    renderAdminOrders();
    closeOrderModal();
}

function deleteOrder(index){
    if(confirm("Delete this order?")){
        orders.splice(index,1);
        renderAdminOrders();
    }
}

// -------------------- CUSTOMER PANEL --------------------
function registerCustomer(){
    let name=document.getElementById('regName').value;
    let email=document.getElementById('regEmail').value;
    let pass=document.getElementById('regPass').value;
    if(!name||!email||!pass)return alert("Enter all fields");
    customers.push({id:Date.now(),name,email,pass});
    alert("Registered!");
}

function customerLogin(){
    let email=document.getElementById('logEmail').value;
    let pass=document.getElementById('logPass').value;
    loggedCustomer=customers.find(c=>c.email===email&&c.pass===pass);
    if(!loggedCustomer)return alert("Invalid login");

    // Hide panel buttons
    document.getElementById('panelButtons').style.display = 'none';

    cart=[];
    showPanel('customerDashboard');
    renderCustomerProducts();
    renderCart();
    renderMyOrders();
}


// -------- CUSTOMER PRODUCTS --------
function renderCustomerProducts(){
    let container=document.getElementById('customerProducts');
    container.innerHTML='';
    products.forEach(p=>{
        let div=document.createElement('div');
        div.className='product-card';
        div.innerHTML=`<img src="${p.img}" alt="${p.name}"><b>${p.name}</b><br>Price: ${p.price}<p>${p.desc}</p>
            <button onclick="addToCart(${p.id})">Add</button>`;
        container.appendChild(div);
    });
}

function addToCart(pid){
    let p = products.find(x=>x.id===pid);
    cart.push({...p});
    renderCart();
}

function renderCart(){
    let container = document.getElementById('cartItems');
    container.innerHTML = '';

    if(cart.length === 0){
        container.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach((p,i)=>{
            let div = document.createElement('div');
            div.className='list-item';
            div.innerHTML = `${p.name} - $${p.price} 
                             <button onclick="removeFromCart(${i})">Remove</button>`;
            container.appendChild(div);
        });
    }

    // Enable or disable checkout button
    let checkoutBtn = document.getElementById('checkoutBtn');
    if(cart.length > 0){
        checkoutBtn.disabled = false;
        checkoutBtn.style.display = 'block';
    } else {
        checkoutBtn.disabled = true;
        checkoutBtn.style.display = 'none'; // optional: hide button
    }
}


function removeFromCart(index){cart.splice(index,1);renderCart();}

function checkout(){
    if(cart.length === 0) return alert("Cart is empty");

    // Populate order summary
    let total = cart.reduce((sum,p)=>sum+p.price,0);
    let summaryDiv = document.getElementById('paymentSummary');
    summaryDiv.innerHTML = "<b>Order Summary:</b><br>" +
        cart.map(p=>`${p.name} - $${p.price}`).join("<br>") +
        `<br><br><b>Total: $${total.toFixed(2)}</b>`;

    document.getElementById('paymentDetails').value = '';
    document.getElementById('paymentModal').style.display = 'block';
}

function closePaymentModal(){
    document.getElementById('paymentModal').style.display='none';
}

function processPayment(){
    let method = document.getElementById('paymentMethod').value;
    let details = document.getElementById('paymentDetails').value.trim();
    let mobile = document.getElementById('customerMobile').value.trim();
    let address = document.getElementById('customerAddress').value.trim();

    if(!mobile) return alert("Mobile number is mandatory!");
    if(!address) return alert("Address is mandatory!");
    if(method !== "cash" && !details) return alert("Payment details are mandatory!");

    let total = cart.reduce((sum,p)=>sum+p.price,0);

    orders.push({
        id: Date.now(),
        customer: loggedCustomer.email,
        total: total.toFixed(2),
        method: method,
        paymentDetails: details || "",
        mobile: mobile,
        address: address,
        items: [...cart]
    });

    cart = [];
    renderCart();
    renderMyOrders();
    renderAdminOrders();
    closePaymentModal();

    // Show success notification
    showToast(`Payment successful via ${method.toUpperCase()}!`);
}

function showToast(message){
    let toast = document.getElementById('toast');
    if(!toast) return; // safety check
    toast.innerText = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}



function renderMyOrders(){
    let container = document.getElementById('myOrders');
    container.innerHTML = '';
    orders.filter(o => o.customer === loggedCustomer.email).forEach((o,i)=>{
        let div = document.createElement('div');
        div.className='list-item';
        div.innerHTML = `Order #${o.id} - Total: $${o.total} 
                         <button onclick="viewOrderDetail(${i})">View Details</button>`;
        container.appendChild(div);
    });
}



function viewOrderDetail(index){
    let o = orders.filter(o => o.customer === loggedCustomer.email)[index];
    let content = `<b>Order ID:</b> ${o.id}<br>
                   <b>Payment Method:</b> ${o.method.toUpperCase()}<br>
                   <b>Mobile:</b> ${o.mobile}<br>
                   <b>Address:</b> ${o.address}<br>`;
    if(o.paymentDetails) content += `<b>Payment Details:</b> ${o.paymentDetails}<br>`;
    content += `<b>Total:</b> $${o.total}<br><b>Items:</b><br>`;
    o.items.forEach(i => content += `- ${i.name} - $${i.price}<br>`);
    document.getElementById('orderDetailContent').innerHTML = content;
    document.getElementById('orderDetailModal').style.display = 'block';
}


function closeOrderDetailModal(){
    document.getElementById('orderDetailModal').style.display = 'none';
}

function viewAdminOrderDetail(index){
    let o = orders[index];
    let content = `<b>Order ID:</b> ${o.id}<br>
                   <b>Customer:</b> ${o.customer}<br>
                   <b>Payment Method:</b> ${o.method.toUpperCase()}<br>
                   <b>Mobile:</b> ${o.mobile}<br>
                   <b>Address:</b> ${o.address}<br>`;
    if(o.paymentDetails) content += `<b>Payment Details:</b> ${o.paymentDetails}<br>`;
    content += `<b>Total:</b> $${o.total}<br><b>Items:</b><br>`;
    o.items.forEach(i => content += `- ${i.name} - $${i.price}<br>`);
    document.getElementById('adminOrderDetailContent').innerHTML = content;
    document.getElementById('adminOrderDetailModal').style.display = 'block';
}


function closeAdminOrderDetailModal(){
    document.getElementById('adminOrderDetailModal').style.display = 'none';
}



function logoutCustomer(){
    loggedCustomer=null;
    cart=[];
    showPanel('customerPanel');

    // Show panel buttons again
    document.getElementById('panelButtons').style.display = 'flex';
}

function logoutAdmin(){
    showPanel('adminLogin'); // go back to admin login
    document.getElementById('panelButtons').style.display = 'flex'; // show panel buttons again
}


