/* =====================================================
   SALES MONITOR - SCRIPT UTAMA
   ===================================================== */

function rupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);
}


/* =====================================================
   DATA DEFAULT
   ===================================================== */

const defaultProducts = [
    {
        kode: "MR001",
        nama: "Hand & Body Lotion",
        kategori: "Perawatan Tubuh",
        harga: 50000,
        stok: 750,
        status: "Tersedia"
    },
    {
        kode: "MR002",
        nama: "Sabun Herba",
        kategori: "Pembersih",
        harga: 35000,
        stok: 620,
        status: "Tersedia"
    },
    {
        kode: "MR003",
        nama: "Bedak Wangi",
        kategori: "Make Up",
        harga: 45000,
        stok: 310,
        status: "Tersedia"
    },
    {
        kode: "MR004",
        nama: "Minyak Zaitun",
        kategori: "Perawatan Tubuh",
        harga: 42000,
        stok: 275,
        status: "Stok Menipis"
    },
    {
        kode: "MR005",
        nama: "Lulur Tradisional",
        kategori: "Perawatan Tubuh",
        harga: 38000,
        stok: 0,
        status: "Stok Habis"
    }
];


const defaultOutlets = [
    {
        kode: "OUT001",
        nama: "Mustika Ratu Surabaya",
        wilayah: "Surabaya",
        alamat: "Jl. Raya Darmo No. 25",
        penjualan: 42500000,
        status: "Aktif"
    },
    {
        kode: "OUT002",
        nama: "Mustika Ratu Sidoarjo",
        wilayah: "Sidoarjo",
        alamat: "Jl. Ahmad Yani No. 18",
        penjualan: 35750000,
        status: "Aktif"
    },
    {
        kode: "OUT003",
        nama: "Mustika Ratu Malang",
        wilayah: "Malang",
        alamat: "Jl. Ijen No. 12",
        penjualan: 28200000,
        status: "Aktif"
    },
    {
        kode: "OUT004",
        nama: "Mustika Ratu Kediri",
        wilayah: "Kediri",
        alamat: "Jl. Hayam Wuruk No. 31",
        penjualan: 19850000,
        status: "Aktif"
    },
    {
        kode: "OUT005",
        nama: "Mustika Ratu Gresik",
        wilayah: "Gresik",
        alamat: "Jl. Veteran No. 42",
        penjualan: 8500000,
        status: "Tidak Aktif"
    }
];


/* =====================================================
   LOCAL STORAGE
   ===================================================== */

function getProducts() {
    const data = localStorage.getItem("salesMonitorProducts");

    if (data) {
        return JSON.parse(data);
    }

    localStorage.setItem(
        "salesMonitorProducts",
        JSON.stringify(defaultProducts)
    );

    return [...defaultProducts];
}


function saveProducts(products) {
    localStorage.setItem(
        "salesMonitorProducts",
        JSON.stringify(products)
    );
}


function getOutlets() {
    const data = localStorage.getItem("salesMonitorOutlets");

    if (data) {
        return JSON.parse(data);
    }

    localStorage.setItem(
        "salesMonitorOutlets",
        JSON.stringify(defaultOutlets)
    );

    return [...defaultOutlets];
}


function saveOutlets(outlets) {
    localStorage.setItem(
        "salesMonitorOutlets",
        JSON.stringify(outlets)
    );
}


/* =====================================================
   DOM READY
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".sidebar");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });
    }


    /* PRODUK */

    if (document.getElementById("productTable")) {
        initProduct();
    }


    /* OUTLET */

    if (document.getElementById("outletTable")) {
        initOutlet();
    }


    /* DASHBOARD */

    if (document.getElementById("dashboardPage")) {
        initDashboard();
    }

});


/* =====================================================
   PRODUK
   ===================================================== */

