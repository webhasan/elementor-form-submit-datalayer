(function() {
    var origXMLHttpRequest = XMLHttpRequest;
    XMLHttpRequest = function() {
        var requestURL;
        var requestMethod;
        var requestBody;

        var xhr = new origXMLHttpRequest();
        var origOpen = xhr.open;
        var origSend = xhr.send;

        // Override the `open` function.
        xhr.open = function(method, url) {
            requestURL = url;
            requestMethod = method;
            return origOpen.apply(this, arguments);
        };

        xhr.send = function(data) {
            // Only proceed if the request URL matches what we're looking for.
            if (/.+\/admin-ajax\.php/.test(requestURL)) {
                xhr.addEventListener('load', function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var response = JSON.parse(xhr.responseText);

                            if (response.success && (data instanceof FormData)) {
                                requestBody = {};
                                data.forEach(function(value, key) {
                                    requestBody[key] = value;
                                });

                                if(requestBody.action === "elementor_pro_forms_send_form") {
                                    window.dataLayer = window.dataLayer || [];
                                    dataLayer.push({
                                        event: 'elementor_form_submit', 
                                        inputs: requestBody
                                    });
                                }
                            }
                        }
                    }
                });
            }

            return origSend.apply(this, arguments);
        };

        return xhr;
    };
})();