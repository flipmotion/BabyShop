'use strict';

// ---------------------------------------------------------------------------------------
// Multi Level Drowpdown Menu Start
$(function () {
    $(".dropdown-menu > li > a.dropdown-toggle").on("click", function (e) {
        var current = $(this).next();
        var grandparent = $(this).parent().parent();
        if ($(this).hasClass('left-caret') || $(this).hasClass('right-caret'))
            $(this).toggleClass('right-caret left-caret');
        grandparent.find('.left-caret').not(this).toggleClass('right-caret left-caret');
        grandparent.find(".sub-menu:visible").not(current).hide();
        current.toggle();
        e.stopPropagation();
    });
    $(".dropdown-menu > li > a:not(.dropdown-toggle)").on("click", function () {
        var root = $(this).closest('.dropdown');
        root.find('.left-caret').toggleClass('right-caret left-caret');
        root.find('.sub-menu:visible').hide();
    });
});
// Multi Level Drowpdown Menu End
// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// Mega Drowpdown Menu Start
jQuery(document).ready(function () {
    if (window.matchMedia('(min-width: 768px)').matches) {
        $(".dropdown").hover(
                function () {
                    $('.dropdown-menu', this).stop(true, true).slideDown("fast");
                },
                function () {
                    $('.dropdown-menu', this).stop(true, true).slideUp("fast");
                }
        );
        // SUBSCRIBE NEWSLETTER
        /*$(".subscribe-me").subscribeBetter({
         trigger: "onload",
         delay: 5000
         });*/
        $('.subscribe-me').hide();
    }

    if (window.matchMedia('(max-width: 767px)').matches) {
        $(".mega-dropdown").hover(
                function () {
                    $('.dropdown-menu', this).stop(true, true).slideDown("fast");
                },
                function () {
                    $('.dropdown-menu', this).stop(true, true).slideUp("fast");
                }
        );
    }


    $('.view-as .tabination li a').click(function () {

        var view = $(this).attr('href');
        $.post("/include/SetTemplateCatalog.php", {view: view}, function (data) {
            location.reload();
        });
        return false;
    });


    //alert`s
    var bootstrap_alert = function() {}
    bootstrap_alert.success = function(message) {
        //$('#alert_placeholder').fadeIn();
        $('#alert_placeholder').html('<div class="alert alert-success"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');
        setTimeout(function() {
            $("div.alert").slideUp();
        }, 1000);
    }
    bootstrap_alert.warning = function(message) {
        $('#alert_placeholder').html('<div class="alert alert-warning"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>')
    }





    //MY CATALOG READY

    $("#OrderForm").on("submit", function (event) {
        event.preventDefault();
        var FormData =  $(this).serialize();
            $.post("/include/Order.php",{FormData:FormData},function(data){
                if(data.toString().trim() == 'name' || data.toString().trim() == 'adress' || data.toString().trim() == 'email' || data.toString().trim() == 'phone'){
                    $("input").css('border','1px solid #E4E4E4');
                    $("input[name='"+data.toString().trim()+"']").css('border','1px solid red');
                }else{
                    $("input").css('border','1px solid #E4E4E4');
                    //alert("Ваш заказ №"+data+" тут появится что то красиво, но пока Игорь не дал страницу =) Заказ отображается в дминке во кладке заказы. Сообщения на почту настроются позже. Спасибо!");
                    $('#thx').modal('show');
                }
            });
    });

    $('.addCart').click(function (e) {
        e.preventDefault();
        var idItem = $(this).data('item');
        $.post("/include/AddCart.php", {idItem: idItem},
        function (data) {
            if (data.toString().trim() === 'NULL') {
                $('#count-smallcart').html('0 товаров');
                $('.cart-table').html('');
            } else {
                RenderSmallCart(data);
                bootstrap_alert.success("Товар <strong>" + idItem + "</strong> добавлен в корзину");
            }
        });
    });

    UpdateSmallCart();

});

//MY CATALOG FUNCTIONS

//Updates
function UpdateSmallCart() {
    var update = 'update';
    $.post("/include/AddCart.php", {update: update},
    function (data) {


        if (data.toString().trim() === 'NULL') {
            $('#count-smallcart').html('0 товаров');
            $('.cart-table').html('');
        } else {
            RenderSmallCart(data);
        }

    });

}

