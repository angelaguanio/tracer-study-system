import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from './ui/label';

export default function SelectInput({ data, labelTitle, selectLabelTitle, ...props }) {
    return (
        <>
            {labelTitle && <Label {...props}>{labelTitle}</Label>}
            <Select {...props}>
                <SelectTrigger>
                    <SelectValue {...props} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{selectLabelTitle}</SelectLabel>
                        {data &&
                            data.map((d, index) => (
                                <SelectItem key={index} value={d}>
                                    {d}
                                </SelectItem>
                            ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    );
}
