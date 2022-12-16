let limit = 4;
let start = 0;
let action = "inactive";
let name = "";
let type = "";
let result = 1;

$(document).ready(function () {
    home();
});

function navigation(id) {
    $(".fill-nav").removeClass("footer-active")
    $("#" + id).addClass("footer-active")
}

$(function () {
    $(window).scroll(function () {
        var margin = $('nav').height();
        console.log(margin);
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
            // $("#home").addClass("active");
            // $("#katalog").removeClass("active");
            // $("#profil").removeClass("active");

            // $("#load_data").html("");
            // start = 0;
            // lazzy_loader(limit);
            // if (action == "inactive") {
            //     action = "active";
            //     fetching_data(limit, start, search);
            // }
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
            name = $("#search").val();
            fecth(limit, start, name, type);
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

function fecth(limit, start, name, type) {
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