import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Subscription } from 'rxjs';
import { Task } from '../../models/task.model';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  newTaskDescription: string = '';
  taskSubscription: Subscription = new Subscription();
  editingTaskId: string | null = null;
  originalTaskDescription: string = '';
  isLoading: boolean = false;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.fetchData();
  }

  // Fetch all tasks
  fetchData() {
    this.isLoading = true;
    this.taskSubscription = this.taskService.getTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        this.isLoading = false;
      }
    );
  }

  // Add a new task
  addTask() {
    if (this.newTaskDescription.trim()) {
      // console.log('Adding task:', this.newTaskDescription);
      this.taskService
        .addTask({
          description: this.newTaskDescription,
          completed: false,
        })
        .then(() => {
          this.newTaskDescription = '';
        })
        .catch((error) => console.error('Failed to add task:', error));
    }
  }

  // Update an existing task
  updateTask(task: Task) {
    this.taskService
      .updateTask(task.id!, { completed: task.completed })
      .catch((error) => console.error('Failed updating task:', error));
  }

  // Edit a task's description
  editTask(task: Task) {
    if (task.description.trim()) {
      this.updateTask(task);
    }
  }

  // Storing the ID for the task being edited for conditinal rendering
  editMode(task: Task) {
    this.editingTaskId = task.id;
    this.originalTaskDescription = task.description;
  }

  // Update the task description
  updateTaskDescription(task: Task) {
    // console.log('Updating task description:', task.description);

    //If the task description is empty, return.
    if (!task.description.trim()) {
      return;
    }

    //If the task description is unchaged, return.
    if (task.description === this.originalTaskDescription) {
      // console.log('Task description unchanged:', task.description);

      this.editingTaskId = null;
      return;
    }

    this.taskService
      .updateTask(task.id!, { completed: false, description: task.description })
      .then(() => {
        this.editingTaskId = null;
      })
      .catch((error) => console.error('Failed to update description:', error));
  }

  // Delete a task
  deleteTask(id: string) {
    this.taskService.deleteTask(id);
  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
  }
}