function initProduct() {

    let products = getProducts();

    const table = document.getElementById("productTable");
    const search = document.getElementById("searchProduct");
    const category = document.getElementById("categoryFilter");
    const status = document.getElementById("statusProductFilter");
    const reset = document.getElementById("resetProduct");


    function render(data = products) {

        table.innerHTML = data.map(function (p) {

            return `
                <tr>

                    <td>
                        <strong class="product-code">
                            ${p.kode}
                        </strong>
                    </td>

                    <td>
                        <div class="product-name">

                            <div class="product-image">
                                <i class="fa-solid fa-pump-soap"></i>
                            </div>

                            <div>
                                <strong>${p.nama}</strong>
                                <span>${p.kategori}</span>
                            </div>

                        </div>
                    </td>

                    <td>${p.kategori}</td>

                    <td>${rupiah(p.harga)}</td>

                    <td>
                        <strong>
                            ${p.stok.toLocaleString("id-ID")}
                        </strong>
                    </td>

                    <td>
                        <span class="stock-status ${
                            p.status === "Tersedia"
                                ? "available"
                                : "low"
                        }">
                            ${p.status}
                        </span>
                    </td>

                    <td>

                        <div class="table-actions">

                            <button
                                class="edit-btn"
                                onclick="editProduct('${p.kode}')"
                                title="Edit">

                                <i class="fa-solid fa-pen"></i>

                            </button>

                            <button
                                class="delete-btn"
                                onclick="deleteProduct('${p.kode}')"
                                title="Hapus">

                                <i class="fa-solid fa-trash"></i>

                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");


        const count = document.getElementById("productCount");

        if (count) {
            count.textContent =
                `Menampilkan ${data.length} produk`;
        }


        updateProductSummary();

    }


    function filter() {

        const q = search
            ? search.value.toLowerCase()
            : "";

        const c = category
            ? category.value
            : "Semua Kategori";

        const s = status
            ? status.value
            : "Semua Status";


        const filtered = products.filter(function (p) {

            const matchSearch =
                (p.kode + " " + p.nama)
                    .toLowerCase()
                    .includes(q);

            const matchCategory =
                c === "Semua Kategori" ||
                p.kategori === c;

            const matchStatus =
                s === "Semua Status" ||
                p.status === s;

            return (
                matchSearch &&
                matchCategory &&
                matchStatus
            );

        });


        render(filtered);

    }


    if (search) {
        search.addEventListener("input", filter);
    }

    if (category) {
        category.addEventListener("change", filter);
    }

    if (status) {
        status.addEventListener("change", filter);
    }


    if (reset) {

        reset.addEventListener("click", function () {

            if (search) {
                search.value = "";
            }

            if (category) {
                category.selectedIndex = 0;
            }

            if (status) {
                status.selectedIndex = 0;
            }

            render();

        });

    }


    window.refreshProducts = function () {

        products = getProducts();

        render();

    };


    render();


    /* =================================================
       TAMBAH PRODUK
       ================================================= */

    const addBtn =
        document.getElementById("addProductBtn");

    const modal =
        document.getElementById("productModal");

    const closeBtn =
        document.getElementById("closeModal");

    const cancelBtn =
        document.getElementById("cancelBtn");

    const form =
        document.getElementById("productForm");


    if (addBtn && modal) {

        addBtn.onclick = function () {

            if (form) {
                form.reset();
            }

            const productId =
                document.getElementById("productId");

            if (productId) {
                productId.value = "";
            }

            modal.classList.add("show");

        };

    }


    function closeProductModal() {

        if (modal) {
            modal.classList.remove("show");
        }

    }


    if (closeBtn) {
        closeBtn.onclick = closeProductModal;
    }

    if (cancelBtn) {
        cancelBtn.onclick = closeProductModal;
    }


    if (modal) {

        modal.addEventListener("click", function (e) {

            if (e.target === modal) {
                closeProductModal();
            }

        });

    }


    /* =================================================
       SIMPAN PRODUK
       ================================================= */

    if (form) {

        form.addEventListener("submit", function (e) {

            e.preventDefault();


            const kode =
                document.getElementById("productCode").value.trim();

            const nama =
                document.getElementById("productName").value.trim();

            const kategori =
                document.getElementById("category").value;

            const harga =
                Number(document.getElementById("price").value);

            const stok =
                Number(document.getElementById("stock").value);

            const status =
                document.getElementById("status").value;


            if (
                !kode ||
                !nama ||
                !kategori ||
                !harga ||
                stok < 0 ||
                !status
            ) {

                alert("Mohon lengkapi semua data produk.");

                return;

            }


            const existing =
                products.findIndex(
                    p => p.kode === kode
                );


            const data = {

                kode: kode,
                nama: nama,
                kategori: kategori,
                harga: harga,
                stok: stok,
                status: status

            };


            if (existing >= 0) {

                products[existing] = data;

            } else {

                products.push(data);

            }


            saveProducts(products);


            closeProductModal();

            form.reset();

            render();


            alert(
                existing >= 0
                    ? "Produk berhasil diperbarui."
                    : "Produk berhasil ditambahkan."
            );

        });

    }


    /* =================================================
       EDIT PRODUK
       ================================================= */

    window.editProduct = function (kode) {

        const product =
            products.find(
                p => p.kode === kode
            );

        if (!product) {
            return;
        }


        document.getElementById("productCode").value =
            product.kode;

        document.getElementById("productName").value =
            product.nama;

        document.getElementById("category").value =
            product.kategori;

        document.getElementById("price").value =
            product.harga;

        document.getElementById("stock").value =
            product.stok;

        document.getElementById("status").value =
            product.status;


        if (modal) {
            modal.classList.add("show");
        }

    };


    /* =================================================
       HAPUS PRODUK
       ================================================= */

    window.deleteProduct = function (kode) {

        const product =
            products.find(
                p => p.kode === kode
            );

        if (!product) {
            return;
        }


        const yakin = confirm(
            `Hapus produk "${product.nama}"?`
        );


        if (!yakin) {
            return;
        }


        products =
            products.filter(
                p => p.kode !== kode
            );


        saveProducts(products);

        render();

    };

}


/* =====================================================
   UPDATE RINGKASAN PRODUK
   ===================================================== */

function updateProductSummary() {

    const products = getProducts();


    const totalProduct =
        document.getElementById("totalProduct");

    const totalStock =
        document.getElementById("totalStock");

    const lowStock =
        document.getElementById("lowStock");

    const outStock =
        document.getElementById("outStock");


    if (totalProduct) {

        totalProduct.textContent =
            products.length + " Produk";

    }


    if (totalStock) {

        totalStock.textContent =
            products
                .reduce(
                    (total, p) => total + Number(p.stok),
                    0
                )
                .toLocaleString("id-ID") +
            " Unit";

    }


    if (lowStock) {

        lowStock.textContent =
            products.filter(
                p => p.status === "Stok Menipis"
            ).length +
            " Produk";

    }


    if (outStock) {

        outStock.textContent =
            products.filter(
                p => p.status === "Stok Habis"
            ).length +
            " Produk";

    }

}


/* =====================================================
   OUTLET
   ===================================================== */

function initOutlet() {

    let outlets = getOutlets();


    const table =
        document.getElementById("outletTable");

    const search =
        document.getElementById("searchOutlet");

    const wilayah =
        document.getElementById("wilayahFilter");

    const status =
        document.getElementById("statusOutletFilter");


    function render(data = outlets) {

        table.innerHTML =
            data.map(function (o) {

                const index =
                    outlets.findIndex(
                        x => x.kode === o.kode
                    );


                return `
                    <tr>

                        <td>
                            <strong class="product-code">
                                ${o.kode}
                            </strong>
                        </td>

                        <td>

                            <div class="product-name">

                                <div class="product-image">
                                    <i class="fa-solid fa-store"></i>
                                </div>

                                <div>

                                    <strong>
                                        ${o.nama}
                                    </strong>

                                    <span>
                                        Outlet ${o.wilayah}
                                    </span>

                                </div>

                            </div>

                        </td>

                        <td>${o.wilayah}</td>

                        <td>${o.alamat}</td>

                        <td>${rupiah(o.penjualan)}</td>

                        <td>

                            <span class="stock-status ${
                                o.status === "Aktif"
                                    ? "available"
                                    : "low"
                            }">

                                ${o.status}

                            </span>

                        </td>

                        <td>

                            <div class="table-actions">

                                <button
                                    class="edit-btn"
                                    onclick="editOutlet(${index})">

                                    <i class="fa-solid fa-pen"></i>

                                </button>

                                <button
                                    class="delete-btn"
                                    onclick="deleteOutlet(${index})">

                                    <i class="fa-solid fa-trash"></i>

                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");


        const count =
            document.getElementById("outletCount");

        if (count) {

            count.textContent =
                `Menampilkan ${data.length} outlet`;

        }


        updateOutletSummary();

    }


    function filter() {

        const q =
            search.value.toLowerCase();

        const w =
            wilayah.value;

        const s =
            status.value;


        const filtered =
            outlets.filter(function (o) {

                return (

                    (
                        o.kode +
                        " " +
                        o.nama
                    )
                    .toLowerCase()
                    .includes(q)

                    &&

                    (
                        w === "Semua Wilayah" ||
                        o.wilayah === w
                    )

                    &&

                    (
                        s === "Semua Status" ||
                        o.status === s
                    )

                );

            });


        render(filtered);

    }


    if (search) {
        search.addEventListener(
            "input",
            filter
        );
    }


    if (wilayah) {
        wilayah.addEventListener(
            "change",
            filter
        );
    }


    if (status) {
        status.addEventListener(
            "change",
            filter
        );
    }


    /* =================================================
       FORM OUTLET
       ================================================= */

    const form =
        document.getElementById("outletForm");


    if (form) {

        form.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();


                const index =
                    document.getElementById(
                        "outletIndex"
                    ).value;


                const data = {

                    kode:
                        document.getElementById(
                            "kodeOutlet"
                        ).value.trim(),

                    nama:
                        document.getElementById(
                            "namaOutlet"
                        ).value.trim(),

                    wilayah:
                        document.getElementById(
                            "wilayahOutlet"
                        ).value,

                    alamat:
                        document.getElementById(
                            "alamatOutlet"
                        ).value.trim(),

                    penjualan:
                        index === ""
                            ? 0
                            : outlets[index].penjualan,

                    status:
                        document.getElementById(
                            "statusOutlet"
                        ).value

                };


                if (index === "") {

                    outlets.push(data);

                } else {

                    outlets[index] = data;

                }


                saveOutlets(outlets);

                closeOutletModal();

                render();

            }
        );

    }


    window.openOutletModal = function () {

        document.getElementById(
            "outletForm"
        ).reset();

        document.getElementById(
            "outletIndex"
        ).value = "";

        document.getElementById(
            "outletModalTitle"
        ).textContent =
            "Tambah Outlet";

        document.getElementById(
            "outletModal"
        ).classList.add("show");

    };


    window.closeOutletModal = function () {

        document.getElementById(
            "outletModal"
        ).classList.remove("show");

    };


    window.editOutlet = function (index) {

        const o =
            outlets[index];

        document.getElementById(
            "outletIndex"
        ).value = index;

        document.getElementById(
            "outletModalTitle"
        ).textContent =
            "Edit Outlet";

        document.getElementById(
            "kodeOutlet"
        ).value = o.kode;

        document.getElementById(
            "namaOutlet"
        ).value = o.nama;

        document.getElementById(
            "wilayahOutlet"
        ).value = o.wilayah;

        document.getElementById(
            "alamatOutlet"
        ).value = o.alamat;

        document.getElementById(
            "statusOutlet"
        ).value = o.status;

        document.getElementById(
            "outletModal"
        ).classList.add("show");

    };


    window.deleteOutlet = function (index) {

        if (
            !confirm(
                `Hapus outlet "${outlets[index].nama}"?`
            )
        ) {
            return;
        }


        outlets.splice(index, 1);

        saveOutlets(outlets);

        render();

    };


    window.resetOutletFilter = function () {

        search.value = "";

        wilayah.selectedIndex = 0;

        status.selectedIndex = 0;

        render();

    };


    render();

}


