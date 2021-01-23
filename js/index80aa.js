var canvas;
var image = "/image/logo-min.png";
var iphoneImage = "/image/iPhone-min.png";
var pixelImage = "/image/pixel-xl-min.png";
var isDownloading = false;

var Panel = {
    isVisible: true,
    showMessage: null,
    hideMessage: null,
    animationDuration: 300,
    animationEasing: 'linear',

    init: function() {

    },

    hidePanel: function() {
        $('.panel-wrapper').animate({
            bottom: -(Panel.getAnimationOffset())
        }, Panel.animationDuration, Panel.animationEasing, function() {
            Panel.isVisible = false;
            Panel.updateTabMessage();
        });
        $('.fab').animate({
            bottom: 60
        }, Panel.animationDuration, Panel.animationEasing, function() {
        });
    },

    showPanel: function() {
        $('.fab').animate({
            bottom: 420
        }, Panel.animationDuration, Panel.animationEasing, function() {
        });
        $('.panel-wrapper').animate({
            bottom: 0
        }, Panel.animationDuration, Panel.animationEasing, function() {
            Panel.isVisible = true;
            Panel.updateTabMessage();
        });
    },

    togglePanel: function() {
        ((this.isVisible) ? this.hidePanel : this.showPanel)();
    },

    updateTabMessage: function() {
        if (this.isVisible) {
            $('.tab-controller .close').show();
            $('.tab-controller .show').hide();
        } else {
            $('.tab-controller .close').hide();
            $('.tab-controller .show').show();
        }
    },

    getAnimationOffset: function() {
        return $('.panel-content').height();
    }

}

