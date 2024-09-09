import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collectionData,
  CollectionReference,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.tasksCollection = collection(this.firestore, 'tasks'); // Firestore collection reference
  }

  // Fetch all tasks
  getTasks(): Observable<Task[]> {
    const tasksQuery = query(
      this.tasksCollection,
      orderBy('createdAt', 'desc')
    );
    return collectionData(tasksQuery, { idField: 'id' }) as Observable<Task[]>;
  }

  // Add a new task
  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    console.log('Adding task');
    const timestamp = new Date();
    return addDoc(this.tasksCollection, {
      ...task,
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    }).then((docRef) => {
      console.log('Task added with ID:', docRef.id);
    });
  }

  // Update an existing task
  updateTask(taskId: string, updatedFields: Partial<Task>): Promise<void> {
    const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
    const timestamp = new Date();

    return updateDoc(taskDocRef, {
      ...updatedFields,
      updatedAt: timestamp,
    }).then((res) => {
      console.log('Task updated with ID:', res, taskId);
    });
  }

  // Delete a task
  deleteTask(id: string): Promise<void> {
    const taskDocRef = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskDocRef);
  }
}
