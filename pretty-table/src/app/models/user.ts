export interface UserData {
  _id: string;
  isActive: boolean;
  balance: string;
  picture: string;
  age: number;
  name: {
    first: string;
    last: string;
  };
  company: string;
  email: string;
  address: string;
  tags: string[];
  favoriteFruit: string;
}

export interface UserDataCustom extends UserData {
  activeCustom: string;
  nameCustom: string;
  tagsCustom: string;
}

export interface Grid<T> {
  items: T[];
}
