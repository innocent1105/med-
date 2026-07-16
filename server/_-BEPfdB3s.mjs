import { a as __toESM } from "./_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "./_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_-BEPfdB3s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ClinicApp = (0, import_react.lazy)(() => import("./_ssr/ClinicApp-Cfu0Ep3Z.mjs"));
function SpaHost() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-screen bg-background" }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClinicApp, {})
	});
}
//#endregion
export { SpaHost as component };
