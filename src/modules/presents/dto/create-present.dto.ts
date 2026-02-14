export class CreatePresentDto {
  idCategory: number;
  name: string;
  description: string;
  price: number;
  photo: string;
  purchased: boolean;
  purchasedBy?: string;
}