function DeleteSmallCart(param) {
    var Delete = param;

    $.post("/include/AddCart.php", {delete: Delete},
    function (data) {
        if (data.toString().trim() === 'NULL') {
            $('#count-smallcart').html('0 товаров');
            $('.cart-table').html('');
        } else {
            RenderSmallCart(data);
        }
    });
    
}

function DeleteOrderFinal(param) {
    var Delete = param;

    $.post("/include/AddCart.php", {delete: Delete},
    function (data) {
        if (data.toString().trim() === 'NULL') {
            $('#count-smallcart').html('0 товаров');
            $('.cart-table').html('');
        } else {
            RenderSmallCart(data);
            RenderOrderFinal(data);
        }
    });

}


//Renders
function RenderSmallCart(Json) {
    var obj = jQuery.parseJSON(Json);
    var count = obj.length;
    $('#count-smallcart').html('(' + count + ' товаров)');
    var SmallCart = '';
    $.each(obj, function (key, value) {


        var SmallCartImg = '<tr><td><div class="product-media"> <a href="#">\n\
<img alt="product-img" src="' + obj[key].DETAIL_PICTURE + '"></a>\n\
</div>\n\
</td>';



        var SmallCartBody = '<td><div class="product-content"><div class="product-name"><a href="#">' + obj[key].NAME + '</a>\n\
<div class="product-price"><h5 class="price"><b>' + obj[key].PROPERTY_PRICE_VALUE + '*' + obj[key].count + '</b>\n\
</h5><a href="javascript:void(0)" onclick="javascript:DeleteSmallCart(' + obj[key].ID + ')" class="delete fa fa-close"></a></div></div></td></tr> ';


        SmallCart = SmallCart + SmallCartImg + SmallCartBody;

        $('.cart-table').html(SmallCart);
    });
}



