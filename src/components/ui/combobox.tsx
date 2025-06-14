'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ComboboxProps {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSearch?: (searchTerm: string) => void;
  isLoading?: boolean;
}

export function Combobox({ options, value, onValueChange, placeholder = 'Select option...', className, onSearch, isLoading }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn('w-full justify-between', className)} disabled={isLoading}>
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Cari ${placeholder.toLowerCase()}...`} onValueChange={onSearch} />
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm">Mencari...</div>
            ) : (
              <>
                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', value === option ? 'opacity-100' : 'opacity-0')} />
                      {option}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
