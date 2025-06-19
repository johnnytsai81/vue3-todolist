export type FormData = {
  id: string;
  active: boolean;
  title: string;
  start_date: string;
  end_date: string;
  image: File | null;
  image_url: string;
  content: string;
}

export type FormItem = {
  prop?: string;
  label?: string;
  type: 'text' | 'date' | 'textarea' | 'file' | 'image-upload' | 'inline';
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  span?: number;
  dateFields?: {
    start: string;
    end: string;
  };
}