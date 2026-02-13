export class CreateGuessDto {
  name: string;
  email: string;
  confirmed: 'Sim' | 'Não';
  restrictions?: string;
}
