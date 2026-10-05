document.addEventListener("DOMContentLoaded", function () {

    const productsGrid =
        document.getElementById("products-grid");

    const productCount =
        document.getElementById("product-count");


    if (!productsGrid) {
        return;
    }


    if (typeof products === "undefined") {

        console.error("Products data not found.");

        return;
    }


    if (productCount) {

        productCount.textContent =
            `Showing ${products.length} Product`;

    }


    productsGrid.innerHTML = "";


    products.forEach(function (product) {

        const productCard = document.createElement("article");

        productCard.className = "product-card";


        productCard.innerHTML = `

            <a
                href="/product/${product.id}/"
                class="product-image-link"
            >

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>

            </a>


            <div class="product-content">

                <a
                    href="/product/${product.id}/"
                    class="product-name"
                >

                    ${product.name}

                </a>


                <div class="product-price">

                    ${product.price}

                </div>


                <a
                    href="/product-category/${product.categorySlug}/"
                    class="product-category"
                >

                    ${product.category}

                </a>

            </div>

        `;


        productsGrid.appendChild(productCard);

    });

});