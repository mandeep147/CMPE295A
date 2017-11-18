/**
 * Created by aartichella on 5/1/17.
 */
var app = angular.module('mylogin',[]);

app.controller('login',['$scope','$http','$window',function($scope,$http,$window){

    $scope.submit= function(isValid){
    	$scope.submitted = true;
    	if(isValid){
    		
    		$http({
                "method":"POST",
                "url":"/loginRequest",
                "headers": {
                    "content-type": "application/json"
                },
                "data":{
                    "username" : $scope.username,
                    "password" : $scope.password
                }
            }).success(function(response){
            	console.log("Login Success!!");
                if(response.status == 200){
                    $window.location.assign('/homepage');
                }
                else{
                    console.log("Some problem in login");
                    $window.alert("Wrong email or password");

                }
            }).error(function(error){
                console.log("from error in login");
                $window.alert("Sorry! Could not retrieve your information. Please try again.");
            });	
    	}
    	else{
    		$window.alert("Email or Password Invalid");
    	}
        
    };

    $scope.register = function(isValid){
    	$scope.submittedRegister = true;
    	if(isValid){
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
	            console.log(response.status);
	            if(response.status == 200){
	                $scope.success_register=false;
	                $window.location.assign('/homepage');
	            }
	            else{
	            	$window.alert("Some error in Register. Please try again later!");
	            }
	        }).error(function(error){
	            console.log("from error");
	            $window.alert("Sorry! Could not create your account. Please try again later!");
	        });
    	}
    	else{
    		$window.alert("Invalid Register form entries");
    	}
    };

    $scope.clickOnLoginButton = function(){
    	console.log("I came in here");
    	$window.location.assign('/login');
    };
    
    $scope.clickOnProfileButton = function(){
    	console.log("Profile button clicked");
    	$window.location.assign('/profile');
    };
    
    

    $scope.logout = function(){
    	console.log("Logout button clicked");
    	$window.location.assign('/');
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
