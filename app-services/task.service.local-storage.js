(function() {
	
	angular
		.module("app")
		.factory("TaskService", TaskService);
		
	TaskService.$inject = ['$http', '$q'];
	function TaskService($http, $q) {
		
		var service = {};
		var tasks;
		
		service.fetchTasks = fetchTasks;
		service.saveNewTask = saveNewTask;
		service.updateTask = updateTask;
		service.deleteTask = deleteTask;
		
//		localStorage.removeItem("tasks");
		return service;
		
		function fetchTasks(username) {
			var deferred = $q.defer();
			// отсутвуют в хранилище, тогда получение из файла конф.
			if (!localStorage.tasks) {
				$http.get('config/tasks.json')
				.then(
					function(response) {
						tasks = response.data;
						localStorage.tasks = JSON.stringify(response.data);
						deferred.resolve((_.find(response.data, {username: username})|| {tasks:[]}).tasks);
					},
					function(errResponse){
						console.error('Error while fetching Tasks');
						deferred.reject(errResponse);
					}
				);
			}
			else {
				tasks = JSON.parse(localStorage.tasks);
				deferred.resolve((_.find(tasks, {username: username}) || {tasks:[]}).tasks);
			}
			return deferred.promise;
		}

		function saveNewTask(username, task) {
			var deferred = $q.defer();
			var firstIndex = _.findIndex(tasks, {username: username});
			if (firstIndex == -1) {
				task.id = 1;
				tasks.push({username: username, tasks:[task]});
			}
			else {
				task.id = (_.last(tasks[firstIndex].tasks) || {id:0}).id + 1;
				tasks[firstIndex].tasks.push(task);
			}
			saveTasksInStorage();
			deferred.resolve(true);
			return deferred.promise;
		}
		
		function updateTask(username, task) {
			var deferred = $q.defer();
			var firstIndex = _.findIndex(tasks, {username: username});
			var secondIndex = _.findIndex(tasks[firstIndex].tasks, {id: task.id});
			tasks[firstIndex].tasks[secondIndex] = task;
			saveTasksInStorage();
			deferred.resolve(true);
			return deferred.promise;
		}
		
		function deleteTask(username, id) {
			var deferred = $q.defer();
			var firstIndex = _.findIndex(tasks, {username: username});
			var secondIndex = _.findIndex(tasks[firstIndex].tasks, {id: id});
			tasks[firstIndex].tasks.splice(secondIndex, 1);
			saveTasksInStorage();
			deferred.resolve(true);
			return deferred.promise;
		}
		
		function saveTasksInStorage() {
			localStorage.tasks = JSON.stringify(tasks);
		}
		
	}
	
})();