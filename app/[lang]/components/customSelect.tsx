import { Select, ComboboxItem } from "@mantine/core";

function CustomSelect<T extends string | number | boolean = string>({
  value,
  onChange,
  data,
  label,
  placeholder,
  defaultValue,
  ...props
}: {
  value?: string;
  onChange: (_value: string | null, option: ComboboxItem) => void;
  data: { value: string; label: string }[];
  label?: string;
  placeholder?: string;
  defaultValue?: string | null;
  [key: string]: any;
}) {
  return (
    <Select
      data={data}
      value={value}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      defaultValue={defaultValue}
      {...props}
    />
  );
}

export default CustomSelect;
