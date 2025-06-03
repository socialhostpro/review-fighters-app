import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "https://resolute-gecko-685.convex.cloud");

export default convex; 