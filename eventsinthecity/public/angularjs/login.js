/**
 * Created by aartichella on 5/1/17.
 */
var app = angular.module('mylogin',[]);

app.controller('login',['$scope','$http','$window',function($scope,$http,$window){

    $scope.invalid_login = true;
    $scope.unexpected_error = true;
    $scope.error_register =true;
    $scope.success_register = true;

    $scope.submit= function(){
        $http({
            "method":"POST",
            "url":"/login",
            "headers": {
                "content-type": "application/json"
            },
            "data":{
                "username" : $scope.username,
                "password" : $scope.password
            }
        }).success(function(response){
            console.log("Hi1")
            if(response.status == 200){
                $window.location.assign('/events');
            }
            else{
                console.log("Some problem in login");
                $scope.invalid_login = false;
                $scope.unexpected_error = true;

            }
        }).error(function(error){
            console.log("from error in login");
            $scope.invalid_login = false;
            $scope.unexpected_error = true;
        });
    };

    $scope.register = function(){
        $http({
            "method":"POST",
            "url":"/register",
            "headers": {
                "content-type": "application/json"
            },
            "data":{
                "email" : $scope.email1,
                "password" : $scope.password1,
                "firstname":$scope.firstname,
                "lastname":$scope.lastname,
                "mobile": $scope.mobile,
                "address":$scope.address
            }
        }).success(function(response){
            console.log("Hi1 from angular");
            console.log(response.status);
            if(response.status == 200){
                $scope.success_register=false;
                //$window.location.assign('/homepage1');
            }
            else{
                $scope.error_register =false;
            }
        }).error(function(error){
            console.log("from error");
            $scope.invalid_login = false;
            $scope.unexpected_error = true;
        });
    };

    $scope.nextpage = function(){

        $http({
            "method":"POST",
            "url":"/nextpage",
            "headers": {
                "content-type": "application/json"
            },
            "data":{
                id : $scope.data
            }
        }).success(function(response){
            console.log("Hi1 from angular");
            console.log(response.status);
            if(response.status == 200){

            }
            else{
                $scope.error_register =false;
            }
        }).error(function(error){
            console.log("from error");
            $scope.invalid_login = false;
            $scope.unexpected_error = true;
        });
    }
}]);


