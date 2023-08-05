import { Router } from "express";
import { isValidToken } from "../utils/hash.js";
import Exception from "../utils/exception.js";
export default class CustomerRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallback(callbacks)
    );
  }

  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallback(callbacks)
    );
  }

  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallback(callbacks)
    );
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallback(callbacks)
    );
  }
  /**
   * @method getRouter
   * @returns {Object} - Express router object
   * @description This method will return the express router object
   */
  getRouter() {
    return this.router;
  }

  /**
   * @method applyCallback
   * @param {Array} callbacks - Array of callback functions
   * @returns {Array} - Array of middlerware functions
   * @description This method will return an array of middleware functions that will wrap the callback functions
   * and will handle the errors
   */
  applyCallback(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (err) {
        params[1].status(500).json({ error: err.message });
      }
    });
  }

  /**
   * @method generateCustomResponse
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next function
   * @returns {void}
   * @description This method will add some custom methods to the response object
   */
  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = (payload) => res.status(200).json({ success: true, payload });
    res.sendServerError = (error) => res.status(500).json({ success: false, error });
    res.sendUserError = (error) => res.status(400).json({ success: false, error });
    next();
  };

  /**
   * @method handlePolicies
   * @param {Array} policies - Array of policies. Example: ['PUBLIC', 'USER', 'ADMIN']
   * @returns {Function} - Middleware function
   * @description This method will return a middleware function that will check if the user has the required policies
   * to access the endpoint
   */
  handlePolicies = (policies) => (req, res, next) => {
     const path = req.baseUrl ? "" : req.path;
     const url = path.split("/")[1];
    if (policies[0] === "PUBLIC") {
      return next();
    }
    const token = req.cookies.token;
    if (!token) {
      return next(new Exception("Unauthorized", 401, url));
    }
    const payload = isValidToken(token);
    if (!policies.includes(payload.role.toUpperCase())) {
      return next(new Exception("Forbidden", 403, url));
    }
    req.user = payload;
    next();
  };
}
