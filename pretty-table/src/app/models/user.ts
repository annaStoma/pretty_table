export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

export interface Grid<T> {
  items: T[];
}
