export class ApiResponse<T> {
  data?: T | null;
  message?: string | string[];
  timestamp?: string;
  success?: boolean;

  constructor(data: ApiResponse<T>) {
    this.data = data.data ?? null;
    this.message = data.message ?? '';
    this.timestamp = new Date().toISOString();
    this.success = data.success ?? true;
  }
}
