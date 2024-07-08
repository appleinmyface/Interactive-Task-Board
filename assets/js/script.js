// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")); // Get the stored tasks array from localStorage and parse it into a JavaScript array
let nextId = JSON.parse(localStorage.getItem("nextId")); // Get the stored nextId value from localStorage and parse it into a number

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++; // Increment nextId and return the current value to use as the new task's ID
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let taskColor = "bg-primary"; // Default task color is primary (blue)
    const today = dayjs().startOf('day'); // Get today's date at the start of the day
    const dueDate = dayjs(task.dueDate).startOf('day'); // Get the task's due date at the start of the day

    if (dueDate.isBefore(today)) {
        taskColor = "bg-danger"; // If the due date is before today, change the color to danger (red)
    } else if (dueDate.isSame(today)) {
        taskColor = "bg-warning"; // If the due date is today, change the color to warning (yellow)
    }

    if (task.status === "done") {
        taskColor = "bg-success"; // If the task is done, change the color to success (green)
    }

    // Return a string of HTML representing the task card with appropriate color and task details
    return `
      <div class="card text-white ${taskColor} mb-3 task-card" data-id="${task.id}">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text"><small>${task.dueDate}</small></p>
          <button class="btn btn-sm btn-danger delete-task">Delete</button>
        </div>
      </div>
    `;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards').empty(); // Clear the to-do cards container
    $('#in-progress-cards').empty(); // Clear the in-progress cards container
    $('#done-cards').empty(); // Clear the done cards container

    taskList.forEach(task => {
        const taskCard = createTaskCard(task); // Create a task card for each task
        if (task.status === "to-do") {
            $('#todo-cards').append(taskCard); // Append the task card to the to-do container
        } else if (task.status === "in-progress") {
            $('#in-progress-cards').append(taskCard); // Append the task card to the in-progress container
        } else if (task.status === "done") {
            $('#done-cards').append(taskCard); // Append the task card to the done container
        }
    });

    $('.task-card').draggable({
        revert: 'invalid', // Revert the task card to its original position if dropped outside a droppable area
        stack: '.task-card', // Stack the task cards on top of each other when dragged
        helper: 'clone' // Create a clone of the task card when dragging
    });

    $('.delete-task').on('click', handleDeleteTask); // Add click event listeners to delete buttons on task cards
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const taskTitle = $('#task-title').val(); // Get the value of the task title input field
    const taskDescription = $('#task-desc').val(); // Get the value of the task description input field
    const taskDueDate = $('#task-date').val(); // Get the value of the task due date input field

    const newTask = {
        id: generateTaskId(), // Generate a unique ID for the new task
        title: taskTitle, // Set the task title
        description: taskDescription, // Set the task description
        dueDate: taskDueDate, // Set the task due date
        status: 'to-do' // Set the initial status of the task to 'to-do'
    };

    taskList.push(newTask); // Add the new task to the task list
    localStorage.setItem("tasks", JSON.stringify(taskList)); // Save the updated task list to localStorage
    localStorage.setItem("nextId", nextId); // Save the updated nextId to localStorage

    renderTaskList(); // Re-render the task list to include the new task
    $('#formModal').modal('hide'); // Hide the task form modal
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).closest('.task-card').data('id'); // Get the ID of the task to be deleted
    taskList = taskList.filter(task => task.id !== taskId); // Remove the task with the matching ID from the task list

    localStorage.setItem("tasks", JSON.stringify(taskList)); // Save the updated task list to localStorage
    renderTaskList(); // Re-render the task list to reflect the deletion
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('id'); // Get the ID of the task being dropped
    const newStatus = $(this).attr('id').replace('-cards', ''); // Determine the new status based on the ID of the droppable area

    taskList.forEach(task => {
        if (task.id === taskId) {
            task.status = newStatus; // Update the status of the task with the matching ID
        }
    });

    localStorage.setItem("tasks", JSON.stringify(taskList)); // Save the updated task list to localStorage
    renderTaskList(); // Re-render the task list to reflect the status change
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // Function to reset the task form fields
    function resetForm() {
        $('#task-title').val(''); // Clear the task title input field
        $('#task-desc').val(''); // Clear the task description input field
        $('#task-date').val(''); // Clear the task due date input field
    }

    if (!taskList) {
        taskList = []; // Initialize the task list if it doesn't exist
        nextId = 1; // Initialize the nextId if it doesn't exist
    }

    renderTaskList(); // Render the task list when the page loads

    $('#task-form').on('submit', handleAddTask); // Add submit event listener to the task form

    $('#task-date').datepicker({
        dateFormat: 'yy-mm-dd' // Initialize the date picker for the due date input field with the specified date format
    });

    $('.lane').droppable({
        accept: '.task-card', // Make lanes droppable, accepting elements with the class 'task-card'
        drop: handleDrop // Handle the drop event with the handleDrop function
    });

    // Resets form fields when modal is hidden
    $('#formModal').on('hidden.bs.modal', resetForm); // Add event listener to reset form fields when the modal is hidden
});
