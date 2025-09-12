import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Button, Select, Space, Spin} from 'antd';
import type { SelectProps } from 'antd';
import debounce from 'lodash/debounce';
import {PlusOutlined} from "@ant-design/icons";
import {atomSelector} from "@/states/selector.ts";
import {useAtomValue} from "jotai/index";

export interface SearchApiProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions?: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
  showButtonAdd?: boolean,
  selectorState?: string,
  options?: any[],
  onAdd?: () => void,
}

export function SearchApi<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number, selectorState?: string } = any,
>({ fetchOptions, debounceTimeout = 800, onAdd, showButtonAdd, selectorState, ...props }: SearchApiProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const atomSelectorState = useAtomValue(atomSelector)
  const [options, setOptions] = useState<ValueType[]>(props.options || []);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      if(!fetchOptions) {
        setOptions(selectorState ? atomSelectorState[selectorState] || [] : props.options || []);
        setFetching(false);
        return
      }
      fetchOptions(value).then((newOptions) => {
        setFetching(false);
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setOptions(newOptions);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  useEffect(() => {
    if(!options.length) {
      debounceFetcher('')
    }
  }, []);
  useEffect(() => {
    setOptions(props.options || [])
  }, [props.options]);
  useEffect(() => {
    if(selectorState) {
      setOptions(atomSelectorState[selectorState] || []);
      // if(props.onChange && atomSelectorState[props.selectorState]?.length) {
      //   props.onChange(atomSelectorState[props.selectorState][0] as any, atomSelectorState[props.selectorState]);
      // }
    }
  }, selectorState ? [atomSelectorState[selectorState]] : []);

  return (
      <Space.Compact style={{ width: '100%' }}>
        <Select
            filterOption={false}
            onSearch={debounceFetcher}
            placeholder={props.placeholder}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
        />
        {showButtonAdd && <Button type="primary" onClick={onAdd}><PlusOutlined/></Button>}
      </Space.Compact>
  );
}
