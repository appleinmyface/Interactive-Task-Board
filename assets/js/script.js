// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
  }

// Todo: create a function to create a task card
function createTaskCard(task) {
    let taskColor = "bg-primary";
    const today = dayjs().startOf('day');
    const dueDate = dayjs(task.dueDate).startOf('day');
  
    if (dueDate.isBefore(today)) {
      taskColor = "bg-danger";
    } else if (dueDate.isSame(today)) {
      taskColor = "bg-warning";
    }
  
    if (task.status === "done") {
      taskColor = "bg-success";
    }
  
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
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();
  
    taskList.forEach(task => {
      const taskCard = createTaskCard(task);
      if (task.status === "to-do") {
        $('#todo-cards').append(taskCard);
      } else if (task.status === "in-progress") {
        $('#in-progress-cards').append(taskCard);
      } else if (task.status === "done") {
        $('#done-cards').append(taskCard);
      }
    });
  
    $('.task-card').draggable({
      revert: 'invalid',
      stack: '.task-card',
      helper: 'clone'
    });
  
    $('.delete-task').on('click', handleDeleteTask);
  }
  
// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
  
    const taskTitle = $('#task-title').val();
    const taskDescription = $('#task-desc').val();
    const taskDueDate = $('#task-date').val();
  
    const newTask = {
      id: generateTaskId(),
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate,
      status: 'to-do'
    };
  
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);
  
    renderTaskList();
    $('#formModal').modal('hide');
  }
  
// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).closest('.task-card').data('id');
    taskList = taskList.filter(task => task.id !== taskId);
  
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }
  

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('id');
    const newStatus = $(this).attr('id').replace('-cards', '');
  
    taskList.forEach(task => {
      if (task.id === taskId) {
        task.status = newStatus;
      }
    });
  
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }
  
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    function resetForm() {
        $('#task-title').val('');
        $('#task-desc').val('');
        $('#task-date').val('');
      }      


    if (!taskList) {
      taskList = [];
      nextId = 1;
    }
  
    renderTaskList();
  
    $('#task-form').on('submit', handleAddTask);
  
    $('#task-date').datepicker({
      dateFormat: 'yy-mm-dd'
    });
  
    $('.lane').droppable({
      accept: '.task-card',
      drop: handleDrop
    });
  
    // Resets form fields when modal is hidden
    $('#formModal').on('hidden.bs.modal', resetForm);
  });
  
  