$(document).ready(function () {

    setTimeout(() => {
        $('#sidebar').css('height', '100vh');
    }, 200);

    $(document).on('click', '.tab-controller', function() {
        Panel.togglePanel();
    });

    $('#color-picker-div-full').colourBrightness();
    $('#color-picker-div-full-mobile').colourBrightness();

    $('#file-upload-button').click(function () {
        $('#file-upload').trigger("click");
    });
    $('#file-upload-button-mobile').click(function () {
        $('#file-upload-mobile').trigger("click");
    });

    $('#color-picker-div').on('click', function () {
        $('#color-picker').trigger("click");
    });
    $('#color-picker-div-mobile').on('click', function () {
        $('#color-picker-mobile').trigger("click");
    });

    $('#color-picker-word').click(function() {
        copyToClipboard($('#color-picker').val().toUpperCase());
        $('#toast').simpleToast({
            content: $('#color-picker').val().toUpperCase() + " is copied!",
            animateDuration: 500,
        });
    });
    $('#color-picker-word-mobile').click(function() {
        copyToClipboard($('#color-picker-mobile').val().toUpperCase());
        $('#toast').simpleToast({
            content: $('#color-picker-mobile').val().toUpperCase() + " is copied!",
            animateDuration: 500,
        });
    });

    // ======================= Padding =======================

    $('#foreground-padding').on('input change', function () {
        $('#padding-value').html(($('#foreground-padding').val()) + '%');

        drawPreview();
    });

    $('#foreground-padding-mobile').on('input change', function () {
        $('#padding-value-mobile').html(($('#foreground-padding-mobile').val()) + '%');

        drawPreview();
    });

    // ======================= Color picker =======================
    $('#pickemall-overlay').on('click', function(){
        if($('.color-picker-pick-i').css('color') == 'rgb(76, 175, 80)') {
            $('.color-picker-pick-i').css('color', 'white')
        } else {
            $('.color-picker-pick-i').css('color', '#4caf50')
        }
    })
    $('#pickemall-overlay').pickemall({
        onChange: function(color) {
            $('#pickemall-overlay').click();
            $('#toast').simpleToast({
                content: "Change to '" + color + "'",
                animateDuration: 500,
            });
            if($('.mobile').css('display') == 'none') {
                $('#color-picker').val(color);
                $('#color-picker-word').html($('#color-picker').val().toUpperCase());
                $('#color-picker-div').css('background-color', $('#color-picker').val());
                $('#color-picker-div-full').css('background-color', $('#color-picker').val());
                $('#color-picker-div-full').colourBrightness();
            } else {
                $('#color-picker-mobile').val(color);
                $('#color-picker-word-mobile').html($('#color-picker-mobile').val().toUpperCase());
                $('#color-picker-div-mobile').css('background-color', $('#color-picker-mobile').val());
                $('#color-picker-div-full-mobile').css('background-color', $('#color-picker-mobile').val());
                $('#color-picker-div-full-mobile').colourBrightness();
            }

            drawPreview();
        },
    })

    $('#color-picker').on('input change', function () {

        $('#color-picker-word').html($('#color-picker').val().toUpperCase());
        $('#color-picker-div').css('background-color', $('#color-picker').val());
        $('#color-picker-div-full').css('background-color', $('#color-picker').val());
        $('#color-picker-div-full').colourBrightness();

        drawPreview();
    });
    $('#color-picker-mobile').on('input change', function () {

        $('#color-picker-word-mobile').html($('#color-picker-mobile').val().toUpperCase());
        $('#color-picker-div-mobile').css('background-color', $('#color-picker-mobile').val());
        $('#color-picker-div-full-mobile').css('background-color', $('#color-picker-mobile').val());
        $('#color-picker-div-full-mobile').colourBrightness();

        drawPreview();
    });

    // ======================= Grid Control =======================
    $('#show-grid').on('change', function() {

        if($('#show-grid').prop('checked') == true) {
            $('#outputs-image-overlay-1').show();
            $('#outputs-image-overlay-2').show();
            $('#outputs-image-overlay-3').show();
        } else {
            $('#outputs-image-overlay-1').hide();
            $('#outputs-image-overlay-2').hide();
            $('#outputs-image-overlay-3').hide();
        }
    });

    // ======================= Preview phone =======================
    var ctxiPhone = $('#preview-iphone').get(0).getContext('2d');
    drawPhone(ctxiPhone, iphoneImage, "iPhone");

    var ctxPixel = $('#preview-pixel').get(0).getContext('2d');
    drawPhone(ctxPixel, pixelImage, "Pixel");

    // ======================= Download =======================
    $('#download-loading-mobile').hide();

    $('#download-adaptive').click(function() {
        if(isDownloading == false) {
            isDownloading = true;
            $('#download-adaptive').hide();
            $('#download-adaptive-disabled').show();
            var data = {
                legacy: $('#default-legacy').get(0).toDataURL("image/png"),
                round: $('#default-round').get(0).toDataURL("image/png"),
                full: $('#default-foreground').get(0).toDataURL("image/png"),
                ios: $('#default-image-ios').get(0).toDataURL("image/png"),
                name: $('#name-icon').val(),
                color: $('#color-picker').val(),
                choice: 'Adaptive'
            } 
    
            $.post("/index/process.php", data, function(data) {
                window.location = "/index/download.php?filename=" + data;
                window.setTimeout('location.reload();',5000);
            });
        }
    });
    $('#download-adaptive-mobile').click(function() {
        if(isDownloading == false) {
            isDownloading = true;
            $('#download-icon-mobile').hide();
            $('#download-loading-mobile').show();
            var data = {
                legacy: $('#default-legacy-mobile').get(0).toDataURL("image/png"),
                round: $('#default-round-mobile').get(0).toDataURL("image/png"),
                full: $('#default-foreground-mobile').get(0).toDataURL("image/png"),
                ios: $('#default-image-ios-mobile').get(0).toDataURL("image/png"),
                name: 'ic_launcher',
                color: $('#color-picker-mobile').val(),
                choice: 'Adaptive'
            } 
    
            $.post("/index/process.php", data, function(data) {
                window.location = "/index/download.php?filename=" + data;
                window.setTimeout('location.reload();',5000);
            });
        }
    });
    $('#download-legacy').click(function() {
        if(isDownloading == false) {
            isDownloading = true;
            $('#download-legacy').hide();
            $('#download-legacy-disabled').show();
            var data = {
                legacy: $('#default-legacy').get(0).toDataURL("image/png"),
                round: $('#default-round').get(0).toDataURL("image/png"),
                full: $('#default-foreground').get(0).toDataURL("image/png"),
                ios: $('#default-image-ios').get(0).toDataURL("image/png"),
                name: $('#name-icon').val(),
                color: $('#color-picker').val(),
                choice: 'Legacy'
            } 
    
            $.post("/index/process.php", data, function(data) {
                window.location = "/index/download.php?filename=" + data;
                window.setTimeout('location.reload();',5000);
            });
        }
    });
    
    // ----------------------------- Default -----------------------------
    drawPreview();

    Panel.init();
    
})

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function drawRoundRect(ctx, x, y, width, height, radius, color, fill, stroke, shadow) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }

    ctx.fillStyle = color ? color : 'white';
    ctx.strokeStyle = color ? color : 'white';
    if(shadow) {
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 3;
        ctx.shadowColor = "darkgrey";
    } else {
        ctx.shadowColor = "transparent";
    }

    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

