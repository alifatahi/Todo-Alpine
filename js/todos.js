window.todoStore = {
	//Save to Local Storage
	todos: JSON.parse(localStorage.getItem("todo-store") || "[]"),

	save() {
		localStorage.setItem("todo-store", JSON.stringify(this.todos));
	},
};

window.todos = function () {
	return {
		//Merge another object by ...Name of Object
		...todoStore,
		filter: "all",
		newTodo: "",
		editedTodo: null,

		get active() {
			//Active Task
			return this.todos.filter((todo) => !todo.completed);
		},

		get completed() {
			//Completed Task
			return this.todos.filter((todo) => todo.completed);
		},

		get filteredTodos() {
			//Lookup table
			return {
				all: this.todos,
				active: this.active,
				completed: this.completed,
			}[this.filter];
		},
		get allComplete() {
			//Mark all task as complete by toggle
			return this.todos.length === this.completed.length;
		},
		addTodo() {
			//Validation
			if (!this.newTodo) {
				return;
			}
			//Add new todo
			this.todos.push({
				id: Date.now(),
				body: this.newTodo,
				completed: false,
			});

			this.save();

			this.newTodo = "";
		},
		editTodo(todo) {
			todo.cachedBody = todo.body; //This is store old task
			this.editedTodo = todo;
		},
		cancelEdit(todo) {
			//When cancel edit then old task back
			todo.body = todo.cachedBody;
			this.editedTodo = null;
			delete todo.cachedBody;
		},
		editComplete(todo) {
			if (todo.body.trim() === "") {
				//If when edit type empty its store as null
				return this.deleteTodo(todo);
			}
			this.editedTodo = null;
			this.save();
		},
		deleteTodo(todo) {
			let position = this.todos.indexOf(todo);
			this.todos.splice(position, 1);
			this.save();
		},
		toggleTodoCompletion(todo) {
			//Check to see if status ! complete then make it complete and also reverse
			todo.completed = !todo.completed;
			this.save();
		},
		toggleAllComplete() {
			//On click we will mark all as complete for first time
			let allComplete = this.allComplete;
			//Then when click again we will set it opposite of its status
			this.todos.forEach((todo) => (todo.completed = !allComplete));

			this.save();
		},
		clearCompletedTodos() {
			this.todos = this.active;
			this.save();
		},
	};
};
