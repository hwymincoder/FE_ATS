import { forwardRef, useImperativeHandle } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { RotateCw, Search } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const DepartmentSearchForm = forwardRef(function DepartmentSearchForm({ onSearch }, ref) {
  const form = useForm({
    defaultValues: { keyword: '' },
  });

  const handleSubmit = (data) => {
    onSearch({
      keyword: data.keyword?.trim() || undefined,
    });
  };

  const handleReset = () => {
    form.reset({ keyword: '' });
    onSearch({ keyword: undefined });
  };

  useImperativeHandle(ref, () => ({
    submitForm: () => form.handleSubmit(handleSubmit)(),
    resetForm: handleReset,
  }));

  return (
    <Card className="p-4">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="keyword">Từ khoá</Label>
              <Input
                id="keyword"
                placeholder="Tìm theo tên hoặc mô tả phòng ban"
                {...form.register('keyword')}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit" variant="default">
                <Search className="mr-2 h-4 w-4" />
                Tìm kiếm
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                <RotateCw className="mr-2 h-4 w-4" />
                Đặt lại
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
});
