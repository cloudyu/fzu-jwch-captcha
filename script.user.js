// ==UserScript==
// @name         福州大学教务处验证码自动填充
// @namespace    https://cloudyu.me/
// @version      0.1
// @description  利用Tesseract自动化填写教务处验证码 By: CloudYu Blog: https://blog.cloudyu.me/
// @author       CloudYu
// @match        http://jwch.fzu.edu.cn/
// @connect      59.77.226.32
// @connect      jwch.fzu.c-y.in
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var vcodeimg = document.getElementById('vcodeimg');
    vcodeimg.onclick = function(){
        GM_xmlhttpRequest({
            method: "GET",
            responseType : "arraybuffer",
            url: "http://59.77.226.32/captcha.asp",
            onload: function(response){
                GetCaptcha('data:image/bmp;base64,' + encode(response.response), 70, 0, -30, 0);
            }
        });
    };
    function GetCaptcha(urlData, width = 0, height = 0, x = 0, y = 0){//data:image/png;base64,balabala
        var img = new Image();
        var canvas = document.createElement('canvas');
        img.src= urlData;
        img.onload = function(e){
            canvas.width = width === 0 ? img.width : width;
            canvas.height = height === 0 ? img.height: height;
            canvas.getContext('2d').drawImage(img, x, y);
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://jwch.fzu.c-y.in:54088/jwch-captcha",
                dataType: "json",
                responseType: "json",
                data: JSON.stringify({"data" : canvas.toDataURL().split(',')[1]}),
                onload: function(response) {
                    console.log(response.response);
                    document.getElementById('Verifycode').value = response.response[`captcha`];
                    document.getElementById('vcodeimg').src = canvas.toDataURL();
                },
                contentType: "application/json"
            });
        };
    }

    document.getElementById('vcodeimg').click();

    // arraybuffer to base64
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    // Use a lookup table to find the index.
    var lookup = new Uint8Array(256);
    for (var i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
    }
    function encode(arraybuffer) {
        var bytes = new Uint8Array(arraybuffer),
            i, len = bytes.length, base64 = "";
        for (i = 0; i < len; i+=3) {
            base64 += chars[bytes[i] >> 2];
            base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
            base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
            base64 += chars[bytes[i + 2] & 63];
        }
        if ((len % 3) === 2) {
            base64 = base64.substring(0, base64.length - 1) + "=";
        } else if (len % 3 === 1) {
            base64 = base64.substring(0, base64.length - 2) + "==";
        }
        return base64;
    }
})();