function drawCircle(ctx, color, fill, stroke, shadow) {
    var context = ctx.getContext('2d');
    var centerX = ctx.width / 2;
    var centerY = ctx.height / 2;
    var thisRadius = 66;

    if(shadow) {
        context.shadowBlur = 2;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 3;
        context.shadowColor = "darkgrey";
    }

    context.beginPath();
    context.arc(centerX, centerY, thisRadius, 0, 2 * Math.PI, false);
    context.fillStyle = color ? color : 'white';
    if (fill)
        context.fill();
    if (stroke)
        context.stroke();
}

function drawCircleFree(ctx, color, radius, fill, stroke, shadow) {
    var context = ctx.getContext('2d');
    var centerX = ctx.width / 2;
    var centerY = ctx.height / 2;

    if(shadow) {
        context.shadowBlur = 4;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 5;
        context.shadowColor = "darkgrey";
    }

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color ? color : 'white';
    if (fill)
        context.fill();
    if (stroke)
        context.stroke();
}

function drawCirclePhone(ctx, color, radius, centerX, centerY, fill, stroke, shadow) {
    if(shadow) {
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 3;
        ctx.shadowColor = "darkgrey";
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color ? color : 'white';
    if (fill)
        ctx.fill();
    if (stroke)
        ctx.stroke();
}

function drawRect(ctx, color, fill, stroke) {
    ctx.rect(0, 0, 144, 144);
    ctx.fillStyle = color ? color : 'white';
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

function copyToClipboard(text) {
    // Create a "hidden" input
    var aux = document.createElement("input");
    // Assign it the value of the specified element
    aux.setAttribute("value", text);
    // Append it to the body
    document.body.appendChild(aux);
    // Highlight its content
    aux.select();
    // Copy the highlighted text
    document.execCommand("copy");
    // Remove it from the body
    document.body.removeChild(aux);
}

function loadImageIOS(ctx, src, width, height) {

    ctx.shadowColor = "transparent";

    var img = new Image();

    img.src = src;
    img.alt = 'iphone app icon'
    img.onload = function() {
        ctx.drawImage(img, (1024-width)/2, (1024-height)/2, width, height);
    }

    return img;
}

function loadImageWithOut(ctx, src, width, height) {

    ctx.shadowColor = "transparent";

    var img = new Image();

    img.src = src;
    img.alt = 'foreground app icon'
    img.onload = function() {
        ctx.drawImage(img, (144-width)/2, (144-height)/2, width, height);
    }

    return img;
}

function loadImageFree(ctx, src, width, height, outWidth, outHeight, clip) {

    ctx.shadowColor = "transparent";

    var img = new Image();

    img.src = src;
    img.alt = 'foreground app icon'
    img.onload = function() {
        if(clip)
            ctx.clip();
        ctx.drawImage(img, (outWidth-width)/2, (outHeight-height)/2, width, height);
        if(clip)
            ctx.restore();
        img
    }

    return img;
}

function loadImage(ctx, src, width, height) {

    ctx.shadowColor = "transparent";

    var img = new Image();

    img.src = src;
    img.alt = 'foreground app icon'
    img.onload = function() {
        ctx.clip();
        ctx.drawImage(img, (144-width)/2, (144-height)/2, width, height);
        ctx.restore();
    }

    return img;
}

function loadImageIPhone(ctx, src, width, height, outerWidth, outerHeight, phoneWidth, phoneHeight) {

    ctx.shadowColor = "transparent";

    var img = new Image();

    img.src = src;
    img.alt = "Smartphone mock-up"
    img.onload = function() {
        ctx.clip();
        ctx.drawImage(img,  phoneWidth + (outerWidth - width)/2, phoneHeight + (outerHeight-height)/2, width, height);
        ctx.restore();
    }

    return img;
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        var colorThief = new ColorThief();


        reader.onload = function (e) {
            image = e.target.result;
            $('#file-upload-image').attr('src', image);
            const img = document.getElementById('file-upload-image')

            const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
                const hex = x.toString(16)
                return hex.length === 1 ? '0' + hex : hex
            }).join('')

            if (img.complete) {
                rgb = colorThief.getColor(img);
                let hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
                
                if($('.mobile').css('display') == 'none') {
                    $('#color-picker').val(hex);
                    $('#color-picker-word').html($('#color-picker').val().toUpperCase());
                    $('#color-picker-div').css('background-color', $('#color-picker').val());
                    $('#color-picker-div-full').css('background-color', $('#color-picker').val());
                    $('#color-picker-div-full').colourBrightness();
                } else {
                    $('#color-picker-mobile').val(hex);
                    $('#color-picker-word-mobile').html($('#color-picker-mobile').val().toUpperCase());
                    $('#color-picker-div-mobile').css('background-color', $('#color-picker-mobile').val());
                    $('#color-picker-div-full-mobile').css('background-color', $('#color-picker-mobile').val());
                    $('#color-picker-div-full-mobile').colourBrightness();
                }

                drawPreview();
            } else {
                img.addEventListener('load', function() {
                    rgb = colorThief.getColor(img);
                    let hex = rgbToHex(rgb[0], rgb[1], rgb[2]);

                    if($('.mobile').css('display') == 'none') {
                        $('#color-picker').val(hex);
                        $('#color-picker-word').html($('#color-picker').val().toUpperCase());
                        $('#color-picker-div').css('background-color', $('#color-picker').val());
                        $('#color-picker-div-full').css('background-color', $('#color-picker').val());
                        $('#color-picker-div-full').colourBrightness();
                    } else {
                        $('#color-picker-mobile').val(hex);
                        $('#color-picker-word-mobile').html($('#color-picker-mobile').val().toUpperCase());
                        $('#color-picker-div-mobile').css('background-color', $('#color-picker-mobile').val());
                        $('#color-picker-div-full-mobile').css('background-color', $('#color-picker-mobile').val());
                        $('#color-picker-div-full-mobile').colourBrightness();
                    }

                    drawPreview();
                });
            }            
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function drawPreview() {
    var color = $('#color-picker').val();
    var colorMobile = $('#color-picker-mobile').val();

    $('#default-image-div').html("<canvas id=\"default-image\" width=\"144\" height=\"144\"></canvas>")
    $('#default-image-div-mobile').html("<canvas id=\"default-image-mobile\" width=\"144\" height=\"144\"></canvas>")

    $('#default-image-circle-div').html("<canvas id=\"default-image-circle\" width=\"144\" height=\"144\"></canvas>")
    $('#default-image-circle-div-mobile').html("<canvas id=\"default-image-circle-mobile\" width=\"144\" height=\"144\"></canvas>")

    $('#default-image-full-div').html("<canvas id=\"default-image-full\" width=\"144\" height=\"144\"></canvas> ")
    $('#default-image-full-div-mobile').html("<canvas id=\"default-image-full-mobile\" width=\"144\" height=\"144\"></canvas> ")


    var ctx = $('#default-image').get(0).getContext('2d');
    drawRoundRect(ctx, 15, 15, 114, 114, 10, color, true, false, true);
    loadImage(ctx, image, (100 - $('#foreground-padding').val()) * 114/132, (100 - $('#foreground-padding').val()) * 114/132);
    var ctxm = $('#default-image-mobile').get(0).getContext('2d');
    drawRoundRect(ctxm, 15, 15, 114, 114, 10, colorMobile, true, false, true);
    loadImage(ctxm, image, (100 - $('#foreground-padding-mobile').val()) * 114/132, (100 - $('#foreground-padding-mobile').val()) * 114/132);
    
    var ctx2 = $('#default-image-circle').get(0);
    drawCircle(ctx2, color, true, false, true);
    loadImage(ctx2.getContext('2d'), image, 100 - $('#foreground-padding').val(), 100 - $('#foreground-padding').val());
    var ctxm2 = $('#default-image-circle-mobile').get(0);
    drawCircle(ctxm2, colorMobile, true, false, true);
    loadImage(ctxm2.getContext('2d'), image, 100 - $('#foreground-padding-mobile').val(), 100 - $('#foreground-padding-mobile').val());

    var ctx3 = $('#default-image-full').get(0).getContext('2d');
    loadImageWithOut(ctx3, image, (72 - 72 * $('#foreground-padding').val() / 100), (72 - 72 * $('#foreground-padding').val() / 100));
    var ctxm3 = $('#default-image-full-mobile').get(0).getContext('2d');
    loadImageWithOut(ctxm3, image, (72 - 72 * $('#foreground-padding-mobile').val() / 100), (72 - 72 * $('#foreground-padding-mobile').val() / 100));

    var ctxiPhone = $('#preview-iphone').get(0).getContext('2d');
    drawPhone(ctxiPhone, iphoneImage, "iPhone");

    var ctxPixel = $('#preview-pixel').get(0).getContext('2d');
    drawPhone(ctxPixel, pixelImage, "Pixel");

    $('#default-image-ios-div').html('<canvas id="default-image-ios" width="1024" height="1024"></canvas>');
    $('#default-image-ios-div-mobile').html('<canvas id="default-image-ios-mobile" width="1024" height="1024"></canvas>');

    var ctxIOS = $('#default-image-ios').get(0).getContext('2d');
    drawRoundRect(ctxIOS, 0, 0, 1024, 1024, 0, color, true, false, false);
    loadImageIOS(ctxIOS, image, (100 - $('#foreground-padding').val()) * 114/132 * 1024/113 , (100 - $('#foreground-padding').val()) * 114/132 * 1024/113 );
    var ctxIOSM = $('#default-image-ios-mobile').get(0).getContext('2d');
    drawRoundRect(ctxIOSM, 0, 0, 1024, 1024, 0, colorMobile, true, false, false);
    loadImageIOS(ctxIOSM, image, (100 - $('#foreground-padding-mobile').val()) * 114/132 * 1024/113 , (100 - $('#foreground-padding-mobile').val()) * 114/132 * 1024/113 );

    $('#default-legacy-div').html("<canvas id=\"default-legacy\" width=\"512\" height=\"512\"></canvas>");
    $('#default-legacy-div-mobile').html("<canvas id=\"default-legacy-mobile\" width=\"512\" height=\"512\"></canvas>");

    $('#default-round-div').html('<canvas id="default-round" width="512" height="512"></canvas> ');
    $('#default-round-div-mobile').html('<canvas id="default-round-mobile" width="512" height="512"></canvas> ');

    $('#default-foreground-div').html('<canvas id="default-foreground" width="512" height="512"></canvas>');
    $('#default-foreground-div-mobile').html('<canvas id="default-foreground-mobile" width="512" height="512"></canvas>');

    var ctxLegacy = $('#default-legacy').get(0).getContext('2d');
    drawRoundRect(ctxLegacy, 53, 53, 405.3, 405.3, 38, color, true, false, true);
    loadImageFree(ctxLegacy, image, (100 - $('#foreground-padding').val()) * 114/132 * 512/144, (100 - $('#foreground-padding').val()) * 114/132 * 512/144, 512, 512, true);
    var ctxLegacyM = $('#default-legacy-mobile').get(0).getContext('2d');
    drawRoundRect(ctxLegacyM, 53, 53, 405.3, 405.3, 38, colorMobile, true, false, true);
    loadImageFree(ctxLegacyM, image, (100 - $('#foreground-padding-mobile').val()) * 114/132 * 512/144, (100 - $('#foreground-padding-mobile').val()) * 114/132 * 512/144, 512, 512, true);

    var ctxRound = $('#default-round').get(0);
    drawCircleFree(ctxRound, color, 234, true, false, true);
    loadImageFree(ctxRound.getContext('2d'), image, (100 - $('#foreground-padding').val()) * 469.3/132, (100 - $('#foreground-padding').val()) * 469.3/132, 512, 512, true);
    var ctxRoundM = $('#default-round-mobile').get(0);
    drawCircleFree(ctxRoundM, colorMobile, 234, true, false, true);
    loadImageFree(ctxRoundM.getContext('2d'), image, (100 - $('#foreground-padding-mobile').val()) * 469.3/132, (100 - $('#foreground-padding-mobile').val()) * 469.3/132, 512, 512, true);

    var ctxForeground = $('#default-foreground').get(0).getContext('2d');
    loadImageFree(ctxForeground, image, (72 - 72 * $('#foreground-padding').val() / 100 ) * 512/144, (72 - 72 * $('#foreground-padding').val() / 100) * 512/144, 512, 512, false);
    var ctxForegroundM = $('#default-foreground-mobile').get(0).getContext('2d');
    loadImageFree(ctxForegroundM, image, (72 - 72 * $('#foreground-padding-mobile').val() / 100 ) * 512/144, (72 - 72 * $('#foreground-padding-mobile').val() / 100) * 512/144, 512, 512, false);
}

function drawPhone(ctx, src, phone) {
    ctx.shadowColor = "transparent";

    var img = new Image();

    img.src = src;
    img.onload = function() {
        ctx.drawImage(img, 0, 0, 257.09, 516);
        if(phone === 'iPhone') {
            var outerPointX = 187;
            var outerPointY = 302;
            var outerSize = 36;
            var innerPoint = (100 - $('#foreground-padding').val()) * 114/132 * (36 / 114);
            drawRoundRect(ctx, outerPointX, outerPointY, outerSize, outerSize, 9, $('#color-picker').val(), true, false, false);
            loadImageIPhone(ctx, image, innerPoint, innerPoint, outerSize, outerSize, outerPointX, outerPointY);
        } else if (phone === 'Pixel') {
            var outerPointX = 31;
            var outerPointY = 123;
            var outerSize = 28;
            var innerPoint = (100 - $('#foreground-padding').val()) * (23 / 114);
            drawCirclePhone(ctx, $('#color-picker').val(), 14, 45, 137, true, false, false);
            loadImageIPhone(ctx, image, innerPoint, innerPoint, outerSize, outerSize, outerPointX, outerPointY);
        }
    }

    return img;
}