function RenderOrderFinal(data) {
    var OrderCart = '';
    var obj = jQuery.parseJSON(data);
    var sum = 0;
    $.each(obj, function (key, value) {
        var OpenProduct = '<tr>';
        var ImgProduct = '<td class="image">\n\
                    <div class="white-bg cart-img"><a class="media-link" href="#">\n\
                        <img width="120px" heigth="120px" src="' + obj[key].DETAIL_PICTURE + '" alt="">\n\
                        </a>\n\
                    </div>\n\
                    </td>';

        var InfoProduct = '<td class="description">\n\
                    <a href="#">' + obj[key].NAME + '</a>\n\
                        <p>Тут совйства, которых пока нет</p>\n\
                        <a href="#" class="remove pink-color" onclick="javascript:DeleteOrderFinal(' + obj[key].ID + ')">\n\
                        <i class="fa fa-times"></i> Удалить \n\
                    </a></td>';

        var disabled = 'disabled="disabled"';
        var disabled2 = 'disabled="disabled"';

        if (obj[key].count > 1) {
            var disabled = "";
        }

        if (obj[key].count < 10) {
            var disabled2 = "";
        }
        sum = sum + (obj[key].PROPERTY_PRICE_VALUE * obj[key].count);
        var CountProduct = '<td class="quantity">\n\
                    <div class="input-group">\n\
                        <span class="input-group-btn">\n\
                            <button type="button" class="btn btn-default  btn-number minus" ' + disabled + '  data-type="minus" data-item="' + obj[key].ID + '" data-field="quant[1]">\n\
                                <span class="glyphicon glyphicon-minus"></span>\n\
                            </button>\n\
                        </span>\n\
                        <input type="text" name="quant[1]" class="form-control input-number" value="' + obj[key].count + '" min="1" max="10">\n\
                        <span class="input-group-btn">\n\
                            <button type="button" class="btn btn-default btn-number" data-type="plus" ' + disabled2 + ' data-item="' + obj[key].ID + '" data-field="quant[1]">\n\
                                <span class="glyphicon glyphicon-plus"></span>\n\
                            </button>\n\
                        </span>\n\
                    </div>\n\
                    </td>';

        var TotalProduct = '<td class="total">\n\
                        <strong> ' + obj[key].PROPERTY_PRICE_VALUE + '*' + obj[key].count + ' </strong> \n\
                    </td>';

        var CloseProduct = '</tr>';

        OrderCart = OrderCart + OpenProduct + ImgProduct + InfoProduct + CountProduct + TotalProduct + CloseProduct;

    });
    //alert(OrderCart);
    $('#OrderSumm').text('Сумма: ' + sum + ' руб.');
    $('#OrderSubtotalSumm').text(sum + ' руб.');
    $('#OrderTableBody').html(OrderCart);
    RenderSmallCart(data);

    //minus and plus
    $('.btn-number').click(function (e) {
        e.preventDefault();
        var fieldName = $(this).attr('data-field');
        var type = $(this).attr('data-type');
        var input = $("input[name='" + fieldName + "']");
        var currentVal = parseInt(input.val());
        var ItemId = $(this).attr('data-item');
        if (!isNaN(currentVal)) {
            if (type == 'minus') {

                if (currentVal > input.attr('min')) {
                    input.val(currentVal - 1).change();
                }
                if (parseInt(input.val()) == input.attr('min')) {
                    $(this).attr('disabled', true);
                }
                OrderFinalMinus(ItemId);

            } else if (type == 'plus') {

                if (currentVal < input.attr('max')) {
                    input.val(currentVal + 1).change();
                }
                if (parseInt(input.val()) == input.attr('max')) {
                    $(this).attr('disabled', true);
                }
                OrderFinalPlus(ItemId);
            }
        } else {
            alert("CODE:132533");
        }
    });
    $('.input-number').focusin(function () {
        $(this).data('oldValue', $(this).val());
    });

    $('.input-number').change(function () {
        var minValue = parseInt($(this).attr('min'));
        var maxValue = parseInt($(this).attr('max'));
        var valueCurrent = parseInt($(this).val());

        var name = $(this).attr('name');
        if (valueCurrent >= minValue) {
            $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
        } else {
            alert('Sorry, the minimum value was reached');
            $(this).val($(this).data('oldValue'));
        }
        if (valueCurrent <= maxValue) {
            $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
        } else {
            alert('Sorry, the maximum value was reached');
            $(this).val($(this).data('oldValue'));
        }


    });

// ---------------------------------------------------------------------------------------



}


function OrderFinalPlus(ItemId) {
    $.post("/include/AddCart.php", {plus: ItemId}, function (data) {
        if (data.toString().trim() === 'NULL') {
            $('#count-smallcart').html('0 товаров');
            $('.cart-table').html('');
        } else {
            RenderSmallCart(data);
            RenderOrderFinal(data);
        }

    });
}

function OrderFinalMinus(ItemId) {
    $.post("/include/AddCart.php", {minus: ItemId}, function (data) {
        if (data.toString().trim() === 'NULL') {
            $('#count-smallcart').html('0 товаров');
            $('.cart-table').html('');
        } else {
            RenderSmallCart(data);
            RenderOrderFinal(data);
        }
    });
}



// Mega Drowpdown Menu End
// ---------------------------------------------------------------------------------------



