(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditTaskController', EditTaskController);

    EditTaskController.$inject = ['TaskService', '$rootScope', '$location', '$filter'];
    function EditTaskController(TaskService, $rootScope, $location, $filter) {
		
		var vm = this;
		
		var username = $rootScope.globals.currentUser.username;

		vm.submit = submit;
		vm.dataSaving = false;
		vm.task = $rootScope.task;
		if (vm.task) {
			vm.task.expectedTimeSec = vm.task.expectedTime * 3600;
			vm.task.spentTimeSec = vm.task.spentTime * 3600;
		}
		
		function submit() {
			vm.dataSaving = true;
			vm.task.expectedTime = vm.task.expectedTimeSec / 3600;
			vm.task.spentTime = vm.task.spentTimeSec / 3600;
			if (vm.task.id) {
				TaskService.updateTask(username, vm.task)
				.then(
					function(){
						vm.dataSaving = false;
						$location.path("/taskslist");
					}, 
					function(errResponse){
						vm.dataSaving = false;
						console.error("Error while updating Task");
						$location.path("/taskslist");
					}
				);
			}
			else {
				vm.task.date = (new Date()).toISOString();
				TaskService.saveNewTask(username, vm.task)
				.then(
					function(){
						vm.dataSaving = false;
						$location.path("/taskslist");
					}, 
					function(errResponse){
						vm.dataSaving = false;
						console.error("Error while saving new Task");
						$location.path("/taskslist");
					}
				);
			}
		}
		
	}
	
})();