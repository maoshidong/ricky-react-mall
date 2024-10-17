import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '~/store/rootReducer';
import rootSaga from '~/store/rootSaga';
import { createWrapper } from 'next-redux-wrapper';

const bindMiddleware = (middleware) => {
    if (process.env.NODE_ENV !== 'production') {
        // redux-devtools-extension 是一个用于 Redux 开发的浏览器扩展工具。它提供了一个可视化的界面，帮助开发人员调试和监控 Redux 应用程序的状态变化。
        const { composeWithDevTools } = require('redux-devtools-extension');
        return composeWithDevTools(applyMiddleware(...middleware));
    }
    return applyMiddleware(...middleware);
};
// 创建store create 与redux和red
// createSagaMiddleware 是一个用于处理 Redux 中异步操作的中间件，通常与 Redux 和 Redux-Saga 配合使用。Redux-Saga 是一个用于管理应用程序副作用（例如异步请求、定时器等）的库，它基于 Generator 函数实现了一种优雅而强大的异步流控制方案。
export const makeStore = (context) => {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(rootReducer, bindMiddleware([sagaMiddleware]));
    // 调用 sagaMiddleware.run(rootSaga) 方法来连接 Saga Middleware 和根 Saga，使其开始监听和处理 Redux action。
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
};

export const wrapper = createWrapper(makeStore, { debug: false });
