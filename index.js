const navbarWraper = document.getElementById("navbar");
const mainWraper = document.getElementById("root");

// navbar
navbarWraper.innerHTML = `
    <div>
        <h1>Product Listing Page</h1>
        <div id = "searchQuery"></div>
        <div id = "sort"></div>
    </div>
    `

// navbar search, select and sort functionality
const searchQuery = navbarWraper.querySelector("#searchQuery");
const searchInput = document.createElement("input");
searchInput.placeholder = "Search products...";
searchInput.addEventListener("input", handleSearch)

const searchSelect = document.createElement("div");
searchSelect.innerHTML = `
    <select id="categorySelect" name="category">
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="jewelery">Jewelery</option>
        <option value="men's clothing">Men's Clothing</option>
        <option value="women's clothing">Women's Clothing</option>
    </select>
    `
searchQuery.append(searchInput, searchSelect);

const categorySelect = document.getElementById("categorySelect");
categorySelect.addEventListener("change", handleSearch);

const sort = navbarWraper.querySelector("#sort");
const sortSelect = document.createElement("div");
sortSelect.innerHTML = `
    <select id="sortSelect" name="sort">
        <option value="any">--</option>
        <option value="lowtohigh">Price: Low to High</option>
        <option value="hightolow">Price: High to Low</option>
    </select>
    `
sort.appendChild(sortSelect);

const sortedvalue = document.getElementById("sortSelect");
sortedvalue.addEventListener("change", handleSearch);

let productsData = [];

// function to handle and render search, category select and price sort
async function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortBy = sortedvalue.value;
    const productsData = await dataFetch()

    const filteredProducts = productsData.filter(product => {
        const title = product.title.toLowerCase();
        const titleMatch = title.includes(searchTerm);
        const category = categorySelect.value;
        const categoryMatch = category === "all" || product.category === category;    
        
        return titleMatch && categoryMatch;
    });
    let sortedProducts = filteredProducts.slice();

    if (sortBy === "lowtohigh") {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if(sortBy === "hightolow") {
        sortedProducts.sort((a, b) => b.price - a.price);
    }

    productsCard(sortedProducts);
}    

// function to fetch product data
async function dataFetch(category) {
    const endPoint = category ? `products/category/${category}` : `products`
    try {
        const response = await fetch(`https://fakestoreapi.com/${endPoint}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// function to create product card
function productsCard(productsData) {
    const productsWrapper = document.createElement('div');
    productsWrapper.id = "productsWrapper"

    productsWrapper.innerHTML = "";
    
    productsData.forEach((data) => {
        const productsCard = document.createElement('div');
        productsCard.className = "products-card";
        productsCard.innerHTML = `
            <img src = "${data.image}" alt = "${data.title}">
            <h1>${data.title}</h1>
            <p>${data.price}</p>
        `;
        productsWrapper.appendChild(productsCard);
    });
    mainWraper.innerHTML = "";
    mainWraper.appendChild(productsWrapper);
}

async function fetchAndRender() {
    try {
        const fetchProductsData = await dataFetch();
        productsData = fetchProductsData;
        productsCard(productsData);
    } catch (error) {
        console.error(error);
    }
}

fetchAndRender();