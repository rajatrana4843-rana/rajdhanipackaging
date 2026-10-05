/* =========================================================
   RAJDHANI PACKAGING - BUILD SCRIPT

   Run:  node build.js

   Ye script banata hai:
   - /product/<id>/index.html            (har product)
   - /product-category/<slug>/index.html (har category)
   - purane URLs ke redirect pages (about-us.html, product.html?id=... etc.)
   - sitemap.xml
   - .htaccess (Apache 301 redirects)

   Product ya category add/change karne ke baad ye script dobara chalana hai.
========================================================= */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const BASE = "https://www.plasticpouchandbags.com";
const TODAY = new Date().toISOString().slice(0, 10);


/* =========================================
   LOAD DATA FILES
========================================= */

function loadData(file, names) {

    const code = fs.readFileSync(path.join(ROOT, file), "utf8")
        + "\n;({" + names.join(",") + "})";

    return vm.runInNewContext(code, { document: { addEventListener() {} } });
}

const { products } = loadData("js/products-data.js", ["products"]);
const { productSeo } = loadData("js/product-seo.js", ["productSeo"]);
const { categoryMeta, categoryRedirects } =
    loadData("js/category-seo.js", ["categoryMeta", "categoryRedirects"]);


/* =========================================
   HELPERS
========================================= */