jQuery(document).ready(function () {

    // Preloader
    $(window).bind("load", function () {
        $('#preloader').delay(1000).fadeOut(200);

    });

    var interval = null;

    interval = setInterval(function () {
        if ($("body:has(#preloader)")) {
            document.getElementsByClassName("baby")[0].classList.toggle('down');
        }
    }, 500);



    // Sticky Header
    $(window).scroll(function () {
        if (window.matchMedia('(min-width: 767px)').matches) {
            if (!(jQuery('body > main ').hasClass('header-style-wrap'))) {
                if ($(this).scrollTop() > 1) {
                    $('.header-wrapper').addClass("sticky-header");
                }
                else {
                    $('.header-wrapper').removeClass("sticky-header");
                }
            }
        }
    });


    // ---------------------------------------------------------------------------------------
    // Scroll To Top Start

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.to-top').fadeIn();
        } else {
            $('.to-top').fadeOut();
        }
    });
    //Click event to scroll to top
    $('.to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });

    //Scroll To Top End
    // ---------------------------------------------------------------------------------------


    // ---------------------------------------------------------------------------------------
    // Product Slider Start

    jQuery(".product-slider.related-product").owlCarousel({
        autoPlay: true, //Set AutoPlay to 3 seconds
        items: 3,
        itemsDesktop: [1199, 3],
        itemsTablet: [1024, 2],
        itemsTabletSmall: [768, 2],
        itemsMobile: [480, 1]
    });
    jQuery(".verticle-tabination .product-slider").owlCarousel({
        autoPlay: true, //Set AutoPlay to 3 seconds
        items: 3,
        itemsDesktop: [1199, 3],
        itemsTablet: [1024, 3],
        itemsTabletSmall: [767, 2],
        itemsMobile: [480, 1]
    });
    jQuery(".product-slider").owlCarousel({
        autoPlay: true, //Set AutoPlay to 3 seconds
        items: 4,
        itemsDesktop: [1199, 4],
        itemsTablet: [1024, 3],
        itemsTabletSmall: [767, 2],
        itemsMobile: [480, 1]
    });

    jQuery(".product-slide.next").click(function () {
        jQuery(".product-slider").trigger('owl.next');
    });
    jQuery(".product-slide.prev").click(function () {
        jQuery(".product-slider").trigger('owl.prev');
    });
    // Product Slider End
    // ---------------------------------------------------------------------------------------


    // ---------------------------------------------------------------------------------------
    // Top Rated Slider Start

    jQuery(".top-rated-owl-slider").owlCarousel({
        autoPlay: true, //Set AutoPlay to 3 seconds
        items: 1,
        itemsDesktop: [1199, 1],
        itemsTablet: [1024, 1],
        itemsTabletSmall: [767, 2],
        itemsMobile: [480, 1]
    });
    jQuery(".top-rated .next").click(function () {
        jQuery(".top-rated-owl-slider").trigger('owl.next');
    });
    jQuery(".top-rated .prev").click(function () {
        jQuery(".top-rated-owl-slider").trigger('owl.prev');
    });

    // Top Rated Slider End
    // ---------------------------------------------------------------------------------------


    // ---------------------------------------------------------------------------------------
    // Best Seller Slider Start
    jQuery(".best-sellers-owl-slider").owlCarousel({
        autoPlay: true, //Set AutoPlay to 3 seconds
        items: 1,
        itemsDesktop: [1199, 1],
        itemsTablet: [1024, 1],
        itemsTabletSmall: [767, 2],
        itemsMobile: [480, 1]
    });
    jQuery(".best-sellers-slider .next").click(function () {
        jQuery(".best-sellers-owl-slider").trigger('owl.next');
    });
    jQuery(".best-sellers-slider .prev").click(function () {
        jQuery(".best-sellers-owl-slider").trigger('owl.prev');
    });

    // Best Seller Slider End
    // ---------------------------------------------------------------------------------------


    // ---------------------------------------------------------------------------------------
    // Popular Items Slider Start

    jQuery(".popular-items-owl-slider").owlCarousel({
        autoPlay: true, //Set AutoPlay to 3 seconds
        items: 1,
        itemsDesktop: [1199, 1],
        itemsTablet: [1024, 1],
        itemsTabletSmall: [767, 2],
        itemsMobile: [480, 1]
    });
    jQuery(".popular-items .next").click(function () {
        jQuery(".popular-items-owl-slider").trigger('owl.next');
    });
    jQuery(".popular-items .prev").click(function () {
        jQuery(".popular-items-owl-slider").trigger('owl.prev');
    });

    // Popular Items Slider  End
    // ---------------------------------------------------------------------------------------


    // ---------------------------------------------------------------------------------------
    // Brands Slider Start
    jQuery("#brands-carousel-slider").owlCarousel({
        autoPlay: true, //Set AutoPlay to 3 seconds
        items: 7,
        itemsDesktop: [1199, 7],
        itemsDesktopSmall: [1024, 6],
        itemsTablet: [991, 4],
        itemsTabletSmall: [767, 3],
        itemsMobile: [480, 2]
    });
    jQuery(".brands-slider .next").click(function () {
        jQuery("#brands-carousel-slider").trigger('owl.next');
    });
    jQuery(".brands-slider .prev").click(function () {
        jQuery("#brands-carousel-slider").trigger('owl.prev');
    });
    // Brands Slider End
    // ---------------------------------------------------------------------------------------


    // ---------------------------------------------------------------------------------------
    // Testimonials Slider Start
    jQuery(".testimonials-slider").owlCarousel({
        autoPlay: true, //Set AutoPlay to 3 seconds
        items: 1,
        itemsDesktop: [1199, 1],
        itemsTablet: [1024, 1],
        itemsMobile: [768, 1]
    });
    jQuery(".testimonials-wrap .next").click(function () {
        jQuery(".testimonials-slider").trigger('owl.next');
    });
    jQuery(".testimonials-wrap .prev").click(function () {
        jQuery(".testimonials-slider").trigger('owl.prev');
    });
    // Testimonials Slider End
    // ---------------------------------------------------------------------------------------


    // Cart Dorwpdown
    $('.cart-btn').click(function () {
        $('.cart-dropdown').slideToggle('fast');
    });

    // Who We Are Tabination
    $('#we-are-toggle').find('.we-are').click(function (e) {
        e.preventDefault();
        $(this).next().slideToggle('fast');
        $(this).find('.fa').toggleClass('fa-caret-right fa-caret-down');
        $(".we-are-content").not($(this).next()).slideUp('fast');
    });

    // ---------------------------------------------------------------------------------------
    // DateTimePicker Start
    $(".datetimepicker").datepicker();
    // DateTimePicker End
    // ---------------------------------------------------------------------------------------


    // ---------------------------------------------------------------------------------------
    // Checkout Massage Start

    $('#diff-address').click(function () {
        $('.form-delivery-different').toggle("slow");
    });
    $('#direct-transfer').click(function () {
        $('.direct-transfer-msg').show("slow");
        $('.cheque-transfer-msg').hide();
        $('.paypal-transfer-msg').hide();
    });

    $('#cheque-transfer').click(function () {
        $('.cheque-transfer-msg').show("slow");
        $('.direct-transfer-msg').hide();
        $('.paypal-transfer-msg').hide();
    });

    $('#paypal-transfer').click(function () {
        $('.paypal-transfer-msg').show("slow");
        $('.cheque-transfer-msg').hide();
        $('.direct-transfer-msg').hide();
    });

    // Checkout Massage End
    // ---------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------------------
    // Countdown Start
    if ($().countdown) {
        var austDay = new Date();
        austDay = new Date(austDay.getFullYear() + 1, 1 - 1, 26);
        $('#dealCountdown1').countdown({until: austDay});
        $('#dealCountdown2').countdown({until: austDay});
        $('#dealCountdown3').countdown({until: austDay});
    }
    // Countdown End
    // ---------------------------------------------------------------------------------------





    // ---------------------------------------------------------------------------------------
    // Sidebar Filter Scroll Start
//    $('#pink-scroll').slimScroll({
//        size: '3px',
//        color: '#f37f8c',
//        railOpacity: 1,
//        alwaysVisible: true,
//        railVisible: true,
//        railColor: '#e4e4e4',
//        opacity: '1',
//        height: '215px'
//    });
//    $('#purple-scroll').slimScroll({
//        size: '3px',
//        color: '#9865eb',
//        railOpacity: 1,
//        alwaysVisible: true,
//        railVisible: true,
//        railColor: '#e4e4e4',
//        opacity: '1',
//        height: '215px'
//    });
    // Sidebar Filter Scroll End
    // ---------------------------------------------------------------------------------------


});



// ---------------------------------------------------------------------------------------
// Sidebar Filter Range Start
var priceSliderRange = $('#slider-range');
if ($.ui) {
    if ($(priceSliderRange).length) {
        $(priceSliderRange).slider({
            range: true,
            min: 0,
            max: 500,
            values: [75, 300],
            slide: function (event, ui) {
                $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
            }
        });
        $("#amount").val(
                "$" + $("#slider-range").slider("values", 0) +
                " - $" + $("#slider-range").slider("values", 1)
                );
    }
}
// Sidebar Filter Range End
// ---------------------------------------------------------------------------------------



