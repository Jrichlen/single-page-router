"use strict";
var router;

function Router(target, routes) {
    var router = this;

    this.routes = [];
    this.target = document.getElementById(target);

    routes = routes || [];
    routes.forEach(function(route) {
        router.routes.push(new Route(route));
    });
}
Router.prototype = {
    goto: function (hash) {
        var routeNum = this.routes.length;
        for (var i=0; i<routeNum; i++) {
            if(this.routes[i].hash == hash) {
                this.routes[i].go(this.target);
                return;
            }
        }
        this.goto("#home");
    }
};

function Route(route) {
    this.path = route.path;
    this.hash = route.hash;
}

Route.prototype = {
    go: function(target) {
        var xhr = new XMLHttpRequest();
        target.classList.add("is-loading");
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                target.innerHTML = xhr.responseText;
            }
            target.classList.remove("is-loading");
        };

        xhr.open("GET", this.path);
        xhr.setRequestHeader("Content-type", "text/html");
        xhr.send();
    }
};

function ExecuteRoute(e) {
    router.goto(location.hash);
    updateNavLinks();
}

function updateNavLinks() {
    var links = document.getElementsByClassName("navlink");
    var linkCnt = links.length;
    for (var i=0; i<linkCnt; i++) {
        var link = links.item(i);
        var hash = link.getAttribute("href");
        if(hash == location.hash) {
            link.classList.add("is-active");
        } else {
            link.classList.remove("is-active");
        }
    };
}

var routes = [
    { hash: "#home", path: "/home" },
    { hash: "#banquet", path: "/banquet"}
];

var router = new Router("main-content", routes);

window.onhashchange = ExecuteRoute;

document.addEventListener("DOMContentLoaded", function(event) {
    if (!location.hash.length) {
        location.hash = "home";
    }
    ExecuteRoute();
});