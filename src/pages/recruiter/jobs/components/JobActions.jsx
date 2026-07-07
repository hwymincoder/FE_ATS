import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function JobActions({onAdd}){
    return(
        <div className="flex justify-end gap-2">
            <Button onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm job
            </Button>
        </div>
    );
}