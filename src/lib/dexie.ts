import Dexie, { type Table } from 'dexie';

export interface Student {
  id: string;
  workspace_id: string;
  name: string;
  age?: number;
  level?: string;
  phone?: string;
  registration_date?: string;
  sync_status: 'synced' | 'pending_insert' | 'pending_update' | 'pending_delete';
}

export class QuranCenterDatabase extends Dexie {
  students!: Table<Student>;
  attendance!: Table<any>; // تمت إضافة هذا السطر
  monthly_exams!: Table<any>; // تمت إضافة هذا السطر

  constructor() {
	super('QuranCenterDB');
	this.version(1).stores({
	  students: 'id, workspace_id, sync_status',
	  attendance: 'key, workspace_id, month, sync_status',
	  monthly_exams: 'id, workspace_id, sync_status'
	});
  }
}

export const db = new QuranCenterDatabase();