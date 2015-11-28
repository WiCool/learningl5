myApp.controller('userController', ['$scope', '$location', 'userModel', function($scope, $location, userModel) {
    angular.extend($scope, {
        login: {
            username: 'reachme@amitavroy.com',
            password: 'pass'
        }
    });

    angular.extend($scope, {
        doLogin: function(loginForm) {
            var data = {
                email: $scope.login.username,
                password: $scope.login.password
            };

            userModel.doLogin(data).then(function() {
                $location.path('/dashboard');
            });
        }
    });
}]);

myApp.controller('globalController', ['$scope', function($scope) {
    $scope.global = {};
    $scope.global.navUrl = 'templates/partials/nav.html';
}]);

myApp.controller('navController', ['$scope', '$location', 'userModel', function($scope, $location, userModel) {
    /*Variables*/
    angular.extend($scope, {
        user: userModel.getUserObject(),
        navUrl: [{
            link: 'Home',
            url: '/dashboard',
            subMenu: [{
                link: 'View Gallery',
                url: '/gallery/view'
            }, {
                link: 'Add Gallery',
                url: '/gallery/add'
            }]
        }, {
            link: 'View Gallery',
            url: '/gallery/view'
        }, {
            link: 'Add Gallery',
            url: '/gallery/add'
        }]
    });

    /*Methods*/
    angular.extend($scope, {
        doLogout: function() {
            userModel.doUserLogout();
            $location.path('/');
        },
        checkActiveLink: function(routeLink) {
            if ($location.path() == routeLink) {
                return 'make-active';
            }
        }
    });
}]);

myApp.controller('galleryController', ['$scope', '$location', 'galleryModel', '$timeout', '$routeParams', 'Lightbox',

    function($scope, $location, galleryModel, $timeout, $routeParams, Lightbox) {

        /*Getting all the galleries*/
        galleryModel.getAllGalleries().success(function(response) {
            $scope.galleries = response;
            $timeout(function() {
                $scope.galleries = response;
                console.log('Galleries loaded', $scope.galleries);
                $scope.showGallery = true;
            }, 300);
        });

        if ($routeParams.id) {
            console.log('Looking at gallery id' + $routeParams.id);
            galleryModel.getGalleryById($routeParams.id).success(function(response) {
                console.log('Gallery details', response);
                $scope.singleGallery = response;
            });
        }

        $scope.$on('imageAdded', function(event, args) {
            $scope.singleGallery = args;
            console.log('Inside event', $scope.singleGallery);
            $scope.$apply();
        });

        /*Variables*/
        angular.extend($scope, {
            newGallery: {},
            errorDiv: false,
            errorMessages: [],
            singleGallery: {},
            dropzoneConfig: {
                'options': {
                    'url': baseUrl + 'upload-image'
                },
                'eventHandlers': {
                    'sending': function(file, xhr, formData) {
                        formData.append('_token', csrfToken);
                        formData.append('galleryId', $routeParams.id);
                    },
                    'success': function(file, response) {
                        console.log(response);
                        $scope.singleGallery.images.push(response);
                        console.log($scope.singleGallery);
                        $scope.$emit('imageAdded', $scope.singleGallery);
                    }
                }
            },
            images: [{
                'url': '1.jpg',
                'caption': 'Optional caption',
                'thumbUrl': 'thumb1.jpg' // used only for this example
            }, {
                'url': '2.gif',
                'thumbUrl': 'thumb2.jpg'
            }, {
                'url': '3.png',
                'thumbUrl': 'thumb3.png'
            }]
        });

        /*Functions*/
        angular.extend($scope, {
            saveNewGallery: function(addGalleryForm) {
                console.log(addGalleryForm);
                if (addGalleryForm.$valid) {
                    $scope.formSubmitted = false;
                    galleryModel.saveGallery($scope.newGallery).success(function(response) {
                        $location.path('/gallery/view');
                    });
                } else {
                    $scope.formSubmitted = true;
                    console.log('Error');
                }
            },
            viewGallery: function(id) {
                console.log(id);
                $location.path('/gallery/' + id);
            },
            openLightboxModal: function(index) {
                Lightbox.openModal($scope.singleGallery.images, index);
            }
        });
    }
]);

//# sourceMappingURL=controllers.js.map