/* =====================================================
   RINGKASAN OUTLET
   ===================================================== */

function updateOutletSummary() {

    const outlets =
        getOutlets();


    const total =
        outlets.length;

    const active =
        outlets.filter(
            o => o.status === "Aktif"
        ).length;

    const inactive =
        outlets.filter(
            o => o.status === "Tidak Aktif"
        ).length;

    const regions =
        new Set(
            outlets.map(
                o => o.wilayah
            )
        ).size;


    const totalEl =
        document.getElementById("totalOutlet");

    const activeEl =
        document.getElementById("activeOutlet");

    const inactiveEl =
        document.getElementById("inactiveOutlet");

    const regionEl =
        document.getElementById("regionOutlet");

    const noteEl =
        document.getElementById("activeOutletNote");


    if (totalEl) {
        totalEl.textContent = total;
    }

    if (activeEl) {
        activeEl.textContent = active;
    }

    if (inactiveEl) {
        inactiveEl.textContent = inactive;
    }

    if (regionEl) {
        regionEl.textContent = regions;
    }

    if (noteEl) {

        noteEl.textContent =
            total
                ? `${((active / total) * 100).toFixed(1)}% dari total outlet`
                : "0% dari total outlet";

    }

}


/* =====================================================
   DASHBOARD
   ===================================================== */

