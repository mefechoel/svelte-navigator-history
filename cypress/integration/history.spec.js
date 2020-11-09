/// <reference types="cypress" />

import {
	createAssertAction,
	createAssertHistoryLocation,
	createAssertPath,
	createAssertState,
	createNavigate,
	assertParsePath,
	assertStringifyPath,
	createSubscribe,
	createAssertHref,
	assertSubscribe,
} from "../helpers";

describe("History", () => {
	const runTest = (mod) => {
		const navigate = createNavigate(mod);
		const assertState = createAssertState(mod);
		const assertPath = createAssertPath(mod);
		const assertAction = createAssertAction(mod);
		const assertHistoryLocation = createAssertHistoryLocation(mod);
		const subscribe = createSubscribe(mod);

		describe(mod, () => {
			beforeEach(() => {
				cy.visit("/");
			});

			describe("navigate", () => {
				let navState;
				let store;

				beforeEach(() => {
					navState = { value: {} };

					store = subscribe((update) => {
						navState.value = update;
					});
				});

				afterEach(() => {
					cy.wrap().then(store.unsubscribe);
				});

				it("basic navigation", () => {
					assertAction("POP");
					assertSubscribe(navState, "/", "POP");

					navigate("/routeA");
					assertPath("/routeA");
					assertAction("PUSH");
					assertSubscribe(navState, "/routeA", "PUSH");

					navigate("/routeB");
					assertPath("/routeB");
					assertAction("PUSH");
					assertSubscribe(navState, "/routeB", "PUSH");

					navigate("/routeC");
					assertPath("/routeC");
					assertAction("PUSH");
					assertSubscribe(navState, "/routeC", "PUSH");
				});

				it("back/forward navigation", () => {
					assertPath("/");
					assertAction("POP");
					assertSubscribe(navState, "/", "POP");

					navigate("/routeA");
					assertPath("/routeA");
					assertAction("PUSH");
					assertSubscribe(navState, "/routeA", "PUSH");

					navigate("/routeB");
					assertPath("/routeB");
					assertAction("PUSH");
					assertSubscribe(navState, "/routeB", "PUSH");

					navigate("/routeC");
					assertPath("/routeC");
					assertAction("PUSH");
					assertSubscribe(navState, "/routeC", "PUSH");

					navigate(-1);
					assertPath("/routeB", true);
					assertAction("POP");
					assertSubscribe(navState, "/routeB", "POP");

					navigate(-1);
					assertPath("/routeA", true);
					assertAction("POP");
					assertSubscribe(navState, "/routeA", "POP");

					navigate(2);
					assertPath("/routeC", true);
					assertAction("POP");
					assertSubscribe(navState, "/routeC", "POP");

					navigate(-3);
					assertPath("/", true);
					assertAction("POP");
					assertSubscribe(navState, "/", "POP");
				});

				it("stateful navigation", () => {
					assertState(null);
					assertSubscribe(navState, "/", "POP", null);

					navigate("/routeA", { state: { stateValue: 123 } });
					assertState({ stateValue: 123 });
					assertSubscribe(navState, "/routeA", "PUSH", { stateValue: 123 });

					navigate("/routeB", { state: { stateValue: 456 } });
					assertState({ stateValue: 456 });
					assertSubscribe(navState, "/routeB", "PUSH", { stateValue: 456 });

					navigate("/routeC", { state: null });
					assertState(null);
					assertSubscribe(navState, "/routeC", "PUSH", null);

					navigate(-1);
					assertState({ stateValue: 456 }, true);
					assertSubscribe(navState, "/routeB", "POP", { stateValue: 456 });

					navigate(-1);
					assertState({ stateValue: 123 }, true);
					assertSubscribe(navState, "/routeA", "POP", { stateValue: 123 });

					navigate(2);
					assertState(null, true);
					assertSubscribe(navState, "/routeC", "POP", null);

					navigate(-3);
					assertState(null, true);
					assertSubscribe(navState, "/", "POP", null);
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

	describe("createHref", () => {
		describe("browserHistory", () => {
			it("works", () => {
				const assertHref = createAssertHref("browserHistory");
				assertHref("/", "/");
				assertHref("/path", "/path");
				assertHref("/path?search", "/path?search");
				assertHref("/path#hash", "/path#hash");
				assertHref("/path?search#hash", "/path?search#hash");
			});
		});

		describe("hashHistory", () => {
			it("works", () => {
				const assertHref = createAssertHref("hashHistory");
				assertHref("/", "#/");
				assertHref("/path", "#/path");
				assertHref("/path?search", "#/path?search");
				assertHref("/path#hash", "#/path#hash");
				assertHref("/path?search#hash", "#/path?search#hash");
			});
		});

		describe("memoryHistory", () => {
			it("works", () => {
				const assertHref = createAssertHref("memoryHistory");
				assertHref("/", "/");
				assertHref("/path", "/path");
				assertHref("/path?search", "/path?search");
				assertHref("/path#hash", "/path#hash");
				assertHref("/path?search#hash", "/path?search#hash");
			});
		});
	});

	describe("parsePath", () => {
		it("happy path", () => {
			assertParsePath("/path?search#hash", {
				pathname: "/path",
				search: "?search",
				hash: "#hash",
			});
			assertParsePath("/path?search", {
				pathname: "/path",
				search: "?search",
				hash: "",
			});
			assertParsePath("/path#hash", {
				pathname: "/path",
				search: "",
				hash: "#hash",
			});
		});

		it("removes empty hash or search", () => {
			assertParsePath("/path?#hash", {
				pathname: "/path",
				search: "",
				hash: "#hash",
			});
			assertParsePath("/path?search#", {
				pathname: "/path",
				search: "?search",
				hash: "",
			});
			assertParsePath("/path?#", {
				pathname: "/path",
				search: "",
				hash: "",
			});
		});
	});

	describe("stringifyPath", () => {
		it("works", () => {
			assertStringifyPath(
				{
					pathname: "/path",
					search: "?search",
					hash: "#hash",
				},
				"/path?search#hash",
			);
			assertStringifyPath(
				{
					pathname: "/path",
					search: "",
					hash: "",
				},
				"/path",
			);
			assertStringifyPath(
				{
					pathname: "",
					search: "?search",
					hash: "",
				},
				"?search",
			);
			assertStringifyPath(
				{
					pathname: "",
					search: "",
					hash: "#hash",
				},
				"#hash",
			);
			assertStringifyPath(
				{
					pathname: "",
					search: "?search",
					hash: "#hash",
				},
				"?search#hash",
			);
			assertStringifyPath(
				{
					pathname: "/path",
					search: "?search",
					hash: "",
				},
				"/path?search",
			);
			assertStringifyPath(
				{
					pathname: "/path",
					search: "",
					hash: "#hash",
				},
				"/path#hash",
			);
		});
	});
});
