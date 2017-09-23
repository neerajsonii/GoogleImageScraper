var app = angular.module('myApp', ['ui.router','ngStorage', function() {}]).
config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

        //$locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('');
        $urlRouterProvider.otherwise('home');

        $stateProvider
            .state('app', {
                abstract: true,
                url: '/Task',
                templateUrl: '../../src/index.html'
            })
            .state('/', {
                url: '/home',
                templateUrl: '../../src/html/search.html',
                controller: 'searchCtrl'
            })
            .state('app.home', {
                url: '/home',
                templateUrl: '../../src/html/search.html',
                controller: 'searchCtrl'
            })
            .state('app.keywords', {
                url: '/keywords',
                templateUrl: '../../src/html/keywords.html',
                controller: 'keywordsCtrl'
            })
            .state('app.images', {
                url: '/images',
                templateUrl: '../../src/html/images.html',
                controller: 'imagesCtrl'
            });
        //$locationProvider.html5Mode(true);    
    }
]);

app.provider('callApi', function() {
    var baseUrl = '';
    this.config = function(url) {
        baseUrl = url;
    };


    this.$get = ['$http', '$log', '$q',
        function($http, $log, $q) {

            var q = $q.defer();

            var callApiObj = {};

            callApiObj.getDataPost = function(api,keyword) {
                $http
                    .post(
                        baseUrl + api, {
                            "keyword": keyword
                        })
                    .then(
                        function(response) {

                            if (response.data[0] != null && response.data[0].success) {


                            } else {

                            }
                        },
                        function(x) {
                            if (x.status == 500) {

                            }
                        });

            };
            callApiObj.getDataGet = function(api) {

                $http
                    .get(
                        baseUrl + api)
                    .then(
                        function(response) {
                            if (response.status == 200 && response.data.success) {
                                q.resolve(response.data);

                            } else {
                                q.reject(error);
                            }
                        },
                        function(x) {
                            if (x.status == 500) {

                            }
                        });
                return q.promise
            };
            return callApiObj;
        }

    ];
}).
config(['callApiProvider', function(callApiProvider) {
    callApiProvider.config('http://localhost:3100/api/');

}]);

app.controller('searchCtrl', ['$scope', '$rootScope', 'callApi', '$state',
    function($scope, $rootScope, callApi, $state) {

        $scope.gotToKeywordsPage = function() {
            $state.go('app.keywords');
        };
        $scope.save = function() {

            callApi.getDataPost('getImages',$scope.keyword);

        };

    }
]);
app.controller('keywordsCtrl', ['$scope', '$rootScope', 'callApi', '$state','$localStorage',
    function($scope, $rootScope,callApi, $state,$localStorage) {

        $scope.keywordList = [];
        $scope.promise = callApi.getDataGet('getKeywords'); // URL for API
        $scope.promise.then(function(Data) {
            $scope.keywordList = Data.data;
        }, function(err) {

        });
        $localStorage.KEY = null;

        $scope.showImages = function(key) {
            $localStorage.KEY = key;
            $state.go('app.images');
        };
    }

]);
app.controller('imagesCtrl', ['$scope', '$rootScope', 'callApi', '$state','$localStorage',
    function($scope, $rootScope, callApi, $state,$localStorage) {
          
        if($localStorage.KEY == null){
            $state.go('app.keywords');  
        }
        $scope.data = $localStorage.KEY;
    }

]);