function esc(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function metaTags(description, keywords) {

    let html = "";

    if (description) {
        html += `\n    <meta name="description" content="${esc(description)}">\n`;
    }

    if (keywords) {
        html += `\n    <meta name="keywords" content="${esc(keywords)}">\n`;
    }

    return html;
}

function fill(template, values) {

    return template.replace(/{{(\w+)}}/g, function (match, key) {
        return key in values ? values[key] : match;
    });
}

function writePage(urlPath, html) {

    const file = path.join(ROOT, urlPath, "index.html");

    fs.mkdirSync(path.dirname(file), { recursive: true });

    fs.writeFileSync(file, html);
}

function redirectPage(target) {

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Redirecting...</title>
    <link rel="canonical" href="${BASE}${target}">
    <meta http-equiv="refresh" content="0; url=${target}">
    <script>window.location.replace("${target}");</script>
</head>
<body>
    <a href="${target}">${BASE}${target}</a>
</body>
</html>
`;
}


/* =========================================
   CLEAN OLD GENERATED FOLDERS
========================================= */

fs.rmSync(path.join(ROOT, "product"), { recursive: true, force: true });
fs.rmSync(path.join(ROOT, "product-category"), { recursive: true, force: true });


/* =========================================
   PRODUCT PAGES
========================================= */

const productTemplate =
    fs.readFileSync(path.join(ROOT, "templates/product.html"), "utf8");

const productIds = [];

products.forEach(function (product) {

    if (productIds.includes(product.id)) {
        console.warn("Duplicate product id skipped:", product.id);
        return;
    }

    productIds.push(product.id);

    const seo = productSeo[product.id] || {};

    let faqSchema = "";

    if (seo.faqs && seo.faqs.length) {

        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": seo.faqs.map(function (faq) {
                return {
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.schemaAnswer || faq.answer
                    }
                };
            })
        };

        faqSchema = "    <!-- FAQ SCHEMA -->\n"
            + '    <script type="application/ld+json">\n'
            + JSON.stringify(schema, null, 2).replace(/</g, "\\u003c")
            + "\n    </script>\n\n";
    }

    writePage("product/" + product.id, fill(productTemplate, {
        TITLE: esc(seo.title || product.name + " | Rajdhani Packaging"),
        META: metaTags(seo.description, seo.keywords),
        CANONICAL: `${BASE}/product/${product.id}/`,
        FAQ_SCHEMA: faqSchema,
        ID: esc(product.id)
    }));
});


/* =========================================
   CATEGORY PAGES
========================================= */

const categoryTemplate =
    fs.readFileSync(path.join(ROOT, "templates/category.html"), "utf8");

const categorySlugs = [];

products.forEach(function (product) {

    if (categorySlugs.includes(product.categorySlug)) {
        return;
    }

    categorySlugs.push(product.categorySlug);

    const seo = categoryMeta[product.categorySlug] || {};

    const firstWithDescription = products.find(function (item) {
        return item.categorySlug === product.categorySlug
            && item.categoryDescription;
    });

    writePage("product-category/" + product.categorySlug, fill(categoryTemplate, {
        TITLE: esc(seo.title || product.category + " | Rajdhani Packaging"),
        META: metaTags(seo.description, seo.keywords),
        CANONICAL: `${BASE}/product-category/${product.categorySlug}/`,
        SLUG: esc(product.categorySlug),
        H1: esc(product.category),
        SHORT_DESCRIPTION: esc(
            seo.shortDescription
            || (firstWithDescription ? firstWithDescription.categoryDescription : "")
        )
    }));
});


/* =========================================
   REDIRECTS
========================================= */

const redirects = {

    "/about-us.html": "/about-us/",
    "/shop.html": "/shop/",
    "/blog.html": "/blog/",
    "/contact-us.html": "/contact-us/",
    "/6-types-of-plastic-packaging-pouches-you-should-know.html":
        "/6-types-of-plastic-packaging-pouches-you-should-know/",
    "/searching-for-trusted-plastic-pouch-manufacturers-for-your-business.html":
        "/searching-for-trusted-plastic-pouch-manufacturers-for-your-business/"
};

const oldProductIds = {};

Object.keys(productSeo).forEach(function (id) {

    (productSeo[id].oldIds || []).forEach(function (oldId) {

        oldProductIds[oldId] = id;

        writePage("product/" + oldId, redirectPage(`/product/${id}/`));
    });
});

Object.keys(categoryRedirects).forEach(function (oldSlug) {

    writePage(
        "product-category/" + oldSlug,
        redirectPage(`/product-category/${categoryRedirects[oldSlug]}/`)
    );
});


/* OLD .html PAGES */

Object.keys(redirects).forEach(function (from) {

    fs.writeFileSync(path.join(ROOT, from), redirectPage(redirects[from]));
});


/* OLD product.html?id=... AND category.html?category=... */

function queryRedirectPage(param, prefix, oldMap) {

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Redirecting...</title>
    <meta name="robots" content="noindex">
    <script>
        var oldMap = ${JSON.stringify(oldMap)};
        var value = new URLSearchParams(window.location.search).get("${param}");
        value = oldMap[value] || value;
        window.location.replace(
            value && /^[a-z0-9-]+$/.test(value) ? "${prefix}" + value + "/" : "/shop/"
        );
    </script>
</head>
<body>
    <a href="/shop/">${BASE}/shop/</a>
</body>
</html>
`;
}

fs.writeFileSync(
    path.join(ROOT, "product.html"),
    queryRedirectPage("id", "/product/", oldProductIds)
);

fs.writeFileSync(
    path.join(ROOT, "category.html"),
    queryRedirectPage("category", "/product-category/", categoryRedirects)
);


/* =========================================
   .htaccess (APACHE 301 REDIRECTS)
========================================= */

let htaccess = `# Generated by build.js - edit build.js instead of this file.

Options -MultiViews
RewriteEngine On

# index.html -> /
RewriteCond %{THE_REQUEST} \\s/index\\.html[\\s?]
RewriteRule ^index\\.html$ / [R=301,L]

`;

Object.keys(redirects).forEach(function (from) {
    htaccess += `RewriteRule ^${from.slice(1).replace(/\./g, "\\.")}$ ${redirects[from]} [R=301,L]\n`;
});

htaccess += "\n# Old product / category ids\n";

Object.keys(oldProductIds).forEach(function (oldId) {
    htaccess += `RewriteRule ^product/${oldId}/?$ /product/${oldProductIds[oldId]}/ [R=301,L]\n`;
});

Object.keys(categoryRedirects).forEach(function (oldSlug) {
    htaccess += `RewriteRule ^product-category/${oldSlug}/?$ /product-category/${categoryRedirects[oldSlug]}/ [R=301,L]\n`;
});

htaccess += `
# product.html?id=xyz -> /product/xyz/
RewriteCond %{QUERY_STRING} (?:^|&)id=([a-z0-9-]+)
RewriteRule ^product\\.html$ /product/%1/? [R=301,L]

# category.html?category=xyz -> /product-category/xyz/
RewriteCond %{QUERY_STRING} (?:^|&)category=([a-z0-9-]+)
RewriteRule ^category\\.html$ /product-category/%1/? [R=301,L]
`;

fs.writeFileSync(path.join(ROOT, ".htaccess"), htaccess);


/* =========================================
   SITEMAP.XML
========================================= */

const sitemapUrls = [
    "/",
    "/about-us/",
    "/shop/",
    "/blog/",
    "/contact-us/",
    "/6-types-of-plastic-packaging-pouches-you-should-know/",
    "/searching-for-trusted-plastic-pouch-manufacturers-for-your-business/"
]
    .concat(categorySlugs.map(function (slug) {
        return `/product-category/${slug}/`;
    }))
    .concat(productIds.map(function (id) {
        return `/product/${id}/`;
    }));

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

sitemapUrls.forEach(function (url) {
    sitemap += `  <url>\n    <loc>${BASE}${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>daily</changefreq>\n  </url>\n`;
});

sitemap += "</urlset>\n";

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);


console.log(
    `Built ${productIds.length} products, ${categorySlugs.length} categories, `
    + `${sitemapUrls.length} sitemap URLs.`
);
