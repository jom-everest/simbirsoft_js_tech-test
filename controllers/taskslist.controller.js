(function () {
    'use strict';

    angular
        .module('app')
        .controller('TasksListController', TasksListController);

    TasksListController.$inject = ['$filter', 'TaskService', 'UserService', '$rootScope', '$location'];
    function TasksListController($filter, TaskService, UserService, $rootScope, $location) {
		
		var vm = this;
		
		vm.editTask = editTask;
		vm.removeTask = removeTask;
		vm.createTask = createTask;
		
		vm.tasks = [];
		vm.username = $rootScope.globals.currentUser.username;//UserService.getUser();
		
		loadTasks();
		
		function loadTasks() {
			TaskService.fetchTasks(vm.username)
				.then(function(tasks) {
					vm.tasks = tasks;
					extend();
				},
				function(errResponse) {
					console.error("Error while fetching Tasks");
				}
			);		
		}
		
		function editTask(id) {
			for (var i = 0; i < vm.tasks.length; i++) {
				if (vm.tasks[i].id == id) {
					$rootScope.task = vm.tasks[i];
					$location.path("/task");
					break;
				}
			}
		}
		
		function removeTask(id) {
			TaskService.deleteTask(vm.username, id)
				.then(function() {
					loadTasks();
				},
				function(errResponse) {
					console.error("Error while remove Task");
				}
			);		
		}
		
		function createTask() {
			$rootScope.task = {priority: 'normal', status: 'start'};
			$location.path("/task");
		}
		
		function extend() {
			vm.tasks.forEach(function(task) {
				task.dateObject = Date.parse(task.date);
				task.dateFormat = $filter('date')(task.dateObject, 'd MMMM y, HH:mm');
				
				task.expectedTimeFormat = parseInt(task.expectedTime/24) + " days, " + task.expectedTime%24 + " hours";
				task.spentTimeFormat = parseInt(task.spentTime/24) + " days, " + task.spentTime%24 + " hours";
				
				task.priorityLoc = locPriority(task.priority);
				task.statusLoc = locStatus(task.status);
			});
			
			vm.rows = [];
			var tasks_start = _.filter(vm.tasks, {status: "start"}) || [];
			var tasks_doing = _.filter(vm.tasks, {status: "doing"}) || [];
			var tasks_done = _.filter(vm.tasks, {status: "done"}) || [];
			var maxLength = _.max([tasks_start.length, tasks_doing.length, tasks_done.length]);
			for (var i = 0; i < maxLength; i++) {
				vm.rows[i] = [];
				vm.rows[i][0] = tasks_start[i];
				vm.rows[i][1] = tasks_doing[i];
				vm.rows[i][2] = tasks_done[i];
 			}
		}
		
		function locPriority(priority) {
			switch (priority) {
				case 'low': 
					return 'Низкий';
				
				case 'high':
					return 'Высокий';
				
				case 'normal':
					return 'Обычный';
					
				default:
					return 'Необычный';
			}
		}
		
		function locStatus(status) {
			switch (status) {
				case 'done': 
					return 'Завершено';
				
				case 'doing':
					return 'В процессе';
				
				default:
					return 'Планируется';
			}
		}

	}
	
})();