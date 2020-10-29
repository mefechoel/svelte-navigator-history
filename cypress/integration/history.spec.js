/// <reference types="cypress" />

import {
	createAssertAction,
	createAssertHistoryLocation,
	createAssertPath,
	createAssertState,
	createNavigate,
} from "./helpers";

describe("History", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	const runTest = (mod) => {
		const navigate = createNavigate(mod);
		const assertState = createAssertState(mod);
		const assertPath = createAssertPath(mod);
		const assertAction = createAssertAction(mod);
		const assertHistoryLocation = createAssertHistoryLocation(mod);

		describe(mod, () => {
			describe("navigate", () => {
				it("basic navigation", () => {
					assertAction("POP");

					navigate("/routeA");
					assertPath("/routeA");
					assertAction("PUSH");

					navigate("/routeB");
					assertPath("/routeB");
					assertAction("PUSH");

					navigate("/routeC");
					assertPath("/routeC");
					assertAction("PUSH");
				});

				it("back/forward navigation", () => {
					assertPath("/");
					assertAction("POP");

					navigate("/routeA");
					assertPath("/routeA");
					assertAction("PUSH");

					navigate("/routeB");
					assertPath("/routeB");
					assertAction("PUSH");

					navigate("/routeC");
					assertPath("/routeC");
					assertAction("PUSH");

					navigate(-1);
					assertPath("/routeB", true);
					assertAction("POP");

					navigate(-1);
					assertPath("/routeA", true);
					assertAction("POP");

					navigate(2);
					assertPath("/routeC", true);
					assertAction("POP");

					navigate(-3);
					assertPath("/", true);
					assertAction("POP");
				});

				it("stateful navigation", () => {
					assertState(null);

					navigate("/routeA", { state: { stateValue: 123 } });
					assertState({ stateValue: 123 });

					navigate("/routeB", { state: { stateValue: 456 } });
					assertState({ stateValue: 456 });

					navigate("/routeC", { state: null });
					assertState(null);

					navigate(-1);
					assertState({ stateValue: 456 }, true);

					navigate(-1);
					assertState({ stateValue: 123 }, true);

					navigate(2);
					assertState(null, true);

					navigate(-3);
					assertState(null, true);
				});

				it("replacing navigation", () => {
					assertPath("/");
					assertAction("POP");

					navigate("/routeA");
					assertPath("/routeA");
					assertAction("PUSH");

					navigate("/routeB");
					assertPath("/routeB");
					assertAction("PUSH");

					navigate("/routeC", { replace: true });
					assertPath("/routeC");
					assertAction("REPLACE");

					navigate(-1);
					assertPath("/routeA", true);
					assertAction("POP");

					navigate(1);
					assertPath("/routeC", true);
					assertAction("POP");

					navigate(-2);
					assertPath("/", true);
					assertAction("POP");

					navigate("/routeA", { state: { value: "A" } });
					assertState({ value: "A" });
					assertPath("/routeA");
					assertAction("PUSH");

					navigate("/routeB", { state: { value: "B" } });
					assertState({ value: "B" });
					assertPath("/routeB");
					assertAction("PUSH");

					navigate("/routeC", { state: { value: "C" }, replace: true });
					assertState({ value: "C" });
					assertPath("/routeC");
					assertAction("REPLACE");

					navigate(-1);
					assertState({ value: "A" }, true);
					assertPath("/routeA", true);
					assertAction("POP");

					navigate(1);
					assertState({ value: "C" }, true);
					assertPath("/routeC", true);
					assertAction("POP");
				});
			});

			describe("location", () => {
				it("happy path", () => {
					navigate("/routeA?q=search-value#result-3");
					assertHistoryLocation({
						pathname: "/routeA",
						search: "?q=search-value",
						hash: "#result-3",
					});
				});

				it("only pathname", () => {
					navigate("/routeA");
					assertHistoryLocation({
						pathname: "/routeA",
						search: "",
						hash: "",
					});
				});

				it("only search", () => {
					navigate("?q=search-value");
					assertHistoryLocation({
						pathname: "/",
						search: "?q=search-value",
						hash: "",
					});
				});

				it("only hash", () => {
					navigate("#result-3");
					assertHistoryLocation({
						pathname: "/",
						search: "",
						hash: "#result-3",
					});
				});

				it("only hash and search", () => {
					navigate("?q=search-value#result-3");
					assertHistoryLocation({
						pathname: "/",
						search: "?q=search-value",
						hash: "#result-3",
					});
				});

				it("only pathname and search", () => {
					navigate("/routeA?q=search-value");
					assertHistoryLocation({
						pathname: "/routeA",
						search: "?q=search-value",
						hash: "",
					});
				});

				it("only pathname and hash", () => {
					navigate("/routeA#result-3");
					assertHistoryLocation({
						pathname: "/routeA",
						search: "",
						hash: "#result-3",
					});
				});
			});
		});
	};

	runTest("browserHistory");
	runTest("hashHistory");
	runTest("memoryHistory");
});
