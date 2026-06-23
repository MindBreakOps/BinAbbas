import Dexie, { type Table } from 'dexie';

// Define your interfaces
export interface Student {
  id: string;
  workspace_id: string;
  name: string;
  age?: number;
  level?: string;
  phone?: string;
  registration_date: string;
  sync_status: 'synced' | 'pending_insert' | 'pending_update' | 'pending_delete';
}

// ... the rest of your Dexie database class
export class QuranCenterDatabase extends Dexie {
  students!: Table<Student, string>;

  constructor() {
	super('QuranCenterDB_V2');
	
	// Define tables and indexes
	// Note: workspace_id is indexed to allow fast querying per tenant
	this.version(1).stores({
	  students: 'id, workspace_id, name, phone, sync_status',
	  attendance: 'key, workspace_id, month, sync_status',
	  halaqat: 'id, workspace_id, date, halqa, sync_status',
	  financials: 'id, workspace_id, category, transaction_date, sync_status',
	  monthly_exams: 'id, workspace_id, halqa_name, exam_month, sync_status'
	});
  }
}

export const db = new QuranCenterDatabase();