function initDashboard() {

    updateDashboard();

}


/* =====================================================
   UPDATE DASHBOARD
   ===================================================== */

function updateDashboard() {

    const products =
        getProducts();

    const outlets =
        getOutlets();


    const totalStock =
        products.reduce(
            (total, p) =>
                total + Number(p.stok),
            0
        );


    const lowStock =
        products.filter(
            p =>
                p.status === "Stok Menipis"
        ).length;


    const activeOutlet =
        outlets.filter(
            o =>
                o.status === "Aktif"
        ).length;


    /* TOTAL PRODUK */

    const totalProduct =
        document.getElementById(
            "dashboardTotalProduct"
        );

    if (totalProduct) {
        totalProduct.textContent =
            products.length;
    }


    /* TOTAL STOK */

    const stock =
        document.getElementById(
            "dashboardTotalStock"
        );

    if (stock) {
        stock.textContent =
            totalStock.toLocaleString("id-ID");
    }


    /* TOTAL OUTLET */

    const totalOutlet =
        document.getElementById(
            "dashboardTotalOutlet"
        );

    if (totalOutlet) {
        totalOutlet.textContent =
            outlets.length;
    }


    /* OUTLET AKTIF */

    const active =
        document.getElementById(
            "dashboardActiveOutlet"
        );

    if (active) {
        active.textContent =
            activeOutlet;
    }


    /* PRODUK STOK MENIPIS */

    const low =
        document.getElementById(
            "dashboardLowStock"
        );

    if (low) {
        low.textContent =
            lowStock;
    }

}
/* =================================================
   PENJUALAN
================================================= */

