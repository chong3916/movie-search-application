import React from "react";
import {cleanup, render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import IdleTimerContainer from "./components/IdleTimerContainer";
import {act} from "react-dom/test-utils";

const sessionStorageEvent = new Event("sessionStorageEvent");
const props = { setBanner: jest.fn().mockResolvedValueOnce({message: null, variant: null}),
    banner: {message: null, variant: null},
    sessionStorageEvent: sessionStorageEvent};

let dateNowStub;
beforeEach(() => {
    fetch.resetMocks();
    jest.resetAllMocks();
    window.sessionStorage.removeItem("timeoutTime");
});
afterEach(() => {
    window.history.pushState(null, document.title, "/");
    cleanup();
    window.sessionStorage.clear();
});

test('Idle timer times out properly when logged in', async () => {
    window.sessionStorage.setItem("user","51234");
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    dateNowStub = jest.fn()
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(50000)
        .mockReturnValueOnce(60002);
    global.Date.now = dateNowStub;

    render(<IdleTimerContainer {...props} />, { wrapper: BrowserRouter });

    await act(async () => {document.dispatchEvent(sessionStorageEvent)});
    await act(async () => {jest.advanceTimersByTime(300)});
    await act(async () => {jest.advanceTimersByTime(700)});
    await act(async () => {jest.advanceTimersByTime(1000)});
    expect(setTimeout).toHaveBeenCalledTimes(2);
});

test('Idle timer expires properly when logged in', async () => {
    window.sessionStorage.setItem("user", "51234");
    window.sessionStorage.setItem("timeoutTime", "1");
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    dateNowStub = jest.fn()
        .mockReturnValueOnce(10);
    global.Date.now = dateNowStub;

    render(<IdleTimerContainer {...props} />, { wrapper: BrowserRouter });

    await act(async () => {document.dispatchEvent(sessionStorageEvent)});

    expect(setTimeout).toHaveBeenCalledTimes(0);
});

test('Idle timer times out properly when timeoutTime is not found', async () => {
    window.sessionStorage.setItem("user","51234");
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    dateNowStub = jest.fn()
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(1);
    global.Date.now = dateNowStub;
    render(<IdleTimerContainer {...props} />, { wrapper: BrowserRouter });

    await act(async () => {document.dispatchEvent(sessionStorageEvent)});
    await act(async () => {jest.advanceTimersByTime(300)}); // setTimeout
    window.sessionStorage.removeItem("timeoutTime");
    await act(async () => {jest.advanceTimersByTime(700)});

    expect(setTimeout).toHaveBeenCalledTimes(1);
});

test("Idle timer doesn't start if not logged in", async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    render(<IdleTimerContainer {...props} />, { wrapper: BrowserRouter });

    await act(async () => {document.dispatchEvent(sessionStorageEvent)});

    expect(setTimeout).toHaveBeenCalledTimes(0);
});
