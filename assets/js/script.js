let limit = 4;
let start = 0;
let action = "inactive";
let name = "";
let type = "";
let result = 1;
let all_data = 0;
let img = "";
let img_edit = null;

$(document).ready(function () {
    home();
});

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
        type: "GET",
        url: "home.html",
        success: function (response) {
            $("#content").html(response);
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
        url: "service.html",
        success: function (response) {
            $("#content").html(response);
        },
    });
}

function cost() {
    navigation('cost')

    $.ajax({
        type: "GET",
        url: "service.html",
        success: function (response) {
            $("#content").html(response);
        },
    });
}

function info() {
    navigation('info')

    $.ajax({
        type: "GET",
        url: "service.html",
        success: function (response) {
            $("#content").html(response);
        },
    });
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
                        <p class="bodytext1 semibold m-0 px-2 text-secondary">${v.name}</p>
                        <p class="bodytext2 color-black300 m-0 px-2">${v.type}</p>
                        <p class="caption m-0 py-1 px-2 text-primary">Rp.
                        ${numFormat(v.price)}</p>
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
        denyButtonText: 'No',
    }).then((isConfirm) => {
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
    });
}