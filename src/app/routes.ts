import {
    type RouteConfig,
    route,
    index,
} from "@react-router/dev/routes";

export default [
    index("./home.tsx"),
    route("candles", "./candles.ts"),
    route("candles/new", "./create.tsx"),

    // layout("./auth/layout.tsx", [
    //     route("login", "./auth/login.tsx"),
    //     route("register", "./auth/register.tsx"),
    // ]),
] satisfies RouteConfig;