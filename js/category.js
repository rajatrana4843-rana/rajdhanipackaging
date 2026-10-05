document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       GET ELEMENTS
    ========================================= */

    const categoryTitle =
        document.getElementById("category-title");

    const categoryDescription =
        document.getElementById("category-description");

    const categoryCount =
        document.getElementById("category-count");

    const categoryProducts =
        document.getElementById("category-products");


    /* =========================================
       GET CATEGORY
       (build.js har category page par data-category set karta hai)
    ========================================= */

    const categorySlug =
        document.querySelector("[data-category]")
            ?.getAttribute("data-category");

    const seo =
        typeof categoryMeta !== "undefined"
            ? categoryMeta[categorySlug]
            : null;


    /* =========================================
       CATEGORY NOT FOUND
    ========================================= */

    if (!categorySlug) {

        categoryTitle.textContent = "Products";

        categoryDescription.textContent =
            "Explore our complete range of products.";

        categoryCount.textContent = "";

        categoryProducts.innerHTML = `

            <div class="category-not-found">

                <h2>Category Not Found</h2>

                <p>
                    Please select a valid product category.
                </p>

                <a href="/shop/">
                    View All Products
                </a>

            </div>

        `;

        return;
    }


    /* =========================================
       FILTER PRODUCTS
    ========================================= */

    const filteredProducts = products.filter(function (product) {

        return product.categorySlug === categorySlug;

    });


    /* =========================================
       NO PRODUCTS FOUND
    ========================================= */

    if (filteredProducts.length === 0) {

        categoryTitle.textContent = categorySlug
            .split("-")
            .map(function (word) {

                return word.charAt(0).toUpperCase()
                    + word.slice(1);

            })
            .join(" ");


        categoryDescription.textContent =
            "No products are available in this category.";


        categoryCount.textContent =
            "Showing 0 Products";


        categoryProducts.innerHTML = `

            <div class="category-no-products">

                <h2>No Products Found</h2>

                <p>
                    Products will be added soon.
                </p>

                <a href="/shop/">
                    View All Products
                </a>

            </div>

        `;

        return;
    }


    /* =========================================
       CATEGORY DETAILS
    ========================================= */

    const firstProduct = filteredProducts[0];


    /* CATEGORY NAME */

    categoryTitle.textContent =
        firstProduct.category;


/* CATEGORY DESCRIPTION */

if (seo && seo.shortDescription) {

    categoryDescription.textContent =
        seo.shortDescription;

} else if (firstProduct.categoryDescription) {

    categoryDescription.textContent =
        firstProduct.categoryDescription;

} else {

    categoryDescription.textContent = "";

}


    /* =========================================
       PRODUCT COUNT
    ========================================= */

    categoryCount.textContent =
        "Showing "
        + filteredProducts.length
        + (filteredProducts.length === 1
            ? " Product"
            : " Products");


    /* =========================================
       UPDATE PAGE TITLE
    ========================================= */

    if (!seo) {

        document.title =
            firstProduct.category
            + " | Rajdhani Packaging";
    }


    /* =========================================
       CREATE PRODUCT CARDS
    ========================================= */

    let productsHTML = "";


    filteredProducts.forEach(function (product) {

        productsHTML += `

            <article class="product-card">


                <!-- PRODUCT IMAGE -->

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


                <!-- PRODUCT CONTENT -->

                <div class="product-content">


                    <!-- PRODUCT NAME -->

                    <a
                        href="/product/${product.id}/"
                        class="product-name"
                    >

                        ${product.name}

                    </a>


                    <!-- PRODUCT PRICE -->

                    <div class="product-price">

                        ${product.price}

                    </div>


                    <!-- VIEW PRODUCT -->

                    <a
                        href="/product/${product.id}/"
                        class="view-product"
                    >

                        View Product

                    </a>


                </div>

            </article>

        `;

    });


    /* =========================================
       SHOW PRODUCTS
    ========================================= */

    categoryProducts.innerHTML = productsHTML;

});