// import useMobile from './mobile/useMobile';
// import useAccount from './useAccount';
// import useApi from './useApi';
// import useCart from './useCart';
// import useClickLimit from './useClickLimit';

// import useDebounce from './useDebounce';
// import useEcomerce from './useEcomerce';
// import useForm from './useForm';
// import useI18 from './useI18';
// import useLanguage from './useLanguage';

// import useLocalStorage from './useLocalStorage';
// import useOrder from './useOrder';
// import useProduct from './useProduct';

// export {
//     useMobile, useAccount, useApi, useCart, useClickLimit, useDebounce, useEcomerce,
//     useForm, useI18, useLanguage, useLocalStorage, useOrder, useProduct,
// };

export { default as useMobile } from './mobile/useMobile';
export { default as useAccount } from './useAccount';
export { default as useApi } from './useApi';
export { default as useCart } from './useCart';
export { default as useClickLimit } from './useClickLimit';

export { default as useDebounce } from './useDebounce';
export { default as useEcomerce } from './useEcomerce';
export { default as useForm } from './useForm';
export { default as useI18 } from './useI18';
export { default as useLanguage } from './useLanguage';

export { default as useLocalStorage } from './useLocalStorage';
export { default as useOrder } from './useOrder';
export { default as useProduct } from './useProduct';




// 这两种导出方式在语法和效果上有一些差异。下面是它们的具体区别：

// 第一种方式
// javascript
// export {
//     CartDuplicatePart,
//     MinLoginTip,
//     MinModalTip,
//     AlipayBtn,
//     PaymentMethodsSelect,
//     PayWaySelect,
//     PageHeaderShadow,
// };
// 用途：这种方式通常是在文件中先定义了一些变量或导入了模块，然后统一导出它们。
// 导出内容：这里的所有组件必须已经在文件中被定义或导入，才能使用这个方式进行导出。
// 形式：它是一个批量导出，所有组件都在一个块中列出。
// 第二种方式
// javascript
// export { default as PayWaySelect } from './modules/PayWaySelect';
// export { default as PageHeaderShadow } from './modules/PageHeaderShadow';
// 用途：此种写法直接从其他模块中导入并导出。这种方式不需要在当前文件中重复导入变量，可以直接从其他文件导入并导出。
// 灵活性：你可以为导入的模块指定名称，例如 default as 可以让你重命名导出的组件。
// 单独导出：每个导出都是单独的一行，便于管理和阅读，特别是当你只想导出特定模块时。
// 总结
// 导入机制：

// 第一种方式依赖于先在当前文件中定义或导入要导出的组件。
// 第二种方式直接从其他模块导入并导出，简洁明了。
// 可读性与管理：

// 第一种方式适合在一个地方集中导出所有内容，但如果组件数量较多，会显得冗长。
// 第二种方式更灵活，可以更易于维护和阅读，特别是当只需要导出部分内容时。
// 按需导入：

// 如果想实现摇树优化，第二种方式可能更容易达到，因为每个导出都是独立的，可以更好地控制哪些模块被导入和导出。
// 选择使用哪种方式主要取决于你的代码组织结构、可读性需求和个人偏好。

