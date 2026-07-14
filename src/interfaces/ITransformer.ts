export interface ITransformer {
  transform(data: any, type: string): any;
  reverse(data: any, type: string): any;
  hasTransformer(type: string): boolean;
  getTransformerNames(): string[];
  register(name: string, transformer: (data: any) => any, reverse?: (data: any) => any): void;
}