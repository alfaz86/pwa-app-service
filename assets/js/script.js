let limit = 4;
let start = 0;
let action = "inactive";
let name = "";
let type = "";
let result = 1;
let all_data = 0;
let img = "";
let img_edit = null;
let user_session = null;
let service_type_price = {};

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "controller/auth.controller.php?key=auth",
        contentType: "application/json;",
        dataType: "json",
        success: function (response) {
            user = response.user ?? null;
            setUserSession(user);
            user_session = user;
        },
    });

    home();
});

function checkRole() {
    if (user_session && user_session.role == "admin") {
        return true;
    } else {
        return false;
    }
}

function setUserSession(user) {
    if (user != null) {
        $('#dropdown-content').html(`
            Profile
            <h5 id="user-session">${user.name}</h5>
            <div id="notification"></div>
            <hr>
            <button type="button" class="btn btn-sm btn-danger w-100" onclick="logout()">Logout</button>
        `);
    } else {
        $('#dropdown-content').html(`<button type="button" class="btn btn-sm btn-green w-100" data-toggle="modal" data-target="#modalLogin">Login</button>`);
    }
}

function navigation(id) {
    $(".fill-nav").removeClass("footer-active")
    $("#" + id).addClass("footer-active")
}

function selectType(id) {
    $(".btn-filter").removeClass("select-type")
    $("#" + id).addClass("select-type")
}

$(function () {
    $(window).scroll(function () {
        var margin = $('nav').height();
        if ($(this).scrollTop() >= margin) {
            $(".sticky-top").addClass("bg-white border-bottom")
        } else {
            $(".sticky-top").removeClass("bg-white border-bottom")
        }
    });
});

function home() {
    navigation('home')

    $.ajax({
        url: "api/catalog.php?f=recommended",
        contentType: "application/json;",
        dataType: "json",
        success: function (response) {
            $("#content").html(response.view);
            let card = "";
            $.each(response.data, function (i, data) {
                card += `
                <div class="card">
                    <img draggable="false" src="${data.img}" class="img-recommended mx-auto p-3">
                    <div class="card-body">
                        <h5 class="f-bold mb-0" style="color: var(--theme-blue-1) !important;">${data.name}</h5>
                        <h5 style="color: var(--theme-green) !important;">Rp ${numFormat(data.price)}</h5>
                    </div>
                </div>`;
            });
            card += `
            <div class="btn-continue">
                <div class="center-element">
                    <div class="btn-circle" onclick="catalog()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16" style="transform: translateY(10px) !important;">
                            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </div>
                </div>
            </div>`;
            $("#div-slides").html(card);
            document.getElementById('nav').scrollIntoView();
        },
    });
}

function catalog() {
    navigation('catalog')

    $.ajax({
        type: "GET",
        url: "catalog.html",
        success: function (response) {
            $("#content").html(response);
            document.getElementById('nav').scrollIntoView();
            $("#load_data").html("");
            name = $("#search").val();
            start = 0;
            lazzy_loader(limit);
            if (action == "inactive") {
                action = "active";
                setTimeout(function () {
                    fetch(limit, start, name, type);
                }, 1000);
            }
        },
    });
}

function service() {
    navigation('service')

    $.ajax({
        type: "GET",
        url: "api/service.php?f=viewIndex",
        contentType: "application/json;",
        dataType: "json",
        success: function (response) {
            $("#content").html(response.view);
            if ((response.data).length > 0) {
                content = "";
                $.each(response.data, function (i, data) {
                    content += `
                    <div class="card shadow-sm mb-3">
                        <div class="p-3">
                            <div class="p-0 m-0 d-flex justify-content-between">
                                <span style="font-weight: bold; color: var(--theme-blue-1)">${data.no_service}</span>
                                <select class="select-status" name="status" id="status" onchange="">
                                    <option value="pending" ${data.status == "pending" ? "selected" : ""}>pending</option>
                                    <option value="confirm" ${data.status == "confirm" ? "selected" : ""}>confirm</option>
                                    <option value="process" ${data.status == "process" ? "selected" : ""}>process</option>
                                    <option value="done" ${data.status == "done" ? "selected" : ""}>done</option>
                                </select>
                            </div>
                            <span style="font-weight: bold; color: var(--theme-gray-1)">${data.user.name}</span>
                            <br>
                            <span style="font-weight: bold; color: var(--theme-green)">Rp ${numFormat(data.service_type.price)}</span>
                            <hr class="m-1">
                            <span style="font-weight: bold; color: var(--theme-gray-1)">Jenis Servis : ${data.service_type.name}</span>
                            <br>
                            <span style="font-weight: bold; color: var(--theme-gray-1)">Tanggal : ${data.date}</span>
                        </div>
                    </div>
                    `;
                });
                $('#div-services').html(content);
                document.getElementById('nav').scrollIntoView();
            } else {
                $('#div-services').html(`<h5 style="color: var(--theme-gray-3) !important;">Belum ada jadwal servis</h5>`);
            }
        },
    });
}

