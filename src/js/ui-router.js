var app = angular.module('myApp', ['ui.router', 'ngStorage', function() {}]).
config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

        //$locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('');
        $urlRouterProvider.otherwise('/');

        $stateProvider
            /* .state('app', {
                 abstract: true,
                 url: '/Task',
                 templateUrl: '../../src/index.html'
             })*/
            .state('/', {
                url: '/',
                templateUrl: '../../src/html/search.html',
                controller: 'searchCtrl',
            })
            .state('home', {
                url: '/home',
                templateUrl: '../../src/html/search.html',
                controller: 'searchCtrl',
            })
            .state('keywords', {
                url: '/keywords',
                templateUrl: '../../src/html/keywords.html',
                controller: 'keywordsCtrl',
            })
            .state('images', {
                url: '/images',
                templateUrl: '../../src/html/images.html',
                controller: 'imagesCtrl',
            });
        //$locationProvider.html5Mode(true);    
    }
]);

app.controller('searchCtrl', ['$scope', '$state', '$http', '$timeout',
    function($scope, $state, $http, $timeout) {

        $scope.gotToKeywordsPage = function() {
            $state.go('keywords');
        };
        $scope.is_loading = false;
        $scope.DATA = {};
        $scope.showAlert = false;
        $scope.closeAlert = function() {
            $scope.showAlert = false;
        }
        $scope.save = function() {
            $scope.is_loading = true;

            $http
                .post(
                    'http://localhost:3100/api/saveImages', { "keyword": $scope.keyword })
                .then(
                    function(response) {
                        if (response.status == 200 && response.data.success) {
                            $scope.is_loading = false;
                            $scope.showAlert = true;
                            $scope.DATA = response.data;
                            console.log($scope.DATA);
                            $scope.keyword = '';
                            $timeout($scope.closeAlert, 2000);


                        } else {
                            $scope.DATA = response.data;
                            $scope.is_loading = false;
                            $scope.showAlert = true;
                            $timeout($scope.closeAlert, 2000);
                        }
                    },
                    function(x) {
                        if (x.status == 500 || x.status == 400) {
                            $scope.DATA = {
                                "success": false,
                                "message": "Server Error.."
                            }
                            $scope.is_loading = false;
                            $scope.showAlert = true;
                        }
                    });

        };

    }
]);
app.controller('keywordsCtrl', ['$scope', '$state', '$localStorage', '$http', '$timeout',
    function($scope, $state, $localStorage, $http, $timeout) {
        $scope.DATA = {};
        $scope.showAlert = false;
        $scope.closeAlert = function() {
            $scope.showAlert = false;
        }
        $scope.keywordList = [];
        $http
            .get(
                'http://localhost:3100/api/getKeywords')
            .then(
                function(response) {
                    if (response.status == 200 && response.data.success) {

                        $scope.keywordList = response.data.data;
                        $scope.DATA = response.data;
                        //$scope.showAlert = true;
                        //$timeout($scope.closeAlert, 2000);

                    } else {

                    }
                },
                function(x) {
                    if (x.status == 500 || x.status == 400) {
                        $scope.DATA = {
                            "success": false,
                            "message": "Server Error.."
                        }
                        $scope.showAlert = true;
                        $timeout($scope.closeAlert, 2000);
                    }
                });

        $localStorage.KEY = null;

        $scope.showImages = function(key) {
            $localStorage.KEY = key.keyword;
            $state.go('images');
        };
        $scope.deleteKeyword = function(key) {
            $http
                .post(
                    'http://localhost:3100/api/deleteKeyword', { "id": key._id })
                .then(
                    function(response) {
                        if (response.status == 200 && response.data.success) {
                            $scope.keywordList = response.data.data;
                            $scope.DATA = response.data;
                            $scope.showAlert = true;
                            $timeout($scope.closeAlert, 2000);
                        } else {

                        }
                    },
                    function(x) {
                        if (x.status == 500) {

                        }
                    });
        };
    }

]);
app.controller('imagesCtrl', ['$scope', '$state', '$localStorage', '$http',
    function($scope, $state, $localStorage, $http) {

        if ($localStorage.KEY == null) {
            $state.go('keywords');
        }

        $http
            .post(
                'http://localhost:3100/api/getImages', { "keyword": $localStorage.KEY })
            .then(
                function(response) {
                    if (response.status == 200 && response.data.success) {
                        var DATA = response.data;
                        $scope.image_data = DATA.data[0].image_url;
                        $scope.data = DATA.data[0].keyword;
                    } else {

                    }
                },
                function(x) {
                    if (x.status == 500) {

                    }
                });
    }

]);
window.setTimeout(function() {
    $(".alert").fadeTo(500, 0).slideUp(500, function() {
        $(this).remove();
    });
}, 2000);