function openSalesModal() {

    const modal = document.getElementById("salesModal");

    const form = document.getElementById("salesForm");

    if (form) {
        form.reset();
    }

    if (modal) {
        modal.classList.add("show");
    }

}


function closeSalesModal() {

    const modal =
        document.getElementById("salesModal");

    if (modal) {
        modal.classList.remove("show");
    }

}


/* =========================
   SIMPAN PENJUALAN
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const salesForm =
        document.getElementById("salesForm");

    if (!salesForm) {
        return;
    }


    salesForm.addEventListener("submit", function (e) {

        e.preventDefault();


        const kode =
            document.getElementById("kodeTransaksi").value.trim();

        const tanggal =
            document.getElementById("tanggalPenjualan").value;

        const outlet =
            document.getElementById("outletPenjualan").value;

        const produk =
            document.getElementById("produkPenjualan").value;

        const jumlah =
            document.getElementById("jumlahPenjualan").value;

        const total =
            document.getElementById("totalPenjualan").value;


        if (
            !kode ||
            !tanggal ||
            !outlet ||
            !produk ||
            !jumlah ||
            !total
        ) {

            alert("Mohon lengkapi semua data penjualan.");

            return;

        }


        const table =
            document.getElementById("salesTable");


        if (!table) {
            return;
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong class="product-code">
                    ${kode}
                </strong>
            </td>

            <td>
                ${tanggal}
            </td>

            <td>
                ${outlet}
            </td>

            <td>

                <div class="product-name">

                    <div class="product-image">

                        <i class="fa-solid fa-pump-soap"></i>

                    </div>

                    <div>

                        <strong>
                            ${produk}
                        </strong>

                    </div>

                </div>

            </td>

            <td>
                ${jumlah} Unit
            </td>

            <td>
                ${rupiah(Number(total))}
            </td>

            <td>

                <div class="table-actions">

                    <button
                        type="button"
                        class="delete-btn"
                        onclick="this.closest('tr').remove()">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        `;


        table.appendChild(row);


        closeSalesModal();


        salesForm.reset();


        alert("Penjualan berhasil ditambahkan.");

    });

});

            // =========================
            // FILTER PENCARIAN
            // =========================

            const searchMatch =
                keyword === "" ||
                kode.includes(keyword) ||
                produk.includes(keyword) ||
                outlet.toLowerCase().includes(keyword);

            // =========================
            // FILTER OUTLET
            // =========================

            const outletMatch =
                selectedOutlet === "Semua Outlet" ||
                outlet === selectedOutlet;

            // =========================
            // FILTER TANGGAL
            // =========================

            let dateMatch = true;

            if (selectedDate !== "Semua Periode") {

                const parts = tanggal.split("/");

                if (parts.length === 3) {

                    const day = parseInt(parts[0]);
                    const month = parseInt(parts[1]) - 1;
                    const year = parseInt(parts[2]);

                    const transactionDate =
                        new Date(year, month, day);

                    transactionDate.setHours(0, 0, 0, 0);

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate === "Hari Ini") {

                        dateMatch =
                            transactionDate.getTime() ===
                            today.getTime();

                    }

                    if (selectedDate === "Minggu Ini") {

                        const startOfWeek = new Date(today);

                        const dayOfWeek =
                            today.getDay();

                        const difference =
                            dayOfWeek === 0
                                ? 6
                                : dayOfWeek - 1;

                        startOfWeek.setDate(
                            today.getDate() - difference
                        );

                        startOfWeek.setHours(0, 0, 0, 0);

                        const endOfWeek =
                            new Date(startOfWeek);

                        endOfWeek.setDate(
                            startOfWeek.getDate() + 6
                        );

                        endOfWeek.setHours(
                            23, 59, 59, 999
                        );

                        dateMatch =
                            transactionDate >= startOfWeek &&
                            transactionDate <= endOfWeek;
                    }

                    if (selectedDate === "Bulan Ini") {

                        dateMatch =
                            transactionDate.getMonth() ===
                                today.getMonth() &&
                            transactionDate.getFullYear() ===
                                today.getFullYear();
                    }
                }
            }

            // =========================
            // TAMPILKAN / SEMBUNYIKAN
            // =========================

            if (
                searchMatch &&
                outletMatch &&
                dateMatch
            ) {

                row.style.display = "";

                visibleRows++;

            } else {

                row.style.display = "none";

            }

        

        // =========================
        // UPDATE JUMLAH
        // =========================

        if (count) {

            count.textContent =
                `Menampilkan ${visibleRows} transaksi`;

        }

        if (footerCount) {

            if (visibleRows === 0) {

                footerCount.textContent =
                    "Tidak ada transaksi yang ditemukan";

            } else {

                footerCount.textContent =
                    `Menampilkan ${visibleRows} transaksi`;

            }

        }
    


    // =========================
    // EVENT FILTER
    // =========================

    search.addEventListener(
        "input",
        filterSales
    );

    outletFilter.addEventListener(
        "change",
        filterSales
    );

    dateFilter.addEventListener(
        "change",
        filterSales
    );


    // =========================
    // RESET
    // =========================

    window.resetSalesFilter = function() {

        search.value = "";

        outletFilter.value =
            "Semua Outlet";

        dateFilter.value =
            "Semua Periode";

        filterSales();

    };


    // Jalankan pertama kali
    filterSales();


    // =========================
    // JIKA DATA PENJUALAN
    // DITAMBAHKAN
    // =========================

    const observer =
        new MutationObserver(function() {

            filterSales();

        });

    observer.observe(table, {
        childList: true,
        subtree: true
    });
// ===== PERBAIKAN FILTER OUTLET PENJUALAN =====
document.addEventListener("DOMContentLoaded", function () {

    const outletFilter = document.getElementById("outletSalesFilter");
    const dateFilter = document.getElementById("dateSalesFilter");
    const search = document.getElementById("searchSales");
    const table = document.getElementById("salesTable");

    if (!outletFilter || !table) return;

    function jalankanFilterPenjualan() {

        const outletDipilih = outletFilter.value.trim().toLowerCase();
        const periodeDipilih = dateFilter
            ? dateFilter.value.trim().toLowerCase()
            : "semua periode";

        const kataKunci = search
            ? search.value.trim().toLowerCase()
            : "";

        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(function (row) {

            const cells = row.querySelectorAll("td");

            if (cells.length < 4) return;

            // Kolom tabel:
            // 0 = Kode Transaksi
            // 1 = Tanggal
            // 2 = Outlet
            // 3 = Produk

           const kode = cells[0].innerText.toLowerCase();
const tanggal = cells[1].innerText.toLowerCase();
const outlet = cells[2].innerText.trim().toLowerCase();
const produk = cells[3].innerText.toLowerCase();

// FILTER OUTLET
const cocokOutlet =
    outletDipilih === "" ||
    outletDipilih.toLowerCase() === "semua outlet" ||
    outlet === outletDipilih.trim().toLowerCase();

            // FILTER PENCARIAN
            const cocokSearch =
                kataKunci === "" ||
                kode.includes(kataKunci) ||
                tanggal.includes(kataKunci) ||
                outlet.includes(kataKunci) ||
                produk.includes(kataKunci);

            // FILTER PERIODE
            let cocokPeriode = true;

            if (periodeDipilih !== "" &&
                periodeDipilih !== "semua periode") {

                
                const sekarang = new Date();

const [hari, bulan, tahun] = tanggal.split("/");
const tanggalTransaksi = new Date(
    tahun,
    bulan - 1,
    hari
);

                if (periodeDipilih === "hari ini") {
                    cocokPeriode =
                        tanggalTransaksi.toDateString() ===
                        sekarang.toDateString();
                }

                if (periodeDipilih === "minggu ini") {
                    const awalMinggu = new Date(sekarang);
                    awalMinggu.setDate(
                        sekarang.getDate() - sekarang.getDay()
                    );
                    awalMinggu.setHours(0, 0, 0, 0);

                    cocokPeriode =
                        tanggalTransaksi >= awalMinggu;
                }

                if (periodeDipilih === "bulan ini") {
                    cocokPeriode =
                        tanggalTransaksi.getMonth() === sekarang.getMonth() &&
                        tanggalTransaksi.getFullYear() === sekarang.getFullYear();
                }
            }

            row.style.display =
                cocokOutlet && cocokSearch && cocokPeriode
                    ? ""
                    : "none";
        });
    }

    // Jalankan ketika outlet dipilih
    outletFilter.addEventListener(
        "change",
        jalankanFilterPenjualan
    );

    // Jalankan ketika periode dipilih
    if (dateFilter) {
        dateFilter.addEventListener(
            "change",
            jalankanFilterPenjualan
        );
    }

    // Jalankan ketika mengetik pencarian
    if (search) {
        search.addEventListener(
            "input",
            jalankanFilterPenjualan
        );
    }

    // Jalankan pertama kali
    jalankanFilterPenjualan();

});
document.addEventListener("DOMContentLoaded", function () {
    const outletFilter = document.getElementById("outletSalesFilter");
    const periodeFilter = document.getElementById("dateSalesFilter");
    const searchFilter = document.getElementById("searchSales");

    if (outletFilter) {
        outletFilter.addEventListener("change", function () {
            jalankanFilterPenjualan();
        });
    }

    if (periodeFilter) {
        periodeFilter.addEventListener("change", function () {
            jalankanFilterPenjualan();
        });
    }

    if (searchFilter) {
        searchFilter.addEventListener("input", function () {
            jalankanFilterPenjualan();
        });
    }
});



