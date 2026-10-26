class ApiService {
  constructor() {
    // Configure default parameters for your base environment
    this.baseURL = 'https://example.com';
  }

  /**
   * Fetch data natively via standard window.fetch and defer a callback.
   * @param {string} endpoint - The resource path (e.g., '/users')
   * @param {Object} queryParams - Key-value URL modifiers (?status=active)
   * @param {Function} [callback] - Deferred callback function
   * @returns {Promise<any>} Parsed clean response JSON
   */
  async get(endpoint, queryParams = {}, callback) {
    try {
      // 1. Convert the query object into a URL-encoded string natively
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `${this.baseURL}${endpoint}${queryString ? `?${queryString}` : ''}`;

      // 2. Perform native fetch call
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // 3. Native fetch does not reject on HTTP errors (e.g. 404, 500)—we must explicitly throw
      if (!response.ok) {
        throw new Error(`HTTP Error Status: ${response.status}`);
      }

      const data = await response.json();

      // 4. Defer the callback using a microtask (Promise.resolve)
      if (typeof callback === 'function') {
        Promise.resolve().then(() => callback(null, data));
      }

      return data;

    } catch (error) {
      console.error(`Native API Error at ${endpoint}:`, error.message);
      
      if (typeof callback === 'function') {
        Promise.resolve().then(() => callback(error, null));
      }
      
      throw error;
    }
  }
}

export const apiService = new ApiService();