function cost() {
    navigation('cost')

    $.ajax({
        type: "GET",
        url: "api/service.php?f=viewCost",
        contentType: "application/json;",
        dataType: "json",
        success: function (response) {
            $("#content").html(response.view);
            if ((response.data).length > 0) {
                content = "";
                $.each(response.data, function (i, data) {
                    content += `
                    <div class="card card-datatable shadow-sm mb-3">
                        <div class="p-3">
                            <div class="p-0 m-0 d-flex justify-content-between">
                                <span style="font-weight: bold; color: var(--theme-blue-1)">${data.name}</span>
                            </div>
                            <span style="font-weight: bold; color: var(--theme-green)">Rp ${numFormat(data.price)}</span>
                            <hr class="p-0 m-0">
                            <span style="font-weight: bold; color: var(--theme-gray-1)">${data.description}</span>
                        </div>
                    </div>
                    `;
                });
                $('#div-costs').html(content);
                document.getElementById('nav').scrollIntoView();
            } else {
                $('#div-costs').html(`<h5 style="color: var(--theme-gray-3) !important;">Belum ada jadwal servis</h5>`);
            }
        },
    });
}

function info() {
    navigation('info')
    element = document.getElementById('about')
    if (element) {
        document.getElementById('about').scrollIntoView();
    } else {
        Swal.fire({
            title: "Aplikasi Service v.1.0",
            confirmButtonText: "Ok",
        });
    }
}

function fetch(limit, start, name, type) {
    $.ajax({
        url: "/api/catalog.php?f=search",
        type: "post",
        contentType: "application/json;",
        dataType: "json",
        data: JSON.stringify({
            limit: limit,
            start: start,
            search: {
                name: name,
                type: type
            },
        }),
        success: function (response) {
            result = response.result;
            all_data = response.all_data;
            if (response.status) {
                let card_data = "";
                $.each(response.data, function (i, v) {
                    card_data = ` <a class="product-items w-50 flex-column"
                        href="javascript:void(0)" onclick="dialog('${v.id}');">
                        <div class="product-cover mb-2" style="background-image:
                        url('${v.img}');"></div>
                        <p class="bodytext1 semibold m-0 px-2 text-secondary" style="font-weight: bold;">${v.name}</p>
                        <p class="bodytext2 color-black300 m-0 px-2" style="color: var(--theme-gray-1) !important">${v.type}</p>
                        <p class="caption m-0 py-1 px-2 text-primary" style="font-weight: bold; color: var(--theme-green) !important">Rp. ${numFormat(v.price)}</p>
                    </a>`;
                    $("#load_data").append(card_data);
                });
                action = "inactive";
                $("#load_data_message").html("");
            } else {
                $("#load_data").html("");
                $("#load_data_message").html(
                    '<div class="col-12 text-center"><h4 class="text-danger">Oops, barang yang anda cari tidak di temukan</h4 ></div > '
                );
                action = "active";
            }
        },
    });
}

