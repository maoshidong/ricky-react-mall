
// import { useRouter } from "next/router";

export default function RequireAuth(WrappedComponent) {
    const HocComponent = (props) => {
        // const Router = useRouter();
        // 未登录时重定向至登录页面  客户端?服务端不能使用useRouter
        return <WrappedComponent {...props} />;
    };
    return HocComponent 
}
