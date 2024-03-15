export default interface Category {
    id: number;
    name: string;
    children?: Category[];
  }
  