function numFormat(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const setType = (newType) => {
    type = newType == "all" ? "" : newType;
    selectType(newType)
    search()
}

function lazzy_loader(limit) {
    var output = "";
    for (var count = 0; count < limit; count++) {
        output += `
        <a class="product-items w-50 flex-column shimmer"
        href="javascript:void(0)">
        <div class="product-cover animate mb-2" ></div>
        <p class="bodytext1 semibold m-0 px-2 text-secondary animate
        mb-2"></p>
        <p class="bodytext2 color-black300 m-0 px-2 animate mb2"></p>
        <p class="caption m-0 py-1 px-2 text-primary animate"></p>
        </a>`;
    }
    $("#load_data_message").html(output);
}

$(window).scroll(function () {
    if (
        $(window).scrollTop() + $(window).height() > $("#load_data").height()
        &&
        action == "inactive" &&
        result == 1 &&
        all_data > (start + limit)
    ) {
        lazzy_loader(limit);
        action = "active";
        start = start + limit;
        name = $("#search").val();
        setTimeout(function () {
            fetch(limit, start, name, type);
        }, 1000);
    }
});

function createCatalog(data) {
    Swal.fire("Sedang menyimpan data");
    Swal.showLoading();
    $.ajax({
        url: "/api/catalog.php?f=create",
        type: "post",
        contentType: "application/json;",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (response) {
            if (response.status) {
                lazzy_loader(limit);
                action = "inactive";
                start = 0;
                name = "";
                $('form#create-catalog').trigger("reset");
                $('#custom-file-label').html("Upload gambar...");
                $("#modalCatalog").modal('hide');
                $("#load_data").html("");
                lazzy_loader(limit);
                if (action == "inactive") {
                    action = "active";
                    fetch(limit, start, name, type);
                }
                Swal.fire({
                    text: response.message,
                    icon: "success",
                    confirmButtonText: "Ok",
                });
            } else {
                Swal.fire({
                    text: response.message,
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        },
    });
}

function dialog(id) {
    if (!checkRole()) return false;
    $.ajax({
        url: "/api/catalog.php?f=edit",
        type: "post",
        contentType: "application/json;",
        dataType: "json",
        data: JSON.stringify(id),
        success: function (response) {
            if (response.data != null) {
                $("#modalEditCatalog").modal('show');
                $('#id').val(response.data.id);
                $('#btn-delete').attr({ 'data-id': response.data.id });
                $('#name-edit').val(response.data.name);
                $('#price-edit').val(response.data.price);
                $('#type-edit').val(response.data.type).trigger('change');
            }
        },
    });
}

function updateCatalog(data) {
    Swal.fire("Sedang menyimpan data");
    Swal.showLoading();
    $.ajax({
        url: "/api/catalog.php?f=update",
        type: "post",
        contentType: "application/json;",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (response) {
            if (response.status) {
                lazzy_loader(limit);
                action = "inactive";
                start = 0;
                name = "";
                img_edit = null;
                $('form#edit-catalog').trigger("reset");
                $('#custom-file-label-edit').html("Upload gambar...");
                $("#modalEditCatalog").modal('hide');
                $("#load_data").html("");
                lazzy_loader(limit);
                if (action == "inactive") {
                    action = "active";
                    fetch(limit, start, name, type);
                }
                Swal.fire({
                    text: response.message,
                    icon: "success",
                    confirmButtonText: "Ok",
                });
            } else {
                Swal.fire({
                    text: response.message,
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        },
    });
}

function deleteCatalog(e) {
    Swal.fire({
        text: "Apakah anda yakin ingin menghapus data ini?",
        icon: "warning",
        confirmButtonText: "Yes",
        showDenyButton: true,
        denyButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/api/catalog.php?f=delete",
                type: "post",
                contentType: "application/json;",
                dataType: "json",
                data: JSON.stringify(e.dataset.id),
                success: function (response) {
                    if (response.status) {
                        lazzy_loader(limit);
                        action = "inactive";
                        start = 0;
                        name = "";
                        $("#modalEditCatalog").modal('hide');
                        $("#load_data").html("");
                        lazzy_loader(limit);
                        if (action == "inactive") {
                            action = "active";
                            fetch(limit, start, name, type);
                        }
                        Swal.fire({
                            text: response.message,
                            icon: "success",
                            confirmButtonText: "Ok",
                        });
                    } else {
                        Swal.fire({
                            text: response.message,
                            icon: "error",
                            confirmButtonText: "Ok",
                        });
                    }
                },
            });
        }
    });
}

// Funtion Authentication
$("form#auth-login").submit(function (e) {
    e.preventDefault();
    let form = $(this).closest('form').serializeArray();
    data = {};
    form.forEach((v, i) => {
        key = v.name.replace("-edit", "")
        data[key] = v.value;
    });
    login(data);
});

function login(data) {
    $.ajax({
        url: "controller/auth.controller.php?key=login",
        type: "post",
        dataType: "json",
        data: JSON.stringify({
            email: data.email,
            password: data.password
        }),
        success: function (result) {
            if (result) {
                location.reload();
            }
        },
    });
}

function logout() {
    $.ajax({
        type: "GET",
        url: "controller/auth.controller.php?key=logout",
        success: function (result) {
            if (result) {
                location.reload();
            }
        },
    });
}
// Funtion Authentication

function addServiceView() {
    if (!user_session) {
        $("#modalLogin").modal('show');
        return false;
    };
    $.ajax({
        type: "GET",
        url: "api/service.php?f=viewCreate",
        contentType: "application/json;",
        dataType: "json",
        success: function (response) {
            $("#content").html(response.view);
            let respon_date = {};
            $.each(response.data, function (i, data) {
                $('#service_type_id').append($('<option>', {
                    value: data.id,
                    text: data.name
                }));
                respon_date[data.id] = data.price;
            });
            service_type_price = respon_date;
        },
    });
}

function createService(data) {
    $.ajax({
        url: "/api/service.php?f=create",
        type: "post",
        contentType: "application/json;",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (response) {
            if (response.status) {
                Swal.fire({
                    text: response.message,
                    icon: "success",
                    confirmButtonText: "Ok",
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        service();
                    }
                });
            } else {
                Swal.fire({
                    text: response.message,
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        },
    });
}