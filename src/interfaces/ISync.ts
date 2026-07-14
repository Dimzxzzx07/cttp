export interface ISync {
  sync(url: string, lastSync: string, options?: any): Promise<any>;
  pull(url: string, options?: any): Promise<any>;
  push(url: string, options?: any): Promise<any>;
  resolveConflict(url: string, conflictId: string, resolution: any): Promise<void>;
  getSyncState(syncId: string): any;
}