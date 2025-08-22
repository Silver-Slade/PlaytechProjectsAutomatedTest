"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expect = exports.test = void 0;
const test_1 = require("@playwright/test");
exports.test = test_1.test.extend({});
exports.expect = test_1.test.expect;
