import { useEffect, useState } from 'react'
import localStorage from 'localStorage'
// 浏览器数据本地储存
export default function useLocalStorage (key, defaultValue) {
    if (typeof key !== 'string') {
        throw new Error('key must be a string');
    }
    const localStr = JSON.parse(localStorage.getItem(key))  || '';
    const [value, setValue] = useState(localStr || defaultValue)

    useEffect(() => {
        localStorage.setItem(String(key), JSON.stringify(value))
    }, [value, setValue])
    return [value, setValue]
}