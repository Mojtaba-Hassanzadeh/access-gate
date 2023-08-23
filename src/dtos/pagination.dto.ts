import { CoreOutput } from './output.dto';

export class PaginationInput {
  page: number;
  count: number;
}

export class PaginationOutput extends CoreOutput {
  totalPages?: number;
  totalCount?: number;
}
