import { z } from 'zod';

import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '../constants/apply.constants';

const ACCEPTED_EXTENSIONS = ACCEPTED_FILE_TYPES.split(',').map((ext) => ext.trim().toLowerCase());

const cvFileSchema = z
  .instanceof(File, { message: 'Vui lòng đính kèm CV của bạn' })
  .refine((file) => file && file.size > 0, {
    message: 'File CV không được để trống',
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: 'Dung lượng CV vượt quá 10MB',
  })
  .refine(
    (file) => {
      const name = (file.name || '').toLowerCase();
      return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
    },
    { message: 'Chỉ chấp nhận file PDF, DOC hoặc DOCX' },
  );

export const applySchema = z.object({
  fullName: z.string().trim().min(1, 'Vui lòng nhập họ và tên').max(255, 'Họ tên tối đa 255 ký tự'),
  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập email')
    .email('Email không hợp lệ')
    .max(255, 'Email tối đa 255 ký tự'),
  phone: z
    .string()
    .trim()
    .max(30, 'Số điện thoại tối đa 30 ký tự')
    .optional()
    .or(z.literal('')),
  message: z.string().max(2000, 'Lời nhắn tối đa 2000 ký tự').optional().or(z.literal('')),
  cvFile: cvFileSchema,
});

export const applyDefaultValues = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
  cvFile: null,
};