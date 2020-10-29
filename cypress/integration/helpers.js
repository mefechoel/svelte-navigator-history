/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const history = (mod) =>
	cy.window().then((win) => win.NavigatorHistory[mod]);

export const createNavigate = (mod) => (...args) =>
	history(mod).then((hist) => hist.navigate(...args));

export function assertLocationMatches(location, partialLocation) {
	const { pathname, hash, search } = partialLocation;
	if (pathname !== undefined) {
		expect(location.pathname).to.equal(pathname);
	}
	if (hash !== undefined) {
		expect(location.hash).to.equal(hash);
	}
	if (search !== undefined) {
		expect(location.search).to.equal(search);
	}
}

export function _wait(shouldWait = false) {
	// eslint-disable-next-line cypress/no-unnecessary-waiting
	if (shouldWait) cy.wait(200);
}

export function assertLocation({ pathname, hash, search } = {}, wait = false) {
	_wait(wait);
	return cy
		.window()
		.then((win) =>
			assertLocationMatches(win.location, { pathname, hash, search }),
		);
}

export const createAssertPath = (mod) => (path, wait = false) => {
	_wait(wait && mod !== "memoryHistory");
	history(mod).then((hist) => {
		expect(hist.location.pathname).to.equal(path);
	});
	const assertions = {
		browserHistory() {
			assertLocation({ pathname: path }, false);
		},
		hashHistory() {
			cy.window().then((win) => {
				if (!win.location.hash || win.location.hash === "#") {
					expect(path).to.equal("/");
				} else {
					expect(win.location.hash).to.equal(`#${path}`);
				}
			});
		},
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		memoryHistory() {},
	};
	assertions[mod]();
};

export const createAssertHistoryLocation = (mod) => (expectedLocation) =>
	history(mod).then((hist) => {
		const { pathname, search, hash } = hist.location;
		const actualLocation = { pathname, search, hash };
		expect(actualLocation).to.deep.equal(expectedLocation);
	});

export const createAssertAction = (mod) => (action) =>
	history(mod).then((hist) => {
		expect(hist.action).to.equal(action);
	});

export const createAssertState = (mod) => (expectedState, wait = false) => {
	_wait(wait);
	history(mod)
		.then((hist) => hist.location.state)
		.should("deep.equal", expectedState);
};
