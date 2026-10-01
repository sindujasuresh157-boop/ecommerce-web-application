// ================= SUPABASE PRODUCTS =================

async function loadProducts() {

    const productContainer =
        document.querySelector(".product-container");

    if (!productContainer) {
        return;
    }

    const { data, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .order("id");

    if (error) {

        console.error("Product loading error:", error);

        return;
    }

    productContainer.innerHTML = "";

    data.forEach(function(product) {

        let emoji = "🛍️";

        if (product.name === "Smartphone") {
            emoji = "📱";
        }

        if (product.name === "Headphones") {
            emoji = "🎧";
        }

        if (product.name === "Smart Watch") {
            emoji = "⌚";
        }

        if (product.name === "Laptop") {
            emoji = "💻";
        }

        productContainer.innerHTML += `

            <div class="product-card">

                <div class="product-image">
                    ${emoji}
                </div>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description || ""}
                </p>

                <h4>
                    ₹${product.price}
                </h4>

                <button
                    onclick="addToCart('${product.name}', ${product.price})">
                    Add to Cart
                </button>

            </div>

        `;
    });
}


// ================= CART =================

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// Add product to cart
function addToCart(name, price) {

    const existingProduct =
        cart.find(item => item.name === name);

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    alert(name + " added to cart!");
}


// Display cart
function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const totalElement =
        document.getElementById("total");

    if (!cartItems || !totalElement) {
        return;
    }

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        totalElement.textContent = "0";

        return;
    }

    cart.forEach(function(item, index) {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        const div =
            document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `

            <div>

                <strong>
                    ${item.name}
                </strong>

                <br>

                ₹${item.price} × ${item.quantity}

            </div>

            <div>

                <button
                    onclick="changeQuantity(${index}, -1)">
                    −
                </button>

                <span style="margin: 0 10px;">
                    ${item.quantity}
                </span>

                <button
                    onclick="changeQuantity(${index}, 1)">
                    +
                </button>

                <button
                    onclick="removeFromCart(${index})">
                    Remove
                </button>

            </div>

        `;

        cartItems.appendChild(div);
    });

    totalElement.textContent = total;
}


// Change quantity
function changeQuantity(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);
    }

    saveCart();
    updateCart();
}


// Remove product
function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();
    updateCart();
}


// Save cart
function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


// ================= CHECKOUT =================

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    let total = 0;

    cart.forEach(function(item) {

        total +=
            item.price * item.quantity;

    });

    alert(
        "Total Amount: ₹" +
        total +
        "\n\nPlease fill the checkout form."
    );

    document
        .getElementById("checkout")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ================= PLACE ORDER =================

async function placeOrder(event) {

    event.preventDefault();

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    const name =
        document
            .getElementById("customerName")
            .value
            .trim();

    const email =
        document
            .getElementById("customerEmail")
            .value
            .trim();

    const address =
        document
            .getElementById("address")
            .value
            .trim();


    let total = 0;

    cart.forEach(function(item) {

        total +=
            item.price * item.quantity;

    });


    // Save order to Supabase

    const { error } =
        await supabaseClient
            .from("orders")
            .insert([
                {
                    customer_name: name,
                    customer_email: email,
                    address: address,
                    total: total
                }
            ]);


    if (error) {

        console.error("Order error:", error);

        alert(
            "Order could not be saved. Please try again."
        );

        return;
    }


    document
        .getElementById("orderMessage")
        .textContent =
            "Order placed successfully for " +
            name +
            "! Total: ₹" +
            total;


    document
        .getElementById("orderMessage")
        .style.color =
            "green";


    alert(
        "Order placed successfully!\n\n" +
        "Customer: " +
        name +
        "\nEmail: " +
        email +
        "\nTotal: ₹" +
        total
    );


    cart = [];

    saveCart();

    updateCart();

    event.target.reset();
}


// ================= HOME =================

function showProducts() {

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ================= LOGIN =================

function loginUser(event) {

    event.preventDefault();

    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim();

    const password =
        document
            .getElementById("loginPassword")
            .value
            .trim();

    const role =
        document
            .getElementById("userRole")
            .value;

    const message =
        document
            .getElementById("loginMessage");


    if (
        email === "" ||
        password === "" ||
        role === ""
    ) {

        message.textContent =
            "Please fill all the fields.";

        message.style.color =
            "red";

        return;
    }


    if (role === "admin") {

        message.textContent =
            "Admin login successful!";

    } else {

        message.textContent =
            "User login successful!";
    }


    message.style.color =
        "green";
}


// ================= PAGE LOAD =================

updateCart();

loadProducts();