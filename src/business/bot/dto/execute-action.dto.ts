export class ExecuteActionDto {
  action!: string;
  params!: {
    date_from: string;
    date_to: string;
  };
}
