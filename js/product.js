document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       GET PRODUCT CONTAINER
    ========================================= */

    const productDetails =
        document.getElementById("product-details");

    if (!productDetails) {
        return;
    }


    /* =========================================
       GET PRODUCT ID
       (build.js har product page par data-product-id set karta hai)
    ========================================= */

    const productId =
        productDetails.getAttribute("data-product-id");

    const seo =
        typeof productSeo !== "undefined"
            ? productSeo[productId]
            : null;


    /* =========================================
       FIND PRODUCT
    ========================================= */

    const product = products.find(function (item) {

        return item.id === productId;

    });


    /* =========================================
       PRODUCT NOT FOUND
    ========================================= */

    if (!product) {

        productDetails.innerHTML = `

            <section class="product-not-found">

                <h1>Product Not Found</h1>

                <a href="/shop/">
                    Back to Products
                </a>

            </section>

        `;

        return;
    }


    /* =========================================
       TITLE, META, CANONICAL & FAQ SCHEMA
       build.js static HTML me likhta hai.
    ========================================= */


    /* =========================================
       CREATE SEO CONTENT & FAQS
    ========================================= */

    function listItems(items) {

        return items.map(function (item) {

            return Array.isArray(item)
                ? `<li><strong>${item[0]}:</strong>${item[1]}</li>`
                : `<li>${item}</li>`;

        }).join("");
    }


    let descriptionHTML = `

        <h2>
            Product Description
        </h2>

        <p>
            ${product.description}
        </p>

    `;


    if (seo && seo.content) {

        descriptionHTML =
            `<h2>${seo.contentHeading}</h2>`
            + seo.content.map(function (block) {

                if (block.h3) return `<h3>${block.h3}</h3>`;
                if (block.ul) return `<ul>${listItems(block.ul)}</ul>`;
                if (block.ol) return `<ol>${listItems(block.ol)}</ol>`;
                return `<p>${block.p}</p>`;

            }).join("");
    }


    let faqHTML = "";

    if (seo && seo.faqs && seo.faqs.length) {

        faqHTML = `

            <section class="product-faq-section">

                <div class="container">

                    <h2>${seo.faqHeading || "FAQs"}</h2>

                    <div class="product-faq-list">

                        ${seo.faqs.map(function (faq, index) {

                            return `
                                <details class="product-faq-item">
                                    <summary>${index + 1}. ${faq.question}</summary>
                                    <p>${faq.answer}</p>
                                </details>
                            `;

                        }).join("")}

                    </div>

                </div>

            </section>

        `;
    }


    /* =========================================
       CREATE SPECIFICATIONS
    ========================================= */

    let specificationsHTML = "";


    if (product.specifications) {

        Object.entries(product.specifications)
            .forEach(function ([key, value]) {

                specificationsHTML += `

                    <tr>
                        <th>${key}</th>
                        <td>${value}</td>
                    </tr>

                `;

            });

    }


    /* =========================================
       CREATE PRODUCT PAGE
    ========================================= */

    productDetails.innerHTML = `


        <!-- ================= BREADCRUMB ================= -->

        <section class="product-breadcrumb-section">

            <div class="container">

                <div class="product-breadcrumb">

                    <a href="/">
                        Home
                    </a>

                    <span>/</span>

                    <a href="/shop/">
                        Products
                    </a>

                    <span>/</span>

                    <a href="/product-category/${product.categorySlug}/">
                        ${product.category}
                    </a>

                    <span>/</span>

                    <span class="current-product">
                        ${product.name}
                    </span>

                </div>

            </div>

        </section>



        <!-- ================= MAIN PRODUCT ================= -->

        <section class="single-product-section">

            <div class="container">

                <div class="single-product-grid">


                    <!-- LEFT : PRODUCT IMAGE -->

                    <div class="single-product-left">

                        <div class="single-product-image">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >

                        </div>

                    </div>



                    <!-- RIGHT : PRODUCT DETAILS -->

                    <div class="single-product-info">


                        <!-- CATEGORY -->

                        <a
                            href="/product-category/${product.categorySlug}/"
                            class="single-product-category"
                        >

                            ${product.category}

                        </a>


                        <!-- PRODUCT NAME -->

                        <h1>
                            ${seo && seo.h1 ? seo.h1 : product.name}
                        </h1>

                        ${seo && seo.subHeading
                            ? `<h2 class="single-product-subheading">${seo.subHeading}</h2>`
                            : ""}


                        <!-- PRICE -->

                        <div class="single-product-price">

                            ${product.price}

                        </div>


                        <!-- DIVIDER -->

                        <div class="product-info-divider"></div>


                        <!-- SPECIFICATIONS -->

                        <div class="product-specifications">

                            <h2>
                                Product Specifications
                            </h2>


                            <div class="specifications-table-wrapper">

                                <table class="specifications-table">

                                    <tbody>

                                        ${specificationsHTML}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        <!-- ENQUIRY BUTTON -->

                        <a
                            href="/contact-us/"
                            class="product-enquiry-btn"
                        >

                            Enquire Now

                        </a>


                    </div>


                </div>

            </div>

        </section>



        <!-- ================= DESCRIPTION ================= -->

        <section class="product-description-section">

            <div class="container">

                <div class="product-description-box${seo && seo.content ? " product-seo-content" : ""}">

                    ${descriptionHTML}

                </div>

            </div>

        </section>

        ${faqHTML}


    `;

});