// 1. This error DOES NOT use captureStackTrace
class WithoutCapture extends Error {
  constructor(message) {
    super(message);
    this.name = "WithoutCapture";
  }
}

// 2. This error DOES use captureStackTrace
class WithCapture extends Error {
  constructor(message) {
    super(message);
    this.name = "WithCapture";

    // The magic line: hide this constructor from the trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// --- Simulating your controller routes ---

function bookingControllerA() {
  throw new WithoutCapture("Database entry failed!");
}

function bookingControllerB() {
  throw new WithCapture("Database entry failed!");
}

// --- Run the test and print the stacks ---

console.log("========== TEST 1: WITHOUT CAPTURE ==========");
try {
  bookingControllerA();
} catch (err) {
  console.log(err.stack);
}

console.log("\n========== TEST 2: WITH CAPTURE ==========");
try {
  bookingControllerB();
} catch (err) {
  console.log(err.stack);
}
