export interface IMerge {
  merge(url: string, conflicts: any[], options?: any): Promise<any>;
  resolveConflict(url: string, mergeId: string, conflictId: string, resolution: any): Promise<void>;
  rollback(mergeId: string): Promise<void>;
  getMergeSession(mergeId: string): any;
}